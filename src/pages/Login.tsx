import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AuthOceanBackground from '../assets/images/auth-ocean-background-1.jpg';
import { ethers } from 'ethers';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithWallet } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/marketplace` },
    });
    if (error) {
      console.error('Google Login Error:', error.message);
      alert('Login failed. Please try again.');
    }
  };

  const handleWalletLogin = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = `Sign in to Pacific Trade Hub at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      await signInWithWallet(address, signature, message);
      navigate('/marketplace');
    } catch (error) {
      console.error('Wallet Login Error:', error);
      alert('Wallet login failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Email Login Error:', error.message);
      alert('Login failed. Check your credentials.');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthOceanBackground})` }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-pacifico text-primary mb-6 text-center">Login</h1>
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Login with Email
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-4"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Login with Google</span>
        </button>
        <button
          onClick={handleWalletLogin}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <span>Login with Wallet</span>
        </button>
        <div className="text-center mt-4">
          <Link to="/signup" className="text-sm text-primary hover:text-primary-dark">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;