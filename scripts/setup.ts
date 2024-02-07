import fs from "fs";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IDL } from "../target/types/chirp_staking";

const programKey = new PublicKey("5ghCYkAfKSYZxuWi3ACcWviF9d7zCE8XKf2LD4hajMcL");
const chirpToken = new PublicKey("ALdyWN5zRTMA8p2yGaBx72jjam1YArdvpz6EetLWxzt1");

(async () => {
  const payer = loadKeypairFromFile("/Users/jmf/.config/solana/id.json");

  const wallet = new anchor.Wallet(payer);
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const provider = new anchor.AnchorProvider( connection, wallet,  { commitment: "confirmed"});
  const program = new anchor.Program(IDL, programKey, provider);

  const [tokenVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], program.programId);
  const [status] = PublicKey.findProgramAddressSync([Buffer.from("status")], program.programId);
  // Add your test here.
  const tx = await program.methods.initialize().accounts({
    tokenVault,
    status,
    mint: chirpToken,
  }).rpc();
  console.log("Your transaction signature", tx);

console.log('provider block',await provider.connection.getBlockHeight())

  const [pool1] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([1])], program.programId);
  const [pool2] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([2])], program.programId);
  const [pool3] = PublicKey.findProgramAddressSync([Buffer.from("pool"), new Uint8Array([3])], program.programId);

  const time1 = 30 * 24 * 3600; // 5 seconds
  const time2 = 60 * 24 * 3600; // 5 seconds
  const time3 = 90 * 24 * 3600; // 5 seconds

  const tx1= await program.methods.createPool(1, new anchor.BN(time1), 5)
    .accounts({
      newPool: pool1,
      status,
    }).rpc();
  const tx2 = await program.methods.createPool(2, new anchor.BN(time2), 15)
    .accounts({
      newPool: pool2,
      status,
    }).rpc();
  const tx3 = await program.methods.createPool(3, new anchor.BN(time3), 30)
    .accounts({
      newPool: pool3,
      status,
    }).rpc();

  const newOwner = new PublicKey("71cb6Wk3sness4ZSezZtBg9Ffordzw7c1NaYnDGcr14U");
  const ownerTransferTx = await program.methods.transferOwner(newOwner).accounts({
    status,
  }).rpc();

  console.log("Your owner transaction signature", ownerTransferTx);
})();

function loadKeypairFromFile(absPath: string) {
  try {
    if (!absPath) throw Error("No path provided");
    if (!fs.existsSync(absPath)) throw Error("File does not exist.");

    // load the keypair from the file
    const keyfileBytes = JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" }));
    // parse the loaded secretKey into a valid keypair
    const keypair = Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
    return keypair;
  } catch (err) {
    // return false;
    throw err;
  }
}