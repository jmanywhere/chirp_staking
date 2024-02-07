"use client";
import Image from "next/image";
// import Logo from "@/../public/bonkfi_logo.png";
import { useState, useCallback, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import Modal from "./shared/Modal";
import { motion } from "framer-motion";
import bird2 from "@/public/imgs/bird-2.png";
import useStakingProgram from "@/hooks/useStakingProgram";
import { useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";

const StakeComponent = () => {
  const stakeTokens = useStakingProgram((state) => state.stake);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStake(
    poolId: number,
    amount: number,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await stakeTokens(poolId, amount, wallet);
    setIsLoading(false);
  }

  return (
    <section className="md:py-10 px-2 md:px-10 flex flex-col items-center bg-transparent">
      <div className="rounded-xl bg-[#ecb621]/85 px-5 lg:px-16 py-5 md:py-10 w-full max-w-[1440px] backdrop-blur-md z-[99] relative">
        <Image
          src={bird2.src}
          alt=""
          width={100}
          height={100}
          className="absolute bottom-0 right-0"
        />
        <div className="flex flex-col lg:flex-row items-center lg:items-start md:pb-8 lg:pb-3 gap-4">
          <div className="max-h-[100px] max-w-[100px]">
            {/* <Image src={Logo} alt="logo" className="" /> */}
          </div>
          <h2 className="text-soft-blue font-[Eazy] text-2xl py-5 text-center md:text-4xl lg:text-5xl">
            Stake (& Lock) Your Chirp to Earn More $Chirp
          </h2>
        </div>

        <div className="w-auto items-center justify-center grid md:grid-cols-3 grid-cols-1 md:space-x-1 space-y-1 md:space-y-0 z-[10]">
          <motion.button
            whileHover={{
              color: "#ecb621",
              backgroundColor: "#0A0A0A",
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            // onClick={() => setModalOpen(true)}
            className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
          >
            Stake
          </motion.button>
          <motion.button
            whileHover={{
              color: "#ecb621",
              backgroundColor: "#0A0A0A",
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
          >
            Widthdraw
          </motion.button>
          <motion.button
            whileHover={{
              color: "#ecb621",
              backgroundColor: "#0A0A0A",
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
          >
            Claim
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default StakeComponent;
