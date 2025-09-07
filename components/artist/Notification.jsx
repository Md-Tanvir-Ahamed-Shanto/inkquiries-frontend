"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/service/notificationApi";
import { toast } from "sonner";

function Notification() {
  // State for notifications data
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

  // Pagination calculations
  const totalNotifications = filteredNotifications.length;
  const totalPages = Math.ceil(totalNotifications / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications?.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
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
    setCurrentPage(1);
    setShowItemsPerPageDropdown(false);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'system', label: 'System' },
    { value: 'review', label: 'Reviews' },
    { value: 'comment', label: 'Comments' },
    { value: 'message', label: 'Messages' }
  ];

  // Items per page options
  const itemsPerPageOptions = [5, 8, 10, 15];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6 md:mt-12">
      <div className="flex justify-between items-center">
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="w-fit px-4 py-2 bg-slate-50 font-medium text-sm rounded-lg flex gap-2 items-center cursor-pointer"
          >
            {filterOptions.find(option => option.value === filterType)?.label || 'All Notifications'} 
            {showFilterDropdown ? <SlArrowUp size={10} /> : <SlArrowDown size={10} />}
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
        
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-white rounded-lg border border-gray-100 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-3 mt-4 md:mt-6">
        {loading ? (
          <div className="w-full py-10 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading notifications...</p>
          </div>
        ) : error ? (
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
          currentNotifications.map((notification, index) => (
            <SingleNotification 
              key={notification.id || index} 
              notification={notification} 
              onMarkAsRead={handleMarkAsRead} 
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-lg">No notifications found.</div>
        )}
        
        {totalNotifications > 0 && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border border-gray-100 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex gap-4 items-center">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-8 h-8 border border-gray-100 rounded-lg flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdKeyboardArrowLeft />
              </button>
              <div className="flex">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <div key={`ellipsis-${index}`} className="w-8 h-8 rounded-lg flex justify-center items-center font-medium text-xs">
                      ...
                    </div>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg flex justify-center items-center cursor-pointer font-medium text-xs ${currentPage === page ? 'border border-gray-100 bg-stone-50' : ''}`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-8 h-8 border border-gray-100 rounded-lg flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdKeyboardArrowRight />
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="text-slate-500 font-medium text-xs text-center">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalNotifications)} of {totalNotifications} entries
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                  className="w-fit px-4 py-2 border border-gray-100 font-medium text-xs rounded-lg flex gap-2 items-center cursor-pointer"
                >
                  Show {itemsPerPage} {showItemsPerPageDropdown ? <SlArrowUp size={10} /> : <SlArrowDown size={10} />}
                </button>
                {showItemsPerPageDropdown && (
                  <div className="absolute bottom-full right-0 mb-1 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                    {itemsPerPageOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleItemsPerPageChange(option)}
                        className={`block w-full text-left px-4 py-2 text-xs ${itemsPerPage === option ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      >
                        Show {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleNotification({ notification, onMarkAsRead }) {
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

  return (
    <div 
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
      className={`p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start rounded-lg
        ${notification.read ? 'bg-white border border-gray-100' : 'bg-slate-50 cursor-pointer hover:bg-gray-100 transition-colors'}`}
    >
      <div className="flex-1">
        <h1 className="font-medium text-base md:text-lg flex items-center">
          {notification.title || 'Notification'}
          {!notification.read && (
            <span className="ml-2 inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
          )}
        </h1>
        <div className="text-neutral-600 mt-1 md:mt-2 text-sm md:text-base">
          {notification.message}
        </div>
        {notification.actionLink && (
          <a 
            href={notification.actionLink} 
            className="text-gray-600 text-sm mt-2 inline-block hover:"
            onClick={(e) => e.stopPropagation()}
          >
            View details
          </a>
        )}
      </div>
      <div className="text-zinc-500 font-medium text-xs sm:text-sm whitespace-nowrap">
        {formatRelativeTime(notification.createdAt || new Date())}
      </div>
    </div>
  );
}

export default Notification;