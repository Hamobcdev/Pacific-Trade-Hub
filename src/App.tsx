import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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
import KYC from './pages/KYC';

// Use environment variable for Google Client ID
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/kyc" element={<KYC />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;