import React from 'react';

/**
 * A functional component for displaying the Inkquiries Privacy Policy.
 * Uses Tailwind CSS for styling and responsiveness.
 */
export default function PrivacyPolicy() {
  return (
    // Max width container for readable content, centered, with mobile padding
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      
      {/* Policy Header */}
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900 sm:text-4xl">Privacy Policy – Inkquiries</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: 21-09-2025</p>
      
      <p className="mb-8 leading-relaxed">
        Inkquiries ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, website, and services.
      </p>
      
      {/* Policy Sections */}
      <div className="space-y-10">
        
        {/* Section 1: Information We Collect */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">1. Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>
          
          {/* Subsections of Data Collected */}
          <div className="space-y-6">
            <div className="pl-4 border-l-4 border-indigo-200">
              <h3 className="text-xl font-medium mb-2 text-gray-800">A. Personal Information (provided by users):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name, email address, password</li>
                <li>Location (city/state/country)</li>
                <li>Social media links (if added)</li>
                <li>Profile photos, bios, portfolio images</li>
              </ul>
            </div>
            
            <div className="pl-4 border-l-4 border-indigo-200">
              <h3 className="text-xl font-medium mb-2 text-gray-800">B. Content & Reviews:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Tattoo photos you upload (fresh and healed)</li>
                <li>Review details, ratings, comments, likes</li>
                <li>Artist portfolios and interactions</li>
              </ul>
            </div>
            
            <div className="pl-4 border-l-4 border-indigo-200">
              <h3 className="text-xl font-medium mb-2 text-gray-800">C. Automatically Collected Data:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Device information, IP address, browser type</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>
            
            <div className="pl-4 border-l-4 border-indigo-200">
              <h3 className="text-xl font-medium mb-2 text-gray-800">D. Payment Information (for promotions):</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Processed securely by **third-party providers (Stripe, PayPal)**</li>
                <li>We do not store full payment card details</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Section 2: How We Use Your Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Create and manage user and artist profiles</li>
            <li>Display reviews, ratings, and portfolios (Publicly visible purpose)</li>
            <li>Send notifications (new reviews, comments, claims, promotions, admin actions, etc.)</li>
            <li>Process payments for promotions</li>
            <li>Improve our services, security, and user experience</li>
            <li>Enforce our Terms of Service and prevent misuse</li>
          </ul>
        </div>
        
        {/* Section 3: Sharing of Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">3. Sharing of Information</h2>
          <p className="mb-4 font-medium text-red-600">
            We **do not sell, rent, or trade** your personal data with third parties for marketing or advertising purposes.
          </p>
          <p className="mb-2">We may only share your information in these limited situations:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>With other users: Reviews, photos, and comments you submit will be visible publicly on the platform.</li>
            <li>With service providers: Only as necessary to operate our platform (e.g., secure hosting, payment processors, notification systems). These providers are bound by confidentiality and data protection obligations.</li>
            <li>For legal compliance: If required by law, regulation, or to respond to valid legal requests.</li>
            <li>With your consent: If you explicitly opt-in for integrations or features that require sharing.</li>
          </ul>
        </div>
        
        {/* Section 4: User Rights */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">4. User Rights</h2>
          <p className="mb-2">Depending on your location (GDPR, CCPA, etc.), you may have rights to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access the data we hold about you</li>
            <li>Correct or update your personal information</li>
            <li>Request deletion of your account and content</li>
            <li>Opt out of marketing or notifications</li>
            <li>Download a copy of your data (where applicable)</li>
          </ul>
          <p className="mt-4 p-3 bg-gray-100 rounded">
            To exercise these rights, contact us at: **<a href="mailto:privacy@inkquiries.com" className="text-indigo-600 hover:text-indigo-800">privacy@inkquiries.com</a>**
          </p>
        </div>
        
        {/* Section 5: Data Retention */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">5. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Reviews, ratings, and tattoo photos may remain visible unless deleted by you or removed by us for policy violations.</li>
            <li>We retain necessary information as long as your account is active or required for legal, business, or security purposes.</li>
          </ul>
        </div>
        
        {/* Section 6: Security */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">6. Security</h2>
          <p className='text-gray-700'>
            We implement reasonable technical and organizational measures to protect your information. However, no system is completely secure. Use caution when sharing personal details or images.
          </p>
        </div>
        
        {/* Section 7: Cookies & Tracking */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">7. Cookies & Tracking</h2>
          <p className="mb-2 text-gray-700">Inkquiries uses cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Keep you logged in</li>
            <li>Remember preferences</li>
            <li>Analyze usage for improvement</li>
            <li>Deliver relevant content and promotions</li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">
            You can disable cookies in your browser, but some features may not work properly.
          </p>
        </div>
        
        {/* Section 8: Children's Privacy */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">8. Children's Privacy</h2>
          <p className='text-gray-700'>
            Inkquiries is **not intended for individuals under 18**. We do not knowingly collect data from children. If we discover such data, we will delete it.
          </p>
        </div>
        
        {/* Section 9: Changes to This Privacy Policy */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">9. Changes to This Privacy Policy</h2>
          <p className='text-gray-700'>
            We may update this Privacy Policy from time to time. Updates will be posted with the "Last Updated" date at the top of the policy.
          </p>
        </div>
        
        {/* Section 10: Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">10. Contact Us</h2>
          <p className='text-gray-700'>If you have questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2 text-lg font-medium">
            📧 <a href="mailto:inkquiries@gmail.com" className="text-indigo-600 hover:text-indigo-800">inkquiries@gmail.com</a>
          </p>
         
        </div>
        
      </div>
      {/* End of Policy Sections */}
    </div>
  );
}