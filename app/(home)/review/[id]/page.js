"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getReviewById } from "@/service/adminApi";
import { getCurrentUser } from "@/service/authApi";
import ReviewCard from "@/components/cards/ReviewCard";
import ReportReviewModal from "@/components/models/ReportReviewModal";

const ReviewDetailsPage = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const data = await getReviewById(id);
        setReview(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching review:", err);
        setError(err.message || "Failed to load review details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  const handleReport = () => {
    if (!user) {
      alert("Please log in to report reviews");
      return;
    }
    setShowReportModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" suppressHydrationWarning>
        <div className="w-12 h-12 border-4 border-t-gray-500 border-gray-200 rounded-full animate-spin" suppressHydrationWarning></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 text-red-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Error Loading Review</h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 text-yellow-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-yellow-700">Review Not Found</h2>
          </div>
          <p className="text-yellow-600 mb-4">
            The review you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors inline-block"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
      <div className="max-w-3xl mx-auto" suppressHydrationWarning>
        <div className="flex justify-between items-center mb-6" suppressHydrationWarning>
          <h1 className="text-2xl font-bold">Review Details</h1>
          {user?.id === review?.artistId && (
            <button 
              onClick={handleReport}
              className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-lg hover:border-red-200 transition-colors"
              title="Report this review"
              suppressHydrationWarning
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Report Review</span>
            </button>
          )}
        </div>
        
        <ReviewCard item={review} reviewId={review.id} />
        
        <div className="mt-8" suppressHydrationWarning>
          <a
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
              suppressHydrationWarning
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
      
      {/* Report Review Modal */}
      <ReportReviewModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reviewId={review?.id}
      />
    </div>
  );
};

export default ReviewDetailsPage;