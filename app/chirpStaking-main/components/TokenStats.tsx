"use client";

import useStakingProgram, { useGeneralData } from "@/hooks/useStakingProgram";

export default function TokenStats() {
  useStakingProgram();
  const { tokenSupply, totalStaked, price } = useGeneralData();

  return (
    <div className="justify-evenly flex flex-col sm:flex-row flex-wrap items-center pt-6 gap-4">
      <div className="stats drop-shadow">
        <div className="stat bg-primary">
          <div className="stat-desc">Staked BFi</div>
          <div className="stat-value text-white">
            {tokenSupply && totalStaked
              ? ((totalStaked * 100) / tokenSupply).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) + "%"
              : 0}
          </div>
          <div className="stat-title text-accent">Supply %</div>
        </div>
      </div>
      <div className="stats drop-shadow">
        <div className="stat bg-primary">
          <div className="stat-desc">TVL</div>
          <div className="stat-value text-white">
            {totalStaked
              ? Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(totalStaked * (price || 0))
              : 0}
          </div>
          <div className="stat-title text-accent">USD</div>
        </div>
      </div>
      <div className="stats drop-shadow">
        <div className="stat bg-primary">
          <div className="stat-desc">BFi Price</div>
          <div className="stat-value text-white">{price || "TBD"}</div>
          <div className="stat-title text-accent">USD</div>
        </div>
      </div>
    </div>
  );
}
