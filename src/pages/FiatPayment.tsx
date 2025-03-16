import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const FiatPayment: React.FC = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing (replace with actual Stripe integration)
    console.log('Processing credit card payment:', cardDetails);
    alert('Credit card payment simulated successfully!');
    navigate('/order-confirmation');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Enter Payment Details</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <CreditCard size={24} className="mr-2" />
          Credit/Debit Card Payment
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Card Number (e.g., 1234 5678 9012 3456)"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Pay Now</button>
        </div>
      </form>
    </div>
  );
};

export default FiatPayment;