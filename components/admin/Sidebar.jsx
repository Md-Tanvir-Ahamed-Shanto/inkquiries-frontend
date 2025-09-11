// components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import LogoutModal from "./LogoutModal";
// We no longer need to import Image from 'next/image' if we use standard img tags.
// import Image from "next/image";

const menuItemsTop = [
  { name: "Overview", icon: "/icon/dashboard-square.svg", href: "/admin/overview" },
  { name: "User Management", icon: "/icon/user-group.svg", href: "/admin/user-management" },
  { name: "Review Management", icon: "/icon/star-square.svg", href: "/admin/review-management" },
  { name: "Promotion", icon: "/icon/promotion.svg", href: "/admin/promotion-management" },
];

const menuItemsBottom = [
  { name: "Report & Support", icon: "/icon/alert-diamond.svg", href: "/admin/report-n-support" },
  { name: "Settings", icon: "/icon/settings.svg", href: "/admin/settings" },
  { name: "Log out", icon: "/icon/logout.svg", href: "/logout", danger: true },
];

function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      // Import dynamically to avoid circular dependencies
      const { logoutAdmin } = await import("@/service/adminApi");
      await logoutAdmin();
      setLogoutModal(false);
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback logout method if API call fails
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLogoutModal(false);
      router.push("/login");
    }
  };

  const renderMenuItem = ({ name, icon, href, danger }) => {
    // const isActive = pathname === href;
    const isActive = pathname.startsWith(href);

    // Handle logout click differently
    if (name === "Log out") {
      return (
        <div
          key={name}
          onClick={() => {
            setLogoutModal(true);
            onClose();
          }}
          className={`w-full pl-6 py-4 rounded-tr-xl rounded-br-xl inline-flex justify-start items-center gap-3.5 cursor-pointer ${
            danger ? "text-red-500 hover:bg-red-100" : "hover:bg-gray-100"
          }`}
        >
          <div className="w-5 h-5 relative flex-shrink-0">
            {/* Switched back to <img> for simplicity and to avoid next/image issues */}
            <img src={icon} alt={name} className="w-full h-full object-contain" />
          </div>
          <span className="text-base capitalize leading-tight font-['Inter'] text-neutral-600 font-medium">
            {name}
          </span>
        </div>
      );
    }

    return (
      <Link href={href} key={name} onClick={onClose}>
        <div
          className={`w-full pl-6 py-4 rounded-tr-xl rounded-br-xl inline-flex justify-start items-center gap-3.5 cursor-pointer ${
            isActive
              ? "bg-zinc-950"
              : danger
              ? "text-red-500 hover:bg-red-100"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="w-5 h-5 relative flex-shrink-0">
            {/* Switched back to <img> for simplicity and to avoid next/image issues */}
            <img src={icon} alt={name} className="w-full h-full object-contain" />
          </div>
          <span
            className={`text-base capitalize leading-tight font-['Inter'] ${
              isActive ? "text-white font-semibold" : "text-neutral-600 font-medium"
            }`}
          >
            {name}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 h-screen w-65 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 font-bold text-xl h-[85px] flex items-center">
          <div className="justify-start">
          <Link href={"/"}>
            <span className="text-black text-3xl font-bold font-['Inter'] capitalize leading-9">
              Ink
            </span>
            <span className="text-zinc-600 text-3xl font-bold font-['Inter'] capitalize leading-9">
              quiries
            </span></Link>
          </div>
        </div>

        <div className="w-64 flex flex-col justify-between h-[calc(100%-85px)] px-0 py-6">
          <div className="flex flex-col gap-3">
            <div className="px-6 text-zinc-500 text-xs font-medium font-['Inter'] capitalize leading-none">
              Menu
            </div>
            <div className="flex flex-col gap-1">
              {menuItemsTop.map(renderMenuItem)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {menuItemsBottom.map(renderMenuItem)}
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)}>
        <LogoutModal 
          onClose={() => setLogoutModal(false)} 
          onConfirm={handleLogout}
        />
      </Modal>
    </>
  );
}

export default Sidebar;