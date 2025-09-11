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
    isActive: true,
    createdAt: "2022-06-15T00:00:00Z",
    profilePhoto: "/default-avatar.jpg"
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "wade@gmail.com",
    isActive: false,
    createdAt: "2022-06-15T00:00:00Z",
    profilePhoto: "/default-avatar.jpg"
  }
];

export default function ClientTable() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);
  const filterRef = useRef(null);
  const entriesRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("Status: All");
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [status, setStatus] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 1000 // Get all clients in one request
      };
      
      const response = await getAllClients(params);
      setClients(response.clients);
      setFilteredClients(response.clients);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: Math.ceil(response.pagination.total / prev.limit)
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients(placeholderClients);
      setFilteredClients(placeholderClients);
      setPagination(prev => ({
        ...prev,
        total: placeholderClients.length,
        pages: Math.ceil(placeholderClients.length / prev.limit)
      }));
    } finally {
      setLoading(false);
    }
  };
    
  // Fetch clients data on component mount
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Combined filter effect for search and status
  useEffect(() => {
    setIsFiltering(true);
    const filtered = clients.filter(client => {
      const matchesSearch = searchTerm === "" || 
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = status === "" || 
        (status === "Active" && client.isActive === true) ||
        (status === "Inactive" && client.isActive === false);
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredClients(filtered);
    setPagination(prev => ({ 
      ...prev, 
      page: 1,
      total: filtered.length,
      pages: Math.ceil(filtered.length / prev.limit)
    }));
    setIsFiltering(false);
  }, [status, searchTerm, clients]);
  
  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setIsFiltering(true);
    if (value === "Status: Active") {
      setStatus("Active");
    } else if (value === "Status: Inactive") {
      setStatus("Inactive");
    } else if (value === "Status: All") {
      setStatus("");
    }
    setShowFilter(false);
  };
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(filteredClients.length / pagination.limit)) {
      setPagination(prev => ({ ...prev, page }));
    }
  };
  
  const handleLimitChange = (limit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit, 
      page: 1,
      pages: Math.ceil(filteredClients.length / limit)
    }));
  };
  
  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
      if (entriesRef.current && !entriesRef.current.contains(e.target)) {
        setShowEntriesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredClients.slice(startIndex, endIndex);
  };

  // Calculate total pages based on filtered clients
  const totalPages = filteredClients.length > 0 ? Math.ceil(filteredClients.length / pagination.limit) : 0;
  const currentPageData = getCurrentPageData();

  return (
    <div className="w-full h-full px-3 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-5 overflow-hidden">
      {/* Header with title and filter */}
      <div className="w-full flex flex-col sm:flex-row px-12 justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-black text-lg sm:text-xl font-semibold font-['Inter'] capitalize leading-normal">
          Client Management
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 sm:h-10 px-3 sm:px-4 py-2 bg-white rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <div
              onClick={() => setShowFilter((prev) => !prev)}
              className="w-full sm:min-w-fit h-8 sm:h-10 px-3 sm:px-4 bg-white rounded-md border border-zinc-200 flex justify-between sm:justify-center items-center gap-2.5 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
                {selectedFilter || "Filter"}
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${showFilter ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showFilter && (
              <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-48 p-3 bg-white rounded-md shadow-lg border border-zinc-200 z-20">
                <div className="flex flex-col gap-2.5">
                  {["Status: All", "Status: Active", "Status: Inactive"].map(
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
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading || isFiltering ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : currentPageData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            ) : (
              currentPageData.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={client.profilePhoto ? `${backendUrl}${client.profilePhoto}` : '/default-avatar.jpg'}
                        alt={client.name}
                        onError={(e) => {
                          e.target.src = '/default-avatar.jpg';
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {client.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.createdAt ? format(new Date(client.createdAt), 'dd MMM yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={async () => {
                          try {
                            const status = client.isActive ? 'restricted' : 'active';
                            await updateClientStatus(client.id, status);
                            toast.success(`Client ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
                            fetchClients();
                          } catch (error) {
                            console.error('Error updating client status:', error);
                            toast.error('Failed to update client status');
                          }
                        }}
                        className={`${
                          client.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        } transition-colors`}
                      >
                        {client.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                            try {
                              await deleteClient(client.id);
                              toast.success('Client deleted successfully');
                              fetchClients();
                            } catch (error) {
                              console.error('Error deleting client:', error);
                              toast.error('Failed to delete client');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {loading || isFiltering ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : currentPageData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No clients found
          </div>
        ) : (
          currentPageData.map((client) => (
            <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={client.profilePhoto ? `${backendUrl}${client.profilePhoto}` : '/default-avatar.jpg'}
                    alt={client.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.jpg';
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    client.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {client.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Joined</div>
                <div className="text-sm text-gray-900">
                  {client.createdAt ? format(new Date(client.createdAt), 'dd MMM yyyy') : 'N/A'}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  onClick={async () => {
                    try {
                      const status = client.isActive ? 'restricted' : 'active';
                      await updateClientStatus(client.id, status);
                      toast.success(`Client ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
                      fetchClients();
                    } catch (error) {
                      console.error('Error updating client status:', error);
                      toast.error('Failed to update client status');
                    }
                  }}
                  className={`text-sm ${
                    client.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                  } transition-colors`}
                >
                  {client.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                      try {
                        await deleteClient(client.id);
                        toast.success('Client deleted successfully');
                        fetchClients();
                      } catch (error) {
                        console.error('Error deleting client:', error);
                        toast.error('Failed to delete client');
                      }
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-900 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <div className="w-full p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full">
            {/* Previous/Next buttons and page info */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`px-3 py-2 text-sm border border-gray-300 rounded-md ${
                  pagination.page <= 1 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'bg-white hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className={`px-3 py-2 text-sm border border-gray-300 rounded-md ${
                  pagination.page >= totalPages 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'bg-white hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Next
              </button>
            </div>
            
            {/* Entries info and selector */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {filteredClients.length > 0 ? (
                  `Showing ${((pagination.page - 1) * pagination.limit) + 1} to ${Math.min(pagination.page * pagination.limit, filteredClients.length)} of ${filteredClients.length} entries`
                ) : (
                  "No entries to show"
                )}
              </div>
              
              <div className="relative" ref={entriesRef}>
                <button 
                  onClick={() => setShowEntriesDropdown(prev => !prev)}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-1"
                >
                  <span>Show {pagination.limit}</span>
                  <svg className={`w-4 h-4 transition-transform ${showEntriesDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showEntriesDropdown && (
                  <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    {[10, 25, 50, 100].map(limit => (
                      <button 
                        key={limit} 
                        onClick={() => {
                          handleLimitChange(limit);
                          setShowEntriesDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};