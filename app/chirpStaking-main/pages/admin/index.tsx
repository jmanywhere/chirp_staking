import CardComponent from "@/components/cardComponent";
import AdminComponent from "@/components/admin/adminComponent";
import Navigation from "@/components/Navigation";
import Image from 'next/image'
import bird from '@/public/imgs/bird-1.png'
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import useStakingStore from "@/hooks/useStakingProgram";
import {useState, useEffect} from 'react'

const Adminpage = () => {

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
    <Navigation activeId="staking"/>
    <main className="flex max-h-[calc(100vh_-_80px)] w-full flex-col">
      <CardComponent />
      <AdminComponent />
      {/* <PositionsComponent /> */}
      <Image src={bird.src} alt="" width={100} height={100} className="w-[18rem] h-[29rem] bottom-0 fixed"/>
    </main>
    </>
  );
};

export default Adminpage;
