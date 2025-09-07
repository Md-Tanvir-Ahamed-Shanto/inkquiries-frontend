"use client"
import React, { useEffect, useRef, useState } from "react";
import { getAllClients, updateClientStatus, deleteClient } from "../../../../../service/adminApi";
import { format } from "date-fns";
import backendUrl from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Placeholder data for initial loading state
const placeholderClients = [
  {
    id: 1,
    name: "Arsalan Ahmed",
    email: "arsalan@gmail.com",
    status: "Active",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Default",
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "wade@gmail.com",
    status: "Pending",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Variant2",
  },
  {
    id: 3,
    name: "Eleanor Pena",
    email: "eleanor@gmail.com",
    status: "Active",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Default",
  },
  {
    id: 4,
    name: "Savannah Nguyen",
    email: "savannah@gmail.com",
    status: "Pending",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Variant2",
  },
  {
    id: 5,
    name: "Robert Fox",
    email: "robert@gmail.com",
    status: "Resticted",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Variant3",
  },
  {
    id: 6,
    name: "Leslie Alexander",
    email: "leslie@gmail.com",
    status: "Active",
    joined: "15 aug 2022",
    lastLogin: "15 feb 2022 (01:20 am)",
    statusVariant: "Default",
  },
  {
    id: 7,
    name: "Jane Cooper",
    email: "jane@gmail.com",
    status: "Active",
    joined: "15 dec 2022",
    lastLogin: "15 Mar 2022 (01:20 am)",
    statusVariant: "Default",
  },
  {
    id: 8,
    name: "Jacob Jones",
    email: "jacob@gmail.com",
    status: "Resticted",
    joined: "15 jun 2022",
    lastLogin: "15 Nov 2022 (01:20 am)",
    statusVariant: "Variant3",
  },
  {
    id: 9,
    name: "Devon Lane",
    email: "devon@gmail.com",
    status: "Active",
    joined: "15 jun 2022",
    lastLogin: "15 jun 2022 (01:20 am)",
    statusVariant: "Default",
  },
];

export default function ClientTable() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const filterRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [status, setStatus] = useState("");
  
   const fetchClients = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };
        
        if (status) {
          params.status = status;
        }
        
        const response = await getAllClients(params);
        setClients(response.clients);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Use placeholder data if API fails
        setClients(placeholderClients);
      } finally {
        setLoading(false);
      }
    };
  // Fetch clients data
  useEffect(() => {
   
    
    fetchClients();
  }, [pagination.page, pagination.limit, status]);
  
  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    if (value === "Status: Active") {
      setStatus("Active");
    } else if (value === "Status: Inactive") {
      setStatus("Inactive");
    } else {
      setStatus("");
    }
    setShowFilter(false); // close dropdown
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };
  
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handleLimitChange = (limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full px-3 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-5 overflow-hidden">
      {/* Header with title and filter */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-black text-lg sm:text-xl font-semibold font-['Inter'] capitalize leading-normal">
          Client Management
        </div>
        {/* Filter Dropdown */}
        <div className="relative w-full sm:w-auto" ref={filterRef}>
          <div
            onClick={() => setShowFilter((prev) => !prev)}
            className="w-full sm:min-w-fit h-8 sm:h-10 px-3 sm:px-4 bg-white rounded-md border border-zinc-200 flex justify-between sm:justify-center items-center gap-2.5 cursor-pointer"
          >
            <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
              {selectedFilter || "Filter"}
            </div>
            <img
              src="/icon/filter.svg"
              className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0"
              alt="filter icon"
            />
          </div>

          {showFilter && (
            <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-48 p-3 bg-white rounded-md shadow-lg border border-zinc-200 z-10">
              <div className="flex flex-col gap-2.5">
                {["Name (A-Z)", "Status", "Join Date Range"].map(
                  (option, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleFilterSelect(option)}
                      className={`w-full py-2 px-2 flex items-center gap-2 rounded cursor-pointer hover:bg-gray-100 ${
                        selectedFilter === option ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="w-4 h-4 border border-gray-400 rounded relative flex-shrink-0">
                        {selectedFilter === option && (
                          <div className="absolute inset-[1.3px] bg-slate-900 rounded" />
                        )}
                      </div>
                      <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
                        {option}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table - Original Design */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="w-full flex">
              <th className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Client name
                </div>
              </th>
              <th className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Email
                </div>
              </th>
              <th className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Status
                </div>
              </th>
              <th className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Joined
                </div>
              </th>
              <th className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Last login
                </div>
              </th>
              <th className="w-[10%] min-w-[128px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                  Action
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {loading ? (
              <tr className="w-full flex border-t border-zinc-200">
                <td colSpan="6" className="w-full h-16 px-3 py-6 bg-white flex justify-center items-center">
                  <div className="text-neutral-600 text-sm font-normal leading-none">
                    Loading clients...
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr className="w-full flex border-t border-zinc-200">
                <td colSpan="6" className="w-full h-16 px-3 py-6 bg-white flex justify-center items-center">
                  <div className="text-neutral-600 text-sm font-normal leading-none">
                    No clients found
                  </div>
                </td>
              </tr>
            ) : clients.map((client) => (
              <tr
                key={client.id}
                className="w-full flex border-t border-zinc-200"
              >
                {/* Client Name */}
                <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center gap-2.5">
                  <img
                    className="w-6 h-6 rounded-full border border-gray-100"
                    src={`${backendUrl}${client.profilePhoto}`}
                    alt={client.name}
                  />
                  <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                    {client.name}
                  </div>
                </td>

                {/* Email */}
                <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center">
                  <div className="text-neutral-600 text-sm font-normal leading-none">
                    {client.email}
                  </div>
                </td>

                {/* Status */}
                <td className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-white flex items-center">
                  <div
                    className={`px-3 py-[5px] rounded-full ${
                      client.isActive === true
                        ? "bg-emerald-50 text-green-500"
                        : client.isActive === false
                        ? "bg-yellow-50 text-amber-400"
                        : "bg-rose-50 text-rose-500"
                    }`}
                  >
                    <div className="text-xs font-normal capitalize leading-none">
                      {client.isActive === true ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </td>

                {/* Joined Date */}
                <td className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-white flex items-center">
                  <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                    {client.createdAt ? format(new Date(client.createdAt), 'dd MMM yyyy') : 'N/A'}
                  </div>
                </td>

                {/* Last Login */}
                <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center">
                  <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                    {client.lastLogin ? `${format(new Date(client.lastLogin), 'dd MMM yyyy')} (${format(new Date(client.lastLogin), 'hh:mm a')})` : 'N/A'}
                  </div>
                </td>

                {/* Action */}
                <td className="w-[10%] min-w-[180px] h-16 px-3 py-6 bg-white flex items-center gap-3">
                  
                  <div 
                    className={`${client.isActive ? 'text-red-500' : 'text-green-500'} text-sm font-normal  capitalize leading-none cursor-pointer`}
                    onClick={async () => {
                      try {
                        const status = client.isActive ? 'restricted' : 'active';
                        await updateClientStatus(client.id, status);
                        toast.success(`Client ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
                        fetchClients(); // Refresh the list
                      } catch (error) {
                        console.error('Error updating client status:', error);
                        toast.error('Failed to update client status');
                      }
                    }}
                  >
                    {client.isActive ? 'Deactivate' : 'Activate'}
                  </div>
                  <div 
                    className="text-red-700 text-sm font-normal  capitalize leading-none cursor-pointer"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                        try {
                          await deleteClient(client.id);
                          toast.success('Client deleted successfully');
                          fetchClients(); // Refresh the list
                        } catch (error) {
                          console.error('Error deleting client:', error);
                          toast.error('Failed to delete client');
                        }
                      }
                    }}
                  >
                    Delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table - Responsive Design */}
      <div className="md:hidden w-full -mx-3 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="min-w-[900px] w-full bg-white rounded-lg border border-gray-100">
          {/* Table Header */}
          <div className="w-full flex">
            <div className="w-[220px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Client name
              </div>
            </div>
            <div className="w-[200px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                email
              </div>
            </div>
            <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Status
              </div>
            </div>
            <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Joined
              </div>
            </div>
            <div className="w-[180px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Last login
              </div>
            </div>
            <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Action
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {loading ? (
            <div className="w-full flex border-t border-zinc-200">
              <div className="w-full h-12 px-2 py-3 bg-white flex justify-center items-center">
                <div className="text-neutral-600 text-xs font-normal leading-none">
                  Loading clients...
                </div>
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="w-full flex border-t border-zinc-200">
              <div className="w-full h-12 px-2 py-3 bg-white flex justify-center items-center">
                <div className="text-neutral-600 text-xs font-normal leading-none">
                  No clients found
                </div>
              </div>
            </div>
          ) : clients.map((client) => (
            <div
              key={client.id}
              className="w-full flex border-t border-zinc-200"
            >
              {/* Client Name with Avatar */}
              <div className="w-[220px] h-12 px-2 py-3 bg-white flex items-center gap-2 border-r border-gray-200">
                <img
                  className="w-5 h-5 rounded-full border border-gray-100 flex-shrink-0"
                  src={`${backendUrl}${client.profilePhoto}`}
                  alt={client.name}
                />
                <div className="text-neutral-600 text-xs font-normal capitalize leading-none truncate">
                  {client.name}
                </div>
              </div>

              {/* Email */}
              <div className="w-[200px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-normal leading-none truncate">
                  {client.email}
                </div>
              </div>

              {/* Status */}
              <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    client.status === "Active"
                      ? "bg-emerald-50 text-green-500"
                      : client.status === "Pending" || client.status === "Inactive"
                      ? "bg-yellow-50 text-amber-400"
                      : "bg-rose-50 text-rose-500"
                  }`}
                >
                  <div className="text-xs font-normal capitalize leading-none">
                    {client.status}
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                  {client.createdAt ? format(new Date(client.createdAt), 'dd MMM yyyy') : 'N/A'}
                </div>
              </div>

              {/* Last Login */}
              <div className="w-[180px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-normal capitalize leading-none truncate">
                  {client.lastLogin ? `${format(new Date(client.lastLogin), 'dd MMM yyyy')} (${format(new Date(client.lastLogin), 'hh:mm a')})` : 'N/A'}
                </div>
              </div>

              {/* Action */}
              <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center">
                <div className="text-neutral-800 text-xs font-normal  capitalize leading-none cursor-pointer">
                  View details
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full p-2 sm:p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Previous Page Button */}
            <button 
              onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
              className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={pagination.page <= 1}
            >
              <img
                src="/icon/right.svg"
                className="w-3 sm:w-4 h-3 sm:h-4 relative rotate-180"
              />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center">
              {Array.from({ length: Math.min(pagination.pages, 3) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 sm:w-8 h-7 sm:h-8 px-2 sm:px-3.5 py-1 sm:py-[5px] ${pagination.page === pageNum ? 'bg-stone-50 rounded-[10px] border border-gray-100' : ''}`}
                  >
                    <div className="text-neutral-900 text-xs font-medium">
                      {pageNum}
                    </div>
                  </button>
                );
              })}
              
              {/* Ellipsis for many pages */}
              {pagination.pages > 3 && (
                <button className="hidden sm:block w-8 h-8 px-3 py-[5px]">
                  <div className="text-neutral-900 text-xs font-medium">
                    ...
                  </div>
                </button>
              )}
              
              {/* Last page button */}
              {pagination.pages > 3 && (
                <button 
                  onClick={() => handlePageChange(pagination.pages)}
                  className={`hidden sm:block w-8 h-8 px-2.5 py-[5px] ${pagination.page === pagination.pages ? 'bg-stone-50 rounded-[10px] border border-gray-100' : ''}`}
                >
                  <div className="text-neutral-900 text-xs font-medium">
                    {pagination.pages}
                  </div>
                </button>
              )}
            </div>
            
            {/* Next Page Button */}
            <button 
              onClick={() => pagination.page < pagination.pages && handlePageChange(pagination.page + 1)}
              className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${pagination.page >= pagination.pages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={pagination.page >= pagination.pages}
            >
              <img src="/icon/right.svg" className="w-3 sm:w-4 h-3 sm:h-4 relative" />
            </button>
          </div>
          
          {/* Entries info and limit selector */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="text-zinc-700 text-xs font-medium text-center sm:text-left">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </div>
            
            {/* Show entries dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowEntriesDropdown(prev => !prev)}
                className="h-7 sm:h-8 p-2 sm:p-2.5 bg-white rounded-lg border border-gray-100 flex items-center gap-2.5"
              >
                <div className="text-neutral-900 text-xs font-medium">
                  Show {pagination.limit}
                </div>
                <img
                  src="/icon/right.svg"
                  className="w-3 sm:w-4 h-3 sm:h-4 relative -rotate-90"
                />
              </button>
              
              {showEntriesDropdown && (
                <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                  {[10, 25, 50, 100].map(limit => (
                    <div 
                      key={limit} 
                      onClick={() => {
                        handleLimitChange(limit);
                        setShowEntriesDropdown(false);
                      }}
                      className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      {limit}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};