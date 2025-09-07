"use client";
import Modal from "@/components/common/Modal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getArtistById, updateArtistStatus, deleteArtist, getArtistSubscriptions } from "../../../../../../service/adminApi";
import RestrictUserModal from "../RestrictUserModal";
import DeleteUserModal from "../DeleteUserModal";

function Page() {
  const searchParams = useSearchParams();
  const artistId = searchParams.get("id");
  
  const [artist, setArtist] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [restrictModal, setRestrictModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [activationSuccessModal, setActivationSuccessModal] = useState(false);
  
  const fetchArtistData = async () => {
      if (!artistId) return;
      
      try {
        setLoading(true);
        const artistResponse = await getArtistById(artistId);
        setArtist(artistResponse.data);
        
        const subscriptionsResponse = await getArtistSubscriptions(artistId);
        setSubscriptions(subscriptionsResponse.data);
      } catch (err) {
        console.error("Error fetching artist data:", err);
        setError("Failed to load artist data");
      } finally {
        setLoading(false);
      }
    };
    
    
  useEffect(() => {
    
    fetchArtistData();
  }, [artistId]);

  const handleDeleteUser = async () => {
    try {
      await deleteArtist(artistId);
      setDeleteModal(false);
      // Redirect to artist management page after deletion
      window.location.href = "/admin/user-management";
    } catch (err) {
      console.error("Error deleting artist:", err);
      alert("Failed to delete artist. Please try again.");
    }
  };

  const handleActivateUser = async () => {
    try {
      await updateArtistStatus(artistId, "active");
      setActivateModal(false);
      // Show success modal after activation
      setActivationSuccessModal(true);
      // Refresh artist data
      const response = await getArtistById(artistId);
      setArtist(response.data);
    } catch (err) {
      console.error("Error activating artist:", err);
      alert("Failed to activate artist. Please try again.");
    }
  };
  
  const handleRestrictUser = async () => {
    try {
      await updateArtistStatus(artistId, "restricted");
      setRestrictModal(false);
      // Refresh artist data
      const response = await getArtistById(artistId);
      setArtist(response.data);
    } catch (err) {
      console.error("Error restricting artist:", err);
      alert("Failed to restrict artist. Please try again.");
    }
  };

  // Format subscription data for display
  const formattedSubscriptions = subscriptions.map(sub => ({
    plan: sub.planName || "Unknown Plan",
    method: sub.paymentMethod || "Unknown",
    txn: sub.transactionId ? `****${sub.transactionId.slice(-4)}` : "N/A",
    date: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A",
    status: {
      label: sub.status || "Unknown",
      color: sub.status === "Active" ? "bg-emerald-50 text-green-600" : "bg-slate-50 text-gray-800",
    },
  }));

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading artist data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  
  if (!artist) {
    return <div className="text-gray-500 p-4">Artist not found</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <span className="text-zinc-500 text-xs sm:text-sm font-normal leading-none">
          Artist Management /
        </span>
        <span className="text-black text-xs sm:text-sm font-normal leading-none">
          {" "}Artist Management / Artist Details
        </span>
      </div>

      {/* Main Artist Details Card */}
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg flex flex-col gap-6 sm:gap-8 shadow-sm mb-4 sm:mb-6">
        {/* Header */}
        <div className="w-full pb-3 border-b border-gray-100 flex items-center gap-4">
          <Link
            href="/admin/user-management"
            className="w-8 h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <img src="/icon/right-arrow.svg" className="w-4 h-4" alt="Back" />
          </Link>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter'] leading-6 sm:leading-7">
            Artist Details
          </h2>
        </div>

        {/* Profile Info */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Artist basic info */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/profile.png"
              alt="Artist Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">
                {artist.firstName} {artist.lastName}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-normal">
                <img
                  src="/icon/location.svg"
                  alt="Location Icon"
                  className="w-4 h-4"
                />
                {artist.location || "Location not specified"}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!artist.isActive && (
              <button
                onClick={() => setActivateModal(true)}
                className="flex-1 sm:flex-none px-6 py-3 bg-green-500 rounded-lg text-white font-medium text-sm sm:text-base hover:bg-green-600 transition-colors"
              >
                Activate
              </button>
            )}
            {artist.isActive && (
              <button
                onClick={() => setRestrictModal(true)}
                className="flex-1 sm:flex-none px-6 py-3 bg-red-500 rounded-lg text-white font-medium text-sm sm:text-base hover:bg-red-600 transition-colors"
              >
                Restrict
              </button>
            )}
            <button
              onClick={() => setDeleteModal(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 rounded-lg text-zinc-950 font-medium text-sm sm:text-base hover:bg-slate-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Bio & Details Section */}
        <div className="w-full flex flex-col lg:flex-row gap-4">
          {/* Bio */}
          <div className="flex-1 p-4 rounded-lg border border-zinc-200 flex flex-col gap-4">
            <h4 className="text-neutral-800 text-base font-medium leading-normal">
              Bio/About
            </h4>
            <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal">
              Reaw hF. 68Co humonies of he or V/max of complations in the azen
              certoin meinler 1, Elandng ande Oiallorcive of clom matiar
              yapone exieating quality cordote dru sefroress a nemeent.
            </p>
          </div>

          {/* Details */}
          <div className="flex-1 p-4 rounded-lg border border-zinc-200 flex flex-col gap-4">
            <ArtistInfo label="Email" value={artist.email} />
            <ArtistInfo label="Role" value="Artist" />
            <ArtistInfo label="Social Handle" value={artist.socialHandle || "Not provided"} />
            <ArtistInfo
              label="Account Status"
              value={
                <span className={`px-4 py-1 ${artist.isActive ? "bg-emerald-50 text-green-500" : "bg-red-50 text-red-500"} rounded-full text-sm capitalize`}>
                  {artist.isActive ? "Active" : "Restricted"}
                </span>
              }
            />
            <ArtistInfo label="Join Date" value={artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : "Unknown"} />
          </div>
        </div>

        {/* View Posts */}
        <div className="flex justify-start">
          <button className="text-sm sm:text-base font-medium text-neutral-600 ">
            View Review Post
          </button>
        </div>
      </div>

      {/* Subscription Logs Section */}
      <div className="w-full p-4 sm:p-6 bg-white rounded-2xl flex flex-col gap-6 sm:gap-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-['Inter'] tracking-tight">
            Subscription Logs
          </h2>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block w-full overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-5 border-b border-gray-100 bg-slate-50 min-w-[600px]">
            {[
              "Plan",
              "Payment Method",
              "Transaction Number",
              "Last Payment",
              "Status",
            ].map((header) => (
              <div key={header} className="h-16 px-3 py-3 flex items-center">
                <span className="text-sm font-medium text-gray-800 uppercase">
                  {header}
                </span>
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {formattedSubscriptions.length > 0 ? (
            formattedSubscriptions.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 border-b border-gray-100 min-w-[600px]"
              >
                <div className="h-20 px-3 py-4 flex items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {row.plan}
                  </span>
                </div>
                <div className="h-20 px-3 py-4 flex items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {row.method}
                  </span>
                </div>
                <div className="h-20 px-3 py-4 flex items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {row.txn}
                  </span>
                </div>
                <div className="h-20 px-3 py-4 flex items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {row.date}
                  </span>
                </div>
                <div className="h-20 px-3 py-4 flex items-center">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full font-['Inter'] ${row.status.color}`}
                  >
                    {row.status.label}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-5 border-b border-gray-100 min-w-[600px]">
              <div className="h-20 px-3 py-4 flex items-center col-span-5 justify-center">
                <span className="text-sm font-medium text-gray-500">
                  No subscription data available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {formattedSubscriptions.length > 0 ? (
            formattedSubscriptions.map((row, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Plan:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {row.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Payment Method:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {row.method}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Transaction:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {row.txn}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Last Payment:
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {row.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${row.status.color}`}
                  >
                    {row.status.label}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="border rounded-lg p-4 text-center text-gray-500">
              No subscription data available
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={restrictModal} onClose={() => setRestrictModal(false)}>
        <RestrictUserModal 
          onClose={() => setRestrictModal(false)} 
          onRestrict={handleRestrictUser}
        />
      </Modal>
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <DeleteUserModal 
          onClose={() => setDeleteModal(false)} 
          onConfirm={handleDeleteUser}
        />
      </Modal>
      <Modal isOpen={activateModal} onClose={() => setActivateModal(false)}>
        <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
          <div className="w-12 h-12 bg-emerald-50 rounded-full outline-[3px] outline-emerald-50/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
              Activate this artist?
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
              Activating the artist will enable their account. They will be able to log in and access all services.
            </p>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 px-6 py-3 rounded-lg border border-zinc-200 text-neutral-800 text-base font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
              onClick={() => setActivateModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-6 py-3 bg-green-500 rounded-lg text-white text-base font-medium hover:bg-green-600 transition-colors cursor-pointer"
              onClick={handleActivateUser}
            >
              Confirm Activation
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={activationSuccessModal} onClose={() => setActivationSuccessModal(false)}>
        <div className="p-6 sm:p-10 bg-white rounded-3xl flex flex-col items-center gap-8 w-full max-w-lg">
          <div className="w-12 h-12 bg-emerald-50 rounded-full outline-[3px] outline-emerald-50/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-neutral-800 text-xl sm:text-2xl font-semibold">
              Artist Activated Successfully
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-normal leading-normal max-w-md">
              The artist account has been activated and they can now access all
              services.
            </p>
          </div>
          <div className="w-full">
            <button
              className="w-full px-6 py-3 bg-green-500 rounded-lg text-white text-base font-medium hover:bg-green-600 transition-colors cursor-pointer"
              onClick={() => setActivationSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const ArtistInfo = ({ label, value }) => (
  <div className="flex flex-wrap gap-2 sm:gap-4 items-start">
    <div className="min-w-[120px] sm:min-w-[150px] flex justify-between text-zinc-500 text-sm sm:text-base font-normal">
      <span>{label}</span>
      <span>:</span>
    </div>
    <div className="text-neutral-600 text-sm sm:text-base font-normal">
      {value}
    </div>
  </div>
);

export default Page;