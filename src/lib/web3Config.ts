import { ethers } from 'ethers';
import { arbitrumSepolia, arbitrum } from 'viem/chains';

export const RPC_URLS = {
  local: 'http://localhost:8545',
  arbitrumSepolia: import.meta.env.VITE_ARBITRUM_RPC_URL as string,
  arbitrum: 'https://arb-mainnet.g.alchemy.com/v2/' + (import.meta.env.VITE_ALCHEMY_API_KEY as string),
};

export const CHAIN_IDS = {
  local: 31337,
  arbitrumSepolia: 421614,
  arbitrum: 42161,
};

export const CHAINS = {
  local: null,
  arbitrumSepolia,
  arbitrum,
};

export const getProvider = () => {
  const url = process.env.NODE_ENV === 'production' ? RPC_URLS.arbitrum : RPC_URLS.arbitrumSepolia;
  return new ethers.providers.JsonRpcProvider(url);
};

export const getChainId = () => {
  return process.env.NODE_ENV === 'production' ? CHAIN_IDS.arbitrum : CHAIN_IDS.arbitrumSepolia;
};

export const getChain = () => {
  return process.env.NODE_ENV === 'production' ? CHAINS.arbitrum : CHAINS.arbitrumSepolia;
};