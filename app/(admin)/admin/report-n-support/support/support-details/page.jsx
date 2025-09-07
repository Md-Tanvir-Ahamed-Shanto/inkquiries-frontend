"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupportTicketById, updateSupportTicketStatus } from "../../../../../../service/adminApi";

function SupportDetailsPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");
  
  const [supportTicket, setSupportTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchSupportTicket = async () => {
      if (!ticketId) {
        setError("No ticket ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getSupportTicketById(ticketId);
        setSupportTicket(response.data);
      } catch (err) {
        console.error("Error fetching support ticket:", err);
        setError("Failed to load support ticket details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportTicket();
  }, [ticketId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await updateSupportTicketStatus(ticketId, newStatus);
      setSupportTicket(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating support ticket status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2">Loading support ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!supportTicket) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-gray-500">Support ticket not found.</div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full max-w-4xl mb-3 sm:mb-5 px-3 sm:px-0">
        <Link href={"/admin/report-n-support/support"} className="text-zinc-500 text-xs font-normal leading-none cursor-pointer hover:text-zinc-700 transition-colors">
          Support /
        </Link>
        <span className="text-black text-xs font-normal leading-none">
          Support Details
        </span>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex justify-center px-3 sm:px-0">
        <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-9 bg-white rounded-xl sm:rounded-2xl">
          {/* Header Section */}
          <div className="w-full pb-3 sm:pb-4 border-b border-neutral-300 flex items-center gap-4 sm:gap-5">
            <Link href="/admin/report-n-support/support" className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0">
              <img src="/icon/right-arrow.svg" className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" alt="Back" />
            </Link>
            <div className="flex-1 flex items-center gap-4 sm:gap-5">
              <div className="flex flex-col gap-3 sm:gap-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-zinc-950 text-lg sm:text-xl lg:text-2xl font-semibold font-['Inter'] leading-6 sm:leading-7 lg:leading-9 tracking-tight">
                    {supportTicket.subject}
                  </h2>
                  {renderStatusBadge(supportTicket.status)}
                </div>
                <p className="text-neutral-600 text-sm sm:text-base font-normal leading-relaxed tracking-tight">
                  From: {supportTicket.email ? supportTicket.email : supportTicket.username || "Anonymous"}
                </p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="text-neutral-800 text-sm sm:text-base font-normal leading-relaxed tracking-tight whitespace-pre-line">
            {supportTicket.message}
          </div>

          {/* Action Buttons */}
          <div className="flex items-start gap-4">
            {supportTicket.status === "pending" && (
              <>
                <button 
                  onClick={() => handleStatusUpdate("resolved")} 
                  disabled={statusUpdateLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statusUpdateLoading ? "Processing..." : "Mark as Resolved"}
                </button>
                <button 
                  onClick={() => handleStatusUpdate("rejected")} 
                  disabled={statusUpdateLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {statusUpdateLoading ? "Processing..." : "Reject Ticket"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SupportDetailsPage;