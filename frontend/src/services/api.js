import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Sign up new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    // Convert email to username for OAuth2PasswordRequestForm compatibility
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);
    
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user info from server
  getCurrentUserInfo: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  }
};

// Document API functions
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/documents/');
  return response.data;
};

export const getDocument = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const deleteDocument = async (id) => {
  console.log('=== DELETE API DEBUG ===');
  console.log('Calling delete API for document ID:', id);
  
  try {
    const response = await api.delete(`/documents/${id}`);
    console.log('Delete API response:', response.data);
    console.log('=== END DELETE API DEBUG ===');
    return response.data;
  } catch (error) {
    console.error('Delete API error:', error);
    console.log('=== END DELETE API DEBUG ===');
    throw error;
  }
};

export const searchDocuments = async (query) => {
  console.log('Searching for:', query);
  try {
    const response = await api.get('/search/', {
      params: { q: query }
    });
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Admin API functions
export const adminAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all organizations (admin only)
  getAllOrganizations: async () => {
    const response = await api.get('/admin/organizations');
    return response.data;
  },

  // Get all documents (admin only)
  getAllDocuments: async () => {
    const response = await api.get('/admin/documents');
    return response.data;
  },

  // Get system statistics (admin only)
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Toggle admin status for a user (admin only)
  toggleAdminStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/admin`);
    return response.data;
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  deleteOrganization: async (orgId) => {
    const response = await api.delete(`/admin/organizations/${orgId}`);
    return response.data;
  }
};

// Organization & Invitation API
export const orgAPI = {
  // Get current user's organization
  getMyOrg: async () => {
    const response = await api.get('/org/me');
    return response.data;
  },
  // List users in org (admin only)
  listOrgUsers: async () => {
    const response = await api.get('/org/users');
    return response.data;
  },
  // Invite user to org (admin only)
  inviteUser: async (email, organization_id) => {
    const response = await api.post('/org/invite', {
      email,
      organization_id,
      invited_by_user_id: null // backend uses auth
    });
    return response.data;
  },
  // List pending invites (admin only)
  listInvites: async () => {
    const response = await api.get('/org/invites');
    return response.data;
  },
  // Accept invitation (by invitee)
  acceptInvite: async (inviteId) => {
    const response = await api.post(`/org/accept-invite/${inviteId}`);
    return response.data;
  },
  // Remove user from org (admin only)
  removeUser: async (userId) => {
    const response = await api.delete(`/org/users/${userId}`);
    return response.data;
  },
  // Toggle org admin status (admin only)
  toggleOrgAdmin: async (userId) => {
    const response = await api.put(`/org/users/${userId}/admin`);
    return response.data;
  },
};

export default api; 