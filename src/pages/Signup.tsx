import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AuthBeachBackground from '../assets/images/auth-beach-background-2.jpg';
import { ethers } from 'ethers';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithWallet } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/marketplace` },
    });
    if (error) {
      console.error('Google Signup Error:', error.message);
      alert('Signup failed. Please try again.');
    }
  };

  const handleWalletSignup = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = `Sign up to Pacific Trade Hub at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      await signInWithWallet(address, signature, message);
      navigate('/marketplace');
    } catch (error) {
      console.error('Wallet Signup Error:', error);
      alert('Wallet signup failed. Please try again.');
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Email Signup Error:', error.message);
      alert('Signup failed. Please try again.');
    } else {
      alert('Check your email for a confirmation link!');
      navigate('/login');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthBeachBackground})` }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-pacifico text-primary mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleEmailSignup} className="space-y-4 mb-4">
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
            Sign Up with Email
          </button>
        </form>
        <button
          onClick={handleGoogleSignup}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-4"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Sign Up with Google</span>
        </button>
        <button
          onClick={handleWalletSignup}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <span>Sign Up with Wallet</span>
        </button>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;