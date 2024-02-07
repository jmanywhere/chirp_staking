import '../styles/globals.css';
import React from 'react';
import type { AppProps } from "next/app";
import Head from 'next/head'
require("@solana/wallet-adapter-react-ui/styles.css");

import dynamic from "next/dynamic";
const WalletProviderSection = dynamic(
  () => import("@/components/WalletProviderSection"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
          <Head>
              <title>CHIRPS - STAKING</title>
              <meta charSet="utf-8" />
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              <link href='../public/favicon.ico' rel='favicon' />
              <meta
                  name="description"
                  content="Chirp is da FUD bird on Solana, he is the shadow lurking behind every coin."
              />
              <link rel="icon" href="/favicon.ico" />
              {/* <link 
                rel="preload"
                href="/fonts/jangkuy.otf"
                as="font"
                type="font/otf"
              /> */}
              <meta name="og:title" content="Chirps: Staking" />
              <meta name="og:description" content="Chirp is da FUD bird on Solana, he is the shadow lurking behind every coin." />
              <meta name="og:image" content="" />
              <meta name="twitter:image" content="" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="@Chirps" />
              <meta name="twitter:creator" content="@Chirps" />
          </Head>
          <WalletProviderSection>
              <Component {...pageProps} />
          </WalletProviderSection>
      </>
  );
}

export default MyApp;
