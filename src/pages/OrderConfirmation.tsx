import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Order Confirmed!</h1>
      <p className="text-lg mb-4">Thank you for your purchase.</p>
      <p className="text-sm text-gray-600 mb-6">Your order has been successfully placed. You’ll receive a confirmation email shortly.</p>
      <Link to="/marketplace" className="btn-primary">Continue Shopping</Link>
    </div>
  );
};

export default OrderConfirmation;