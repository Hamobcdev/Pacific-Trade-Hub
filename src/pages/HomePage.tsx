import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showKYCNotice, setShowKYCNotice] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.country === 'Samoa' && user?.kycStatus !== 'verified') {
      setShowKYCNotice(true);
    } else {
      setShowKYCNotice(false);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col">
      {showKYCNotice && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-700 mr-2" />
            <p className="text-yellow-700">
              Samoan users must complete{' '}
              <Link to="/kyc" className="underline">
                KYC verification
              </Link>{' '}
              for crypto purchases.
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-pacifico text-primary mb-8">Welcome to Pacific Trade Hub</h1>
        <p>Your marketplace for Pacific goods.</p>
        <Link to="/marketplace" className="btn-primary mt-4 inline-block">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;