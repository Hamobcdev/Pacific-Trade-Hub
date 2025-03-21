import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import KYC from './KYC';

const Checkout = () => {
  const { user, fetchUserProfile } = useAuth();
  const [paymentType, setPaymentType] = useState<'fiat' | 'crypto'>('fiat');
  const [profile, setProfile] = useState<{ email: string; kyc_status: string; country: string } | null>(null);
  const [mockWalletBalance, setMockWalletBalance] = useState(100); // Mock testnet balance
  const [cartTotal] = useState(50); // Mock cart total

  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await fetchUserProfile();
      setProfile(userProfile);
    };
    if (user) loadProfile();
  }, [user, fetchUserProfile]);

  const simulateMultisigApproval = () => {
    return Math.random() > 0.2 ? 'Approved' : 'Rejected'; // 80% approval
  };

  const handlePayment = async () => {
    if (paymentType === 'crypto') {
      if (profile?.country === 'Samoa' && profile?.kyc_status !== 'verified') {
        return alert('KYC required for Samoan crypto purchases');
      }
      if (mockWalletBalance < cartTotal) {
        return alert('Insufficient mock wallet funds');
      }

      const multisigStatus = simulateMultisigApproval();
      if (multisigStatus === 'Rejected') {
        return alert('Multisig wallet approval failed');
      }

      setMockWalletBalance((prev) => prev - cartTotal);
      console.log(`Mock crypto transaction: ${cartTotal} testnet tokens sent`);
      alert('Crypto payment processed (mock testnet)');
    } else {
      console.log('Processing fiat payment');
      alert('Fiat payment processed (mock)');
    }
  };

  if (paymentType === 'crypto' && profile?.country === 'Samoa' && profile?.kyc_status !== 'verified') {
    return <KYC />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      <p>Cart Total: {cartTotal} units</p>
      <p>Mock Wallet Balance: {mockWalletBalance} testnet tokens</p>
      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value as 'fiat' | 'crypto')}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="fiat">Fiat Payment</option>
        <option value="crypto">Crypto Payment (Testnet)</option>
      </select>
      <button
        onClick={handlePayment}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Complete Purchase
      </button>
    </div>
  );
};

export default Checkout;