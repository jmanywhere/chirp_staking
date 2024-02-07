"use client";

import React, { useState, useEffect, FC } from "react";
import useStakingProgram from "@/hooks/useStakingProgram";

const CardComponent: FC = () => {

  const totalStaked = useStakingProgram((state)=>state?.stats.status?.total_staked || 0)
  const totalPools = useStakingProgram((state)=>state?.stats.status?.total_pools || 0)
  const enabledPools = useStakingProgram((state)=>state?.stats.status?.active || false)

  return (
    <section className="py-10 px-2 md:px-10 flex flex-col items-center justify-center w-full">
      <div className="bg-[#dd3a3d] rounded-lg w-full py-5 text-white text-lg">
        <div className="grid md:grid-cols-2 grid-cols-1 w-full mt-5 space-x-2">
          <div className="flex flex-col col-span-1 items-center w-auto justify-center mb-5">
            <span className="font-[Eazy] text-5xl">{totalStaked ? totalStaked.toString() : 0}</span>
            <span className="font-[Chillow] tracking-wider">
              Total Staked
            </span>
          </div>
          <div className="col-span-1 items-center w-auto justify-center mb-5 flex flex-col">
            <span className="font-[Eazy] text-5xl">{totalPools ? totalPools.toString() : 0}</span>
            <span className="font-[Chillow] tracking-wider">Total Pools</span>
          </div>
          {/* <div className="col-span-1 items-center w-auto justify-center mb-5 flex flex-col">
            <span className="font-[Eazy] text-5xl">0</span>
            <span className="font-[Chillow] tracking-wider">Enabled Pools</span>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CardComponent;
