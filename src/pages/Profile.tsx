import React, { useState } from 'react';
import { User, Lock, MapPin, CreditCard } from 'lucide-react';

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Pacific Lane, Apia, Samoa',
    kycStatus: 'Verified',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            <li className="flex items-center space-x-2 text-primary font-semibold">
              <User size={20} />
              <span>Personal Information</span>
            </li>
            <li className="flex items-center space-x-2">
              <Lock size={20} />
              <span>Security</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={20} />
              <span>Address Book</span>
            </li>
            <li className="flex items-center space-x-2">
              <CreditCard size={20} />
              <span>Payment Methods</span>
            </li>
          </ul>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                className="w-full p-3 border rounded-lg mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">KYC/AML Status</label>
              <p className={`mt-1 ${userInfo.kycStatus === 'Verified' ? 'text-green-600' : 'text-red-600'}`}>
                {userInfo.kycStatus}
              </p>
            </div>
            <button className="btn-primary w-full">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;