import React from 'react';

const TermsOfService = ({ onClose }) => {
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
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
            <p>By accessing and using LexiBox ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h3>
            <div className="space-y-3">
              <p>LexiBox is a PDF document management and text extraction service that allows users to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload and store PDF documents</li>
                <li>Extract and search text content from PDFs</li>
                <li>Organize and manage their document library</li>
                <li>Search across multiple documents simultaneously</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts and Registration</h3>
            <div className="space-y-3">
              <p><strong>Account Creation:</strong> You must create an account to use the Service. You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p><strong>Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
              <p><strong>Account Termination:</strong> We reserve the right to terminate accounts that violate these terms or for any other reason at our discretion.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Acceptable Use Policy</h3>
            <div className="space-y-3">
              <p><strong>You agree not to:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload documents that contain illegal, harmful, or offensive content</li>
                <li>Upload documents that infringe on intellectual property rights</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to other users' accounts or data</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Upload documents that contain malware, viruses, or other harmful code</li>
                <li>Use the service to store or transmit sensitive personal information without proper authorization</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Content and Intellectual Property</h3>
            <div className="space-y-3">
              <p><strong>Your Content:</strong> You retain ownership of the documents you upload. You grant us a limited license to process and store your documents for service provision.</p>
              <p><strong>Service Content:</strong> The Service, including its software, design, and content, is owned by us and protected by intellectual property laws.</p>
              <p><strong>Third-Party Content:</strong> We are not responsible for the content of documents uploaded by users.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy and Data Protection</h3>
            <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Service Availability and Limitations</h3>
            <div className="space-y-3">
              <p><strong>Service Availability:</strong> We strive to maintain high service availability but cannot guarantee uninterrupted access.</p>
              <p><strong>Storage Limits:</strong> We may impose storage limits on user accounts. You are responsible for managing your document storage.</p>
              <p><strong>File Size Limits:</strong> There may be limits on individual file sizes and total storage capacity.</p>
              <p><strong>Service Changes:</strong> We may modify, suspend, or discontinue the Service at any time with reasonable notice.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Disclaimers and Limitations</h3>
            <div className="space-y-3">
              <p><strong>Service "As Is":</strong> The Service is provided "as is" without warranties of any kind, either express or implied.</p>
              <p><strong>Accuracy:</strong> While we strive for accurate text extraction, we cannot guarantee 100% accuracy in all cases.</p>
              <p><strong>Limitation of Liability:</strong> Our liability is limited to the amount you paid for the Service in the 12 months preceding the claim.</p>
              <p><strong>Indemnification:</strong> You agree to indemnify us against any claims arising from your use of the Service.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h3>
            <div className="space-y-3">
              <p><strong>User Termination:</strong> You may terminate your account at any time by contacting us or using the account deletion feature.</p>
              <p><strong>Service Termination:</strong> We may terminate or suspend your access immediately, without prior notice, for any reason.</p>
              <p><strong>Data Deletion:</strong> Upon termination, your data will be deleted within 30 days, unless required by law to retain it longer.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law and Disputes</h3>
            <div className="space-y-3">
              <p><strong>Governing Law:</strong> These Terms are governed by the laws of [Your Jurisdiction].</p>
              <p><strong>Dispute Resolution:</strong> Any disputes will be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].</p>
              <p><strong>Class Action Waiver:</strong> You agree to resolve disputes individually and waive any right to participate in class actions.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h3>
            <p>We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on our website and updating the "Last updated" date.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h3>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p><strong>Email:</strong> legal@lexibox.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 