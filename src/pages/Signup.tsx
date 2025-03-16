import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import AuthBeachBackground from '../assets/images/auth-beach-background-2.jpg'; // Ensure this file exists

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email/Password Signup submitted:', { name, email, password });
    login({ email, name }); // Placeholder
    navigate('/marketplace');
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      console.log('Google Signup Success - Token Response:', tokenResponse);
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
      console.error('Google Signup Error:', error);
      const errorString = error.error as string; // Type assertion to allow string comparison
      if (errorString === 'popup_closed') {
        alert('Popup was closed or blocked. Please allow popups for this site and try again.');
      } else if (errorString === 'redirect_uri_mismatch') {
        alert('Redirect URI mismatch. Check Google Cloud Console settings.');
      } else {
        alert(`Google Signup failed: ${error.error_description || 'Unknown error'}`);
      }
    },
    flow: 'implicit',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthBeachBackground})` }}
    >
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-pacifico text-primary mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>
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
          <button type="submit" className="btn-primary w-full">Sign Up</button>
        </form>
        <button
          onClick={() => googleSignup()}
          className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Sign Up with Google</span>
        </button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;