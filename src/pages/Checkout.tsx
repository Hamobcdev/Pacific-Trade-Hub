import React, { useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat'>('crypto');
  const [cryptoType, setCryptoType] = useState<'ETH' | 'USDT' | 'USDC'>('ETH');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setWalletAddress(accounts[0]);
      console.log('Connected to wallet:', accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'crypto') {
      if (!walletAddress) {
        alert('Wallet not connected.');
        return;
      }
      if (user?.country === 'Samoa' && user?.kycStatus !== 'verified') {
        alert('Please complete KYC verification for crypto purchases.');
        navigate('/kyc');
        return;
      }
      setShowConfirm(true); // Show confirmation dialog
    } else {
      navigate('/payment/fiat');
    }
  };

  const confirmPurchase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let tx;
      if (cryptoType === 'ETH') {
        tx = await signer.sendTransaction({
          to: '0x000000000000000000000000000000000000dEaD',
          value: ethers.parseEther('0.001'),
        });
      } else {
        alert(`${cryptoType} payment not fully implemented. Simulating...`);
        tx = { hash: '0xSIMULATED' };
      }
      if (tx.wait) {
        if ('wait' in tx) {
          await tx.wait();
        }
      }
      console.log('Transaction successful:', tx);

      if (user?.id) {
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'purchase',
          amount: 50.98,
          currency: cryptoType,
          status: 'completed',
          tx_hash: tx.hash,
        });
      }

      alert('Payment successful!');
      setShowConfirm(false);
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed or rejected.');
      setShowConfirm(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Checkout</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'crypto' | 'fiat')}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="crypto">Crypto</option>
          <option value="fiat">Fiat</option>
        </select>

        {paymentMethod === 'crypto' && (
          <>
            <select
              value={cryptoType}
              onChange={(e) => setCryptoType(e.target.value as 'ETH' | 'USDT' | 'USDC')}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
            </select>
            <button
              onClick={connectWallet}
              className="btn-primary mb-4"
              disabled={!!walletAddress}
            >
              {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
            </button>
          </>
        )}

        <button onClick={handlePlaceOrder} className="btn-primary w-full">
          Place Order
        </button>

        {showConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">Confirm Purchase</h3>
              <p className="mb-4">
                Are you sure you want to spend 0.001 {cryptoType}?
              </p>
              <div className="flex space-x-4">
                <button onClick={confirmPurchase} className="btn-primary">
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;