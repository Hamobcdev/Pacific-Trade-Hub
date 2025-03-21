import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const SWAP_ADDRESS = "0xF47ab3a1a1F4E2Cbb2eC7B30a0FCF70A09Ae5b9B";

const SWAP_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_vault", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {"inputs": [], "name": "ADMIN_ROLE", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
  {"inputs": [], "name": "KYC_MANAGER_ROLE", "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "user", "type": "address"}], "name": "getUserDailyVolume", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}], "name": "hasRole", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "kycApproved", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "bool", "name": "approved", "type": "bool"}], "name": "setKYC", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "user", "type": "address"}], "name": "swapFiatToCrypto", "outputs": [], "stateMutability": "payable", "type": "function"},
  {"inputs": [], "name": "vault", "outputs": [{"internalType": "contract Vault", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}
];

export const useSwap = (userAddress?: string) => {
  const { contract } = useContract(SWAP_ADDRESS, SWAP_ABI);

  const { data: vaultAddress, isLoading: isVaultLoading } = useContractRead(contract, "vault");
  const { data: userDailyVolume, isLoading: isVolumeLoading } = useContractRead(
    contract,
    "getUserDailyVolume",
    [userAddress || ethers.constants.AddressZero]
  );
  const { data: isKycApproved, isLoading: isKycLoading } = useContractRead(
    contract,
    "kycApproved",
    [userAddress || ethers.constants.AddressZero]
  );

  const { mutateAsync: swapFiatToCrypto, isLoading: isSwapping } = useContractWrite(contract, "swapFiatToCrypto");
  const { mutateAsync: setKYC, isLoading: isSettingKYC } = useContractWrite(contract, "setKYC");

  const performSwap = async (userAddress: string, amount: string) => {
    try {
      const tx = await swapFiatToCrypto({
        args: [userAddress],
        overrides: { value: ethers.utils.parseEther(amount) },
      });
      return tx;
    } catch (error) {
      console.error("Swap failed:", error);
      throw error;
    }
  };

  const updateKYC = async (userAddress: string, approved: boolean) => {
    try {
      const tx = await setKYC({ args: [userAddress, approved] });
      return tx;
    } catch (error) {
      console.error("KYC update failed:", error);
      throw error;
    }
  };

  return {
    contract,
    vaultAddress,
    userDailyVolume,
    isKycApproved,
    performSwap,
    updateKYC,
    isLoading: isVaultLoading || isVolumeLoading || isKycLoading,
    isSwapping,
    isSettingKYC,
  };
};