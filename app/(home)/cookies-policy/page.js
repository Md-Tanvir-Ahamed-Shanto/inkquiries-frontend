import React from 'react';

export default function CookiesPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookies Policy – Inkquiries</h1>
      <p className="text-sm text-gray-600 mb-6">Last Updated: 21-09-2025</p>
      
      <p className="mb-6">
        This Cookies Policy explains how Inkquiries ("we," "our," "us") uses cookies and similar technologies when you visit or use our platform.
      </p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website or use an app. They help websites remember your actions and preferences to provide a better user experience.</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">A. Essential Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Required for core functionality (e.g., keeping you logged in, account security).</li>
            <li>Without these cookies, the platform may not function properly.</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">B. Performance & Analytics Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Help us understand how users interact with Inkquiries.</li>
            <li>Collect anonymous data on traffic, usage patterns, and errors.</li>
            <li>Example: Google Analytics.</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">C. Functionality Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Remember your preferences (e.g., location, display settings).</li>
            <li>Enhance your browsing experience.</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">D. Advertising & Promotion Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Used only if you engage with artist promotions.</li>
            <li>Help display relevant featured content and track promotion performance.</li>
            <li>We do not sell your data to third parties.</li>
          </ul>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
        <p className="mb-2">Some cookies may be placed by trusted third parties that provide services on our platform, such as:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment providers (Stripe, PayPal)</li>
          <li>Analytics tools (Google Analytics)</li>
          <li>Social login integrations (Google, Facebook, Instagram)</li>
        </ul>
        <p className="mt-2">These third parties have their own privacy and cookie policies.</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. How We Use Cookies</h2>
        <p className="mb-2">We use cookies to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Keep you logged in and secure your account</li>
          <li>Save your preferences and settings</li>
          <li>Send notifications (reviews, comments, promotions)</li>
          <li>Analyze platform performance and improve features</li>
          <li>Support paid promotions and campaign tracking</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
        <p className="mb-2">You can control and manage cookies in several ways:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Browser settings: Most browsers let you block or delete cookies.</li>
          <li>Opt-out tools: Some analytics providers offer opt-out options.</li>
          <li>Platform settings: You may disable certain non-essential cookies through your account settings.</li>
        </ul>
      </div>
    </div>
  );
}