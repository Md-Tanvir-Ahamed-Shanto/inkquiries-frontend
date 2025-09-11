"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/service/notificationApi';
import { toast } from 'sonner';

const NotificationPage = () => {
  // State for notifications data
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Default items per page
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getUserNotifications();
        setNotifications(data?.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications. Please try again later.');
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update local state to reflect the change
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      toast.error('Failed to update notification');
    }
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Update all notifications in local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      toast.error('Failed to update notifications');
    }
  };

  // Filter notifications based on type
  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter(notification => notification.type === filterType);
  }, [notifications, filterType]);

  // --- Derived Pagination Values ---
  const totalNotifications = filteredNotifications.length;
  const totalPages = Math.ceil(totalNotifications / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Use useMemo to prevent unnecessary re-calculations of currentItems
  const currentNotifications = useMemo(() => {
    return filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredNotifications, indexOfFirstItem, indexOfLastItem]);

  // --- Pagination Handlers ---
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePrevPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const handleItemsPerPageChange = (num) => {
    setItemsPerPage(num);
    setCurrentPage(1); // Reset to first page when items per page changes
    setShowItemsPerPageDropdown(false);
  };

  // --- Pagination Number Generation ---
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Max number of visible page buttons (e.g., 1, 2, ..., 10)

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page

      if (currentPage > 3) {
        pageNumbers.push('...'); // Ellipsis if far from start
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start/end to ensure `maxPageButtons` are visible around current page
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxPageButtons - 2);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxPageButtons - 2));
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('...'); // Ellipsis if far from end
      }
      pageNumbers.push(totalPages); // Always show last page
    }

    // Filter out duplicate page numbers that can occur with ellipsis logic
    return Array.from(new Set(pageNumbers));
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'system', label: 'System' },
    { value: 'review', label: 'Reviews' },
    { value: 'comment', label: 'Comments' },
    { value: 'message', label: 'Messages' }
  ];

  // Options for "Show X" dropdown
  const itemsPerPageOptions = [5, 8, 10, 15];

  return (
    // Outer container: Full width, centered, flexible padding based on screen size
    <div className='flex items-center justify-center w-full  '>

      {/* Main content wrapper: Ensures content doesn't get too wide on large screens */}
      <div className="inline-flex flex-col justify-start items-end gap-5 w-full max-w-4xl">

        {/* Notifications Header */}
        <div className="flex justify-between items-center w-full">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-5 py-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-center items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
              aria-haspopup="true"
              aria-expanded={showFilterDropdown}
            >
              <div className="text-gray-800 text-base font-medium font-['Inter'] leading-relaxed tracking-tight">
                {filterOptions.find(option => option.value === filterType)?.label || 'All Notifications'}
              </div>
              {showFilterDropdown ? <ChevronUp className="w-5 h-5 text-slate-900" /> : <ChevronDown className="w-5 h-5 text-slate-900" />}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-slideUpFaster">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setShowFilterDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Mark All as Read Button */}
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="text-gray-800 text-sm cursor-pointer font-medium leading-relaxed tracking-tight">Mark all as read</div>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="self-stretch flex flex-col justify-start items-start gap-3 w-full">
          {loading ? (
            // Loading state
            <div className="w-full py-10 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                Try Again
              </button>
            </div>
          ) : currentNotifications.length > 0 ? (
            // Notifications list
            currentNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                // Notification item layout: flex-col on small screens, flex-row on medium+
                className={`self-stretch px-4 py-3 sm:px-6 sm:py-5 rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 w-full
                ${notification.read ? 'bg-white' : 'bg-slate-50 hover:bg-gray-100 transition-colors cursor-pointer'}`}
              >
                {/* Content wrapper: Adjusts spacing and direction */}
                <div className="flex-1 flex flex-col sm:flex-row justify-start items-start gap-3 sm:gap-6 w-full">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1 sm:gap-2"> {/* Adjusted gap for content */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                      <div className="self-stretch flex flex-col sm:flex-row justify-start sm:items-center gap-1 sm:gap-2">
                        {/* Sender/Title */}
                        <div className="flex-1 text-neutral-900 text-base sm:text-lg font-medium leading-relaxed tracking-tight"> {/* Adjusted text size */}
                          {notification.sender}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      {/* Message content */}
                      <div className="self-stretch text-neutral-600 text-sm sm:text-base font-normal leading-normal tracking-tight"> {/* Adjusted text size */}
                        {notification.message}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Timestamp: Moves to top right on small screens, stays on right for larger */}
                <div className="shrink-0 text-zinc-500 text-xs sm:text-sm font-medium leading-relaxed mt-1 sm:mt-0 self-end sm:self-auto"> {/* Added self-end for mobile */}
                  {formatRelativeTime(notification.createdAt || new Date())}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 text-lg">No notifications found.</div>
          )}
        </div>

        {/* Pagination Section */}
        <div className="self-stretch px-4 py-3 sm:px-6 sm:py-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Pagination Controls (Prev, Numbers, Next) */}
          <div className="flex justify-center sm:justify-start items-center gap-2 sm:gap-4 w-full sm:w-auto"> {/* Centered on mobile */}
            {/* Previous Page Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-8 h-8 p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-100 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-700" />
            </button>

            {/* Page Numbers */}
            <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-0"> {/* Allow wrapping on small screens, adjust gap */}
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <div key={index} className="w-8 h-8 px-3 py-[5px] flex flex-col justify-center items-center">
                    <div className="text-gray-900 text-xs font-semibold font-['Inter'] leading-tight">...</div>
                  </div>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 px-3.5 py-[5px] rounded-[10px] outline outline-1 outline-offset-[-1px] flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors
                                ${currentPage === page ? 'bg-stone-50 outline-gray-200' : 'bg-transparent outline-transparent'}`}
                  >
                    <div className="text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">{page}</div>
                  </button>
                )
              ))}
            </div>

            {/* Next Page Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-2.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-100 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>

          {/* Pagination Info & "Show X" Dropdown */}
          <div className="flex flex-col sm:flex-row justify-start sm:justify-end items-center gap-2 sm:gap-4 mt-4 sm:mt-0 w-full sm:w-auto"> {/* Align right on larger screens */}
            <div className="text-slate-500 text-xs sm:text-sm font-medium font-['Inter'] leading-none tracking-tight text-center sm:text-left"> {/* Center text on mobile */}
              Showing {Math.min(indexOfFirstItem + 1, totalNotifications)} to {Math.min(indexOfLastItem, totalNotifications)} of {totalNotifications} entries
            </div>
            <div className="relative">
              <button
                onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                className="h-8 p-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-100 flex justify-center items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                aria-haspopup="true"
                aria-expanded={showItemsPerPageDropdown}
              >
                <div className="text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">Show {itemsPerPage}</div>
                {showItemsPerPageDropdown ?
                  <ChevronUp className="w-4 h-4 text-zinc-500" /> :
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                }
              </button>
              {showItemsPerPageDropdown && (
                <ul className="absolute bottom-full right-0 mb-2 w-24 bg-white rounded-md shadow-lg py-1 z-10 animate-slideUpFaster">
                  {itemsPerPageOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleItemsPerPageChange(option)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Show {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;