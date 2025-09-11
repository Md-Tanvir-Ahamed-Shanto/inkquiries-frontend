"use client";
import Modal from "@/components/common/Modal";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import RestrictUserModal from "./RestrictUserModal";
import DeleteUserModal from "./DeleteUserModal";
import ActivateUserModal from "./ActiveUserModal";
import ActivationSuccessModal from "./ActivationSuccessModal";
import { useSearchParams, useRouter } from "next/navigation";
import { getClientById, updateClientStatus, deleteClient } from "@/service/adminApi";
import { formatDate } from "@/utils/formateDate";

function Page() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const router = useRouter();
  
  const [restrictModal, setRestrictModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [activationSuccessModal, setActivationSuccessModal] = useState(false);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId) {
        setError("Client ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getClientById(clientId);
        setClient(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("Failed to load client details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [clientId]);

  const handleDeleteUser = async () => {
    try {
      await deleteClient(clientId);
      setDeleteModal(false);
      router.push("/admin/user-management/client-management");
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Failed to delete client. Please try again.");
    }
  };

  const handleActivateUser = async () => {
    try {
      await updateClientStatus(clientId, "active");
      setActivateModal(false);
      // Update local state to reflect the change
      setClient(prev => ({ ...prev, status: "active" }));
      // Show success modal after activation
      setActivationSuccessModal(true);
    } catch (err) {
      console.error("Error activating client:", err);
      alert("Failed to activate client. Please try again.");
    }
  };
  
  const handleRestrictUser = async () => {
    try {
      await updateClientStatus(clientId, "restricted");
      setRestrictModal(false);
      // Update local state to reflect the change
      setClient(prev => ({ ...prev, status: "restricted" }));
    } catch (err) {
      console.error("Error restricting client:", err);
      alert("Failed to restrict client. Please try again.");
    }
  };
  if (loading) {
    return (
      <div className="w-full max-w-[1132px] px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg flex justify-center items-center shadow-sm">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1132px] px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg flex justify-center items-center shadow-sm">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1132px] px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-lg flex flex-col gap-8 shadow-sm">
      {/* Header */}
      <div className="w-full pb-3 border-b border-gray-100 flex items-center gap-4">
        <Link
          href="/admin/user-management/client-management"
          className="w-8 h-8 bg-slate-50 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <img src="/icon/right-arrow.svg" className="w-4 h-4" alt="Back" />
        </Link>
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 font-['Inter'] leading-6 sm:leading-7">
          Client Details
        </h2>
      </div>

      {/* Profile Info */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-6">
        {/* User basic info */}
        <div className="flex items-center gap-4">
          <img
            src={client?.profilePhoto || "/assets/profile.png"}
            alt="User Avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">
              {client?.firstName} {client?.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-normal">
              <img
                src="/icon/location.svg"
                alt="Location Icon"
                className="w-4 h-4"
              />
              {client?.location || "Location not specified"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {client?.status !== "active" && (
            <button
              onClick={() => setActivateModal(true)}
              className="flex-1 sm:flex-none px-6 py-3 bg-green-500 rounded-lg text-white font-medium text-sm sm:text-base hover:bg-green-600 transition-colors"
            >
              Activate
            </button>
          )}
          {client?.status !== "restricted" && (
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

      {/* Detail Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border border-zinc-200 flex flex-col gap-4 md:col-span-2">
          <UserInfo label="Email" value={client?.email} />
          <UserInfo label="Role" value="Client" />
          <UserInfo
            label="Account Status"
            value={
              <span className={`px-4 py-1 ${client?.status === "active" ? "bg-emerald-50 text-green-500" : "bg-red-50 text-red-500"} rounded-full text-sm capitalize`}>
                {client?.status || "Unknown"}
              </span>
            }
          />
          <UserInfo label="Join Date" value={client?.createdAt ? formatDate(client.createdAt) : "Unknown"} />
          {client?.bio && <UserInfo label="Bio" value={client.bio} />}
          {client?.phone && <UserInfo label="Phone" value={client.phone} />}
        </div>
      </div>

      {/* View Posts */}
      <div className="flex justify-start">
        <button className="text-sm sm:text-base font-medium text-neutral-600 ">
          View Review Post
        </button>
      </div>
      <Modal isOpen={restrictModal} onClose={() => setRestrictModal(false)}>
        <RestrictUserModal 
          onClose={() => setRestrictModal(false)} 
          onConfirm={handleRestrictUser}
        />
      </Modal>
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <DeleteUserModal 
          onClose={() => setDeleteModal(false)} 
          onConfirm={handleDeleteUser}
        />
      </Modal>
      <Modal isOpen={activateModal} onClose={() => setActivateModal(false)}>
        <ActivateUserModal 
          onClose={() => setActivateModal(false)} 
          onConfirm={handleActivateUser}
        />
      </Modal>
      <Modal isOpen={activationSuccessModal} onClose={() => setActivationSuccessModal(false)}>
        <ActivationSuccessModal onClose={() => setActivationSuccessModal(false)} />
      </Modal>
    </div>
  );
}

const UserInfo = ({ label, value }) => (
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
