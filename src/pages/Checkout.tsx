import React, { useState } from 'react';

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}
import { useNavigate } from 'react-router-dom'; // Add useNavigate
import { CreditCard, Bitcoin } from 'lucide-react';
import { ethers } from 'ethers';

const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('fiat');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const navigate = useNavigate(); // For redirection

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'crypto' && !walletAddress) {
      alert('Please connect your wallet to proceed with cryptocurrency payment.');
      return;
    }
    setStep(3);
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log('Connected to wallet:', address);
        alert(`Successfully connected to wallet: ${address}`);
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet. Ensure MetaMask is installed and unlocked.');
      }
    } else {
      alert('Please install MetaMask to use cryptocurrency payments.');
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'crypto') {
      if (!walletAddress) {
        alert('Wallet not connected. Please connect your wallet.');
        return;
      }
      try {
        // Simulate cryptocurrency payment (replace with actual payment logic)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // Example: Send a small amount of ETH to a dummy address (for demo purposes)
        // In a real app, you'd interact with a smart contract to pay in USDC/USDT
        const tx = await signer.sendTransaction({
          to: '0x000000000000000000000000000000000000dEaD', // Dummy address
          value: ethers.parseEther('0.001'), // 0.001 ETH for demo
        });
        await tx.wait();
        console.log('Transaction successful:', tx);
        alert('Payment successful!');
        navigate('/order-confirmation');
      } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    } else {
      // Redirect to fiat payment page
      navigate('/payment/fiat');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Continue to Payment</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="fiat"
                    checked={paymentMethod === 'fiat'}
                    onChange={() => setPaymentMethod('fiat')}
                    className="form-radio text-primary"
                  />
                  <CreditCard size={24} className="text-gray-600" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={() => setPaymentMethod('crypto')}
                    className="form-radio text-primary"
                  />
                  <Bitcoin size={24} className="text-gray-600" />
                  <span>Cryptocurrency (USDC/USDT)</span>
                </label>
                {paymentMethod === 'crypto' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Connect your wallet to proceed with crypto payment.</p>
                    {!walletAddress ? (
                      <button
                        onClick={handleConnectWallet}
                        className="btn-primary mt-2"
                      >
                        Connect Wallet
                      </button>
                    ) : (
                      <p className="text-sm text-green-600">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                    )}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full mt-4">Review Order</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Review</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Shipping Information</h3>
                  <p>{shippingInfo.name}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Payment Method</h3>
                  <p>{paymentMethod === 'fiat' ? 'Credit/Debit Card' : `Cryptocurrency (Wallet: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)})`}</p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="btn-primary w-full"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$50.98</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>TBD</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>$50.98</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;