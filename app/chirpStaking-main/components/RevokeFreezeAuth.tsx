"use client";

// import { providerAtom } from "@/data/atoms";
// import { tokenMintProgram } from "@/data/programKeys";
import useStakingProgram from "@/hooks/useStakingProgram";
import {
  TOKEN_PROGRAM_ID,
  createSetAuthorityInstruction,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
// import { useAtomValue } from "jotai";
import { useCallback, useState } from "react";

export default function RevokeFreezeAuth() {
  const wallet = useWallet();
  useStakingProgram();
  // const provider = useAtomValue(providerAtom);

  const [loading, setLoading] = useState(false);

  // const revokeFreezeAuthority = useCallback(async () => {
  //   if (!wallet.signTransaction || !wallet.publicKey || !provider) return;

  //   setLoading(true);

  //   const transaction = new Transaction().add(
  //     createSetAuthorityInstruction(
  //       tokenMintProgram,
  //       wallet.publicKey,
  //       1,
  //       null,
  //       undefined,
  //       TOKEN_PROGRAM_ID
  //     )
  //   );

  //   await provider.sendAndConfirm(transaction).finally(() => setLoading(false));
  // }, [wallet, provider]);
  return (
    <button
      className="btn btn-primary"
      disabled={loading}
      // onClick={() => revokeFreezeAuthority()}
    >
      {loading ? (
        <span className="loading loading-spinner" />
      ) : (
        "Revoke Freeze Authority"
      )}
    </button>
  );
}
