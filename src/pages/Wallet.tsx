import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const Wallet: React.FC = () => {
  const [balances, setBalances] = useState({
    wst: 1000.50,
    usdc: 200.00,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Balances */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <WalletIcon size={24} className="mr-2" />
            Balances
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>WST</span>
              <span className="font-bold">{balances.wst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>USDC</span>
              <span className="font-bold">{balances.usdc.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <ArrowDownCircle size={20} />
              <span>Deposit</span>
            </button>
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <ArrowUpCircle size={20} />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Deposit</p>
                <p className="text-sm text-gray-600">Mar 10, 2025</p>
              </div>
              <span className="text-green-600">+500.00 WST</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Purchase</p>
                <p className="text-sm text-gray-600">Mar 9, 2025</p>
              </div>
              <span className="text-red-600">-45.00 USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;