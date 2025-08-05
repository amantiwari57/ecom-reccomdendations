'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProductSearch from '@/components/ProductSearch';
import { Database, Search, TrendingUp, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  score: number;
  text: string;
  metadata?: Record<string, any>;
}

export default function Home() {
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('upload');

  const handleUploadSuccess = (count: number) => {
    setUploadedCount(count);
    setActiveTab('search');
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 20 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data.recommendations);
      } else {
        console.error('Search failed:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              E-commerce Recommendation System
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your product CSV data and discover intelligent product recommendations 
            powered by AI and vector search technology.
          </p>
        </div>

        {/* Stats */}
        {uploadedCount !== null && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Database className="w-5 h-5" />
              <span className="font-medium">
                {uploadedCount} products loaded in the database
              </span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upload Data
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Search Products
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'upload' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Upload Your Product Data
                </h2>
                <p className="text-gray-600 mb-8">
                  Upload a CSV file containing your product information. 
                  The system will automatically process and index your products.
                </p>
              </div>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Search & Discover Products
                </h2>
                <p className="text-gray-600 mb-8">
                  Search for products using natural language. 
                  Get intelligent recommendations with match percentages.
                </p>
              </div>
              <ProductSearch
                onSearch={handleSearch}
                results={searchResults}
                isLoading={isSearching}
              />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold">Vector Database</h3>
            </div>
            <p className="text-gray-600">
              Powered by Qdrant vector database for lightning-fast semantic search and similarity matching.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold">AI-Powered Search</h3>
            </div>
            <p className="text-gray-600">
              Uses Google Gemini embeddings for intelligent product matching and recommendation scoring.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold">Smart Recommendations</h3>
            </div>
            <p className="text-gray-600">
              Get percentage-based match scores to understand how well products align with your search.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
