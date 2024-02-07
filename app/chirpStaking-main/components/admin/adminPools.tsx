"use client";

import React, { useState, useEffect, FC } from "react";
import { useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";
import useStakingProgram from "@/hooks/useStakingProgram";
import { motion } from "framer-motion";
import Modal from "../shared/Modal";

const AdminPools: FC = () => {
  const wallet = useAnchorWallet();
  const enableDisablePool = useStakingProgram(
    (state) => state.enableDisablePool
  );
  const updatePoolLock = useStakingProgram((state) => state.updatePoolLock);
  const updatePoolReward = useStakingProgram((state) => state.updatePoolReward);
  const allPools = useStakingProgram((state) => state?.stats.pools);
  const [isLoading, setIsLoading] = useState(false);

  //Modal for different functions
  const [isUpdatePoolLockModalOpen, setUpdatePoolLockModalOpen] =
    useState(false);
  const [inputUpdatePoolLock, setInputUpdatePoolLock] = useState(0);

  const [isUpdatePoolRewardModalOpen, setUpdatePoolRewardModalOpen] =
    useState(false);
  const [inputUpdatePoolReward, setInputUpdatePoolReward] = useState(0);

  async function handleEnableDisablePool(
    poolId: number,
    activeStatus: boolean,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await enableDisablePool(poolId, activeStatus, wallet);
    setIsLoading(false);
  }

  async function handleUpdatePoolLock(
    poolId: number,
    lockDuration: number,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await updatePoolLock(poolId, lockDuration, wallet);
    setIsLoading(false);
  }

  async function handleUpdatePoolReward(
    poolId: number,
    rewardBasis: number,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await updatePoolReward(poolId, rewardBasis, wallet);
    setIsLoading(false);
  }

  return (
    <section className="py-10 px-2 md:px-10 flex flex-col items-center justify-center w-full z-[99]">
      <div className="bg-[#dd3a3d] rounded-lg w-full py-5 text-white">
        <span className="font-[Chillow] tracking-wider m-5 text-2xl">
          Enabled Pools:
        </span>
        <div className="grid md:grid-cols-3 grid-cols-1">
          {allPools.map((pool, i) => {
            return (
              <>
                <div
                  key={pool.pool_id}
                  className="grid-col-1 w-full flex flex-col space-y-3 border-2 border-white/30 rounded-md p-3"
                >
                  <div className="flex flex-row w-full justify-between">
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Staked in Pool: {pool.pool_staked.toString()}
                    </span>
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Lock period: {pool.lock_duration.toString()}
                    </span>
                    <span className="font-[Eazy] text-xl text-white/90 tracking-wide">
                      Reward Basis: {pool.reward_basis}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 space-x-1">
                    <motion.button
                      whileHover={{
                        color: "#ecb621",
                        backgroundColor: "#0A0A0A",
                        scale: 1.01,
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => setUpdatePoolLockModalOpen(true)}
                      className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
                    >
                      Update Lock
                    </motion.button>
                    <motion.button
                      whileHover={{
                        color: "#ecb621",
                        backgroundColor: "#0A0A0A",
                        scale: 1.01,
                        transition: { duration: 0.3 },
                      }}
                      onClick={() => setUpdatePoolRewardModalOpen(true)}
                      className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
                    >
                      Update Reward Basis
                    </motion.button>
                  </div>
                </div>

                {isUpdatePoolLockModalOpen ? (
                  <>
                    <Modal
                      className=""
                      toggleModal={isUpdatePoolLockModalOpen}
                      handleToggle={setUpdatePoolLockModalOpen}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row items-center justify-between p-3 w-full">
                          <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                            Enter the new lock amount:
                          </span>
                        </div>
                        <div className="w-full">
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={inputUpdatePoolLock}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              if (isNaN(parseFloat(e.target.value)))
                                setInputUpdatePoolLock(0);
                              else
                                setInputUpdatePoolLock(e.target.valueAsNumber);
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
                            handleUpdatePoolLock(
                              pool.pool_id,
                              inputUpdatePoolLock,
                              wallet as AnchorWallet
                            )
                          }
                          className="w-full bg-[#ecb621] rounded-md p-5 tracking-wide text-black font-[Chillow] mb-5"
                        >
                          Update
                        </motion.button>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <></>
                )}

                {isUpdatePoolRewardModalOpen ? (
                  <>
                    <Modal
                      className=""
                      toggleModal={isUpdatePoolRewardModalOpen}
                      handleToggle={setUpdatePoolRewardModalOpen}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row items-center justify-between p-3 w-full">
                          <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                            Enter the new reward basis amount:
                          </span>
                        </div>
                        <div className="w-full">
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={inputUpdatePoolReward}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              if (isNaN(parseFloat(e.target.value)))
                                setInputUpdatePoolReward(0);
                              else
                                setInputUpdatePoolReward(
                                  e.target.valueAsNumber
                                );
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
                            handleUpdatePoolReward(
                              pool.pool_id,
                              inputUpdatePoolReward,
                              wallet as AnchorWallet
                            )
                          }
                          className="w-full bg-[#ecb621] rounded-md p-5 tracking-wide text-black font-[Chillow] mb-5"
                        >
                          Update
                        </motion.button>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdminPools;
