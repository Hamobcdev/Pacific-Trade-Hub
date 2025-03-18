import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';

const MerchantRegistration: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'basic' | 'premium'>('basic');

  const isValidWalletAddress = (address: string) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to register as a merchant.');
      navigate('/login');
      return;
    }
    if (walletAddress && !isValidWalletAddress(walletAddress)) {
      alert('Invalid wallet address. Please enter a valid Ethereum address.');
      return;
    }

    const { error } = await supabase.from('merchants').insert({
      id: user.id,
      name,
      email,
      wallet_address: walletAddress || null,
      subscription_plan: subscriptionPlan,
      subscription_status: 'pending',
    });

    if (error) {
      console.error('Error registering merchant:', error);
      alert('Registration failed. Please try again.');
    } else {
      alert('Merchant registration submitted! Awaiting payment confirmation.');
      navigate('/marketplace');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Merchant Registration</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Crypto Wallet Address (Optional)</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., 0x..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <select
              value={subscriptionPlan}
              onChange={(e) => setSubscriptionPlan(e.target.value as 'basic' | 'premium')}
              className="w-full p-2 border rounded-lg"
            >
              <option value="basic">Basic ($50/month - Crypto Payments)</option>
              <option value="premium">Premium ($100/month - Crypto + Fiat + Analytics)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Register as Merchant
          </button>
        </form>
      </div>
    </div>
  );
};

export default MerchantRegistration;