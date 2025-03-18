import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [localPaymentAmount, setLocalPaymentAmount] = useState('');
  const [cryptoType, setCryptoType] = useState<'ETH' | 'USDC' | 'USDT'>('ETH');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.country === 'Samoa' && user.kycStatus !== 'verified') {
      alert('Please complete KYC for crypto purchases.');
      navigate('/kyc');
    }
    fetchTransactions();
  }, [user, navigate]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Wallet connection error:', error);
        alert('Failed to connect wallet.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const fetchTransactions = async () => {
    if (user?.id) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    }
  };

  const handleLocalPayment = async () => {
    if (!walletAddress || !localPaymentAmount) {
      alert('Connect wallet and enter an amount.');
      return;
    }
    // Simulate Chainlink price feed (future integration)
    const simulatedPrice = { ETH: 2000, USDC: 1, USDT: 1 }[cryptoType];
    const cryptoAmount = parseFloat(localPaymentAmount) / simulatedPrice;
    alert(`Simulating purchase of ${cryptoAmount} ${cryptoType} for ${localPaymentAmount} local fiat`);
    await supabase.from('transactions').insert({
      user_id: user?.id || '',
      type: 'local_crypto_purchase',
      amount: cryptoAmount,
      currency: cryptoType,
      status: 'pending',
      tx_hash: 'LOCAL_SIMULATION',
    });
    fetchTransactions();
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
        <h2 className="text-xl font-bold mb-4">Local Crypto Purchase</h2>
        <p className="mb-4">Buy crypto with local bank card or mobile money (simulated).</p>
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
          placeholder="Amount in local currency"
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