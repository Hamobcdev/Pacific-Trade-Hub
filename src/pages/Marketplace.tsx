import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All Products',
    'Fresh Produce',
    'Handicrafts',
    'Textiles',
    'Art',
    'Jewelry',
    'Food & Beverages'
  ];

  // Placeholder products data
  const products = [
    {
      id: 1,
      name: 'Fresh Coconuts',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?auto=format&fit=crop&w=300',
      category: 'Fresh Produce'
    },
    {
      id: 2,
      name: 'Handwoven Basket',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?auto=format&fit=crop&w=300',
      category: 'Handicrafts'
    },
    // Add more products as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-pacifico text-primary mb-4 md:mb-0">Marketplace</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <SlidersHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-bold text-lg mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === category.toLowerCase()
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h2 className="font-bold text-lg mb-4">Price Range</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                  <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;