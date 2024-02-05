//! Program Events
use anchor_lang::prelude::*;

#[event]
pub struct CreatePoolEvent {
    pub pool_id: u8,
    pub lock_duration: i64,
    pub reward_basis: u32,
}

#[event]
pub struct UserStakedEvent {
    pub pool_id: u8,
    pub user: Pubkey,
    pub amount: u64,
    pub reward_amount: u64,
}

#[event]
pub struct UserUnstakedEvent {
    pub pool_id: u8,
    pub user: Pubkey,
    pub amount: u64,
    pub reward_amount: u64,
}
