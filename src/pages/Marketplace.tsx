import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  merchant_id: string;
  merchants?: { name: string }; // Optional merchants field
}

const Marketplace: React.FC = () => {
  const { addToCart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const adminEmails = ['siaosiw@gmail.com'];

  const categories = [
    'All Products',
    'Fresh Produce',
    'Handicrafts',
    'Textiles',
    'Art',
    'Jewelry',
    'Food & Beverages',
  ];

  const fallbackProducts: Product[] = [
    { id: 1, name: 'Fresh Coconuts', price: 5.99, image: 'https://placehold.co/300', category: 'Fresh Produce', merchant_id: 'merchant1', merchants: { name: 'Samoa Farms' } },
    { id: 2, name: 'Handwoven Basket', price: 45.00, image: 'https://placehold.co/300', category: 'Handicrafts', merchant_id: 'merchant2', merchants: { name: 'Pacific Crafts' } },
    { id: 3, name: 'Samoan Textile', price: 30.00, image: 'https://placehold.co/300', category: 'Textiles', merchant_id: 'merchant1', merchants: { name: 'Samoa Farms' } },
    { id: 4, name: 'Tapa Art Print', price: 75.00, image: 'https://placehold.co/300', category: 'Art', merchant_id: 'merchant3', merchants: { name: 'Island Artisans' } },
    { id: 5, name: 'Coral Necklace', price: 25.00, image: 'https://placehold.co/300', category: 'Jewelry', merchant_id: 'merchant2', merchants: { name: 'Pacific Crafts' } },
    { id: 6, name: 'Kava Drink Mix', price: 15.00, image: 'https://placehold.co/300', category: 'Food & Beverages', merchant_id: 'merchant1', merchants: { name: 'Samoa Farms' } },
    { id: 7, name: 'Taro Root', price: 3.50, image: 'https://placehold.co/300', category: 'Fresh Produce', merchant_id: 'merchant1', merchants: { name: 'Samoa Farms' } },
    { id: 8, name: 'Wooden Bowl', price: 60.00, image: 'https://placehold.co/300', category: 'Handicrafts', merchant_id: 'merchant3', merchants: { name: 'Island Artisans' } },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*, merchants(name)');
      if (error) {
        console.error('Error fetching products:', error);
        setProducts(fallbackProducts);
      } else {
        console.log('Supabase products:', data);
        setProducts(data || fallbackProducts);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
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
          {user && (
            <>
              {console.log('User email:', user.email, 'Admin check:', adminEmails.includes(user.email || ''))}
              <button onClick={handleLogout} className="btn-secondary px-4 py-2">
                Logout
              </button>
              <Link to="/wallet" className="btn-primary px-4 py-2">
                Wallet
              </Link>
              <Link to="/profile" className="btn-primary px-4 py-2">
                Profile
              </Link>
              <Link to="/merchant-registration" className="btn-primary px-4 py-2">
                Become a Merchant
              </Link>
              {adminEmails.includes(user.email || '') && (
                <Link to="/regulatory-dashboard" className="btn-primary px-4 py-2">
                  Regulatory Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <p>No products available yet.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/300')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Sold by: <span className="text-primary">{product.merchants?.name || 'Unknown Merchant'}</span>
                    </p>
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                    <button
                      onClick={() => addToCart({ ...product, id: Number(product.id), quantity: 1 })}
                      className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;