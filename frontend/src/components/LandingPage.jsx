import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Contact from './Contact';

const LandingPage = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const features = [
    {
      icon: "📄",
      title: "PDF Text Extraction",
      description: "Automatically extract and process text from your PDF documents with high accuracy."
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find exactly what you're looking for across all your documents with powerful search capabilities."
    },
    {
      icon: "📚",
      title: "Document Management",
      description: "Organize and manage your PDF collection with an intuitive interface."
    },
    {
      icon: "⚡",
      title: "Fast & Efficient",
      description: "Quick uploads and instant search results for a seamless experience."
    }
  ];

  const benefits = [
    "Save time searching through multiple documents",
    "Extract valuable information from PDFs instantly",
    "Organize your document collection efficiently",
    "Access your documents from anywhere",
    "No more manual text copying from PDFs",
    "Secure and private document processing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LexiBox
                </h1>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white text-3xl">📚</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Transform Your
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> PDF Experience</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                LexiBox is your intelligent PDF companion that extracts text, enables powerful search, 
                and helps you find exactly what you need across all your documents instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 hover:shadow-lg transition-all duration-200 text-lg"
                >
                  Start Using LexiBox
                </button>
                <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-200 text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LexiBox?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your document workflow effortless and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your PDFs</h3>
              <p className="text-gray-600">
                Simply drag and drop your PDF files or click to browse. We support all standard PDF formats.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic Processing</h3>
              <p className="text-gray-600">
                Our system automatically extracts text from your PDFs and makes it searchable within seconds.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search & Find</h3>
              <p className="text-gray-600">
                Use our powerful search to find exactly what you need across all your documents instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits You'll Love
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how LexiBox can transform your document workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Professionals</h3>
              <ul className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Everyone</h3>
              <ul className="space-y-3">
                {benefits.slice(3).map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your PDF Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have already discovered the power of intelligent document search.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 text-lg shadow-lg"
            >
              Get Started Now - It's Free!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <span className="text-xl font-bold">LexiBox</span>
            </div>
            <p className="text-gray-400 mb-6">
              Intelligent PDF text extraction and search for the modern world.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <button 
                onClick={() => setShowPrivacyPolicy(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setShowTermsOfService(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setShowContact(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
      
      {showTermsOfService && (
        <TermsOfService onClose={() => setShowTermsOfService(false)} />
      )}
      
      {showContact && (
        <Contact onClose={() => setShowContact(false)} />
      )}
    </div>
  );
};

export default LandingPage; 