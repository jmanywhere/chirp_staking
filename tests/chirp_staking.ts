import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChirpStaking } from "../target/types/chirp_staking";
import { createMintToken, createOrGetTokenAddress, waitForTransaction } from "./helpers";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

describe("chirp_staking", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.ChirpStaking as Program<ChirpStaking>;
  console.log("Program ID", program.programId.toBase58());
  console.log("Payer", payer.publicKey.toBase58());
  // const chirpToken = new PublicKey("ALdyWN5zRTMA8p2yGaBx72jjam1YArdvpz6EetLWxzt1");
  // // const token = createOrGetTokenAddress();

  
  // it("Is initialized!", async () => {
  //   // await createMintToken(token, payer, connection);

  //   const [tokenVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], program.programId);
  //   const [status] = PublicKey.findProgramAddressSync([Buffer.from("status")], program.programId);
  //   // Add your test here.
  //   const tx = await program.methods.initialize().accounts({
  //     tokenVault,
  //     status,
  //     mint: chirpToken,
  //   }).rpc();
  //   console.log("Your transaction signature", tx);
  //   await waitForTransaction(connection, tx);

  //   // const transfertx = await transfer(
  //   //   connection, payer.payer, (await getOrCreateAssociatedTokenAccount(connection, payer.payer, token.publicKey, payer.publicKey)).address, 
  //   //   tokenVault, payer.publicKey, 90_000 * 1e9
  //   //   );
  //   //   waitForTransaction(connection, transfertx);
    
  // });

  // it("can create pool", async () => {

  //   const [status] = PublicKey.findProgramAddressSync([Buffer.from("status")], program.programId);
  //   const [pool1] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([1])], program.programId);
  //   const [pool2] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([2])], program.programId);
  //   const [pool3] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([3])], program.programId);

  //   const time1 = 30 * 24 * 3600; // 5 seconds
  //   const time2 = 60 * 24 * 3600; // 5 seconds
  //   const time3 = 90 * 24 * 3600; // 5 seconds

  //   const tx = await program.methods.createPool(1, new anchor.BN(time1), 5)
  //     .accounts({
  //       newPool: pool1,
  //       status,
  //     }).rpc();
  //   const tx2 = await program.methods.createPool(2, new anchor.BN(time2), 15)
  //     .accounts({
  //       newPool: pool2,
  //       status,
  //     }).rpc();
  //   const tx3 = await program.methods.createPool(3, new anchor.BN(time3), 30)
  //     .accounts({
  //       newPool: pool3,
  //       status,
  //     }).rpc();

  //   const newOwner = new PublicKey("71cb6Wk3sness4ZSezZtBg9Ffordzw7c1NaYnDGcr14U");
  //   const ownerTransferTx = await program.methods.transferOwner(newOwner).accounts({
  //     status,
  //   }).rpc();

  //   await waitForTransaction(connection, ownerTransferTx);

  //   const pool = await program.account.pool.fetch(pool1);
  //   const statusInfo = await program.account.status.fetch(status);
  //   assert.equal(pool.poolId, 1, "pool id not set");
  //   assert.equal(statusInfo.poolsEnabled, true, "pools disabled")
  //   assert.equal(statusInfo.totalPools, 3, "pools size increased")
  // })

  // it("can stake", async () => {
  //   const [status] = PublicKey.findProgramAddressSync([Buffer.from("status")], program.programId);
  //   const [pool1] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([1])], program.programId);
  //   const [stakingPosition1] = PublicKey.findProgramAddressSync([payer.publicKey.toBuffer(), new Uint8Array([1])], program.programId);
  //   const [pos1Vault] = PublicKey.findProgramAddressSync([Buffer.from("position"), payer.publicKey.toBuffer(), new Uint8Array([1])], program.programId);
  //   const [tokenVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], program.programId);

  //   const userTokenAddress = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     payer.payer,
  //     token.publicKey,
  //     payer.publicKey
  //   )

  //   const stakedAmount = new anchor.BN("100000000000");
  //   const tx = await program.methods.stake(1, stakedAmount)
  //   .accounts({
  //     pool: pool1,
  //     stakingPosition: stakingPosition1,
  //     userTokenAccount: userTokenAddress.address,
  //     positionVault: pos1Vault,
  //     tokenVault,
  //     status,
  //     mint: token.publicKey,
  //   })
  //   .rpc({
  //     skipPreflight: true
  //   });

  //   waitForTransaction(connection, tx);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   const pool1Stake = await program.account.pool.fetch(pool1);
  //   assert.equal(pool1Stake.poolStaked.toString(), stakedAmount.toString(), "stake not set");
  //   const userPosition = await program.account.stakingPosition.fetch(stakingPosition1);
  //   assert.equal(userPosition.stakedAmount.toString(), stakedAmount.toString(), "user stake not set");
  // })

  // it("can claim rewards", async () => {
  //   const [status] = PublicKey.findProgramAddressSync([Buffer.from("status")], program.programId);
  //   const [pool1] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([1])], program.programId);
  //   const [stakingPosition1] = PublicKey.findProgramAddressSync([payer.publicKey.toBuffer(), new Uint8Array([1])], program.programId);
  //   const [pos1Vault] = PublicKey.findProgramAddressSync([Buffer.from("position"), payer.publicKey.toBuffer(), new Uint8Array([1])], program.programId);
  //   const [tokenVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], program.programId);

  //   const userTokenAddress = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     payer.payer,
  //     token.publicKey,
  //     payer.publicKey
  //   )

  //   await new Promise((resolve) => setTimeout(resolve, 6000));


  //   const tx = await program.methods.unstake(1).
  //     accounts ({
  //       pool: pool1,
  //       stakingPosition: stakingPosition1,
  //       userTokenAccount: userTokenAddress.address,
  //       positionVault: pos1Vault,
  //       tokenVault,
  //       status,
  //       mint: token.publicKey,
  //     }).rpc();
  
  //   waitForTransaction(connection, tx);

  //   const userPosition = await program.account.stakingPosition.fetch(stakingPosition1);
  //   assert.equal(userPosition.stakedAmount.toString(), "0", "user stake still live");
  //   const userBalance = await connection.getTokenAccountBalance(userTokenAddress.address);
  //   assert.equal(userBalance.value.uiAmount, 10020 , "user balance does not match");
  // })
});
