"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getPromotionById, updatePromotion, deletePromotion } from "@/service/adminApi";
import { format } from "date-fns";

// Helper function to format dates
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy").toLowerCase();
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

// Helper function to calculate duration in days
const calculateDuration = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  } catch (error) {
    console.error("Duration calculation error:", error);
    return "N/A";
  }
};

// Helper function to determine if a promotion is active or ended
const getPromotionStatus = (endDate) => {
  try {
    const end = new Date(endDate);
    const now = new Date();
    return now <= end ? { status: "Active", statusVariant: "Default" } : { status: "Ended", statusVariant: "Variant3" };
  } catch (error) {
    console.error("Status determination error:", error);
    return { status: "Unknown", statusVariant: "Variant3" };
  }
};

// Reusable Label component
const Label = ({ text }) => (
  <div className="text-neutral-600 text-sm font-medium font-['Inter_Tight'] leading-tight tracking-tight">
    {text}
  </div>
);

// Reusable InfoRow component
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <Label text={label} />
    <div className="text-neutral-800 text-sm sm:text-base font-normal font-['Inter_Tight'] leading-tight">
      {value}
    </div>
  </div>
);

export default function PromotionDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get("id");
  
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Fetch promotion details
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      if (!promotionId) {
        setError("No promotion ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getPromotionById(promotionId);
        setPromotion(response.promotion);
        setError(null);
      } catch (err) {
        console.error("Error fetching promotion details:", err);
        setError("Failed to load promotion details. Please try again later.");
        setPromotion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [promotionId]);
  
  const handleDelete = () => {
    setDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deletePromotion(promotionId);
      router.push("/admin/promotion-management");
    } catch (err) {
      console.error("Error deleting promotion:", err);
      setError("Failed to delete promotion. Please try again.");
      setDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <span className="text-zinc-500 text-xs sm:text-sm font-normal leading-none">
          Promotion Management /
        </span>
        <span className="text-black text-xs sm:text-sm font-normal leading-none">
          {" "}Promotion Details
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full flex justify-center py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-[734px] bg-white p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-col gap-6 sm:gap-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
            <Link
              href="/admin/promotion-management"
              className="w-8 h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4 transform rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter'] leading-6 sm:leading-7">
              Promotion Details
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={() => router.back()}
                className="mt-2 text-sm font-medium "
              >
                Go Back
              </button>
            </div>
          )}

          {/* Promotion Details */}
          {!loading && !error && promotion && (
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Artist Info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {promotion.artistImage ? (
                    <img 
                      src={promotion.artistImage} 
                      alt={promotion.artistName || "Artist"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-neutral-800 text-lg sm:text-xl font-semibold font-['Inter_Tight'] leading-tight">
                    {promotion.artistName || "Unknown Artist"}
                  </h3>
                  <div className="text-zinc-500 text-sm font-normal">
                    Artist ID: {promotion.artistId || "N/A"}
                  </div>
                </div>
              </div>

              {/* Promotion Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InfoRow 
                  label="Duration" 
                  value={calculateDuration(promotion.startDate, promotion.endDate)}
                />
                <InfoRow 
                  label="Start Date" 
                  value={formatDate(promotion.startDate)}
                />
                <InfoRow 
                  label="End Date" 
                  value={formatDate(promotion.endDate)}
                />
                <InfoRow 
                  label="Status" 
                  value={
                    <div
                      className={`inline-block px-3 py-1 rounded-[99px] ${getPromotionStatus(promotion.endDate).status === "Active" ? "bg-emerald-50 text-green-500" : "bg-slate-50 text-zinc-950"}`}
                    >
                      {getPromotionStatus(promotion.endDate).status}
                    </div>
                  }
                />
                <InfoRow 
                  label="Created At" 
                  value={formatDate(promotion.createdAt)}
                />
                {promotion.updatedAt && (
                  <InfoRow 
                    label="Last Updated" 
                    value={formatDate(promotion.updatedAt)}
                  />
                )}
              </div>

              {/* Description if available */}
              {promotion.description && (
                <div className="flex flex-col gap-2">
                  <Label text="Description" />
                  <div className="p-4 bg-slate-50 rounded-lg text-neutral-800 text-sm font-normal">
                    {promotion.description}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-6 py-3 bg-red-50 rounded-lg text-red-600 text-sm sm:text-base font-medium hover:bg-red-100 transition-colors"
                >
                  Delete Promotion
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Delete Promotion</h3>
                <p className="text-neutral-600 mb-6">
                  Are you sure you want to delete this promotion? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-neutral-800 hover:bg-gray-50 transition-colors"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}