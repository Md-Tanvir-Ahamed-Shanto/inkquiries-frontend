"use client";
import React, { useState, useEffect } from "react";
import { reportReview } from "@/service/reviewApi";

const ReportReviewModal = ({ isOpen, onClose, reviewId }) => {
  const [reason, setReason] = useState("");
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for reporting this review.");
      return;
    }

    setLoading(true);
    setError(null);
    const data = {
      type,
      reason
    }

    try {
      await reportReview(reviewId,data);
      setSuccess(true);
      setReason("");
      setType("")
      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to report review. Please try again.");
      setTimeout(() => {
        setError("");
        setReason("");
        setType("")
        onClose();
        setSuccess(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40  z-50 flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative transition-all duration-300 transform hover:scale-[1.01]" suppressHydrationWarning>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={loading}
          suppressHydrationWarning
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            suppressHydrationWarning
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
              suppressHydrationWarning
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4" suppressHydrationWarning>Report Review</h2>

        {loading ? (
          <div className="flex justify-center items-center py-8" suppressHydrationWarning>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" suppressHydrationWarning></div>
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" suppressHydrationWarning>
            Review reported successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" suppressHydrationWarning>
                {error}
              </div>
            )}
 <div suppressHydrationWarning>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
                suppressHydrationWarning
              >
                Type of report
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-indigo-300"
                disabled={loading}
                suppressHydrationWarning
              >
                <option value="">Select type</option>
                <option value="spam">Spam</option>
                <option value="fake review">Fake review</option>
                <option value="wrong artist">Wrong artist</option>
                <option value="harmful">Harmful</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div suppressHydrationWarning>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
                suppressHydrationWarning
              >
                Reason for reporting
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-indigo-300"
                rows="4"
                placeholder="Please explain why you're reporting this review..."
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            <div className="flex justify-end" suppressHydrationWarning>
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={loading}
                suppressHydrationWarning
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                disabled={loading}
                suppressHydrationWarning
              >
                {loading ? "Submitting..." : "Report Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportReviewModal;
