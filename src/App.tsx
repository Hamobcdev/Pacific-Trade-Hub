import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext'; // Add this import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import TransactionHistory from './pages/TransactionHistory';
import MerchantPortal from './pages/MerchantPortal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import KYC from './pages/KYC';
import OrderConfirmation from './pages/OrderConfirmation';
import FiatPayment from './pages/FiatPayment';
import ErrorBoundary from './components/ErrorBoundary';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider> {/* Add this wrapper */}
          <ThemeProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
                    <Route path="/merchant" element={<MerchantPortal />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/payment/fiat" element={<FiatPayment />} />
                    <Route
                      path="/login"
                      element={
                        <ErrorBoundary>
                          <Login />
                        </ErrorBoundary>
                      }
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/kyc" element={<KYC />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </CartProvider> {/* Close the wrapper */}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;