import React from 'react';

const SearchResults = ({ results, onDocumentClick }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No results found.</div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((doc) => (
        <div
          key={doc.id}
          className="bg-white/80 rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer border border-white/30"
          onClick={() => onDocumentClick(doc)}
        >
          <div className="font-semibold text-lg text-purple-700 truncate mb-1">{doc.filename}</div>
          <div className="text-xs text-gray-500 mb-2">
            Uploaded: {doc.upload_date ? new Date(doc.upload_date).toLocaleString() : 'Unknown'}
          </div>
          <div className="text-sm text-gray-700 line-clamp-3">
            {doc.content?.slice(0, 120) || 'No preview available.'}
            {doc.content && doc.content.length > 120 ? '...' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults; 