import { create } from "zustand";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, ConfirmOptions, Transaction, clusterApiUrl } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { getStakingProgram, tokenMintProgram } from "@/utils/programs";
import { getChirpToken } from "@/utils/token";
import { ChirpStaking } from "@/types/staking";

type Status = {
  total_staked: number,
  token: PublicKey,
  owner: PublicKey,
  total_pools: number,
  active: boolean,
}

export type Pool = {
  pool_id: number,
  pool_staked: number,
  lock_duration: anchor.BN,
  reward_basis: number,
  is_active: boolean,
  user_staked: anchor.BN,
  user_start: anchor.BN,
  user_locked: anchor.BN
}

type StakingPosition = {
  staked_amount: number,
  start_time: number,
}

type StakingState = {
  wallet: AnchorWallet;
  program: anchor.Program<ChirpStaking>,
  connection: Connection,
  chirpToken: PublicKey,
  // walletChirpAccount: PublicKey,
}

type stakingStats = {
  pools: Pool[],
  stakingPosition?: StakingPosition,
  status: Status,
  tokenPrice: number,
}

interface StakingStore {
  stats: stakingStats;
  state: StakingState;
  getStats: () => Promise<boolean>;
  initState: (wallet: AnchorWallet, loadStats?: boolean) => Promise<boolean>;
  stake: (poolId: number, amount: number, wallet: AnchorWallet) => Promise<void>
  createPool: (poolId: number, lockDuration: number, rewardBasis: number, wallet: AnchorWallet) => void;
  unstake: (poolId: number, wallet: AnchorWallet) => void;
  enableDisablePool: (poolId: number, activeStatus: boolean, wallet: AnchorWallet) => void;
  updatePoolLock: (poolId: number, lockDuration: number, wallet: AnchorWallet) => void;
  updatePoolReward: (poolId: number, rewardBasis: number, wallet: AnchorWallet) => void;
  allPoolActiveStatus: () => Promise<boolean>
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const useStakingStore = create<StakingStore>((set, get) => ({
  stats: {} as stakingStats,
  state: {} as StakingState,

  /* get user balance
  const tokenAccount = await getAssociatedTokenAddressSync(
      tokenMintProgram,
      publicKey
    );
    const bal = await connection.connection.getTokenAccountBalance(
      tokenAccount
    );
  */

  initState: async (wallet:AnchorWallet, loadStats = false) => {

    const connection = new anchor.web3.Connection(
      
      process.env.NEXT_PUBLIC_HELIUS_RPC_URL as string,
      // clusterApiUrl("devnet"),
      "processed" as ConfirmOptions
    );

    const provider = new anchor.AnchorProvider(connection, wallet, "processed" as ConfirmOptions);

    const program = getStakingProgram(provider);

    const chirpToken = getChirpToken()

    // const walletChirpAccount = await Token.getAssociatedTokenAddressSync(
    //   ASSOCIATED_TOKEN_PROGRAM_ID,
    //   TOKEN_PROGRAM_ID,
    //   chirpToken,
    //   program.provider.publicKey //wallet (?)
    // );
    
    const allPools = await program.account.pool.all(); 
    // allPools[0].account.isActive //example
    const [userPos1] = PublicKey.findProgramAddressSync([wallet.publicKey.toBuffer(), new Uint8Array([1])], program.programId)
    const [userPos2] = PublicKey.findProgramAddressSync([wallet.publicKey.toBuffer(), new Uint8Array([2])], program.programId)
    const [userPos3] = PublicKey.findProgramAddressSync([wallet.publicKey.toBuffer(), new Uint8Array([3])], program.programId)

    const userPositions = await program.account.stakingPosition.fetchMultiple([ userPos1, userPos2, userPos3 ])
    // console.log(userPositions, 'userPosition')


    set({
      state: {
        wallet,
        program,
        connection,
        chirpToken
        // allPools,
        // walletChirpAccount,
        // stakingPos,
        // status
      },
    });
    if (loadStats) {
      await get().getStats();
    }
    return true
  },

  getStats: async () => {

    const status = {} as Status
    const stakingPos = {} as StakingPosition

    const _state = get().state

    const program = _state.program
    const _wallet = get().state.wallet

    const allPools = await program.account.pool.all();

    // allPools[0].account.isActive //example
    const [userPos1] = PublicKey.findProgramAddressSync([_wallet.publicKey.toBuffer(), new Uint8Array([1])], program.programId)
    const [userPos2] = PublicKey.findProgramAddressSync([_wallet.publicKey.toBuffer(), new Uint8Array([2])], program.programId)
    const [userPos3] = PublicKey.findProgramAddressSync([_wallet.publicKey.toBuffer(), new Uint8Array([3])], program.programId)

    
    const userPositions = await program.account.stakingPosition.fetchMultiple([ userPos1, userPos2, userPos3 ])
    console.log(userPositions, 'userPosition')

    const dexScreenerData = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenMintProgram}`)
      .then( (res) => res.json())
      .catch( () => null);

    const price = dexScreenerData.pairs?.[0].priceUsd || 0

    const parsedPools:Pool[] = allPools.sort( (a,b) => 
    {
      if (a.account.poolId > b.account.poolId)
      return 1;
      if (a.account.poolId < b.account.poolId)
      return -1;
      return 0;
    } ).map((pool, i)=>{
      return {
        pool_id: pool.account.poolId,
        pool_staked: pool.account.poolStaked,
        lock_duration: pool.account.lockDuration,
        reward_basis: pool.account.rewardBasis,
        is_active: pool.account.isActive,
        user_staked: userPositions[i]?.stakedAmount,
        user_start: userPositions[i]?.startTime,
        user_locked: userPositions[i]?.lockAmount,
      }
    })

    set({
      stats: {
        pools: parsedPools,
        stakingPosition: stakingPos,
        status: status,
        tokenPrice: price
      },
    });
    return true
  },

  stake: async (poolId: number, amount: number, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;

    try {
      // Fetch the accounts needed for the stake transaction
      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      const userPoolAccount = await PublicKey.findProgramAddressSync(
        [wallet.publicKey.toBuffer(), new Uint8Array([poolId])],
        program.programId
      );

      const userTokenAccount = getAssociatedTokenAddressSync(tokenMintProgram, wallet.publicKey);
      const [positionVault] = PublicKey.findProgramAddressSync([Buffer.from('position'), wallet.publicKey.toBuffer(), new Uint8Array([poolId]) ], program.programId);
      const [vaultAccount] = PublicKey.findProgramAddressSync([Buffer.from('vault')], program.programId);
      const [statusAccount] = PublicKey.findProgramAddressSync([Buffer.from('status')], program.programId);
      console.log({userTokennAccount: userTokenAccount.toBase58()})
      try{
        // Make the stake transaction
        const tx = await program.methods.stake(poolId, new anchor.BN(Math.floor(amount * 1e9).toString())).accounts({
            pool: poolIdAccount[0],
            userTokenAccount,
            stakingPosition: userPoolAccount[0],
            tokenVault: vaultAccount,
            status: statusAccount,
            mint: tokenMintProgram,
            positionVault
            // Add other accounts as needed
        }).rpc().catch(e => console.log("dafuq", e));
  
        // Handle the transaction and update state as needed
        console.log({ tx });

      }
      catch(e){
        console.log(e)
      }

      // Refresh staking stats after a successful stake
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Stake error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

  allPoolActiveStatus: async () => {

    const _state = get().state
    const program = _state.program

    try {
      const [status] = PublicKey.findProgramAddressSync([Buffer.from('status')], program.programId);

      const tx = await program.methods.allPoolActiveStatus().accounts({
        status
      }).rpc()


      // Handle transaction success
      console.log('Transaction successful:', tx);
    } catch (error) {
      // Handle transaction error
      console.error('Transaction failed:', error);
    }

    return true;
  },

  createPool: async (poolId: number, lockDuration: number, rewardBasis: number, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;
    
    
    try {
      // Fetch the accounts needed for the createPool transaction
      const [status] = PublicKey.findProgramAddressSync([Buffer.from('status')], program.programId);
      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      // Make the createPool transaction
      const tx = await program.methods.createPool(poolId, lockDuration, rewardBasis).accounts({
          newPool: poolIdAccount[0],
          status, // Replace with the actual status account
          // Add other accounts as needed
      }).rpc();

      // Handle the transaction and update state as needed
      console.log({ tx });

      // Refresh staking stats after a successful createPool
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Create pool error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

  unstake: async (poolId: number, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;

    try {

      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      const userPoolAccount = await PublicKey.findProgramAddressSync(
        [wallet.publicKey.toBuffer(), new Uint8Array([poolId])],
        program.programId
      );

      const userTokenAccount = getAssociatedTokenAddressSync(tokenMintProgram, wallet.publicKey);
      const [positionVault] = PublicKey.findProgramAddressSync([Buffer.from('position'), wallet.publicKey.toBuffer(), new Uint8Array([poolId]) ], program.programId);
      const [vaultAccount] = PublicKey.findProgramAddressSync([Buffer.from('vault')], program.programId);
      const [statusAccount] = PublicKey.findProgramAddressSync([Buffer.from('status')], program.programId);
      
      // Make the unstake transaction
      const tx = await program.methods.unstake(poolId).
        accounts({
          pool: poolIdAccount[0],
          userTokenAccount,
          stakingPosition: userPoolAccount[0],
          tokenVault: vaultAccount,
          status: statusAccount,
          mint: tokenMintProgram,
          positionVault
          // Add other accounts as needed
      }).rpc();

      // Handle the transaction and update state as needed
      console.log({ tx });

      // Refresh staking stats after a successful unstake
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Unstake error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

  enableDisablePool: async (poolId: number, activeStatus: boolean, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;

    try {
      // Fetch the accounts needed for the enable/disable pool transaction
      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      // Make the enable/disable pool transaction
      const tx = await program.methods.enableDisablePool(poolId, activeStatus)
        .accounts({
          pool: poolIdAccount[0],
          // Add other accounts as needed
        }).rpc();

      // Handle the transaction and update state as needed
      console.log({ tx });

      // Refresh staking stats after a successful enable/disable pool
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Enable/disable pool error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

  updatePoolLock: async (poolId: number, lockDuration: number, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;

    try {
      // Fetch the accounts needed for the update pool lock transaction
      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      // Make the update pool lock transaction
      const tx = await program.methods.updatePoolLock(poolId, lockDuration)
      .accounts({
          pool: poolIdAccount[0],
          // Add other accounts as needed
      }).rpc();

      // Handle the transaction and update state as needed
      console.log({ tx });

      // Refresh staking stats after a successful update pool lock
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Update pool lock error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

  updatePoolReward: async (poolId: number, rewardBasis: number, wallet: AnchorWallet) => {
    const _state = get().state;
    const program = _state.program;

    try {
      // Fetch the accounts needed for the update pool reward transaction
      const poolIdAccount = await PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), new Uint8Array([poolId])],
        program.programId
      );

      // Make the update pool reward transaction
      const tx = await program.methods.updatePoolReward(poolId, rewardBasis).accounts({
          signer: wallet.publicKey,
          pool: poolIdAccount[0],
          // Add other accounts as needed
      }).rpc();

      // Handle the transaction and update state as needed
      console.log({ tx });

      // Refresh staking stats after a successful update pool reward
      await get().getStats();
    } catch (error) {
      // Handle errors
      console.error("Update pool reward error:", error);
      // Optionally, you can throw the error or perform other error-handling logic
    }
  },

}))

export default useStakingStore