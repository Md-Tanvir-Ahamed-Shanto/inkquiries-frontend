"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "@/service/adminApi";
import backendUrl from "@/utils/baseUrl";

// Helper function to truncate content
const truncateContent = (content, maxLength = 50) => {
  if (!content) return "";
  if (content.length <= maxLength) {
    return content;
  }
  return `${content.substring(0, maxLength)}...`;
};

const ReviewTable = () => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilter(false); // close dropdown

    // Apply filter based on selection
    if (value === "Status: Active") {
      setStatusFilter("active");
    } else if (value === "Status: Restricted") {
      setStatusFilter("restricted");
    } else {
      setStatusFilter(null); // Clear filter
    }
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getAllReviews({
          page: currentPage,
          limit: pageSize,
          status: statusFilter,
        });

        // Transform API response to match the component's expected structure
        const formattedReviews = response.reviews.map((review) => ({
          id: review.id,
          name: review.client?.name || "Unknown Client",
          content: review.content || "",
          profilePhoto: review.client?.profilePhoto
            ? `${backendUrl}${review.client?.profilePhoto}`
            : "/assets/profile.png",
          artist: review.artist?.username
            ? `@${review.artist.username}`
            : "N/A",
          date: new Date(review.createdAt)
            .toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            ?.toLowerCase(),
          status: review.status?.toLowerCase(),
          statusVariant:
            review.status?.toLowerCase() === "active"
              ? "Default"
              : review.status?.toLowerCase() === "restricted"
              ? "Variant3"
              : "Default",
        }));

        setReviews(formattedReviews);
        setTotalPages(Math.ceil(response.meta?.total / pageSize));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, pageSize, statusFilter]);

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
          All Review
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
                {[
                  "Name (A-Z)",
                  "Status: Active",
                  "Status: Restricted",
                  "Join Date Range",
                ].map((option, idx) => (
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
                ))}
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
              <th className="w-[25%] min-w-[224px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Content (review)
                </div>
              </th>
              <th className="w-[15%] min-w-[192px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Mention Artist
                </div>
              </th>
              <th className="w-[15%] min-w-[176px] h-16 px-3 py-6 bg-slate-50 flex items-center">
                <div className="text-neutral-600 text-sm font-medium uppercase leading-none">
                  Date
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
                <td
                  colSpan="6"
                  className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center"
                >
                  <div className="text-neutral-600 text-sm font-normal">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr className="w-full flex border-t border-zinc-200">
                <td
                  colSpan="6"
                  className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center"
                >
                  <div className="text-red-500 text-sm font-normal">
                    {error}
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr className="w-full flex border-t border-zinc-200">
                <td
                  colSpan="6"
                  className="w-full h-16 px-3 py-6 bg-white flex items-center justify-center"
                >
                  <div className="text-neutral-600 text-sm font-normal">
                    No reviews found
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr
                  key={review.id}
                  className="w-full flex border-t border-zinc-200"
                >
                  {/* Client Name */}
                  <td className="w-[20%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center gap-2.5">
                    <img
                      className="w-6 h-6 rounded-full border border-gray-100"
                      src={review.profilePhoto}
                      alt={review.name}
                    />
                    <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                      {review.name}
                    </div>
                  </td>

                  {/* Review Content - Truncated */}
                  <td className="w-[25%] min-w-[224px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal leading-none w-full">
                      {truncateContent(review.content)}
                    </div>
                  </td>

                  {/* Mentioned Artist */}
                  <td className="w-[15%] min-w-[192px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal leading-none">
                      {review.artist}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="w-[15%] min-w-[176px] h-16 px-3 py-6 bg-white flex items-center">
                    <div className="text-neutral-600 text-sm font-normal capitalize leading-none">
                      {review.date}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="w-[15%] min-w-[176px] h-16 px-3 py-6 bg-white flex items-center">
                    <div
                      className={`px-5 py-[5px] rounded-[99px] ${
                        review.statusVariant === "Default"
                          ? "bg-emerald-50 text-green-500"
                          : review.statusVariant === "Variant3"
                          ? "bg-rose-50 text-rose-500"
                          : "bg-emerald-50 text-green-500"
                      }`}
                    >
                      <div className="text-sm font-normal capitalize leading-none">
                        {review.status}
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="w-[10%] min-w-[128px] h-16 px-3 py-6 bg-white flex items-center">
                    <Link
                      href={`/admin/review-management/review-details?id=${review.id}`}
                      className="text-neutral-800 text-sm font-normal  capitalize leading-none hover:text-neutral-600 transition-colors"
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
      <div
        className="md:hidden w-full -mx-3 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="min-w-[1000px] w-full bg-white rounded-lg border border-gray-100">
          {/* Table Header */}
          <div className="w-full flex">
            <div className="w-[220px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Client name
              </div>
            </div>
            <div className="w-[280px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Content (review)
              </div>
            </div>
            <div className="w-[150px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Mention Artist
              </div>
            </div>
            <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Date
              </div>
            </div>
            <div className="w-[120px] h-12 px-2 py-3 bg-slate-50 flex items-center border-r border-gray-200">
              <div className="text-neutral-600 text-xs font-medium uppercase leading-none">
                Status
              </div>
            </div>
            <div className="w-[110px] h-12 px-2 py-3 bg-slate-50 flex items-center">
              <div className="text-neutral-600 text-xs font-medium font-['Inter'] uppercase leading-none">
                Action
              </div>
            </div>
          </div>

          {/* Table Rows */}
          {loading ? (
            <div className="w-full flex border-t border-zinc-200">
              <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                <div className="text-neutral-600 text-xs font-normal">
                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="w-full flex border-t border-zinc-200">
              <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                <div className="text-red-500 text-xs font-normal">{error}</div>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="w-full flex border-t border-zinc-200">
              <div className="w-full h-12 px-2 py-3 bg-white flex items-center justify-center">
                <div className="text-neutral-600 text-xs font-normal">
                  No reviews found
                </div>
              </div>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="w-full flex border-t border-zinc-200"
              >
                {/* Client Name with Avatar */}
                <div className="w-[220px] h-12 px-2 py-3 bg-white flex items-center gap-2 border-r border-gray-200">
                  <img
                    className="w-5 h-5 rounded-full border border-gray-100 flex-shrink-0"
                    src="/assets/profile.png"
                    alt={review.name}
                  />
                  <div className="text-neutral-600 text-xs font-normal capitalize leading-none truncate">
                    {review.name}
                  </div>
                </div>

                {/* Review Content - Truncated */}
                <div className="w-[280px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal leading-none truncate">
                    {truncateContent(review.content)}
                  </div>
                </div>

                {/* Mentioned Artist */}
                <div className="w-[150px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal leading-none truncate">
                    {review.artist}
                  </div>
                </div>

                {/* Date */}
                <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div className="text-neutral-600 text-xs font-normal capitalize leading-none">
                    {review.date}
                  </div>
                </div>

                {/* Status */}
                <div className="w-[120px] h-12 px-2 py-3 bg-white flex items-center border-r border-gray-200">
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      review.statusVariant === "Default"
                        ? "bg-emerald-50 text-green-500"
                        : review.statusVariant === "Variant3"
                        ? "bg-rose-50 text-rose-500"
                        : "bg-emerald-50 text-green-500"
                    }`}
                  >
                    <div className="text-xs font-normal capitalize leading-none">
                      {review.status}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="w-[110px] h-12 px-2 py-3 bg-white flex items-center">
                  <Link
                    href={`/admin/review-management/review-details?id=${review.id}`}
                    className="text-neutral-800 text-xs font-normal  capitalize leading-none hover:text-neutral-600 transition-colors"
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
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src="/icon/right.svg"
                className="w-3 sm:w-4 h-3 sm:h-4 relative rotate-180"
              />
            </button>
            <div className="flex items-center">
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 sm:w-8 h-7 sm:h-8 px-2 sm:px-3.5 py-1 sm:py-[5px] ${
                      currentPage === pageNum
                        ? "bg-stone-50 rounded-[10px] border border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="text-neutral-900 text-xs font-medium">
                      {pageNum}
                    </div>
                  </button>
                );
              })}
              {totalPages > 3 && (
                <>
                  <button className="hidden sm:block w-8 h-8 px-3 py-[5px]">
                    <div className="text-neutral-900 text-xs font-medium">
                      ...
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`hidden sm:block w-8 h-8 px-2.5 py-[5px] ${
                      currentPage === totalPages
                        ? "bg-stone-50 rounded-[10px] border border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="text-neutral-900 text-xs font-medium">
                      {totalPages}
                    </div>
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg border border-gray-100 flex justify-center items-center ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <img
                src="/icon/right.svg"
                className="w-3 sm:w-4 h-3 sm:h-4 relative"
              />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="text-zinc-700 text-xs font-medium text-center sm:text-left">
              {loading
                ? "Loading..."
                : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                    currentPage * pageSize,
                    (currentPage - 1) * pageSize + reviews.length
                  )} of ${totalPages * pageSize} entries`}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
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
              {showFilter && (
                <div className="absolute right-0 mt-2 w-24 p-2 bg-white rounded-md shadow-lg border border-zinc-200 z-10">
                  {[8, 16, 24, 32].map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        setPageSize(size);
                        setShowFilter(false);
                      }}
                      className="py-1 px-2 hover:bg-gray-100 cursor-pointer text-xs"
                    >
                      Show {size}
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

export default ReviewTable;
