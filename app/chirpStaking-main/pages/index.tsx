import CardComponent from "@/components/cardComponent";
import StakeComponent from "@/components/stakeComponent";
import PoolsComponent from "@/components/poolsComponent";
import PositionsComponent from "@/components/positionsComponent";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import bird from "@/public/imgs/bird-1.png";
import useStakingStore from "@/hooks/useStakingProgram";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import WalletMultiButtonStyled from "@/components/shared/WalletMultiButtonStyled";
import { type NextPage } from "next";

const Home: NextPage = () => {
  const stats = useStakingStore((state) => state.stats);
  const connection = useStakingStore((state) => state.state.connection);
  const wallet = useAnchorWallet();
  const initState = useStakingStore((state) => state.initState);
  const [initLoading, setInitLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    async function initStore() {
      setInitLoading(true);
      await initState(wallet as AnchorWallet, true);
      setInitLoading(false);
    }
    if (wallet?.publicKey) {
      setWalletConnected(true);
      initStore();
    } else {
      setWalletConnected(false);
    }
  }, [wallet]);

  return (
    <>
      <Navigation activeId="staking" />
      <main className="flex max-h-[calc(100vh_-_80px)] w-full flex-col overflow-auto scroll-smooth">
        {walletConnected ? (
          <>
            <CardComponent />
            <StakeComponent />
            <PoolsComponent />
          </>
        ) : (
          <>
            <div className="w-full flex h-[calc(100vh_-_80px)] items-center justify-center">
              <WalletMultiButtonStyled className="" />
            </div>
          </>
        )}
        {/* <PositionsComponent /> */}
        <Image
          src={bird.src}
          alt=""
          width={100}
          height={100}
          className="w-[18rem] h-[29rem] bottom-0 fixed"
        />
      </main>
    </>
  );
};

export default Home;
