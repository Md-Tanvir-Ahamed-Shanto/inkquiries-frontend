"use client"
import React, { useEffect, useRef, useState } from "react";
import { getAllArtists, updateArtistStatus, deleteArtist } from "@/service/adminApi";
import backendUrl from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Placeholder artists for fallback
const placeholderArtists = [
  {
    id: 1,
    name: "Arsalan Ahmed",
    email: "arsalan@gmail.com",
    socialHandle: "fb.com/@username",
    status: "Active",
    joined: "15 jun 2022",
  },
  {
    id: 2,
    name: "Wade Warren",
    email: "wade@gmail.com",
    socialHandle: "ins.com/@username",
    status: "Pending",
    statusVariant: "Variant2",
    joined: "15 jun 2022",
  },
  {
    id: 3,
    name: "Eleanor Pena",
    email: "eleanor@gmail.com",
    socialHandle: "x.com/@username",
    status: "Active",
    statusVariant: "Default",
    joined: "15 jun 2022",
  },
  {
    id: 4,
    name: "Savannah Nguyen",
    email: "savannah@gmail.com",
    socialHandle: "fb.com/@username",
    status: "Pending",
    statusVariant: "Variant2",
    joined: "15 jun 2022",
  },
  {
    id: 5,
    name: "Robert Fox",
    email: "robert@gmail.com",
    socialHandle: "ins.com/@username",
    status: "Restricted",
    statusVariant: "Variant3",
    joined: "15 jun 2022",
  },
  {
    id: 6,
    name: "Leslie Alexander",
    email: "leslie@gmail.com",
    socialHandle: "fb.com/@username",
    status: "Active",
    statusVariant: "Default",
    joined: "15 aug 2022",
  },
  {
    id: 7,
    name: "Jane Cooper",
    email: "jane@gmail.com",
    socialHandle: "ins.com/@username",
    status: "Active",
    statusVariant: "Default",
    joined: "15 dec 2022",
  },
  {
    id: 8,
    name: "Jacob Jones",
    email: "jacob@gmail.com",
    socialHandle: "fb.com/@username",
    status: "Restricted",
    statusVariant: "Variant3",
    joined: "15 jun 2022",
  },
  {
    id: 9,
    name: "Devon Lane",
    email: "devon@gmail.com",
    socialHandle: "x.com/@username",
    status: "Active",
    statusVariant: "Default",
    joined: "15 jun 2022",
  },
];

export default function ArtistTable() {
  const router = useRouter();
  const [showOriginal, setShowOriginal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    pages: 0
  });
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  const originalRef = useRef(null);
  const filterRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedOriginal, setSelectedOriginal] = useState("Original");

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilter(false); // close dropdown
  };

  function handleSelect(option) {
    setSelectedOriginal(option);
    setShowOriginal(false);
  }

  const fetchArtists = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(selectedFilter && { sort: selectedFilter.toLowerCase() })
      };

      const response = await getAllArtists(params);

      if (response  && response.artists && Array.isArray(response.artists)) {
        // Transform the response to match the expected format
        const formattedArtists = response.artists.map(artist => ({
          id: artist.id,
          name: artist.name || 'Unknown',
          email: artist.email || 'No email',
          socialHandle: artist.socialHandle || 'No social handle',
          isActive: artist.isActive,
          profilePhoto: artist.profilePhoto ? `${backendUrl}${artist.profilePhoto}` : null,
          statusVariant: artist.isActive ? 'Default' : 'Variant3',
          joined: new Date(artist.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }));

        setArtists(formattedArtists);
        console.log('Formatted artists after fetch:', formattedArtists); // Added console log

        // Use pagination object from API response
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          // Fallback if pagination object is not availableRestricted
          setPagination({
            total: response.data.length,
            page: pagination.page,
            limit: pagination.limit,
            pages: Math.ceil(response.data.length / pagination.limit)
          });
        }
      } else {
        setArtists([]);
        setPagination({
          total: 0,
          page: 1,
          limit: pagination.limit,
          pages: 0
        });
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
      setError("Failed to load artists. Please try again.");
      setArtists(placeholderArtists); // Use placeholder data on error
      setPagination({
        total: placeholderArtists.length,
        page: 1,
        limit: pagination.limit,
        pages: Math.ceil(placeholderArtists.length / pagination.limit)
      });
    } finally {
      setLoading(false);
    }
  };

// Fetch artists data
useEffect(() => {
  fetchArtists();
}, [pagination.page, pagination.limit, selectedFilter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (originalRef.current && !originalRef.current.contains(e.target)) {
        setShowOriginal(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full px-3 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-5 overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-black text-lg sm:text-xl font-semibold font-['Inter'] capitalize leading-normal">
          Artist Management
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Original Dropdown */}
          <div className="relative inline-block w-full sm:w-auto" ref={originalRef}>
            <div
              onClick={() => setShowOriginal((prev) => !prev)}
              className="w-full sm:min-w-[140px] h-8 sm:h-10 px-3 sm:px-4 bg-white rounded-md border border-zinc-200 flex justify-between sm:justify-center items-center gap-2.5 cursor-pointer"
            >
              <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight truncate">
                {selectedOriginal}
              </div>
              <img
                src="/icon/right-arrow.svg"
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
                  showOriginal ? "rotate-90" : "-rotate-90"
                }`}
                alt="arrow"
              />
            </div>

            {showOriginal && (
              <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-48 p-3 bg-white rounded-md shadow-lg border border-zinc-200 z-10">
                <div className="flex flex-col gap-2.5">
                  <div
                    onClick={() => handleSelect("Original")}
                    className="w-full py-2 border-b border-zinc-200 hover:bg-gray-100 px-2 rounded cursor-pointer"
                  >
                    <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
                      Original
                    </div>
                  </div>
                  <div
                    onClick={() => handleSelect("Created by Client")}
                    className="w-full py-2 hover:bg-gray-100 px-2 rounded cursor-pointer"
                  >
                    <div className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
                      Created by Client
                    </div>
                  </div>
                </div>
              </div>
            )}
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="w-full py-4 px-3 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      {/* Desktop Table - Original Design */}
      {!loading && !error && (
        <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="w-full flex">
                <th className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Artist name
                  </div>
                </th>
                <th className="w-[18%] min-w-[172px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Email
                  </div>
                </th>
                <th className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Social handle
                  </div>
                </th>
                <th className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Status
                  </div>
                </th>
                <th className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Joined
                  </div>
                </th>
                <th className="w-[12%] min-w-[128px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium font-['Inter'] uppercase leading-none">
                    Action
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {artists.map((artist) => (
                <tr
                  key={artist.id}
                  className="w-full flex border-t border-zinc-200"
                >
                  {/* Artist Name */}
                  <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center gap-2.5">
                    <img
                      className="w-6 h-6 rounded-full border border-gray-100"
                      src={artist.profilePhoto ? `${artist.profilePhoto}` : "/assets/profile.png"}
                      alt={artist.name}
                    />
                    <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                      {artist.name}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="w-[18%] min-w-[172px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal leading-none">
                      {artist.email}
                    </div>
                  </td>

                  {/* Social Handle */}
                  <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal leading-none">
                      {artist.socialHandle}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-white flex items-center">
                    <div
                      className={`px-3 py-[5px] rounded-full ${
                        artist.isActive
                          ? "bg-emerald-50 text-green-500"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      <div className="text-xs font-normal capitalize leading-none">
                        {artist.isActive ? 'Active' : 'Restricted'}
                      </div>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="w-[15%] min-w-[144px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                      {artist.joined}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="w-[12%] min-w-[180px] h-16 px-3 py-6 bg-white flex items-center gap-3">
                    <div 
                      className="text-gray-600 text-sm font-normal  capitalize leading-none cursor-pointer"
                      onClick={() => router.push(`/admin/user-management/artist-details/${artist.id}`)}
                    >
                      View details
                    </div>
                    <div 
                       className={`${artist.isActive ? 'text-red-500' : 'text-green-500'} text-sm font-normal  capitalize leading-none cursor-pointer`}
                       onClick={async () => {
                         try {
                           const status = artist.isActive ? 'restricted' : 'active';
                           console.log('Attempting to update artist status:', artist.id, status); // Added console log
                           await updateArtistStatus(artist.id, status);
                           toast.success(`Artist ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
                           fetchArtists(); // Refresh the list
                         } catch (error) {
                           console.error('Error updating artist status:', error);
                           toast.error('Failed to update artist status');
                         }
                       }}
                     >
                       {artist.isActive ? 'Deactivate' : 'Activate'}
                    </div>
                    <div 
                      className="text-red-500 text-sm font-normal  capitalize leading-none cursor-pointer"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this artist?')) {
                          try {
                            await deleteArtist(artist.id);
                            toast.success('Artist deleted successfully');
                            fetchArtists(); // Refresh the list
                          } catch (error) {
                            console.error('Error deleting artist:', error);
                            toast.error('Failed to delete artist');
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
      )}

      {/* Mobile Table */}
      {!loading && !error && (
        <div className="md:hidden w-full -mx-3 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
               style={{ 
                 scrollbarWidth: 'thin',
                 WebkitOverflowScrolling: 'touch'
               }}>
          <div className="min-w-[980px] bg-white rounded-lg border border-gray-100">
            {/* Table Header */}
            <div className="w-full flex">
              <div className="w-[200px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Artist name
                </div>
              </div>
              <div className="w-[180px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  email
                </div>
              </div>
              <div className="w-[200px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Social handle
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
              <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Action
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="w-full flex border-t border-zinc-200"
              >
                {/* Artist Name */}
                <div className="w-[200px] h-12 px-2 py-3 bg-white flex items-center gap-2 border-r border-gray-200">
                  <img
                    className="w-5 h-5 rounded-full border border-gray-100 flex-shrink-0"
                    src={artist.profilePhoto ? `${artist.profilePhoto}` : "/assets/profile.png"}
                    alt={artist.name}
                  />
                  <div className="text-neutral-600 text-xs font-normal capitalize leading-none truncate">
                    {artist.name}
                  </div>
                </div>

                {/* Email */}
                <div className="w-[180px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal leading-none truncate">
                    {artist.email}
                  </div>
                </div>

                {/* Social Handle */}
                <div className="w-[200px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal leading-none truncate">
                    {artist.socialHandle}
                  </div>
                </div>

                {/* Status */}
                <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      artist.isActive
                        ? "bg-emerald-50 text-green-500"
                        : "bg-rose-50 text-rose-500"
                    }`}
                  >
                    <div className="text-xs font-normal capitalize leading-none">
                      {artist.isActive ? 'Active' : 'Restricted'}
                    </div>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                    {artist.joined}
                  </div>
                </div>

                {/* Action */}
                <div className="w-[180px] h-12 px-2 py-3 bg-white flex items-center gap-3">
                  <div 
                    className="text-gray-600 text-xs font-normal  capitalize leading-none cursor-pointer"
                    onClick={() => router.push(`/admin/user-management/artist-details/${artist.id}`)}
                  >
                    View details
                  </div>
                  <div 
                     className={`${artist.isActive ? 'text-red-500' : 'text-green-500'} text-xs font-normal  capitalize leading-none cursor-pointer`}
                     onClick={async () => {
                       try {
                         const status = artist.isActive ? 'restricted' : 'active';
                         await updateArtistStatus(artist.id, status);
                         toast.success(`Artist ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
                         fetchArtists(); // Refresh the list
                       } catch (error) {
                         console.error('Error updating artist status:', error);
                         toast.error('Failed to update artist status');
                       }
                     }}
                   >
                     {artist.isActive ? 'Deactivate' : 'Activate'}
                  </div>
                  <div 
                    className="text-red-500 text-xs font-normal  capitalize leading-none cursor-pointer"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this artist?')) {
                        try {
                          await deleteArtist(artist.id);
                          toast.success('Artist deleted successfully');
                          fetchArtists(); // Refresh the list
                        } catch (error) {
                          console.error('Error deleting artist:', error);
                          toast.error('Failed to delete artist');
                        }
                      }
                    }}
                  >
                    Delete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && artists.length > 0 && (
        <div className="w-full p-2 sm:p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Previous Page Button */}
              <button 
                onClick={() => pagination.page > 1 && setPagination({...pagination, page: pagination.page - 1})}
                className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={pagination.page <= 1}
              >
                <img
                  src="/icon/right.svg"
                  className="w-3 sm:w-4 h-3 sm:h-4 relative rotate-180"
                  alt="previous"
                />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center">
                {Array.from({ length: Math.min(pagination.pages, 3) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setPagination({...pagination, page: pageNum})}
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
                    onClick={() => setPagination({...pagination, page: pagination.pages})}
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
                onClick={() => pagination.page < pagination.pages && setPagination({...pagination, page: pagination.page + 1})}
                className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${pagination.page >= pagination.pages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={pagination.page >= pagination.pages}
              >
                <img 
                  src="/icon/right.svg" 
                  className="w-3 sm:w-4 h-3 sm:h-4 relative"
                  alt="next" 
                />
              </button>
            </div>
            
            {/* Entries info and limit selector */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="text-zinc-700 text-xs font-medium text-center sm:text-left">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>
              
              {/* Show entries dropdown */}
              <div className="relative inline-block">
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
                    alt="dropdown"
                  />
                </button>
                
                {showEntriesDropdown && (
                  <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                    {[10, 25, 50, 100].map(limit => (
                      <div 
                        key={limit} 
                        onClick={() => {
                          setPagination({...pagination, limit, page: 1}); // Reset to first page when changing limit
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
      )}
    </div>
  );
}