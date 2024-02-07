import React, { FC } from "react";
import {
  WalletMultiButton,
  BaseWalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

interface WalletMultiButtonStyledProps {
  className?: string;
}

const LABELS = {
  "change-wallet": "Change wallet",
  connecting: "Connecting ...",
  "copy-address": "Copy address",
  copied: "Copied",
  disconnect: "Disconnect",
  "has-wallet": "Connect",
  "no-wallet": "Connect",
} as const;

const WalletMultiButtonStyled: FC<WalletMultiButtonStyledProps> = ({
  className,
}) => {
  return (
    <BaseWalletMultiButton
      labels={LABELS}
      style={{ background: "white", color: "#dd3a3d", borderRadius: "8px", margin: '10px 10px' }}
    />
  );
};

export default WalletMultiButtonStyled;
