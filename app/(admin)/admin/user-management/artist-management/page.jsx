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
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
  });
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  const originalRef = useRef(null);
  const filterRef = useRef(null);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedOriginal, setSelectedOriginal] = useState("Original");
  const [status, setStatus] = useState(""); // Add status state for active/inactive filtering

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    
    // Handle status filtering
    if (value === "Status: Active") {
      setStatus("Active");
    } else if (value === "Status: Inactive") {
      setStatus("Inactive");
    } else if (value === "Status: All") {
      setStatus("");
    } else {
      // For other filter types (Name, Join Date)
      setStatus(""); // Reset status filter when using other filters
    }
    
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

// Filter artists based on search term
useEffect(() => {
  if (searchTerm) {
    const filtered = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.socialHandle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
    // Reset to first page when filtering
    setPagination(prev => ({...prev, page: 1}));
  } else {
    setFilteredArtists(artists);
  }
}, [searchTerm, artists]);

// Apply filters client-side
useEffect(() => {
  if (selectedFilter) {
    let filtered = [...artists];
    
    if (selectedFilter === "Name (A-Z)") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedFilter === "Status") {
      filtered.sort((a, b) => {
        const statusA = a.isActive ? "Active" : "Restricted";
        const statusB = b.isActive ? "Active" : "Restricted";
        return statusA.localeCompare(statusB);
      });
    } else if (selectedFilter === "Join Date Range") {
      filtered.sort((a, b) => new Date(b.joined) - new Date(a.joined));
    }
    
    setFilteredArtists(filtered);
  } else {
    setFilteredArtists(artists);
  }
}, [selectedFilter, artists]);

// Apply status filter
useEffect(() => {
  if (status) {
    const filtered = artists.filter(artist => {
      if (status === "Active") {
        return artist.isActive === true;
      } else if (status === "Inactive") {
        return artist.isActive === false;
      }
      return true;
    });
    setFilteredArtists(filtered);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  } else if (searchTerm === "") {
    // Only reset to all artists if there's no search term active
    setFilteredArtists(artists);
  }
}, [status, artists]);

// Fetch artists data only once on component mount
useEffect(() => {
  fetchArtists();
}, []);

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
    <div className="w-full h-full px-3 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-5 overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-black text-lg sm:text-xl font-semibold font-['Inter'] capitalize leading-normal">
          Artist Management
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 sm:h-10 px-3 sm:px-4 py-2 bg-white rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                  {/* Status filters */}
                  <div className="w-full py-2 border-b border-zinc-200">
                    <div className="text-neutral-600 text-sm font-medium mb-2">Status</div>
                    <div className="flex flex-col gap-2">
                      {["Status: All", "Status: Active", "Status: Inactive"].map(
                        (option, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleFilterSelect(option)}
                            className={`w-full py-1 px-2 flex items-center gap-2 rounded cursor-pointer hover:bg-gray-100 ${
                              (option === "Status: All" && status === "") ||
                              (option === "Status: Active" && status === "Active") ||
                              (option === "Status: Inactive" && status === "Inactive")
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            <div className="w-4 h-4 border border-gray-400 rounded relative flex-shrink-0">
                              {((option === "Status: All" && status === "") ||
                                (option === "Status: Active" && status === "Active") ||
                                (option === "Status: Inactive" && status === "Inactive")) && (
                                <div className="absolute inset-[1.3px] bg-slate-900 rounded" />
                              )}
                            </div>
                            <div className="text-neutral-600 text-sm font-normal leading-tight">
                              {option.replace("Status: ", "")}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Sort options */}
                  <div className="w-full py-2">
                    <div className="text-neutral-600 text-sm font-medium mb-2">Sort By</div>
                    <div className="flex flex-col gap-2">
                      {["Name (A-Z)", "Status", "Join Date Range"].map(
                        (option, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleFilterSelect(option)}
                            className={`w-full py-1 px-2 flex items-center gap-2 rounded cursor-pointer hover:bg-gray-100 ${
                              selectedFilter === option ? "bg-gray-100" : ""
                            }`}
                          >
                            <div className="w-4 h-4 border border-gray-400 rounded relative flex-shrink-0">
                              {selectedFilter === option && (
                                <div className="absolute inset-[1.3px] bg-slate-900 rounded" />
                              )}
                            </div>
                            <div className="text-neutral-600 text-sm font-normal leading-tight">
                              {option}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
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
              <tr className="w-full flex items-start">
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
              {filteredArtists
                .slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit)
                .map((artist) => (
                <tr
                  key={artist.id}
                  className="w-full flex border-t items-start justify-center border-zinc-200 hover:bg-gray-50 transition-colors duration-150"
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
                      className="text-gray-600 text-sm font-normal capitalize leading-none cursor-pointer flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                      onClick={() => router.push(`/admin/user-management/artist-details/${artist.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    
                    </div>
                    <div 
                       className={`${artist.isActive ? 'text-red-500' : 'text-green-500'} text-sm font-normal capitalize leading-none cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-colors`}
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
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         {artist.isActive ? (
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                         ) : (
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         )}
                       </svg>
                     
                    </div>
                    <div 
                      className="text-red-500 text-sm font-normal capitalize leading-none cursor-pointer flex items-center gap-1.5 hover:opacity-80 transition-colors"
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Table - Card Based Design */}
      {!loading && !error && (
        <div className="md:hidden w-full">
          <div className="w-full flex flex-col gap-4">
            {/* Card Based Layout */}
            {filteredArtists
              .slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit)
              .map((artist) => (
              <div
                key={artist.id}
                className="w-full rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 bg-white"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-gray-800 font-medium">{artist.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${artist.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {artist.isActive ? 'Active' : 'Restricted'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24">Email:</span>
                      <span className="text-gray-700 flex-1 break-all">{artist.email}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24">Social Handle:</span>
                      <span className="text-gray-700 flex-1">{artist.socialHandle || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24">Joined:</span>
                      <span className="text-gray-700 flex-1">{artist.joined}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between items-center p-3 bg-gray-50">
                  <button 
                    className="text-blue-600 text-xs font-medium capitalize leading-none cursor-pointer flex items-center gap-1 hover:text-blue-700 transition-colors"
                    onClick={() => router.push(`/admin/user-management/artist-details/${artist.id}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                   
                  </button>
                  
                  <button 
                    className={`${artist.isActive ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'} text-xs font-medium capitalize leading-none cursor-pointer flex items-center gap-1 transition-colors`}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {artist.isActive ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  
                  </button>
                  
                  <button 
                    className="text-red-500 text-xs font-medium capitalize leading-none cursor-pointer flex items-center gap-1 hover:text-red-600 transition-colors"
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredArtists.length > 0 && (
        <div className="w-full p-2 sm:p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Previous Page Button */}
              <button 
                onClick={() => pagination.page > 1 && setPagination({...pagination, page: pagination.page - 1})}
                className={`w-8 h-8 rounded-lg border ${pagination.page <= 1 ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors'} flex justify-center items-center`}
                disabled={pagination.page <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center">
                {Array.from({ length: Math.min(Math.ceil(filteredArtists.length / pagination.limit), 3) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setPagination({...pagination, page: pageNum})}
                      className={`w-7 sm:w-8 h-7 sm:h-8 px-2 sm:px-3.5 py-1 sm:py-[5px] ${pagination.page === pageNum ? 'bg-blue-50 text-blue-600 rounded-[10px] border border-blue-100' : 'hover:bg-gray-50 transition-colors'}`}
                    >
                      <div className={`text-xs font-medium ${pagination.page === pageNum ? 'text-blue-600' : 'text-neutral-900'}`}>
                        {pageNum}
                      </div>
                    </button>
                  );
                })}
                
                {/* Ellipsis for many pages */}
                {Math.ceil(filteredArtists.length / pagination.limit) > 3 && (
                  <button className="hidden sm:block w-8 h-8 px-3 py-[5px]">
                    <div className="text-neutral-900 text-xs font-medium">
                      ...
                    </div>
                  </button>
                )}
                
                {/* Last page button */}
                {Math.ceil(filteredArtists.length / pagination.limit) > 3 && (
                  <button 
                    onClick={() => setPagination({...pagination, page: Math.ceil(filteredArtists.length / pagination.limit)})}
                    className={`hidden sm:block w-8 h-8 px-2.5 py-[5px] ${pagination.page === Math.ceil(filteredArtists.length / pagination.limit) ? 'bg-blue-50 text-blue-600 rounded-[10px] border border-blue-100' : 'hover:bg-gray-50 transition-colors'}`}
                  >
                    <div className={`text-xs font-medium ${pagination.page === Math.ceil(filteredArtists.length / pagination.limit) ? 'text-blue-600' : 'text-neutral-900'}`}>
                      {Math.ceil(filteredArtists.length / pagination.limit)}
                    </div>
                  </button>
                )}
              </div>
              
              {/* Next Page Button */}
              <button 
                onClick={() => pagination.page < Math.ceil(filteredArtists.length / pagination.limit) && setPagination({...pagination, page: pagination.page + 1})}
                className={`w-8 h-8 rounded-lg border ${pagination.page >= Math.ceil(filteredArtists.length / pagination.limit) ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-colors'} flex justify-center items-center`}
                disabled={pagination.page >= Math.ceil(filteredArtists.length / pagination.limit)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Entries info and limit selector */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="text-zinc-700 text-xs font-medium text-center sm:text-left">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, filteredArtists.length)} of {filteredArtists.length} entries
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