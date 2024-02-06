import { Wallet } from '@coral-xyz/anchor'
import { Connection, Keypair } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token'

export async function waitForTransaction(connection: Connection, tx: string){
  const latestblock = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction({
    ...latestblock,
    signature: tx,
  }, "confirmed")
}

export function createOrGetTokenAddress() {
  const newPair = Keypair.fromSecretKey(new Uint8Array([
      28,  73, 108,  26,  23, 182,  27,  82, 134, 235, 229,
     193,  62, 245, 215, 248,  20, 158, 214, 240, 211, 117,
     248,  34, 112, 196,  24,  95,  73,  73,  81, 125, 163,
     132,  18, 182,  63, 234, 151,  76, 139,  62,   3, 211,
     187,  93, 233,  44,  69, 132, 232,  98, 175,  67, 123,
     119, 227, 208,  12,  54,  95, 255, 204, 176
  ]))
  // const newPair = Keypair.generate();
  // console.log('newPair', newPair.secretKey)
  return newPair;
}

export async function createMintToken( tokenPair: Keypair, payer: Wallet, connection: Connection){
  const mintLamportBalance = await connection.getBalance(tokenPair.publicKey, "confirmed")
  if( mintLamportBalance > 0 ){
    console.log("Mint already created")
    return;
  }
  const mint = await createMint(connection, payer.payer, payer.publicKey, payer.publicKey, 9, tokenPair)
  console.log(mint)

  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer.payer,
    tokenPair.publicKey,
    payer.publicKey
  )

  await mintTo(
    connection,
    payer.payer,
    tokenPair.publicKey,
    userTokenAccount.address,
    payer.publicKey,
    100_000 * 1e9
  )
}