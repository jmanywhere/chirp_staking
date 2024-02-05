#![allow(clippy::result_large_err)]
pub mod errors;
pub mod events;

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};
use errors::*;
use events::*;

declare_id!("5ghCYkAfKSYZxuWi3ACcWviF9d7zCE8XKf2LD4hajMcL");

pub mod constants {
    pub const VAULT_SEED: &[u8] = b"vault";
    pub const STATUS_SEED: &[u8] = b"status";
    pub const POOL_SEED: &[u8] = b"pool";
    pub const POSITION_SEED: &[u8] = b"position";
}

#[program]
pub mod chirp_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Validate that status has not been initialized yet
        if ctx.accounts.status.token != Pubkey::default() {
            return err!(StakingErrors::AlreadyInitialized);
        }

        let status = &mut ctx.accounts.status;
        status.token = *ctx.accounts.mint.to_account_info().key;
        status.owner = *ctx.accounts.signer.to_account_info().key;

        Ok(())
    }

    pub fn create_pool(
        ctx: Context<CreatePool>,
        pool_id: u8,
        lock_duration: i64,
        reward_basis: u32,
    ) -> Result<()> {
        if ctx.accounts.status.owner != *ctx.accounts.signer.to_account_info().key {
            return err!(StakingErrors::NotOwner);
        }
        if pool_id == ctx.accounts.status.total_pools + 1 {
            return err!(StakingErrors::InvalidPoolId);
        }
        if reward_basis == 0 || lock_duration == 0 {
            return err!(StakingErrors::InvalidInputValues);
        }
        let pool_info = &mut ctx.accounts.new_pool;
        pool_info.reward_basis = reward_basis;
        pool_info.lock_duration = lock_duration;
        pool_info.is_active = true;
        // Increase total Pools by 1
        ctx.accounts.status.total_pools += 1;

        emit!(CreatePoolEvent {
            pool_id: pool_id,
            lock_duration: lock_duration,
            reward_basis: reward_basis,
        });
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, pool_id: u8, amount: u64) -> Result<()> {
        // Validate pool is active
        if !ctx.accounts.pool.is_active || !ctx.accounts.status.pools_enabled {
            return err!(StakingErrors::InactivePool);
        }
        // Validate that token is the same as the one in status account
        if ctx.accounts.mint.to_account_info().key != &ctx.accounts.status.token {
            return err!(StakingErrors::InvalidTokenAccount);
        }
        // Validate that pool_id is valid
        if ctx.accounts.status.total_pools < pool_id {
            return err!(StakingErrors::InvalidPoolId);
        }
        // Validate that amount is not 0
        if amount == 0 {
            return err!(StakingErrors::NoTokens);
        }
        let clock = Clock::get()?;
        let mut reward: u64 = 0;
        if ctx.accounts.staking_position.staked_amount > 0 {
            let lock_end_time =
                ctx.accounts.staking_position.start_time + ctx.accounts.pool.lock_duration;
            //claim rewards before staking again
            reward = calc_rewards(
                ctx.accounts.staking_position.staked_amount,
                ctx.accounts.pool.reward_basis,
                clock.unix_timestamp - ctx.accounts.staking_position.start_time,
                ctx.accounts.pool.lock_duration,
            );
            if reward > 0 && ctx.accounts.pool.is_active && ctx.accounts.status.pools_enabled {
                if clock.unix_timestamp > lock_end_time {
                    // if lock period is over: stake rewards and restake deposit amount
                    reward += ctx.accounts.staking_position.lock_amount;
                    ctx.accounts.staking_position.lock_amount = 0;
                    let bump = ctx.bumps.token_vault;
                    let vault_signer: &[&[&[u8]]] = &[&[constants::VAULT_SEED, &[bump]]];
                    let t_res = transfer(
                        CpiContext::new_with_signer(
                            ctx.accounts.token_program.to_account_info(),
                            Transfer {
                                from: ctx.accounts.token_vault.to_account_info(),
                                to: ctx.accounts.position_vault.to_account_info(),
                                authority: ctx.accounts.token_vault.to_account_info(),
                            },
                            vault_signer,
                        ),
                        reward,
                    );
                    if t_res.is_err() {
                        return err!(StakingErrors::MintError);
                    }

                    ctx.accounts.staking_position.staked_amount += reward;
                    ctx.accounts.pool.pool_staked += amount;
                } else {
                    // else lock period is not over: lock accumulated rewards and restake deposit amount with new amount
                    ctx.accounts.staking_position.lock_amount += reward;
                }
            }
        }
        //-------UPDATE USER VALUES-------//
        ctx.accounts.status.total_staked += amount;
        ctx.accounts.staking_position.staked_amount += amount;
        ctx.accounts.staking_position.start_time = clock.unix_timestamp;
        ctx.accounts.pool.pool_staked += amount;

        // Transfer tokens from user to vault
        let t_res = transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.position_vault.to_account_info(),
                    authority: ctx.accounts.signer.to_account_info(),
                },
            ),
            amount,
        );
        if t_res.is_err() {
            return err!(StakingErrors::TransferError);
        }

        emit!(UserStakedEvent {
            pool_id: pool_id,
            user: *ctx.accounts.signer.to_account_info().key,
            amount: amount,
            reward_amount: reward,
        });
        Ok(())
    }

    pub fn unstake(ctx: Context<Stake>, pool_id: u8) -> Result<()> {
        // Validate that token is the same as the one in status account
        if ctx.accounts.mint.to_account_info().key != &ctx.accounts.status.token {
            return err!(StakingErrors::InvalidTokenAccount);
        }
        // Validate that pool_id is valid
        if ctx.accounts.status.total_pools < pool_id {
            return err!(StakingErrors::InvalidPoolId);
        }
        if ctx.accounts.staking_position.staked_amount == 0 {
            return err!(StakingErrors::NoTokens);
        }
        let mut reward_amount: u64 = 0;
        // If pool is inactive, simply transfer the user's vaulted amount to their token account
        if ctx.accounts.pool.is_active && ctx.accounts.status.pools_enabled {
            let clock = Clock::get()?;
            let lock_end_time =
                ctx.accounts.staking_position.start_time + ctx.accounts.pool.lock_duration;
            if clock.unix_timestamp > lock_end_time {
                reward_amount = calc_rewards(
                    ctx.accounts.staking_position.staked_amount,
                    ctx.accounts.pool.reward_basis,
                    clock.unix_timestamp - ctx.accounts.staking_position.start_time,
                    ctx.accounts.pool.lock_duration,
                );
                // if lock period is over, transfer reward from vault to user's token account
                reward_amount += ctx.accounts.staking_position.lock_amount;
                ctx.accounts.staking_position.lock_amount = 0;
                // get token_vault signer
                let bump = ctx.bumps.token_vault;
                let vault_signer: &[&[&[u8]]] = &[&[constants::VAULT_SEED, &[bump]]];
                let t_res = transfer(
                    CpiContext::new_with_signer(
                        ctx.accounts.token_program.to_account_info(),
                        Transfer {
                            from: ctx.accounts.token_vault.to_account_info(),
                            to: ctx.accounts.user_token_account.to_account_info(),
                            authority: ctx.accounts.token_vault.to_account_info(),
                        },
                        vault_signer,
                    ),
                    reward_amount,
                );
                if t_res.is_err() {
                    return err!(StakingErrors::TransferError);
                }
            }
        }
        let bump = ctx.bumps.position_vault;
        let signer_key = ctx.accounts.signer.key();
        let position_vault_signer: &[&[&[u8]]] = &[&[
            constants::POSITION_SEED,
            signer_key.as_ref(),
            &[pool_id],
            &[bump],
        ]];

        ctx.accounts.pool.pool_staked -= ctx.accounts.staking_position.staked_amount;
        // Transfer tokens from user vault to user token account
        let t_res = transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.position_vault.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.position_vault.to_account_info(),
                },
                position_vault_signer,
            ),
            ctx.accounts.staking_position.staked_amount,
        );

        if t_res.is_err() {
            return err!(StakingErrors::TransferError);
        }

        emit!(UserUnstakedEvent {
            pool_id: pool_id,
            user: *ctx.accounts.signer.to_account_info().key,
            amount: ctx.accounts.staking_position.staked_amount,
            reward_amount: reward_amount,
        });
        // reset the user's staking position
        ctx.accounts.staking_position.staked_amount = 0;
        ctx.accounts.staking_position.start_time = 0;
        ctx.accounts.staking_position.lock_amount = 0;

        Ok(())
    }

    pub fn enable_disable_pool(
        ctx: Context<UpdatePool>,
        pool_id: u8,
        active_status: bool,
    ) -> Result<()> {
        if ctx.accounts.status.owner != *ctx.accounts.signer.to_account_info().key {
            return err!(StakingErrors::NotOwner);
        }
        if pool_id > ctx.accounts.status.total_pools {
            return err!(StakingErrors::InvalidPoolId);
        }
        if ctx.accounts.pool.is_active == active_status {
            return Ok(());
        }
        ctx.accounts.pool.is_active = active_status;
        Ok(())
    }

    pub fn update_pool_lock(
        ctx: Context<UpdatePool>,
        pool_id: u8,
        lock_duration: i64,
    ) -> Result<()> {
        if ctx.accounts.status.owner != *ctx.accounts.signer.to_account_info().key {
            return err!(StakingErrors::NotOwner);
        }
        if pool_id > ctx.accounts.status.total_pools {
            return err!(StakingErrors::InvalidPoolId);
        }
        if ctx.accounts.pool.lock_duration == lock_duration {
            return Ok(());
        }
        ctx.accounts.pool.lock_duration = lock_duration;
        Ok(())
    }

    pub fn update_pool_reward(
        ctx: Context<UpdatePool>,
        pool_id: u8,
        reward_basis: u32,
    ) -> Result<()> {
        if ctx.accounts.status.owner != *ctx.accounts.signer.to_account_info().key {
            return err!(StakingErrors::NotOwner);
        }
        if pool_id > ctx.accounts.status.total_pools {
            return err!(StakingErrors::InvalidPoolId);
        }
        if reward_basis > 100 {
            return err!(StakingErrors::InvalidInputValues);
        }
        if ctx.accounts.pool.reward_basis == reward_basis {
            return Ok(());
        }
        ctx.accounts.pool.reward_basis = reward_basis;
        Ok(())
    }

    pub fn all_pool_active_status(ctx: Context<DisablePools>) -> Result<()> {
        if ctx.accounts.status.owner != *ctx.accounts.signer.to_account_info().key {
            return err!(StakingErrors::NotOwner);
        }
        ctx.accounts.status.pools_enabled = !ctx.accounts.status.pools_enabled;
        Ok(())
    }
}

//------------------Helper Functions------------------//
fn calc_rewards(staked_amount: u64, basis_points: u32, time_dif: i64, total_diff: i64) -> u64 {
    let mut rewards = (staked_amount * basis_points as u64) / 100;
    if time_dif < 0 || total_diff < 0 {
        return 0;
    }
    if time_dif < total_diff {
        rewards = (rewards * time_dif as u64) / (total_diff as u64);
    }
    return rewards;
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [constants::VAULT_SEED],
        bump,
        payer = signer,
        token::mint = mint,
        token::authority = token_vault,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        seeds = [constants::STATUS_SEED],
        bump,
        payer = signer,
        space =  8 + std::mem::size_of::<Status>()
    )]
    pub status: Account<'info, Status>,

    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pool_id:u8)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [constants::POOL_SEED, &[pool_id]],
        bump,
        payer = signer,
        space = 8 + std::mem::size_of::<Pool>()
    )]
    pub new_pool: Account<'info, Pool>,

    #[account(mut)]
    pub status: Account<'info, Status>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pool_id:u8)]
pub struct Stake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    // Pool Account
    #[account(
        seeds = [constants::POOL_SEED, &[pool_id]],
        bump,
    )]
    pub pool: Account<'info, Pool>,

    // User's Token Account
    #[account(mut,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        seeds = [constants::POSITION_SEED, signer.key().as_ref(), &[pool_id]],
        bump,
        payer = signer,
        token::mint = mint,
        token::authority = position_vault,
    )]
    pub position_vault: Account<'info, TokenAccount>,

    // User's Staking Position
    #[account(
        init_if_needed,
        seeds = [signer.key.as_ref(), &[pool_id]],
        bump,
        payer = signer,
        space = 8 + std::mem::size_of::<StakingPosition>()
    )]
    pub staking_position: Account<'info, StakingPosition>,

    #[account(mut,
        seeds=[constants::VAULT_SEED],
        bump,
        token::mint = mint,
        token::authority = token_vault,
    )]
    pub token_vault: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub status: Account<'info, Status>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct DisablePools<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub status: Account<'info, Status>,
}

#[derive(Accounts)]
#[instruction(pool_id:u8)]
pub struct UpdatePool<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut,
        seeds = [constants::POOL_SEED, &[pool_id]],
        bump,
    )]
    pub pool: Account<'info, Pool>,

    #[account(
        seeds = [constants::STATUS_SEED],
        bump,
    )]
    pub status: Account<'info, Status>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Status {
    pub total_staked: u64,
    pub token: Pubkey,
    pub owner: Pubkey,
    pub total_pools: u8,
    pub pools_enabled: bool,
}

#[account]
pub struct Pool {
    pub pool_id: u8,
    pub pool_staked: u64,
    pub lock_duration: i64, // so it can be used with timestamp
    pub reward_basis: u32,  // APR in percentage
    pub is_active: bool,
}

// Once user unstakes, their position is reset. Either by claim or withdraw
#[account]
pub struct StakingPosition {
    pub staked_amount: u64,
    pub start_time: i64,
    pub lock_amount: u64,
}
