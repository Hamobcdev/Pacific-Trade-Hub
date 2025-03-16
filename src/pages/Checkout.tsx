import React, { useState } from 'react';
import { CreditCard, Bitcoin } from 'lucide-react';

const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('fiat');

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
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
                  <p className="text-sm text-gray-600">Connect your wallet to proceed with crypto payment.</p>
                )}
                <button type="submit" className="btn-primary w-full">Review Order</button>
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
                  <p>{paymentMethod === 'fiat' ? 'Credit/Debit Card' : 'Cryptocurrency'}</p>
                </div>
                <button className="btn-primary w-full">Place Order</button>
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