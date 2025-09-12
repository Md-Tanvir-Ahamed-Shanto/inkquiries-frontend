"use client";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { updateReportStatus } from "@/service/adminApi";
import { acceptReviewReport, rejectReviewReport, getReviewReportById } from "@/service/reviewApi";

// Report details content component that uses useSearchParams
function ReportDetailsContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!reportId) {
        setError("Report ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getReviewReportById(reportId);
        if (response) {
          // Format the report data to match our component structure
          const formattedReport = {
            id: response.id,
            type: response.type,
            reportedBy: {
              name: response.artist?.username || 'Unknown Artist',
              id: response.artistId
            },
            createdAt: response.createdAt,
            status: response.status.toLowerCase(),
            content: response.reason || 'No content provided',
            reviewId: response.reviewId
          };
          setReport(formattedReport);
          setError(null);
        } else {
          setError("No report data available");
        }
      } catch (err) {
        console.error("Error fetching report details:", err);
        setError("Failed to load report details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportDetails();
  }, [reportId]);
  
  
  const handleAcceptReport = async () => {
    if (!confirm("Are you sure you want to accept this report? This will delete the reported review and all associated reports.")) {
      return;
    }
    
    try {
      setStatusUpdating(true);
      await acceptReviewReport(reportId);
      alert("Report accepted. The review has been deleted.");
      // Redirect back to reports list
      window.location.href = "/admin/report-n-support/report";
    } catch (err) {
      console.error("Error accepting report:", err);
      alert("Failed to accept report. Please try again.");
      setStatusUpdating(false);
    }
  };
  
  const handleRejectReport = async () => {
    if (!confirm("Are you sure you want to reject this report? This will keep the review but remove the report.")) {
      return;
    }
    
    try {
      setStatusUpdating(true);
      await rejectReviewReport(reportId);
      alert("Report rejected. The review has been kept.");
      // Redirect back to reports list
      window.location.href = "/admin/report-n-support/report";
    } catch (err) {
      console.error("Error rejecting report:", err);
      alert("Failed to reject report. Please try again.");
      setStatusUpdating(false);
    }
  };
  
  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "text-yellow-600 bg-yellow-50", label: "Pending" },
      resolved: { color: "text-green-600 bg-green-50", label: "Resolved" },
      rejected: { color: "text-red-600 bg-red-50", label: "Rejected" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`${config.color} px-2 py-1 rounded-full text-xs`}>
        {config.label}
      </span>
    );
  };
  
  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full max-w-4xl mb-3 sm:mb-5 px-3 sm:px-0">
        <Link href="/admin/report-n-support/report" className="text-zinc-500 text-xs font-normal leading-none cursor-pointer hover:text-zinc-700 transition-colors">
          Report /
        </Link>
        <span className="text-black text-xs font-normal leading-none">
          Report Details
        </span>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex justify-center px-3 sm:px-0">
        <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl flex flex-col items-start gap-6 sm:gap-8">
          {/* Header Section */}
          <div className="w-full pb-3 border-b border-gray-100 flex items-center gap-3 sm:gap-4">
            <Link href="/admin/report-n-support/report" className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors">
              <img src="/icon/right-arrow.svg" className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" alt="Back" />
            </Link>
            <h2 className="flex-1 text-neutral-800 text-lg sm:text-xl font-semibold font-['Inter'] leading-6 sm:leading-7">
              Report Details
            </h2>
            
            {/* Status Update Buttons */}
            {!loading && report && (
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptReport}
                  disabled={statusUpdating}
                  className="px-3 py-1 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  {statusUpdating ? "Processing..." : "Accept Report"}
                </button>
                <button
                  onClick={handleRejectReport}
                  disabled={statusUpdating}
                  className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  {statusUpdating ? "Processing..." : "Reject Report"}
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="w-full flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="w-full bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}

          {/* Main Content */}
          {!loading && report && (
            <div className="w-full flex flex-col gap-4 sm:gap-6">
              {/* Report Details Section */}
              <div className="w-full flex flex-col gap-2 sm:gap-3">
                <h3 className="text-neutral-800 text-sm sm:text-base font-medium leading-normal">
                  Report Details
                </h3>
                <div className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg border border-zinc-200 flex flex-col gap-3">
                  <p className="text-neutral-800 text-sm sm:text-base font-normal leading-normal">
                    <span className="font-medium">Type:</span> {report.type || "Offensive language"}
                  </p>
                  <p className="text-neutral-800 text-sm sm:text-base font-normal leading-normal">
                    <span className="font-medium">Reported by:</span> {report.reportedBy?.name || "Anonymous"}
                  </p>
                  <p className="text-neutral-800 text-sm sm:text-base font-normal leading-normal">
                    <span className="font-medium">Date:</span> {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-neutral-800 text-sm sm:text-base font-normal leading-normal">
                    <span className="font-medium">Status:</span> {renderStatusBadge(report.status)}
                  </p>
                </div>
              </div>

              {/* Reported Content Section */}
              <div className="w-full p-3 sm:p-4 bg-rose-50/50 rounded-lg border border-dashed border-red-100 flex items-start gap-2.5">
                <div className="flex-1">
                  <p className="text-red-500 text-sm sm:text-base font-normal  leading-normal">
                    {report.content || "I had been dreaming of getting a delicate floral piece on my forearm, and Sasha absolutely nailed it. A Mandala body tattoo is a beautiful and intricate form of body."}
                  </p>
                  {report.additionalContent && (
                    <p className="text-red-500 text-sm sm:text-base font-normal leading-normal mt-2">
                      {report.additionalContent}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Link */}
          {!loading && report && report.reviewId && (
            <div className="w-full flex flex-col gap-6 sm:gap-8">
              <Link href={`/review/${report.reviewId}`} target="_blank" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                View reported review
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Main page component with Suspense boundary
function Page() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
    </div>}>
      <ReportDetailsContent />
    </Suspense>
  );
}

export default Page;