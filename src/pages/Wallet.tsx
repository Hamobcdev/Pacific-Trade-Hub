import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useSmartAccountClient, useSendUserOperation } from '@account-kit/react';
import { encodeFunctionData } from 'viem';

const VAULT_CONTRACT_ADDRESS = '0xFcC343846312D381cE87f7247463e9e6f17A3eaF'; // Replace after deployment
const VAULT_ABI = [
  "function purchaseCredits(uint256 amount) external payable",
];

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [creditAmount, setCreditAmount] = useState('');
  const [cryptoType, setCryptoType] = useState<'PTH' | 'USDC' | 'USDT'>('PTH');
  const { client: smartAccountClient } = useSmartAccountClient({ type: "MultiOwnerModularAccount" });
  const { sendUserOperation } = useSendUserOperation({ client: smartAccountClient });

  useEffect(() => {
    if (!user) navigate('/login');
    if (user?.country === 'Samoa' && !user.kycStatus) alert('Please complete KYC.');
    fetchTransactions();
  }, [user, navigate]);

  const fetchTransactions = async () => {
    if (user?.email) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.email)
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching transactions:', error);
      else setTransactions(data || []);
    }
  };

  const handleCreditPurchase = async () => {
    if (!smartAccountClient || !creditAmount) {
      alert('Connect account and enter an amount.');
      return;
    }
    try {
      const credits = BigInt(Math.floor(parseFloat(creditAmount))); // Credits as whole units
      const ethValue = credits * BigInt(0.01 ether); // 0.01 ETH per credit

      const callData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'purchaseCredits',
        args: [credits],
      });

      const uoResult = await sendUserOperation({
        uo: {
          target: VAULT_CONTRACT_ADDRESS as `0x${string}`,
          data: callData,
          value: ethValue,
        },
      });

      const txHash = (uoResult as unknown as { hash: string }).hash;

      await supabase.from('transactions').insert({
        user_id: user?.email || '',
        type: 'credit_purchase',
        amount: parseFloat(creditAmount),
        currency: cryptoType,
        status: 'completed',
        tx_hash: txHash,
      });
      fetchTransactions();
      alert(`Purchased ${creditAmount} ${cryptoType} credits!`);
      setCreditAmount('');
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert('Failed to purchase credits: ' + (error.message || error));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Merchant Wallet</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Smart Account</h2>
        <p>{smartAccountClient?.account?.address ? `Connected: ${smartAccountClient.account.address.slice(0, 6)}...` : 'Not connected'}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Purchase Credits</h2>
        <input
          type="number"
          value={creditAmount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in Credits (1 credit = 0.01 ETH)"
          className="border p-2 mr-2"
        />
        <select
          value={cryptoType}
          onChange={(e) => setCryptoType(e.target.value as 'PTH' | 'USDC' | 'USDT')}
          className="border p-2 mr-2"
        >
          <option value="PTH">PTH</option>
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
        </select>
        <button
          onClick={handleCreditPurchase}
          className="bg-primary text-white p-2 rounded"
        >
          Purchase Credits
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((tx) => (
              <li key={tx.tx_hash}>{`${tx.amount} ${tx.currency} - ${tx.status}`}</li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Wallet;