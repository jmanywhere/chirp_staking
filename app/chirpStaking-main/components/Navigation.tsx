import React, {FC} from "react";
import WalletMultiButtonStyled from "./shared/WalletMultiButtonStyled";
import Image from 'next/image'
import icon from '@/public/imgs/icon.svg'
import chirp from '@/public/imgs/chrip.png'

const navigationItems = [
    // {
    //     id: "home",
    //     title: "Home",
    //     href: "https://chirpdabird.com/"
    // },
    {
        id: "staking",
        title: "Staking",
        href: "https://chirpdabird.com/staking"
    },
    {
        id: "swap",
        title: "Swap",
        href: "https://jup.ag/"
    },
];
interface NavigationProps {
    activeId: string;
}
/**
 * Component that contains the global menu
 */
const Navigation: FC<NavigationProps>  = ({activeId}) => {

    return (
        <div
            className="bg-transparent font-[Eazy] tracking-wider uppercase pl-4 block relative flex z-100 inset-0 bottom-auto md:h-20 backdrop-blur-sm"
            style={{zIndex:998}}
        >
            <div className="flex lg:basis-1/6 xl:lg:basis-1/4 items-center">
                <a
                    href="https://www.reptilian-renegade.com/"
                    className="py-2 md:py-0 pr-4 flex flex-row w-full min-w-auto justify-start space-x-3 items-center"
                >
                    <Image src={icon.src} width={35} height={35} alt="" className="md:mr-0 mr-5"/>
                    <span className="font-[Chillow] text-white md:text-3xl hidden md:flex tracking-wide">CHIRP</span>
                </a>
                
            </div>
            <div className="flex sm:flex-grow md:basis-1/2 gap-3 md:gap-6 xl:gap-10 items-center md:flex-grow lg:place-content-center md:mr-0 mr-5">
                {navigationItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`relative indicator whitespace-nowrap flex items-center h-full font-archivoBlack   text-xs md:text-xl ${activeId === item.id ? 'text-[#dd3a3d]' : 'text-[#ecdd57]/70  hover:text-[#dd3a3d]'}`}>
                        {item.title}
                    </a>
                ))}
            </div>
            <WalletMultiButtonStyled className=""/>
            
        </div>
    );
}

export default Navigation;
