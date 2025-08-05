'use client';

import { Star, ShoppingCart, Heart, Eye, Package } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    score: number;
    text: string;
    metadata?: Record<string, any>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const metadata = product.metadata || {};
  
  // Extract product information from metadata
  const title = metadata.title || metadata.product_name || 'Product';
  const price = metadata.final_price || metadata.price || metadata.initial_price || 'N/A';
  const currency = metadata.currency || 'USD';
  const rating = metadata.rating || 0;
  const reviewsCount = metadata.reviews_count || 0;
  const imageUrl = metadata.image_url || '';
  const brand = metadata.brand || metadata.manufacturer || '';
  const availability = metadata.availability || '';
  const discount = metadata.discount || '';
  
  // Clean up title (remove quotes and extra characters)
  const cleanTitle = title.replace(/"/g, '').substring(0, 80);
  
  // Format price
  const formatPrice = (price: string) => {
    if (price === 'N/A') return price;
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `$${numPrice.toFixed(2)}`;
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cleanTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMC40NTcgMTIwIDExOSAxMTEuNDU3IDExOSAxMDFDMTE5IDkwLjU0MjkgMTEwLjQ1NyA4MiAxMDAgODJDODkuNTQyOSA4MiA4MSA5MC41NDI5IDgxIDEwMUM4MSAxMTEuNDU3IDg5LjU0MjkgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzEzNy4yNzIgMTMwIDE2OCAxMDkuMjcyIDE2OCA4MkMxNjggNTQuNzI4IDEzNy4yNzIgMjQgMTAwIDI0QzYyLjcyOCAyNCAzMiA1NC43MjggMzIgODJDMzIgMTA5LjI3MiA2Mi43MjggMTMwIDEwMCAxMzBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Package className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold border ${getScoreColor(product.score)}`}>
          {product.score}% Match
        </div>
        
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            {discount}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-1">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {brand && (
          <p className="text-xs text-gray-500 mb-1">{brand.replace(/"/g, '')}</p>
        )}
        
        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {cleanTitle}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {rating > 0 ? `${rating} (${reviewsCount})` : 'No ratings'}
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {metadata.initial_price && metadata.initial_price !== price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(metadata.initial_price)}
              </span>
            )}
          </div>
          
          {/* Availability */}
          {availability && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              availability.toLowerCase().includes('stock') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {availability.replace(/"/g, '')}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
} 