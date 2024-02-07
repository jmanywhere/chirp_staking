"use client";

// import { usePoolExitActions } from "@/hooks/useStakingProgram";
import { differenceInSeconds } from "date-fns/differenceInSeconds";
import { format } from "date-fns/format";
import { formatDistanceStrict } from "date-fns/formatDistanceStrict";
// import { useAtomValue } from "jotai";
// import compact from "lodash/compact";
// import { offPools, pools } from "@/data/atoms";
import { differenceInDays } from "date-fns/differenceInDays";
import { useEffect, useState } from "react";

const PositionsComponent = () => {
  const [dateCheck, setDateCheck] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateCheck(new Date()), 1000);
    return () => clearInterval(interval);
  });

  // const poolData = useAtomValue(pools);
  // const pool1 = poolData[0];
  // const pool2 = poolData[1];
  // const pool3 = poolData[2];
  // const exitPools = useAtomValue(offPools);
  // const { claim, exit, compound, loading } = usePoolExitActions();
  // const allPools = [pool1, pool2, pool3];
  // const poolRows = compact(
  //   allPools.map((pool, index) => {
  //     if (!pool) return null;
  //     const { userPoolInfo, poolInfo } = pool;
  //     if (!userPoolInfo || !poolInfo || userPoolInfo.amount.isZero())
  //       return null;
  //     const lockTime = poolInfo.lockTime.toNumber();
  //     const endTime = (userPoolInfo.startTime.toNumber() + lockTime) * 1000;
  //     const diff = differenceInSeconds(endTime, dateCheck);
  //     const earned = (userPoolInfo.amount * poolInfo.basisPoints) / 100 / 1e3;
  //     const calculatedEarned = (earned * (lockTime - diff)) / lockTime;
  //     return (
  //       <tr
  //         key={`table_item_${index}`}
  //         className="text-center text-soft-blue font-roboto-condensed border-collapse border-secondary text-lg"
  //       >
  //         <td className="whitespace-pre-wrap">
  //           {formatDistanceStrict(0, poolInfo.lockTime.toNumber() * 1000)}
  //           {"\n"}
  //           {Math.abs(
  //             (poolInfo.basisPoints * 365) /
  //               differenceInDays(0, poolInfo.lockTime.toNumber() * 1000)
  //           ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
  //           % APR
  //         </td>
  //         <td>{(userPoolInfo.amount / 1e3).toLocaleString()}</td>
  //         <td>
  //           {(diff < 0
  //             ? earned
  //             : Math.floor(calculatedEarned * 1000) / 1000
  //           ).toLocaleString()}
  //         </td>
  //         <td>{format(endTime, "yyyy-MM-dd HH:mm")}</td>
  //         <td className="flex flex-row gap-2 justify-center">
  //           {userPoolInfo.claimed ? (
  //             <span className="text-success font-bold">CLAIMED</span>
  //           ) : (
  //             <>
  //               {
  //                 <button
  //                   className="btn btn-outline btn-success"
  //                   disabled={diff > 0 || loading}
  //                   onClick={() => claim(index + 7)}
  //                 >
  //                   {loading ? (
  //                     <span className="loading loading-spinner" />
  //                   ) : (
  //                     "Claim"
  //                   )}
  //                 </button>
  //               }
  //               <button
  //                 className="btn btn-outline btn-error"
  //                 onClick={() => exit(index + 7)}
  //                 disabled={loading}
  //               >
  //                 {loading ? (
  //                   <span className="loading loading-spinner" />
  //                 ) : (
  //                   "Exit"
  //                 )}
  //               </button>
  //             </>
  //           )}
  //         </td>
  //       </tr>
  //     );
  //   })
  // );
  // const exitRows = compact(
  //   exitPools.map((pool, index) => {
  //     if (!pool) return null;
  //     if (pool.amount.isZero()) return null;

  //     return (
  //       <tr
  //         key={`table_item_${index}`}
  //         className="text-center text-soft-blue font-roboto-condensed border-collapse border-secondary text-lg"
  //       >
  //         <td colSpan={2}>{(pool.amount / 1e3).toLocaleString()}</td>
  //         <td className="flex flex-row gap-2 justify-center" colSpan={3}>
  //           {pool.claimed ? (
  //             <span className="text-success font-bold">CLAIMED</span>
  //           ) : (
  //             <button
  //               className="btn btn-outline btn-error"
  //               onClick={() => exit(index + 1)}
  //               disabled={loading}
  //             >
  //               {loading ? (
  //                 <span className="loading loading-spinner" />
  //               ) : (
  //                 "Exit"
  //               )}
  //             </button>
  //           )}
  //         </td>
  //       </tr>
  //     );
  //   })
  // );
  return (
    <section className="flex flex-col items-center px-5 md:px-10 py-5">
      <div className="w-full max-w-[1440px] rounded-xl bg-off-white py-10 px-7">
        <h2 className="text-3xl font-poppins text-secondary font-bold pb-3">
          Stake Positions
        </h2>
        <div className="overflow-x-auto">
          <table className="table  table-pin-rows table-pin-cols">
            <thead>
              <tr className="bg-off-white text-primary font-roboto font-boold text-xl">
                <td>Stake Type</td>
                <td>BFI Staked</td>
                <td>BFI Earned</td>
                <td>Unlock Time</td>
                <td className="text-center">Actions</td>
              </tr>
            </thead>
            <tbody>
              {/* {poolRows.length > 0 ? (
                poolRows
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Staked Positions
                  </td>
                </tr>
              )}
              {exitRows.length > 0 && (
                <>
                  <tr className="bg-off-white text-primary font-roboto font-boold text-xl">
                    <td colSpan={5}>Wrong Positions</td>
                  </tr>
                  {exitRows}
                </>
              )} */}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PositionsComponent;
