"use client";

import AdminAnalytics from "@/components/cards/AdminAnalytics";
import { getDashboardOverview } from "@/service/adminApi";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/service/notificationApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [dashboardData, setDashboardData] = useState({
    clientCount: 0,
    artistCount: 0,
    reviewCount: 0,
    adminCount: 0,
    averageRating: 0,
    reviewGrowthRate: 0,
    recentActivities: []
  });
  const [notifications, setNotifications] = useState([]);
  const [combinedActivities, setCombinedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardOverview();
        console.log("data come api", data);
        setDashboardData({
          clientCount: data?.stats?.clientsCount || 0,
          artistCount: data?.stats?.artistsCount || 0,
          reviewCount: data?.stats?.reviewsCount || 0,
          adminCount: data?.stats?.adminCount || 0,
          averageRating: data?.stats?.averageRating || 0,
          reviewGrowthRate: data?.stats?.reviewGrowthRate || 0,
          recentActivities: data?.recentActivities || [],
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await getUserNotifications();
        setNotifications(response.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchDashboardData();
    fetchNotifications();

    // Set up interval to check for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Combine admin logs and notifications
  useEffect(() => {
    // Format admin logs
    const formattedLogs = dashboardData.recentActivities.map(activity => ({
      id: activity.id || `log-${Math.random()}`,
      message: activity.message || activity.action || 'Admin activity',
      time: activity.time || (activity.createdAt ? new Date(activity.createdAt).toLocaleString() : new Date().toLocaleString()),
      isNotification: false
    }));
    
    // Format notifications
    const formattedNotifications = notifications
      .filter(notification => notification.userType === 'admin')
      .map(notification => ({
        id: notification.id,
        message: notification.message || notification.title,
        time: new Date(notification.createdAt).toLocaleString(),
        isNotification: true,
        read: notification.read,
        actionLink: notification.actionLink
      }));
    
    // Combine and sort by time (newest first)
    const combined = [...formattedLogs, ...formattedNotifications].sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateB - dateA;
    });
    
    setCombinedActivities(combined);
  }, [dashboardData.recentActivities, notifications]);

  // Format growth rate for display
  const formatGrowthRate = (rate) => {
    if (rate > 0) return { value: `+${rate?.toFixed(1) || 0}%`, icon: "/icon/increase.svg" };
    if (rate < 0) return { value: `${rate?.toFixed(1) || 0}%`, icon: "/icon/decrease.svg" };
    return { value: "0%", icon: "/icon/neutral.svg" };
  };

  const growthRate = formatGrowthRate(dashboardData.reviewGrowthRate);

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            <AdminAnalytics
              title={"Total Users"}
              value={dashboardData.clientCount}
              icon={"/icon/user.svg"}
              growthRateIcon={"/icon/increase.svg"}
              growthRate={"+"}
            />
            <AdminAnalytics
              title={"Total Artists"}
              value={dashboardData.artistCount}
              icon={"/icon/user.svg"}
              growthRateIcon={"/icon/increase.svg"}
              growthRate={"+"}
            />
            <AdminAnalytics
              title={"Total Reviews"}
              value={dashboardData.reviewCount}
              icon={"/icon/user-group.svg"}
             growthRateIcon={"/icon/increase.svg"}
              growthRate={growthRate.value}
            />
            <AdminAnalytics
              title={"Average Rating"}
              value={dashboardData.averageRating?.toFixed(1)}
              icon={"/icon/star.png"}
              growthRateIcon={"/icon/increase.svg"}
              growthRate={""}
            />
          </div>
          <div className="mt-6 sm:mt-[33px]">
            <div className="w-full h-64 sm:h-80 p-4 sm:p-6 bg-white rounded-2xl outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col">
              {/* Header */}
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-800 text-lg sm:text-xl font-semibold font-['Inter'] leading-relaxed tracking-tight">
                    Recent Activity
                  </h2>
                  {notifications.filter(n => !n.read && n.userType === 'admin').length > 0 && (
                    <button 
                      onClick={async () => {
                        try {
                          await markAllNotificationsAsRead();
                          // Update local state
                          setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
                        } catch (error) {
                          console.error("Failed to mark all notifications as read:", error);
                        }
                      }}
                      className="text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="h-px bg-violet-300 rounded-full mt-2" />
              </div>

              {/* Activity List */}
              <div className="overflow-y-auto flex-1 mt-3">
                {combinedActivities && combinedActivities.length > 0 ? (
                  combinedActivities.map((activity, index) => (
                    <div
                      key={activity.id || index}
                      className={`py-3 ${
                        index !== combinedActivities.length - 1 ? "border-b border-gray-100" : ""
                      } ${activity.isNotification && !activity.read ? "bg-gray-50" : ""} ${activity.isNotification ? "cursor-pointer hover:bg-gray-50" : ""}`}
                      onClick={() => {
                        if (activity.isNotification) {
                          // Mark notification as read if it's not already read
                          if (!activity.read) {
                            markNotificationAsRead(activity.id)
                              .then(() => {
                                // Update local state
                                setNotifications(prev => 
                                  prev.map(n => n.id === activity.id ? { ...n, read: true } : n)
                                );
                              })
                              .catch(err => console.error("Failed to mark notification as read:", err));
                          }
                          
                          // Navigate to action link if available
                          if (activity.actionLink) {
                            router.push(activity.actionLink);
                          }
                        }
                      }}
                    >
                      <div className="flex items-start">
                        {activity.isNotification && (
                          <div className="mr-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${!activity.read ? "bg-gray-500" : "bg-gray-300"}`}></div>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm sm:text-base font-medium font-['Inter'] leading-relaxed tracking-tight">
                            {activity.message}
                          </p>
                          <span className="text-zinc-500 text-xs font-normal font-['Inter'] leading-tight tracking-tight">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No recent activities
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
