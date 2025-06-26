import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const UserProfile = ({ onClose, onProfileUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Form validation
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getCurrentUserInfo();
      setUser(userData);
      setProfileForm({ name: userData.name });
    } catch (error) {
      setError('Failed to load user profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.current_password) {
      errors.current_password = 'Current password is required';
    }
    if (!passwordForm.new_password) {
      errors.new_password = 'New password is required';
    } else if (passwordForm.new_password.length < 8) {
      errors.new_password = 'New password must be at least 8 characters long';
    }
    if (!passwordForm.confirm_password) {
      errors.confirm_password = 'Please confirm your new password';
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateProfileForm()) return;
    
    try {
      setUpdating(true);
      const updatedUser = await authAPI.updateProfile(profileForm);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      
      // Update the user in localStorage
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        currentUser.name = updatedUser.name;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validatePasswordForm()) return;
    
    try {
      setUpdating(true);
      await authAPI.updatePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      
      setSuccess('Password updated successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <p className="text-gray-600 text-sm">Manage your account settings</p>
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

        <div className="p-6 space-y-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 ml-3">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 ml-3">{success}</p>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        profileErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your name"
                    />
                    {profileErrors.name && (
                      <p className="text-red-600 text-sm mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {updating ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      passwordErrors.current_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.current_password && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.current_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      passwordErrors.new_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.new_password && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.new_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      passwordErrors.confirm_password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirm_password && (
                    <p className="text-red-600 text-sm mt-1">{passwordErrors.confirm_password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {updating ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
