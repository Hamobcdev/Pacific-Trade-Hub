import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Shield, CreditCard, LogIn, User } from 'lucide-react';

const HomePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on component mount
  useEffect(() => {
    // Check localStorage or sessionStorage for user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserProfile(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with improved text visibility */}
      <section className="hero-section min-h-[600px] flex items-center justify-center text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-pacifico mb-6">
            Welcome to Pacific Trade Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your trusted marketplace for Pacific goods with secure crypto payments
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="btn-primary text-lg"
            >
              Start Shopping
            </Link>
            
            <button
              onClick={handleAuthAction}
              className="btn-secondary text-lg flex items-center gap-2"
            >
              {isAuthenticated ? (
                <>
                  <User size={20} />
                  My Account
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-pacifico text-center mb-12 text-primary">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Authentic Products</h3>
              <p>Directly sourced from Pacific artisans and merchants</p>
            </div>
            <div className="card text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p>Regulated crypto payments with bank-grade security</p>
            </div>
            <div className="card text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Multiple Payment Options</h3>
              <p>Pay with traditional methods or approved cryptocurrencies</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-pacifico text-center mb-12 text-primary">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Product cards will be dynamically populated */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;