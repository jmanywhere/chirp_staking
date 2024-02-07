"use client";

// import { pools } from "@/data/atoms";
// import useStakingProgram, { useFetchPoolData } from "@/hooks/useStakingProgram";
// import { BN } from "@coral-xyz/anchor";
// import { useAtomValue } from "jotai";
import React, { useState, useEffect, FC } from "react";
import { useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";
import useStakingProgram from "@/hooks/useStakingProgram";
import { motion } from "framer-motion";
import Modal from "./shared/Modal";
import { formatDistanceStrict } from "date-fns/formatDistanceStrict";

const PoolsComponent: FC = () => {
  const wallet = useAnchorWallet();
  const stakeTokens = useStakingProgram((state) => state.stake);
  const unstakeTokens = useStakingProgram((state) => state.unstake);
  const allPools = useStakingProgram((state) => state?.stats.pools);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [isStakeModalOpen, setStakeModalOpen] = useState(false);
  const [isUnstakeModalOpen, setUnstakeModalOpen] = useState(false);

  async function handleStake(
    poolId: number,
    amount: number,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await stakeTokens(poolId, amount, wallet);
    setIsLoading(false);
  }

  async function handleUnstake(poolId: number, wallet: AnchorWallet) {
    setIsLoading(true);
    await unstakeTokens(poolId, wallet);
    setIsLoading(false);
  }

  return (
    <section className="py-10 px-2 md:px-10 flex flex-col items-center justify-center w-full z-[99]">
      <div className="bg-white/10 p-5 backdrop-blur-lg rounded-lg w-full py-5 text-white">
        <span className="font-[Chillow] tracking-wider m-5 text-2xl">
          Enabled Pools:
        </span>
        <div className="grid grid-cols-1 space-y-3 bg-[#dd3a3d]/80 p-5 rounded-md w-ful">
          {(allPools || []).map((pool, i) => {
            return (
              <React.Fragment key={`pool-${i}`}>
                <div
                  key={pool.pool_id}
                  className="grid-col-1 w-full flex flex-col space-y-3 border-2 border-white/30 rounded-md p-3"
                >
                  <div className="flex md:flex-row flex-col w-full justify-between">
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Staked in Pool: {pool.pool_staked.toString()}
                    </span>
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Lock period:&nbsp;
                      {formatDistanceStrict(
                        0,
                        pool.lock_duration.toNumber() * 1000
                      )}
                    </span>
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Reward Basis: {pool.reward_basis}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 md:space-x-3 md:space-y-0 space-y-2">
                    <motion.button
                      whileHover={{
                        color: "#dd3a3d",
                        backgroundColor: "#101010",
                        scale: 1.01,
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => setStakeModalOpen(true)}
                      className="col-span-1 bg-[#ecb621] rounded-md p-2 text-black font-[Chillow] py-5"
                    >
                      Stake
                    </motion.button>
                    <motion.button
                      whileHover={{
                        color: "#dd3a3d",
                        backgroundColor: "#101010",
                        scale: 1.01,
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => setUnstakeModalOpen(true)}
                      className="col-span-1 bg-[#ecb621] rounded-md p-2 text-black font-[Chillow] py-5"
                    >
                      Claim
                    </motion.button>
                  </div>
                </div>

                {isStakeModalOpen ? (
                  <>
                    <Modal
                      className=""
                      toggleModal={isStakeModalOpen}
                      handleToggle={setStakeModalOpen}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row items-center justify-between p-3 w-full">
                          <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                            Enter the amount you want to stake:
                          </span>
                        </div>
                        <div className="w-full">
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={inputValue}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              if (isNaN(parseFloat(e.target.value)))
                                setInputValue(0);
                              else setInputValue(e.target.valueAsNumber);
                            }}
                            className="w-full bg-transparent text-[#ecdd57] bg-white mb-6 rounded-md py-4 text-4xl font-poppins text-center focus:outline-none focus:border-none placeholder:text-white/60"
                          />
                        </div>
                        <motion.button
                          whileHover={{
                            color: "#dd3a3d",
                            backgroundColor: "#0A0A0A",
                            scale: 1.01,
                            transition: { duration: 0.3 },
                          }}
                          onClick={() =>
                            handleStake(
                              pool.pool_id,
                              inputValue,
                              wallet as AnchorWallet
                            )
                          }
                          className="w-full bg-[#ecb621] rounded-md p-5 tracking-wide text-black font-[Chillow] mb-5"
                        >
                          Stake
                        </motion.button>
                      </div>
                      <span className="text-black/50 font-poppins text-sm my-3 flex text-left flex-col px-2">
                        <span className="font-black uppercase font-[Eazy] text-black">
                          DISCLAIMER:
                        </span>{" "}
                        If you stake while your current position is still
                        ongoing. Your rewards will be locked and will be able to
                        be claimed until the new position is over.
                      </span>
                    </Modal>
                  </>
                ) : (
                  <></>
                )}

                {isUnstakeModalOpen ? (
                  <>
                    <Modal
                      className=""
                      toggleModal={isUnstakeModalOpen}
                      handleToggle={setUnstakeModalOpen}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row items-center justify-between p-3 w-full">
                          <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                            Confirm you wwant to unstake your tokens
                          </span>
                        </div>

                        <motion.button
                          whileHover={{
                            color: "#dd3a3d",
                            backgroundColor: "#0A0A0A",
                            scale: 1.01,
                            transition: { duration: 0.3 },
                          }}
                          onClick={() =>
                            handleUnstake(pool.pool_id, wallet as AnchorWallet)
                          }
                          className="w-full bg-[#ecb621] rounded-md p-5 tracking-wide text-black font-[Chillow] mb-5"
                        >
                          Unstake
                        </motion.button>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PoolsComponent;
