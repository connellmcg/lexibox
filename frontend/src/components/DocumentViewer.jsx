import React, { useState, useEffect, useRef } from 'react';

const DocumentViewer = ({ document, onClose, searchQuery = '' }) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [highlightedSegments, setHighlightedSegments] = useState([]);
  const contentRef = useRef(null);

  if (!document) return null;

  // Function to safely escape HTML
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Function to split text into segments for safe highlighting
  const createHighlightedSegments = (text, searchTerm) => {
    if (!searchTerm.trim()) {
      return [{ text: text, isMatch: false, index: 0 }];
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    const segments = [];
    let matchIndex = 0;

    parts.forEach((part, index) => {
      if (regex.test(part)) {
        segments.push({ text: part, isMatch: true, index: matchIndex++ });
      } else {
        segments.push({ text: part, isMatch: false, index: -1 });
      }
    });

    return segments;
  };

  // Function to find all matches and navigate
  const findMatches = (searchTerm) => {
    if (!searchTerm.trim() || !document.content) {
      setTotalMatches(0);
      setCurrentMatch(0);
      setHighlightedSegments([{ text: document.content || '', isMatch: false, index: 0 }]);
      return;
    }

    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = [...document.content.matchAll(regex)];
    setTotalMatches(matches.length);
    
    if (matches.length > 0) {
      setCurrentMatch(1);
      scrollToMatch(0);
    } else {
      setCurrentMatch(0);
    }

    setHighlightedSegments(createHighlightedSegments(document.content, searchTerm));
  };

  // Function to scroll to a specific match
  const scrollToMatch = (matchIndex) => {
    if (!contentRef.current) return;

    const marks = contentRef.current.querySelectorAll('[data-match-index]');
    if (marks[matchIndex]) {
      marks[matchIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // Remove previous highlight and add current highlight
      marks.forEach(mark => {
        mark.classList.remove('bg-yellow-400', 'ring-2', 'ring-yellow-500');
        mark.classList.add('bg-yellow-300');
      });
      marks[matchIndex].classList.remove('bg-yellow-300');
      marks[matchIndex].classList.add('bg-yellow-400', 'ring-2', 'ring-yellow-500');
    }
  };

  // Navigate to next match
  const nextMatch = () => {
    if (currentMatch < totalMatches) {
      setCurrentMatch(currentMatch + 1);
      scrollToMatch(currentMatch);
    }
  };

  // Navigate to previous match
  const prevMatch = () => {
    if (currentMatch > 1) {
      setCurrentMatch(currentMatch - 1);
      scrollToMatch(currentMatch - 2);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    findMatches(newSearchTerm);
  };

  // Initialize search when component mounts or searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
      findMatches(searchQuery);
    } else {
      setHighlightedSegments([{ text: document.content || '', isMatch: false, index: 0 }]);
    }
  }, [searchQuery, document.content]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex-1">
            <div className="text-2xl font-bold text-purple-700 mb-1 truncate">{document.filename}</div>
            <div className="text-xs text-gray-500">
              Uploaded: {document.upload_date ? new Date(document.upload_date).toLocaleString() : 'Unknown'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition ml-4"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar - Fixed */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search in document..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {totalMatches > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{currentMatch} of {totalMatches}</span>
                <button
                  onClick={prevMatch}
                  disabled={currentMatch <= 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMatch}
                  disabled={currentMatch >= totalMatches}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            
            {searchTerm && totalMatches === 0 && (
              <span className="text-sm text-gray-500">No matches found</span>
            )}
          </div>
        </div>

        {/* Content - Scrollable with always-visible scrollbar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div 
            ref={contentRef}
            className="whitespace-pre-wrap text-gray-800 text-base leading-relaxed"
          >
            {highlightedSegments.map((segment, index) => {
              if (segment.isMatch) {
                return (
                  <span
                    key={index}
                    data-match-index={segment.index}
                    className="bg-yellow-300 text-black px-1 rounded"
                  >
                    {segment.text}
                  </span>
                );
              } else {
                return <span key={index}>{segment.text}</span>;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer; 