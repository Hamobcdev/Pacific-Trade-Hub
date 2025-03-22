import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AuthOceanBackground from '../assets/images/auth-ocean-background-1.jpg';
import { useAuthModal, useUser, useLogout } from '@account-kit/react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithWallet } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { openAuthModal } = useAuthModal();
  const user = useUser();
  const { logout } = useLogout();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/marketplace` },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google Login Error:', error.message);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setLoading(true);
    try {
      await openAuthModal();
      if (user) {
        await signInWithWallet(user.address);
        navigate('/marketplace');
      }
    } catch (error: any) {
      console.error('Wallet Login Error:', error.message);
      alert('Wallet login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/marketplace');
    } catch (error: any) {
      console.error('Email Login Error:', error.message);
      alert('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthOceanBackground})` }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-pacifico text-primary mb-6 text-center">Login</h1>
        {user ? (
          <div>
            <p>Logged in as {user.email || user.address.slice(0, 6)}</p>
            <button onClick={handleLogout} className="btn-primary w-full mt-4">
              Logout
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login with Email'}
              </button>
            </form>
            <button
              onClick={handleGoogleLogin}
              className="btn-primary w-full flex items-center justify-center space-x-2 mb-4"
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>{loading ? 'Processing...' : 'Login with Google'}</span>
            </button>
            <button
              onClick={handleWalletLogin}
              className="btn-primary w-full flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <span>{loading ? 'Connecting...' : 'Login with Smart Account'}</span>
            </button>
          </>
        )}
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