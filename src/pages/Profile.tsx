import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [country, setCountry] = useState(user?.country || '');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ name, country })
      .eq('id', user.id);
    if (error) {
      console.error('Error updating profile:', error);
      alert('Failed to save changes.');
    } else {
      alert('Profile updated!');
      // Update local user state
      const updatedUser = { ...user, name, country };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Refresh to reflect changes
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full p-2 border rounded-lg"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">KYC Status</label>
            <input
              type="text"
              value={user.kycStatus || 'unverified'}
              className="w-full p-2 border rounded-lg"
              disabled
            />
          </div>
          <button onClick={handleSave} className="btn-primary w-full">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;