import * as anchor from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";

export function getChirpToken(): PublicKey {
    
    return new anchor.web3.PublicKey(
      //devnet
      // "C1JG8Vf962xZToGPVXqAEh9c27t33uscpPUrgvRueLhm"
      //mainnnet
      "ALdyWN5zRTMA8p2yGaBx72jjam1YArdvpz6EetLWxzt1"
    );
}

// export function getUsdcToken(): PublicKey {
//     // mainnet: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
//     // devnet: DM5nx4kDo7E2moAkie97C32FSaZUCx9rTx1rwwRfm9VM
//     return new PublicKey(
//       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
//     );
// }
