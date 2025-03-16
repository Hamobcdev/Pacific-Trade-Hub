import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import AuthOceanBackground from '../assets/images/auth-ocean-background-1.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email/Password Login submitted:', { email, password });
    login({ email, name: 'John Doe' }); // Placeholder
    navigate('/marketplace');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      console.log('Google Login Success - Token Response:', tokenResponse);
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        console.log('Google User Info:', userInfo);

        const userData = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          profilePicture: userInfo.picture,
        };
        login(userData);
        navigate('/marketplace');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (error: Pick<TokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
      console.error('Google Login Error:', error);
      const errorString = error.error as string; // Type assertion to allow string comparison
      if (errorString === 'popup_closed') {
        alert('Popup was closed or blocked. Please allow popups for this site and try again.');
      } else if (errorString === 'redirect_uri_mismatch') {
        alert('Redirect URI mismatch. Check Google Cloud Console settings.');
      } else {
        alert(`Google Login failed: ${error.error_description || 'Unknown error'}`);
      }
    },
    flow: 'implicit',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthOceanBackground})` }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-pacifico text-primary mb-6 text-center">Login</h1>
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <button
          onClick={() => googleLogin()}
          className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Login with Google</span>
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