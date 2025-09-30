"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/service/authApi";
import { getUserNotifications } from "@/service/notificationApi";
import { User, User2Icon } from "lucide-react";
import { BiNotification } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import backendUrl from "@/utils/baseUrl";
import CreateReviewPostPopup from "@/components/models/CreateReviewPostPopup";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log("user",currentUser)
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  // Fetch notifications when user is logged in
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getUserNotifications();
          // Set notifications
          setNotifications(response.data || []);
          // Count unread notifications
          const unreadCount = response.data.filter(notification => !notification.read).length;
          setNotificationCount(unreadCount);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
          setLoading(false);
        }
      }
    };
    
    fetchNotifications();
    
    // Set up interval to check for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationMenuOpen && !event.target.closest('.notification-menu-container')) {
        setIsNotificationMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationMenuOpen]);
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const { markAllNotificationsAsRead } = await import('@/service/notificationApi');
      await markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };
  
  // Handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    try {
      // If notification is not read, mark it as read
      if (!notification.read) {
        const { markNotificationAsRead } = await import('@/service/notificationApi');
        await markNotificationAsRead(notification.id);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
      
      // Navigate to the action link if available
      if (notification.actionLink) {
        router.push(notification.actionLink);
      }
      
      // Close the notification menu
      setIsNotificationMenuOpen(false);
    } catch (error) {
      console.error("Failed to handle notification click:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push('/');
  };

  // Handle Create Review Post button click
  const handleCreateReviewClick = () => {
    if (user) {
      setIsCreateReviewOpen(true);
    } else {
      router.push('/login');
    }
  };

  // Handle successful review creation
  const handleReviewSuccess = () => {
    setIsCreateReviewOpen(false);
    // Optionally refresh notifications or redirect
  };
// console.log("user",user)
  const handleProfileClick = () => {
    if (user) {
      switch (user.role?.toLowerCase()) {
        case 'admin':
          router.push('/admin/overview');
          break;
        case 'artist':
          router.push('/artist/dashboard');
          break;
        case 'client':
          router.push('/client/dashboard');
          break;
        default:
          router.push('/');
      }
    }
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-32" suppressHydrationWarning>
      {/* Logo */}
      <div className="justify-start" suppressHydrationWarning>
        <Link href="/">
          <span className="text-black text-3xl sm:text-4xl font-bold font-['Inter'] capitalize leading-10 cursor-pointer">
            Ink
          </span>
          <span className="text-zinc-600 text-3xl sm:text-4xl font-bold font-['Inter'] capitalize leading-10 cursor-pointer">
            quiries
          </span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:inline-flex justify-start items-center gap-9" suppressHydrationWarning>
        <Link href="/">
          <div className={`justify-start hover:text-black hover:font-medium text-base capitalize leading-normal cursor-pointer ${pathname === '/' ? "text-black font-medium" : 'text-zinc-500'}`} suppressHydrationWarning>
            Home
          </div>
        </Link>
        <Link href="/explore">
          <div className={`justify-start hover:text-black hover:font-medium  text-base capitalize leading-normal cursor-pointer ${pathname === '/explore' ? "text-black font-medium" : "text-zinc-500"}`} suppressHydrationWarning>
            Explore
          </div>
        </Link>
        
        {/* Create Review Post Button */}
        <button
          onClick={handleCreateReviewClick}
          className="px-5 py-3 bg-zinc-950 rounded-lg inline-flex justify-center items-center gap-2.5 cursor-pointer hover:bg-zinc-800 transition-colors"
          suppressHydrationWarning
        >
          <div className="w-5 h-5 relative">
            <div className="w-4 h-4 left-[1.66px] top-[1.67px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
            <div className="w-1.5 h-1.5 left-[10.84px] top-[3.33px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
            <div className="w-1.5 h-0 left-[11.66px] top-[18.33px] absolute outline-[1.25px] outline-offset-[-0.62px] outline-white" />
          </div>
          <div className="text-white text-base font-medium capitalize leading-normal">
            Create Review Post
          </div>
        </button>
      </div>

      {/* Desktop Auth/Profile Section */}
      <div className="hidden lg:inline-flex justify-start items-center gap-3" suppressHydrationWarning>
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-28 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="w-28 h-12 bg-zinc-300 rounded-lg animate-pulse"></div>
          </div>
        ) : (
          <>
            {user && (
              <div className="relative notification-menu-container" suppressHydrationWarning>
                <button 
                  className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 hover:rounded-full" 
                  suppressHydrationWarning
                  onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                >
                  <IoNotificationsOutline className="w-5 h-5 text-zinc-950" />
                  {/* Dynamic Notification Count Badge */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" suppressHydrationWarning>
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 notification-menu-container">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {/* {notificationCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-xs cursor-pointer text-gray-600 hover:text-gray-800"
                          >
                            Mark all as read
                          </button>
                        )} */}
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div></div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="text-sm">{notification.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications</div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link href={user?.role === 'admin' ? '/admin/overview' : 
                                    user?.role === 'artist' ? '/artist/dashboard?tab=notification' : 
                                    '/client/dashboard?tab=notification'}
                        >
                          <div className="text-xs text-center cursor-pointer text-gray-600 hover:text-gray-800">
                            View all notifications
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="relative" suppressHydrationWarning>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg "
                  suppressHydrationWarning
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer bg-gray-200 flex items-center justify-center" suppressHydrationWarning>
                    {user?.profilePhoto ? (
                      <Image
                        src={user?.profilePhoto ? `${backendUrl}${user.profilePhoto}` : '/placeholder-image.svg'} 
                        alt="User Avatar" 
                        width={32} 
                        height={32} 
                        className="object-contain"
                      />
                    ) : (
                      <User2Icon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50" suppressHydrationWarning>
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-zinc-950 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-zinc-950 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signup">
                  <div className="w-28 px-6 py-3 bg-gray-100 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer" suppressHydrationWarning>
                    <div className="justify-start text-zinc-950 text-base font-medium capitalize leading-normal" suppressHydrationWarning>
                      Signup
                    </div>
                  </div>
                </Link>
                <Link href="/login">
                  <div className="w-28 px-6 py-3 bg-zinc-950 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer" suppressHydrationWarning>
                    <div className="justify-start text-white text-base font-medium capitalize leading-normal" suppressHydrationWarning>
                      Login
                    </div>
                  </div>
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile Hamburger Menu Icon */}
      <div className="lg:hidden flex items-center" suppressHydrationWarning>
        <button onClick={toggleMobileMenu} className="focus:outline-none cursor-pointer" suppressHydrationWarning>

          <svg
            className="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center space-y-8 animate-fade-in-down" suppressHydrationWarning>
      
          <button onClick={toggleMobileMenu} className="absolute top-6 right-6 focus:outline-none cursor-pointer" suppressHydrationWarning>
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Mobile Navigation Links */}
          <Link href="/">
            <div onClick={toggleMobileMenu} className="text-black text-2xl font-medium capitalize leading-normal cursor-pointer" suppressHydrationWarning>
              Home
            </div>
          </Link>
          <Link href="/explore">
            <div onClick={toggleMobileMenu} className="text-zinc-500 text-2xl font-normal capitalize leading-normal cursor-pointer" suppressHydrationWarning>
              Explore
            </div>
          </Link>

          {/* Mobile Auth/Profile Section */}
          <div className="flex flex-col items-center gap-4 w-full px-4" suppressHydrationWarning>
            {loading ? (
              <>
                <div className="w-full max-w-xs h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="w-full max-w-xs h-16 bg-zinc-300 rounded-lg animate-pulse"></div>
              </>
            ) : user ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="w-full max-w-xs px-6 py-4 bg-gray-100 rounded-lg flex justify-center items-center cursor-pointer"
                  suppressHydrationWarning
                >
                  <div className="text-zinc-950 text-lg font-medium capitalize leading-normal" suppressHydrationWarning>
                    Profile
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="w-full max-w-xs px-6 py-4 bg-zinc-950 rounded-lg flex justify-center items-center cursor-pointer"
                  suppressHydrationWarning
                >
                  <div className="text-white text-lg font-medium capitalize leading-normal" suppressHydrationWarning>
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <div onClick={toggleMobileMenu} className="w-full max-w-xs px-6 py-4 bg-gray-100 rounded-lg flex justify-center items-center cursor-pointer" suppressHydrationWarning>
                    <div className="text-zinc-950 text-lg font-medium capitalize leading-normal" suppressHydrationWarning>
                      Signup
                    </div>
                  </div>
                </Link>
                <Link href="/login">
                  <div onClick={toggleMobileMenu} className="w-full max-w-xs px-6 py-4 bg-zinc-950 rounded-lg flex justify-center items-center cursor-pointer" suppressHydrationWarning>
                    <div className="text-white text-lg font-medium capitalize leading-normal" suppressHydrationWarning>
                      Login
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;