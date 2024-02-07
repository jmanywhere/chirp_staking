import * as anchor from "@coral-xyz/anchor";
import {Program, Provider} from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js'
import {IDL} from "@/types/staking";

export function getStakingProgram(provider: Provider) {
  return new Program(IDL, stakingProgram, provider);
}

// export function getTokenMintProgram(provider: Provider) {
//   return new Program(stakingIDL as anchor.Idl, tokenMintProgram, provider);
// }

export const stakingProgram = new PublicKey('5ghCYkAfKSYZxuWi3ACcWviF9d7zCE8XKf2LD4hajMcL')
export const tokenMintProgram = new PublicKey('C1JG8Vf962xZToGPVXqAEh9c27t33uscpPUrgvRueLhm')

export const TOKEN_LOCK_MULTIPLIERS = [
  {days:30, multiplier:1.05},
  {days:60, multiplier:1.15},
  {days:90, multiplier:1.30},
];