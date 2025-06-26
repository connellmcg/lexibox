import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`relative group transition-all duration-300 ${
        isFocused ? 'scale-105' : 'hover:scale-102'
      }`}>
        {/* Background glow */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          isFocused 
            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl'
            : 'bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-lg'
        }`}></div>
        
        {/* Input container */}
        <div className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 ${
          isFocused 
            ? 'border-purple-500 shadow-xl shadow-purple-500/25'
            : 'border-gray-200 hover:border-purple-300 shadow-lg'
        }`}>
          <div className="flex items-center px-4 py-3">
            {/* Search icon */}
            <div className={`flex-shrink-0 mr-3 transition-all duration-300 ${
              isFocused ? 'text-purple-600 scale-110' : 'text-gray-400'
            }`}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Input field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search through your documents..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base"
            />
            
            {/* Search button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className={`ml-3 px-4 py-1.5 rounded-lg font-medium transition-all duration-300 text-sm ${
                query.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Type keywords to search through document content and filenames
        </p>
      </div>
    </form>
  );
};

export default SearchBar; 