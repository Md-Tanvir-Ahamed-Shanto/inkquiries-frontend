"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import Modal from "@/components/common/Modal";
import RestrictedReasonsModal from "./RestrictedReasonsModal";
import DeleteReviewModal from "./DeleteReviewModal";
import { getReviewById, updateReviewStatus, deleteReview } from "@/service/adminApi";
import { useRouter, useSearchParams } from "next/navigation";
import StarRating from "@/components/common/StarRating";
import backendUrl from "@/utils/baseUrl";
import { deleteReviewByAdmin } from "@/service/reviewApi";

// Reusable label component
const Label = ({ text }) => (
  <div className="min-w-[80px] sm:min-w-[100px] flex justify-between items-center">
    <span className="text-xs sm:text-sm font-medium text-zinc-500">
      {text}
    </span>
    <span className="text-xs sm:text-sm text-neutral-800 font-['SF_Pro']">
      :
    </span>
  </div>
);

// Reusable info row
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6">
    <Label text={label} />
    {/* Ensure value is not an object. React cannot render objects as children. */}
    <span className="text-xs sm:text-sm font-medium text-neutral-800 break-words">
      {value}
    </span>
  </div>
);

export default function ReviewPage() {
  const [restrictModal, setRestrictModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("id");

  // Fetch review details
  useEffect(() => {
    const fetchReviewDetails = async () => {
      if (!reviewId) {
        setError("Review ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const reviewData = await getReviewById(reviewId);
        setReview(reviewData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching review details:", err);
        setError("Failed to load review details. Please try again.");
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [reviewId]);

  const handleRestrict = () => {
    setRestrictModal(true);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleConfirmRestrict = async (reason) => {
    try {
      if (!review) return;
      await updateReviewStatus(reviewId, review.status === "restricted" ? "active" : "restricted", reason);
      const updatedReview = await getReviewById(reviewId);
      setReview(updatedReview);
      setRestrictModal(false);
    } catch (err) {
      console.error("Error updating review status:", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReviewByAdmin(reviewId);
      setDeleteModal(false);
      router.push("/admin/review-management");
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
        <div className="w-full flex justify-center py-6 sm:py-8 lg:py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
        <div className="w-full flex justify-center py-6 sm:py-8 lg:py-10">
          <div className="text-center text-red-500">{error || "Review not found"}</div>
        </div>
      </div>
    );
  }

  // Calculate average rating from the provided fields
  const calculateAverageRating = (review) => {
    const ratings = [
      review.bedsideManner,
      review.accommodation,
      review.price,
      review.heavyHandedness,
      review.artworkQuality,
      review.tattooQuality,
      review.overallExperience,
    ];
    // Filter out any non-numeric or undefined values
    const validRatings = ratings.filter(r => typeof r === 'number' && !isNaN(r));
    if (validRatings.length === 0) {
      return 0; // Return 0 if there are no valid ratings to avoid division by zero
    }
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    // Round to one decimal place for display
    return (sum / validRatings.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(review);

  // Safely format the date on the client to avoid hydration mismatch
  const formattedDate = new Date(review.createdAt).toLocaleDateString();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <span className="text-zinc-500 text-xs sm:text-sm font-normal leading-none">
          Review Management /
        </span>
        <span className="text-black text-xs sm:text-sm font-normal leading-none">
          {" "}
          Review Details
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full flex justify-center py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-[863px] p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-sm flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
            <Link
              href="/admin/review-management"
              className="w-8 h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <img src="/icon/right-arrow.svg" className="w-4 h-4" alt="Back" />
            </Link>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter'] leading-6 sm:leading-7">
              Review Details
            </h2>
          </div>

          {/* Image */}
          <div className="w-full">
            <img
              className="w-full h-48 sm:h-64 lg:h-96 object-contain rounded-lg"
              // Correctly access the image URL from the photoUrls array
              src={`${backendUrl}${review.photoUrls[0]}` || "/assets/tattoing.jpg"}
              alt="Review Visual"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Artist Info */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter']">
                {/* Corrected the artist tag access, using optional chaining */}
                Artist Tag: {review.artist?.username || "N/A"}
              </h3>
              <div className="flex flex-col gap-2">
                <span className="text-sm sm:text-base font-medium text-neutral-800 font-['Inter']">
                  Description:
                </span>
                <p className="text-xs sm:text-sm text-zinc-500 font-normal font-['SF_Pro'] leading-relaxed">
                  {review.content}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Review Metadata */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Ratings */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6">
                <Label text="Ratings" />
                <div className="flex items-center gap-2">
                 
                  <StarRating rating={averageRating}  />
                </div>
              </div>
              {/* Corrected the "Category" line to use `tattooStyle` */}
              <InfoRow label="Category" value={review.tattooStyle || "N/A"} />
              {/* Corrected the "Review by" line to access the client's name correctly */}
              <InfoRow label="Review by" value={review.client?.name || "N/A"} />
              <InfoRow label="Location" value={review.location || "N/A"} />
              <InfoRow label="Status" value={review.status || "N/A"} />
              {/* Corrected the date formatting to prevent hydration mismatch */}
              <InfoRow label="Date" value={formattedDate} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleRestrict}
                className={`flex-1 sm:flex-none px-6 py-3 ${review.status === "restricted" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white text-sm sm:text-base font-medium rounded-lg transition-colors`}
              >
                {review.status === "restricted" ? "Unrestrict" : "Restrict"}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-zinc-950 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={restrictModal} onClose={() => setRestrictModal(false)}>
        <RestrictedReasonsModal
          onCancel={() => setRestrictModal(false)}
          onReview={handleConfirmRestrict}
        />
      </Modal>
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <DeleteReviewModal
          onClose={() => setDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      </Modal>
    </div>
  );
}