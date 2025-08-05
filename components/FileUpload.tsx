'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (count: number) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setMessage('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('success');
        setMessage(`${data.productsCount} products uploaded successfully!`);
        onUploadSuccess(data.productsCount);
      } else {
        setUploadStatus('error');
        setMessage(data.error || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {uploadStatus === 'success'
                ? 'Upload Successful!'
                : uploadStatus === 'error'
                ? 'Upload Failed'
                : 'Upload CSV File'}
            </h3>
            
            {uploadStatus === 'idle' && (
              <p className="text-gray-600">
                Drag and drop your CSV file here, or click to browse
              </p>
            )}

            {message && (
              <p className={`text-sm ${
                uploadStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {message}
              </p>
            )}
          </div>

          {uploadStatus === 'idle' && (
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
              <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {isUploading ? 'Uploading...' : 'Choose CSV File'}
              </div>
            </label>
          )}

          {uploadStatus !== 'idle' && (
            <button
              onClick={() => {
                setUploadStatus('idle');
                setMessage('');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Upload Another File
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>CSV format: product_name,description,price,category</span>
        </div>
      </div>
    </div>
  );
} 