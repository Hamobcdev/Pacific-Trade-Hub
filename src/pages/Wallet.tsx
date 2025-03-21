import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useSwap } from '../../web3/hooks/useSwap'; // Adjusted path
import { useVault } from '../../web3/hooks/useVault';

// Extend Window type for MetaMask
interface WindowWithEthereum extends Window {
  ethereum?: any;
}

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const swap = useSwap(user?.walletAddress); 
  const vault = useVault(user?.walletAddress);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [localPaymentAmount, setLocalPaymentAmount] = useState('');
  const [cryptoType, setCryptoType] = useState<'ETH' | 'USDC' | 'USDT'>('ETH');

  useEffect(() => {
    console.log('Wallet user:', user);
    if (!user) {
      console.log('No user, redirecting to /login');
      navigate('/login');
      return;
    }
    if (user.country === 'Samoa' && !user.kycStatus) { // Adjusted to BOOLEAN
      alert('Please complete KYC for crypto purchases.');
      //navigate('/kyc'); disabled temorarily for testing
    }
    fetchTransactions();
  }, [user, navigate]);

  const connectWallet = async () => {
    const win = window as WindowWithEthereum;
    if (!win.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(win.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      console.log('Connected:', address);
    } catch (error: any) {
      console.error('Wallet connection error:', error.message);
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const fetchTransactions = async () => {
    if (user?.email) { // Switched to email due to profiles table change
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.email) // Use email instead of id
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    }
  };

  const handleLocalPayment = async () => {
    if (!walletAddress || !localPaymentAmount || !swap) {
      alert('Connect wallet, enter an amount, and ensure contracts are loaded.');
      return;
    }
    try {
      const amountInEther = localPaymentAmount; // Assuming input is in ETH for simplicity
      const tx = await swap.performSwap(walletAddress, amountInEther);
      const receipt = await tx.receipt;

      await supabase.from('transactions').insert({
        user_id: user?.email || '', // Use email
        type: 'crypto_purchase',
        amount: parseFloat(localPaymentAmount),
        currency: cryptoType,
        status: 'completed',
        tx_hash: receipt.transactionHash,
      });
      fetchTransactions();
      alert(`Purchased ${localPaymentAmount} ${cryptoType} via blockchain!`);
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert('Failed to purchase crypto: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Wallet</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
        <button
          onClick={connectWallet}
          className="btn-primary mb-4"
          disabled={!!walletAddress}
        >
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Crypto Purchase</h2>
        <p className="mb-4">Buy crypto with local fiat (blockchain transaction).</p>
        <select
          value={cryptoType}
          onChange={(e) => setCryptoType(e.target.value as 'ETH' | 'USDC' | 'USDT')}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="ETH">Ethereum (ETH)</option>
          <option value="USDC">USD Coin (USDC)</option>
          <option value="USDT">Tether (USDT)</option>
        </select>
        <input
          type="number"
          value={localPaymentAmount}
          onChange={(e) => setLocalPaymentAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="w-full p-2 border rounded-lg mb-4"
        />
        <button onClick={handleLocalPayment} className="btn-primary w-full">
          Purchase Crypto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Currency</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
                <th className="py-2">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.type}</td>
                  <td className="py-2">{tx.amount}</td>
                  <td className="py-2">{tx.currency}</td>
                  <td className="py-2">{tx.status}</td>
                  <td className="py-2">{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td className="py-2">{tx.tx_hash.slice(0, 8)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Wallet;