import React from 'react';
import { deleteDocument } from '../services/api';

const DocumentList = ({ documents, onDelete, onDocumentClick }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        onDelete(id);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No documents uploaded yet.</div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white/80 rounded-xl shadow p-4 flex flex-col justify-between hover:shadow-lg transition cursor-pointer border border-white/30"
          onClick={() => onDocumentClick(doc)}
        >
          <div>
            <div className="font-semibold text-lg text-purple-700 truncate mb-1">{doc.filename}</div>
            <div className="text-xs text-gray-500 mb-2">
              Uploaded: {doc.upload_date ? new Date(doc.upload_date).toLocaleString() : 'Unknown'}
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">
              {doc.content?.slice(0, 120) || 'No preview available.'}
              {doc.content && doc.content.length > 120 ? '...' : ''}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList; 