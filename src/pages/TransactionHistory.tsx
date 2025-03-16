import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const [transactions] = useState([
    { id: 1, date: '2025-03-10', type: 'Deposit', amount: 500.00, currency: 'WST', status: 'Completed' },
    { id: 2, date: '2025-03-09', type: 'Purchase', amount: 45.00, currency: 'USDC', status: 'Completed' },
    { id: 3, date: '2025-03-08', type: 'Withdrawal', amount: 100.00, currency: 'WST', status: 'Pending' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-pacifico text-primary">Transaction History</h1>
        <div className="flex space-x-4">
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <Filter size={20} className="text-gray-600" />
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Currency</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-b-0">
                <td className="py-3 px-4">{tx.date}</td>
                <td className="py-3 px-4">{tx.type}</td>
                <td className="py-3 px-4">{tx.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{tx.currency}</td>
                <td className="py-3 px-4">
                  <span className={tx.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;