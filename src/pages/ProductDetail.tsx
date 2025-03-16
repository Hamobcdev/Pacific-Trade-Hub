import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Placeholder product data - replace with actual data fetching
  const product = {
    id: 1,
    name: 'Traditional Samoan Fine Mat',
    price: 299.99,
    cryptoPrice: '150 USDC',
    description: 'Handwoven fine mat (ie toga) made by skilled artisans using traditional Samoan techniques. Each mat is unique and takes several months to complete.',
    images: [
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?auto=format&fit=crop&w=800'
    ],
    rating: 4.8,
    reviews: 24,
    seller: {
      name: 'Pacific Artisans Collective',
      rating: 4.9,
      products: 45
    },
    specifications: [
      { label: 'Material', value: 'Pandanus leaves' },
      { label: 'Dimensions', value: '2m x 1m' },
      { label: 'Weight', value: '0.5 kg' },
      { label: 'Origin', value: 'Samoa' }
    ]
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">${product.price}</div>
            <div className="text-sm text-gray-600">Crypto: {product.cryptoPrice}</div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Specifications</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-sm text-gray-600">{spec.label}</dt>
                  <dd className="text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-primary"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 text-center border-x py-2"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-primary"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border rounded-lg hover:bg-gray-50">
                <Heart size={20} className="text-gray-600" />
              </button>
              <button className="p-3 border rounded-lg hover:bg-gray-50">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product.seller.name}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                  {product.seller.rating} · {product.seller.products} products
                </div>
              </div>
              <button className="text-primary hover:text-primary-dark">View Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;