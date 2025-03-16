import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Fresh Coconuts',
      price: 5.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?auto=format&fit=crop&w=300',
    },
    {
      id: 2,
      name: 'Handwoven Basket',
      price: 45.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?auto=format&fit=crop&w=300',
    },
  ]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <Link to="/marketplace" className="btn-primary mt-4 inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 border rounded-l-lg hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-12 text-center border-t border-b py-1"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 border rounded-r-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>TBD</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="btn-primary w-full text-center block"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;