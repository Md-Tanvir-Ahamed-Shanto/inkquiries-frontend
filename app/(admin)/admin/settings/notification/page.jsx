"use client";
import React, { useState } from 'react';

const NotificationSettings = () => {
  // State for each notification toggle
  const [notifications, setNotifications] = useState({
    newUserSignUp: true,
    newReviewPost: true,
    newReports: true,
    activityAlerts: true
  });

  // Toggle handler
  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <h2 className="text-neutral-800 text-lg md:text-xl font-semibold font-['Inter'] leading-6 md:leading-7">
        Notifications Settings
      </h2>
      
      {/* Divider */}
      <div className="w-full h-px bg-zinc-200"></div>

      {/* Notification Toggles */}
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-neutral-800 text-sm md:text-base font-semibold">
          Enable Notifications
        </h3>

        {/* New User Sign-Up Toggle */}
        <div 
          className="w-full h-12 md:h-14 px-3 md:px-4 py-2 rounded-lg border border-zinc-200 flex justify-between items-center cursor-pointer"
          onClick={() => handleToggle('newUserSignUp')}
        >
          <span className="text-neutral-800 text-sm md:text-base font-normal">
            New User Sign-Up
          </span>
          <div className="w-8 h-8 flex items-center justify-center">
            <div 
              className={`w-7 h-4 px-0.5 flex items-center rounded-full transition-colors ${notifications.newUserSignUp ? 'bg-zinc-950 justify-end' : 'bg-zinc-200 justify-start'}`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* New Review Post Toggle */}
        <div 
          className="w-full h-12 md:h-14 px-3 md:px-4 py-2 rounded-lg border border-zinc-200 flex justify-between items-center cursor-pointer"
          onClick={() => handleToggle('newReviewPost')}
        >
          <span className="text-neutral-800 text-sm md:text-base font-normal">
            New Review Post
          </span>
          <div className="w-8 h-8 flex items-center justify-center">
            <div 
              className={`w-7 h-4 px-0.5 flex items-center rounded-full transition-colors ${notifications.newReviewPost ? 'bg-zinc-950 justify-end' : 'bg-zinc-200 justify-start'}`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* New Reports Toggle */}
        <div 
          className="w-full h-12 md:h-14 px-3 md:px-4 py-2 rounded-lg border border-zinc-200 flex justify-between items-center cursor-pointer"
          onClick={() => handleToggle('newReports')}
        >
          <span className="text-neutral-800 text-sm md:text-base font-normal">
            New Reports
          </span>
          <div className="w-8 h-8 flex items-center justify-center">
            <div 
              className={`w-7 h-4 px-0.5 flex items-center rounded-full transition-colors ${notifications.newReports ? 'bg-zinc-950 justify-end' : 'bg-zinc-200 justify-start'}`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Activity Alerts Toggle */}
        <div 
          className="w-full h-12 md:h-14 px-3 md:px-4 py-2 rounded-lg border border-zinc-200 flex justify-between items-center cursor-pointer"
          onClick={() => handleToggle('activityAlerts')}
        >
          <span className="text-neutral-800 text-sm md:text-base font-normal">
            Activity Alerts
          </span>
          <div className="w-8 h-8 flex items-center justify-center">
            <div 
              className={`w-7 h-4 px-0.5 flex items-center rounded-full transition-colors ${notifications.activityAlerts ? 'bg-zinc-950 justify-end' : 'bg-zinc-200 justify-start'}`}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;