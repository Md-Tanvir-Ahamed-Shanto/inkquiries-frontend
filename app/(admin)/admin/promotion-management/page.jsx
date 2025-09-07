"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAllPromotions } from "@/service/adminApi";
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

const PromotionTable = () => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState(null);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await getAllPromotions({
          page: currentPage,
          limit: pageSize,
          status: statusFilter
        });
        
        // Process the promotions data
        const processedPromotions = response.promotions.map(promotion => ({
          id: promotion._id,
          artist: promotion.artistName || "Unknown Artist",
          duration: calculateDuration(promotion.startDate, promotion.endDate),
          startDate: formatDate(promotion.startDate),
          endDate: formatDate(promotion.endDate),
          ...getPromotionStatus(promotion.endDate),
          originalData: promotion // Keep original data for reference
        }));
        
        setPromotions(processedPromotions);
        setTotalPages(Math.ceil(response.total / pageSize) || 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Failed to load promotions. Please try again later.");
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [currentPage, pageSize, statusFilter]);

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilter(false); // close dropdown
    
    // Update status filter based on selection
    if (value === "Status: Active") {
      setStatusFilter("active");
    } else if (value === "Status: Ended") {
      setStatusFilter("ended");
    } else {
      setStatusFilter(null); // Clear filter
    }
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
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
    <>
      {/* Edit Promotion Plan Button */}
      <div className="w-full flex justify-end mb-3 sm:mb-4.5">
        <Link
          href="/admin/promotion-management/edit-subscription-plan"
          className="w-full sm:w-auto min-w-[fit-content] h-10 sm:h-12 p-2.5 sm:p-3 bg-zinc-950 rounded-lg inline-flex items-center justify-center gap-2.5 cursor-pointer hover:bg-zinc-900 transition"
        >
          {/* Icon */}
          <img src="/icon/credit-card.svg" className="w-4 h-4 sm:w-5 sm:h-5" alt="" />

          {/* Label */}
          <span className="text-white text-sm sm:text-base font-medium capitalize leading-tight">
            Edit Promotion Plan
          </span>
        </Link>
      </div>

      <div className="w-full px-3 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white rounded-lg flex flex-col gap-4 sm:gap-5 overflow-hidden">
        {/* Header with title and filter */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="text-black text-lg sm:text-xl font-semibold font-['Inter'] capitalize leading-normal">
            Promotion Management
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
                  {["All Promotions", "Status: Active", "Status: Ended"].map(
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
                <th className="w-[25%] min-w-[256px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                    Artist name
                  </div>
                </th>
                <th className="w-[20%] min-w-[208px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                    Duration
                  </div>
                </th>
                <th className="w-[15%] min-w-[160px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                    Start Date
                  </div>
                </th>
                <th className="w-[15%] min-w-[160px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                    End Date
                  </div>
                </th>
                <th className="w-[15%] min-w-[176px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                  <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                    Status
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
                  <td colSpan="6" className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center">
                    <div className="text-neutral-600 text-sm font-normal">Loading promotions...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr className="w-full flex border-t border-zinc-200">
                  <td colSpan="6" className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center">
                    <div className="text-red-500 text-sm font-normal">{error}</div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr className="w-full flex border-t border-zinc-200">
                  <td colSpan="6" className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center">
                    <div className="text-neutral-600 text-sm font-normal">No promotions found</div>
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => (
                  <tr
                    key={promotion.id}
                    className="w-full flex border-t border-zinc-200"
                  >
                    {/* Artist Name with Avatar */}
                    <td className="w-[25%] min-w-[256px] h-16 px-3 py-6 bg-white flex items-center gap-2.5">
                      <img
                        className="w-6 h-6 rounded-full border border-gray-100"
                        src={promotion.originalData?.artistImage || "/assets/profile.png"}
                        alt={promotion.artist}
                      />
                      <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                        {promotion.artist}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="w-[20%] min-w-[208px] h-16 px-3 py-6 bg-white flex items-center">
                      <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                        {promotion.duration}
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="w-[15%] min-w-[160px] h-16 px-3 py-6 bg-white flex items-center">
                      <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                        {promotion.startDate}
                      </div>
                    </td>

                    {/* End Date */}
                    <td className="w-[15%] min-w-[160px] h-16 px-3 py-6 bg-white flex items-center">
                      <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                        {promotion.endDate}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="w-[15%] min-w-[176px] h-16 px-3 py-6 bg-white flex items-center">
                      <div
                        className={`px-5 py-[5px] rounded-[99px] ${
                          promotion.statusVariant === "Default"
                            ? "bg-emerald-50 text-green-500"
                            : "bg-slate-50 text-zinc-950"
                        }`}
                      >
                        <div className="text-sm font-normal capitalize leading-none">
                          {promotion.status}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="w-[10%] min-w-[128px] h-16 px-3 py-6 bg-white flex items-center">
                      <Link 
                        href={`/admin/promotion-management/promotion-details?id=${promotion.id}`}
                        className="text-neutral-800 text-sm font-normal  capitalize leading-none cursor-pointer"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
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
          <div className="min-w-[1000px] w-full bg-white rounded-lg border border-gray-100">
            {/* Table Header */}
            <div className="w-full flex">
              <div className="w-[250px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Artist name
                </div>
              </div>
              <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Duration
                </div>
              </div>
              <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Start Date
                </div>
              </div>
              <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  End Date
                </div>
              </div>
              <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Status
                </div>
              </div>
              <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                  Action
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div className="w-full flex border-t border-zinc-200">
                <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                  <div className="text-neutral-600 text-xs font-normal">Loading promotions...</div>
                </div>
              </div>
            ) : error ? (
              <div className="w-full flex border-t border-zinc-200">
                <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                  <div className="text-red-500 text-xs font-normal">{error}</div>
                </div>
              </div>
            ) : promotions.length === 0 ? (
              <div className="w-full flex border-t border-zinc-200">
                <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                  <div className="text-neutral-600 text-xs font-normal">No promotions found</div>
                </div>
              </div>
            ) : (
              promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="w-full flex border-t border-zinc-200"
                >
                  {/* Artist Name with Avatar */}
                  <div className="w-[250px] h-12 px-2 py-3 bg-white flex items-center gap-2 border-r border-gray-200">
                    <img
                      className="w-5 h-5 rounded-full border border-gray-100 flex-shrink-0"
                      src={promotion.originalData?.artistImage || "/assets/profile.png"}
                      alt={promotion.artist}
                    />
                    <div className="text-neutral-600 text-xs font-normal capitalize leading-none truncate">
                      {promotion.artist}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                    <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                      {promotion.duration}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                    <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                      {promotion.startDate}
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                    <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                      {promotion.endDate}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        promotion.statusVariant === "Default"
                          ? "bg-emerald-50 text-green-500"
                          : "bg-slate-50 text-zinc-950"
                      }`}
                    >
                      <div className="text-xs font-normal capitalize leading-none">
                        {promotion.status}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center">
                    <Link 
                      href={`/admin/promotion-management/promotion-details?id=${promotion.id}`}
                      className="text-neutral-800 text-xs font-normal  capitalize leading-none cursor-pointer"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="w-full p-2 sm:p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {!loading && !error && promotions.length > 0 && (
            <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-6">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <img
                    src="/icon/right.svg"
                    className="w-3 sm:w-4 h-3 sm:h-4 relative rotate-180"
                  />
                </button>
                <div className="flex items-center">
                  {/* Generate page buttons */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    // For small number of pages, show all pages
                    if (totalPages <= 5) {
                      return (
                        <button 
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-7 sm:w-8 h-7 sm:h-8 px-2 sm:px-3.5 py-1 sm:py-[5px] ${currentPage === i + 1 ? 'bg-stone-50 rounded-[10px] border border-gray-100' : ''}`}
                        >
                          <div className="text-neutral-900 text-xs font-medium">
                            {i + 1}
                          </div>
                        </button>
                      );
                    } else {
                      // For larger number of pages, show current page and neighbors
                      let pageToShow;
                      if (currentPage <= 2) {
                        pageToShow = i + 1; // Show first 3 pages
                      } else if (currentPage >= totalPages - 1) {
                        pageToShow = totalPages - 2 + i; // Show last 3 pages
                      } else {
                        pageToShow = currentPage - 1 + i; // Show current page and neighbors
                      }
                      
                      return (
                        <button 
                          key={pageToShow}
                          onClick={() => handlePageChange(pageToShow)}
                          className={`w-7 sm:w-8 h-7 sm:h-8 px-2 sm:px-3.5 py-1 sm:py-[5px] ${currentPage === pageToShow ? 'bg-stone-50 rounded-[10px] border border-gray-100' : ''}`}
                        >
                          <div className="text-neutral-900 text-xs font-medium">
                            {pageToShow}
                          </div>
                        </button>
                      );
                    }
                  })}
                  
                  {/* Show ellipsis if needed */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button className="hidden sm:block w-8 h-8 px-3 py-[5px]">
                      <div className="text-neutral-900 text-xs font-medium">
                        ...
                      </div>
                    </button>
                  )}
                  
                  {/* Show last page if needed */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button 
                      onClick={() => handlePageChange(totalPages)}
                      className={`hidden sm:block w-8 h-8 px-2.5 py-[5px] ${currentPage === totalPages ? 'bg-stone-50 rounded-[10px] border border-gray-100' : ''}`}
                    >
                      <div className="text-neutral-900 text-xs font-medium">
                        {totalPages}
                      </div>
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <img src="/icon/right.svg" className="w-3 sm:w-4 h-3 sm:h-4 relative" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="text-zinc-700 text-xs font-medium text-center sm:text-left">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, promotions.length + ((currentPage - 1) * pageSize))} of {promotions.length + ((currentPage - 1) * pageSize)} entries
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowPageSizeDropdown(prev => !prev)}
                    className="h-7 sm:h-8 p-2 sm:p-2.5 bg-white rounded-lg border border-gray-100 flex items-center gap-2.5"
                  >
                    <div className="text-neutral-900 text-xs font-medium">
                      Show {pageSize}
                    </div>
                    <img
                      src="/icon/right.svg"
                      className="w-3 sm:w-4 h-3 sm:h-4 relative -rotate-90"
                    />
                  </button>
                  {showPageSizeDropdown && (
                    <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-zinc-200 z-10">
                      <div className="p-1">
                        {[8, 16, 24, 32].map(size => (
                          <div 
                            key={size}
                            onClick={() => {
                              handlePageSizeChange(size);
                              setShowPageSizeDropdown(false);
                            }}
                            className="px-3 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-xs"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PromotionTable;