import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orgAPI } from '../services/api';

const AcceptInvite = () => {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!inviteId) {
      setError('Invalid invitation link.');
      setLoading(false);
      return;
    }
    const accept = async () => {
      setLoading(true);
      setError('');
      try {
        await orgAPI.acceptInvite(inviteId);
        setSuccess('You have joined the organization! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };
    accept();
    // eslint-disable-next-line
  }, [inviteId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accept Invitation</h1>
        {loading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Accepting your invitation...</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
            <span className="text-green-700">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite; 