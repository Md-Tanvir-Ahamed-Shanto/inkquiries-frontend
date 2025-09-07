"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/service/authApi";
import backendUrl from "@/utils/baseUrl";

function HeaderAdmin({ onMenuClick }) {
  const [admin, setAdmin] = useState(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
      setAdmin(user);
    }
  }, []);
  return (
    <div className="fixed top-0 left-0 lg:left-65 right-0 h-16 sm:h-21 px-3 sm:px-6 py-3 sm:py-5 bg-white flex justify-between items-center z-30 border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Search Bar */}
      <div className="hidden sm:flex w-48 lg:w-72 h-8 sm:h-10 px-3 py-2 rounded-3xl outline-1 outline-offset-[-1px] outline-gray-100 items-center gap-3">
        {/* Search Icon */}
        <div className="w-4 sm:w-5 h-4 sm:h-5 relative">
          <img src="/icon/search.svg" alt="Search Icon" className="w-4 sm:w-5 h-4 sm:h-5" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search here..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-3">

        {/* Bell Icon */}
        <img src="/icon/bell.svg" className="w-5 h-5 sm:w-6 sm:h-6" />

        {/* Profile */}
        <div className="p-1 sm:p-2 rounded-3xl outline-1 outline-offset-[-1px] outline-gray-100 flex items-center gap-1 sm:gap-2">
          <img
            src={admin?.profilePhoto ? `${backendUrl}${admin?.profilePhoto}` : "/images/profile.png"}
            alt="User Profile"
            width={20}
            height={20}
            className="w-6 h-6 rounded-full outline-1 outline-gray-100"
          />
          <div className="hidden sm:flex flex-col justify-center items-start">
            <p className="text-neutral-600 text-sm sm:text-base font-normal capitalize leading-tight">
              {admin?.name || 'Admin'}
            </p>
          </div>
          <img src="/icon/arrow-down.svg" className="cursor-pointer w-3 sm:w-4" />
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
