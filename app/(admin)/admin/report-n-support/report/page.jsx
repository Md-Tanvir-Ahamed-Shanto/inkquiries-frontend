"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { getAllReviewReports } from "@/service/adminApi";
import backendUrl from "@/utils/baseUrl";

const ReportTable = () => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Dynamically get unique report types for the filter dropdown
  const reportTypes = [
    "All",
    ...new Set(allReports.map((report) => report.type)),
  ];

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilter(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
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

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await getAllReviewReports();
        if (response && response.length > 0) {
          // Format the reports data to match our component structure
          const formattedReports = response.map(report => ({
            id: report.id,
            reporter: report.artist?.username || 'Unknown Artist',
            profilePhoto: report.artist?.profilePhoto && `${backendUrl}${report.artist?.profilePhoto}`,
            type: report.type || "Unknown",
            details: report.reason || 'No content provided',
            date: new Date(report.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            status: report.status,
            reviewId: report.reviewId
          }));
          setAllReports(formattedReports);
          setError(null);
        } else {
          setAllReports([]);
          setError("No reports data available");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    // Filter reports whenever the filter selection or allReports state changes
    if (selectedFilter === "All") {
      setFilteredReports(allReports);
    } else {
      setFilteredReports(
        allReports.filter((report) => report.type === selectedFilter)
      );
    }
  }, [selectedFilter, allReports]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'resolved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status || 'pending'}
      </span>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
            currentPage === i
              ? 'bg-gray-50 text-gray-600 border-gray-200'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Report Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage user reports efficiently</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                All Reports
              </h2>
              <div className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {filteredReports.length} total
              </div>
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                <span>{selectedFilter}</span>
                <svg className={`w-4 h-4 transition-transform ${showFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2">
                  {reportTypes.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFilterSelect(option)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        selectedFilter === option
                          ? "bg-gray-50 text-gray-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedFilter === option && (
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              <span className="text-gray-600 font-medium">Loading reports...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="mx-6 mt-6 mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-red-800 font-medium">Error Loading Reports</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Table */}
        {!loading && !error && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <h3 className="text-gray-900 font-medium">No reports found</h3>
                          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report, index) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">#{report.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 rounded-full object-contain border-2 border-gray-200"
                            src={report?.profilePhoto || '/icon/user.svg'}
                            alt={report.reporter}
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {report.reporter}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-600 truncate" title={report.details}>
                          {report.details}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{report.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/report-n-support/report/report-details?id=${report.id}`}>
                          <button className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
          <div className="lg:hidden">
            {currentReports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 className="text-gray-900 font-medium">No reports found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {currentReports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-mono text-gray-600">#{report.id}</div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full object-contain border-2 border-gray-200"
                        src="/assets/profile.png"
                        alt={report.reporter}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{report.reporter}</div>
                        <div className="text-sm text-gray-500">{report.date}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {report.type}
                      </span>
                      <p className="text-sm text-gray-600">{report.details}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Link href={`/admin/report-n-support/report/report-details?id=${report.id}`}>
                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Pagination */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} results
                </span>
                
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={8}>8 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {renderPaginationButtons()}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportTable;