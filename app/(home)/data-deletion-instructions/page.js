import React from 'react';

export default function DataDeletionInstructions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Data Deletion Instructions – Inkquiries</h1>
      <p className="text-sm text-gray-600 mb-6">Last Updated: 21-09-2025</p>
      
      <p className="mb-6">
        At Inkquiries, we respect your right to control your data. This page explains how to delete your account and associated data.
      </p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Deletion</h2>
        <p className="mb-4">To delete your account and associated data:</p>
        <ol className="list-decimal pl-6 space-y-3">
          <li>Log in to your Inkquiries account</li>
          <li>Go to your Account Settings</li>
          <li>Scroll to the bottom and click "Delete Account"</li>
          <li>Confirm your decision by entering your password</li>
        </ol>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What Gets Deleted</h2>
        <p className="mb-2">When you delete your account, the following data will be removed:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your profile information</li>
          <li>Your uploaded photos and content</li>
          <li>Your reviews and comments</li>
          <li>Your saved preferences and settings</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
        <p>Some information may be retained for legal, security, or business purposes as outlined in our Privacy Policy. This may include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Records of transactions or payments</li>
          <li>Information needed for legal compliance</li>
          <li>Anonymized usage data</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p>If you encounter any issues with account deletion or have questions about your data, please contact our support team at:</p>
        <p className="mt-2">📧 inkquiries@gmail.com</p>
      </div>
    </div>
  );
}