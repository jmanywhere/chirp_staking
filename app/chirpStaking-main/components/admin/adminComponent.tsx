"use client";

import Image from "next/image";
import { useState } from "react";
import { useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react";
import useStakingProgram from "@/hooks/useStakingProgram";
import Modal from "../shared/Modal";
import { motion } from "framer-motion";
import bird2 from "@/public/imgs/bird-2.png";

const StakeComponent = () => {
  const wallet = useAnchorWallet();
  const createPool = useStakingProgram((state) => state.createPool);
  const toggleAllPools = useStakingProgram(
    (state) => state.allPoolActiveStatus
  );

  const [isLoading, setIsLoading] = useState(false);
  const [inputReward, setInputReward] = useState(0);
  const [lockTime, setLockTime] = useState(0);
  const dropdownOptions = [30, 60, 90];
  const [isModalOpen, setModalOpen] = useState(false);

  async function handleToggleAllPools() {
    setIsLoading(true);
    await toggleAllPools();
    setIsLoading(false);
  }

  async function handleCreatePool(
    poolId: number,
    lockDuration: number,
    rewardBasis: number,
    wallet: AnchorWallet
  ) {
    setIsLoading(true);
    await createPool(poolId, lockDuration, rewardBasis, wallet);
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

        <div className="w-auto items-center justify-center grid grid-cols-1 md:space-x-1 space-y-1 md:space-y-0 z-[10]">
          {/* <motion.button
            whileHover={{
              color: "#ecb621",
              backgroundColor: "#0A0A0A",
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            onClick={() => setModalOpen(true)}
            className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
          >
            Create Pool
          </motion.button> */}
          <motion.button
            whileHover={{
              color: "#ecb621",
              backgroundColor: "#0A0A0A",
              scale: 1.01,
              transition: { duration: 0.3 },
            }}
            onClick={() => handleToggleAllPools()}
            className="col-span-1 bg-[#dd3a3d] rounded-md p-5 text-white font-[Chillow]"
          >
            Toggle All Pools
          </motion.button>
        </div>
      </div>
      {isModalOpen ? (
        <>
          <Modal
            className=""
            toggleModal={isModalOpen}
            handleToggle={setModalOpen}
          >
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-between p-3 w-full">
                <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                  Choose Stake Duration
                </span>
                <div className="flex justify-center">
                  {dropdownOptions.map((dayOption, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem] font-[Eazy]  text-white"
                        >
                          <input
                            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-[#ecdd57] checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-[#ecdd57] checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#ecdd57] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] "
                            type="radio"
                            name="inlineRadioOptions"
                            id={i.toString()}
                            value={`Option ${i}: ${dayOption} days`}
                            onClick={() => setLockTime(dayOption)}
                          />
                          <label
                            className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                            htmlFor={dayOption.toString()}
                          >
                            {dayOption} days
                          </label>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="w-full">
                <span className="text-white text-2xl font-[Chillow] p-3 tracking-wider text-nowrap">
                  What's the rewward basis?
                </span>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={inputReward}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    if (isNaN(parseFloat(e.target.value))) setInputReward(0);
                    else setInputReward(e.target.valueAsNumber);
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
                  handleCreatePool(
                    1,
                    lockTime,
                    inputReward,
                    wallet as AnchorWallet
                  )
                }
                className="w-full bg-[#ecb621] rounded-md p-5 tracking-wide text-black font-[Chillow] mb-5"
              >
                Create Pool
              </motion.button>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </section>
  );
};

export default StakeComponent;
