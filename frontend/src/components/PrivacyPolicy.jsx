import React from 'react';

const PrivacyPolicy = ({ onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <p className="text-gray-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
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

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-700">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
            <div className="space-y-3">
              <p><strong>Account Information:</strong> When you create an account, we collect your name and email address.</p>
              <p><strong>PDF Documents:</strong> We store the PDF files you upload and extract text content for search functionality.</p>
              <p><strong>Usage Data:</strong> We collect information about how you use our service, including search queries and document interactions.</p>
              <p><strong>Technical Information:</strong> We automatically collect certain technical information including IP address, browser type, and device information.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
            <div className="space-y-3">
              <p><strong>Service Provision:</strong> To provide, maintain, and improve our PDF text extraction and search services.</p>
              <p><strong>Authentication:</strong> To verify your identity and secure your account.</p>
              <p><strong>Communication:</strong> To send you important service updates and respond to your inquiries.</p>
              <p><strong>Analytics:</strong> To analyze usage patterns and improve our service functionality.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h3>
            <div className="space-y-3">
              <p><strong>Secure Storage:</strong> Your data is stored securely using industry-standard encryption and security measures.</p>
              <p><strong>User Isolation:</strong> Each user's documents and data are completely isolated from other users.</p>
              <p><strong>Access Control:</strong> Only you can access your documents and account information.</p>
              <p><strong>Data Retention:</strong> Your data is retained as long as your account is active. You can delete your documents at any time.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Disclosure</h3>
            <div className="space-y-3">
              <p><strong>No Third-Party Sharing:</strong> We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
              <p><strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights and safety.</p>
              <p><strong>Service Providers:</strong> We may use trusted third-party service providers to help operate our service, but they are bound by confidentiality agreements.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights and Choices</h3>
            <div className="space-y-3">
              <p><strong>Access and Update:</strong> You can access and update your account information through your profile settings.</p>
              <p><strong>Data Deletion:</strong> You can delete individual documents or your entire account at any time.</p>
              <p><strong>Account Deletion:</strong> You can request complete deletion of your account and all associated data.</p>
              <p><strong>Opt-Out:</strong> You can opt out of non-essential communications while maintaining service functionality.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h3>
            <div className="space-y-3">
              <p><strong>Essential Cookies:</strong> We use essential cookies for authentication and service functionality.</p>
              <p><strong>Analytics:</strong> We may use analytics cookies to improve our service (with your consent).</p>
              <p><strong>No Tracking:</strong> We do not use tracking cookies for advertising or third-party purposes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Children's Privacy</h3>
            <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8. International Data Transfers</h3>
            <p>Your data may be processed and stored in countries other than your own. We ensure appropriate safeguards are in place to protect your data.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p><strong>Email:</strong> privacy@lexibox.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 