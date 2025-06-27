import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import FileUpload from './components/FileUpload';
import SearchBar from './components/SearchBar';
import DocumentList from './components/DocumentList';
import SearchResults from './components/SearchResults';
import DocumentViewer from './components/DocumentViewer';
import UserProfile from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import OrganizationPanel from './components/OrganizationPanel';
import { getDocuments, getDocument, searchDocuments, authAPI } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup', 'app'
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showOrgPanel, setShowOrgPanel] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = authAPI.getCurrentUser();
    if (currentUser && authAPI.isAuthenticated()) {
      setUser(currentUser);
      setCurrentView('app');
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);
      setCurrentView('app');
      loadDocuments();
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      // Auto-login after successful signup
      await handleLogin({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setCurrentView('landing');
    setDocuments([]);
    setSearchResults([]);
    setSelectedDocument(null);
  };

  const handleUploadSuccess = (result) => {
    // Reload documents after successful upload
    loadDocuments();
    // Close the modal after successful upload
    setShowUploadModal(false);
  };

  const handleDelete = (deletedId) => {
    console.log('=== FRONTEND DELETE DEBUG ===');
    console.log('Deleting document ID:', deletedId);
    console.log('Documents before deletion:', documents.length);
    console.log('Search results before deletion:', searchResults.length);
    
    setDocuments(documents.filter(doc => doc.id !== deletedId));
    setSearchResults(searchResults.filter(result => result.id !== deletedId));
    
    console.log('Documents after deletion:', documents.filter(doc => doc.id !== deletedId).length);
    console.log('Search results after deletion:', searchResults.filter(result => result.id !== deletedId).length);
    console.log('=== END FRONTEND DELETE DEBUG ===');
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setCurrentSearchQuery('');
      return;
    }

    try {
      setIsSearching(true);
      setCurrentSearchQuery(query);
      console.log('=== FRONTEND SEARCH DEBUG ===');
      console.log('Search query:', query);
      console.log('Current documents in state:', documents.length);
      console.log('Current search results in state:', searchResults.length);
      
      const results = await searchDocuments(query);
      console.log('Search API returned:', results.length, 'results');
      console.log('Search results:', results);
      
      setSearchResults(results);
      console.log('=== END FRONTEND SEARCH DEBUG ===');
    } catch (error) {
      console.error('Error searching documents:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDocumentClick = async (doc) => {
    try {
      // Check if this document is from search results
      const isFromSearch = searchResults.some(result => result.id === doc.id);
      
      // If it's a search result, we need to fetch the full document
      if (doc.excerpt) {
        const fullDocument = await getDocument(doc.id);
        setSelectedDocument({ ...fullDocument, isFromSearch });
      } else {
        setSelectedDocument({ ...doc, isFromSearch });
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page
  if (currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show login page
  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />;
  }

  // Show signup page
  if (currentView === 'signup') {
    return <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />;
  }

  // Show main application (protected route)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/30 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LexiBox
                </h1>
                <p className="text-gray-600 text-xs font-medium">PDF Text Extraction & Search</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToLanding}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
              >
                About LexiBox
              </button>
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready</span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>
                {user?.is_admin && (
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center space-x-1 border border-purple-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Admin</span>
                  </button>
                )}
                {user?.is_org_admin && (
                  <button
                    onClick={() => setShowOrgPanel(true)}
                    className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center space-x-1 border border-blue-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5V6a5 5 0 00-10 0v3a5 5 0 0010 0z" />
                    </svg>
                    <span>Organization</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <section className="relative z-30">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl blur-3xl -z-10"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Documents
                </h2>
                <p className="text-gray-600">
                  Find exactly what you're looking for in your uploaded documents
                </p>
              </div>
              <SearchBar onSearch={handleSearch} />
              
              {isSearching && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <span>Searching through your documents...</span>
                  </div>
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <SearchResults 
                    results={searchResults} 
                    onDocumentClick={handleDocumentClick} 
                  />
                </div>
              )}
            </div>
          </section>

          {/* Upload Section */}
          <section className="relative z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload PDF Documents
                </h2>
                <p className="text-gray-600 mb-6">
                  Add new PDF files to your document collection
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Upload New Document</span>
                </button>
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section className="relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/30">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Documents
                </h2>
                <p className="text-gray-600">
                  All uploaded documents and their extracted content
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span>Loading your documents...</span>
                  </div>
                </div>
              ) : (
                <DocumentList 
                  documents={documents}
                  onDelete={handleDelete}
                  onDocumentClick={handleDocumentClick}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload PDF Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          searchQuery={selectedDocument.isFromSearch ? currentSearchQuery : ''}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfile
          onClose={() => setShowProfileModal(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminModal && (
        <AdminPanel
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {/* Organization Panel Modal */}
      {showOrgPanel && (
        <OrganizationPanel onClose={() => setShowOrgPanel(false)} />
      )}
    </div>
  );
}

export default App;
