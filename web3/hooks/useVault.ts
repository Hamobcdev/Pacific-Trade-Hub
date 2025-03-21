import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const VAULT_ADDRESS = "0x05bD324295f639957B8003a6372704fd2897B766";

const VAULT_ABI = [
  {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
  {"inputs": [], "name": "admin", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "user", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function"},
  {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "userBalances", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
  {"inputs": [], "name": "vaultBalance", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "address", "name": "merchant", "type": "address"}], "name": "withdrawToMerchant", "outputs": [], "stateMutability": "nonpayable", "type": "function"}
];

export const useVault = (userAddress?: string) => {
  const { contract } = useContract(VAULT_ADDRESS, VAULT_ABI);

  const { data: admin, isLoading: isAdminLoading } = useContractRead(contract, "admin");
  const { data: vaultBalance, isLoading: isBalanceLoading } = useContractRead(contract, "vaultBalance");
  const { data: userBalance, isLoading: isUserBalanceLoading } = useContractRead(
    contract,
    "userBalances",
    [userAddress || ethers.constants.AddressZero]
  );

  const { mutateAsync: deposit, isLoading: isDepositing } = useContractWrite(contract, "deposit");
  const { mutateAsync: withdrawToMerchant, isLoading: isWithdrawing } = useContractWrite(contract, "withdrawToMerchant");

  const performDeposit = async (userAddress: string, amount: string) => {
    try {
      const tx = await deposit({
        args: [userAddress, ethers.utils.parseEther(amount)],
        overrides: { value: ethers.utils.parseEther(amount) },
      });
      return tx;
    } catch (error) {
      console.error("Deposit failed:", error);
      throw error;
    }
  };

  const performWithdraw = async (amount: string, merchantAddress: string) => {
    try {
      const tx = await withdrawToMerchant({
        args: [ethers.utils.parseEther(amount), merchantAddress],
      });
      return tx;
    } catch (error) {
      console.error("Withdrawal failed:", error);
      throw error;
    }
  };

  return {
    contract,
    admin,
    vaultBalance,
    userBalance,
    performDeposit,
    performWithdraw,
    isLoading: isAdminLoading || isBalanceLoading || isUserBalanceLoading,
    isDepositing,
    isWithdrawing,
  };
};