import React, { useState, useEffect } from 'react';
import { orgAPI } from '../services/api';

const OrganizationPanel = ({ onClose }) => {
  const [org, setOrg] = useState(null);
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [orgData, usersData, invitesData] = await Promise.all([
        orgAPI.getMyOrg(),
        orgAPI.listOrgUsers(),
        orgAPI.listInvites()
      ]);
      setOrg(orgData);
      setUsers(usersData);
      setInvites(invitesData);
    } catch (err) {
      setError('Failed to load organization data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    if (!inviteEmail.trim()) {
      setInviteError('Email is required');
      return;
    }
    try {
      await orgAPI.inviteUser(inviteEmail, org.id);
      setInviteSuccess('Invitation sent!');
      setInviteEmail('');
      loadData();
    } catch (err) {
      setInviteError(err.response?.data?.detail || err.message);
    }
  };

  const handleRemoveUser = async (userId, userEmail) => {
    if (!window.confirm(`Remove user ${userEmail} from your organization?`)) return;
    try {
      await orgAPI.removeUser(userId);
      loadData();
    } catch (err) {
      alert('Failed to remove user: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await orgAPI.toggleOrgAdmin(userId);
      loadData();
    } catch (err) {
      alert('Failed to update admin status: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading organization...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Organization</h2>
            <p className="text-gray-600 text-sm">{org?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Invite Form */}
        <div className="p-6 border-b border-gray-100">
          <form onSubmit={handleInvite} className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Invite user by email
              </label>
              <input
                type="email"
                id="inviteEmail"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="user@example.com"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Invite
            </button>
          </form>
          {inviteError && <div className="text-red-600 text-sm mt-2">{inviteError}</div>}
          {inviteSuccess && <div className="text-green-600 text-sm mt-2">{inviteSuccess}</div>}
        </div>

        {/* Pending Invitations */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Invitations</h3>
          {invites.length === 0 ? (
            <p className="text-gray-500">No pending invitations.</p>
          ) : (
            <ul className="space-y-2">
              {invites.map(invite => (
                <li key={invite.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-gray-700">{invite.email}</span>
                  <span className="text-xs text-gray-500">Invited {new Date(invite.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Organization Users */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Organization Members</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_org_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.is_org_admin ? 'Admin' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${user.is_org_admin ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        disabled={user.is_org_admin && users.filter(u => u.is_org_admin).length === 1}
                      >
                        {user.is_org_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.id, user.email)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors duration-200"
                        disabled={user.is_org_admin && users.filter(u => u.is_org_admin).length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPanel; 