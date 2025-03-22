import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

export const viemClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(import.meta.env.VITE_ARBITRUM_RPC_URL as string),
});