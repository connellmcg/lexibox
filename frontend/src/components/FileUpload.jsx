import { useState, useRef } from 'react';
import { uploadPDF } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file.type.includes('pdf')) {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const result = await uploadPDF(file);
      onUploadSuccess(result);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Upload failed';
      if (detail.includes('password-protected')) {
        setError('This PDF is password-protected and cannot be processed. Please upload an unprotected PDF.');
      } else {
        setError(detail);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Icon */}
        <div className="mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
            isDragOver
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isUploading ? 'Processing PDF...' : 'Upload your PDF'}
          </h3>
          <p className="text-gray-600 text-sm">
            {isUploading 
              ? 'Extracting text from your document...'
              : 'Drag and drop your PDF here, or click to browse'
            }
          </p>
        </div>

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isUploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Choose PDF File'
          )}
        </button>

        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Info text */}
      {!error && !isUploading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Supported format: PDF files only
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 