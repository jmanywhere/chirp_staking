"use client";

import { topPoolsAtom } from "@/data/atoms";
import { useFetchPoolData } from "@/hooks/useStakingProgram";
import { useAtomValue } from "jotai";

export default function Leaderboard() {
  useFetchPoolData();
  const allPools = useAtomValue(topPoolsAtom);

  const totalValidPools = allPools.filter(
    (pool) => pool?.account?.amount.toNumber() > 0
  ).length;
  const topPools = allPools.slice(0, 10);

  return (
    <div>
      <h3 className="text-2xl font-anton pb-4 text-secondary">Leaderboard</h3>
      <p className="font-poppins text-black whitespace-pre-wrap">
        <strong className="text-base">Total Stakers:</strong>
        {"\n"}
        {totalValidPools}
        {"\n"}
        {"\n"}
        <strong className="text-base">Top 10 Stakers:</strong>
        {"\n"}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Staked</th>
            <th>PDA</th>
          </tr>
        </thead>
        <tbody>
          {topPools.map((pool, index) => {
            if (index == 0) console.log(pool);
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="font-mono text-right">
                  {(pool?.account?.amount / 1e3).toLocaleString(undefined, {
                    maximumFractionDigits: 3,
                  })}
                </td>
                <td className="text-right">
                  <a
                    target="_blank"
                    href={`https://explorer.solana.com/address/${pool?.publicKey?.toBase58()}`}
                  >
                    {pool?.publicKey?.toBase58().slice(0, 6)}...
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
