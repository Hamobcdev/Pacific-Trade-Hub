import React, { useState } from 'react';
import { BarChart2, Package, DollarSign, Settings } from 'lucide-react';

const MerchantPortal: React.FC = () => {
  const [products] = useState([
    { id: 1, name: 'Fresh Coconuts', price: 5.99, stock: 50 },
    { id: 2, name: 'Handwoven Basket', price: 45.00, stock: 10 },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Merchant Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            <li className="flex items-center space-x-2 text-primary font-semibold">
              <BarChart2 size={20} />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2">
              <Package size={20} />
              <span>Product Management</span>
            </li>
            <li className="flex items-center space-x-2">
              <DollarSign size={20} />
              <span>Orders</span>
            </li>
            <li className="flex items-center space-x-2">
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </div>

        {/* Dashboard Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-2xl font-bold text-primary">$1,234.56</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-2xl font-bold text-primary">45</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Products</h3>
              <p className="text-2xl font-bold text-primary">{products.length}</p>
            </div>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Products</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-primary mt-4">Add New Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantPortal;