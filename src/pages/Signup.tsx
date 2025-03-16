import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

// Import images (if already added or placeholder)
import AuthBeachBackground from '../assets/images/auth-beach-background-2.jpg';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for email/password signup logic
    console.log('Email/Password Signup submitted:', { name, email, password });
    // Add success redirect or backend integration here (e.g., window.location.href = '/marketplace';)
    alert('Signup successful! Please log in.'); // Temporary feedback
  };

  const googleSignup = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Google Signup Success:', tokenResponse);
      // Handle token (e.g., verify with backend, redirect to /marketplace)
    },
    onError: (error) => {
      console.log('Google Signup Failed:', error);
    },
    redirect_uri: 'http://localhost:5174',
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