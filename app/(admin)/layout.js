"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { getCurrentUser, checkUserRole } from "@/service/authApi";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // New state to check if client has mounted
  const router = useRouter();

  useEffect(() => {
    // Set state to true to indicate the component has mounted on the client
    setIsClient(true);
    
    const user = getCurrentUser();
    const role = checkUserRole();
    
    if (!user || role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  // If not on the client, render a fallback (e.g., a blank div or a loading state)
  if (!isClient) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        {/* You can add a loading spinner or message here */}
      </div>
    );
  }

  // Render the full component only after it has mounted on the client
  return (
    <div className="w-screen h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderAdmin onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-6 mt-16 sm:mt-21">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;