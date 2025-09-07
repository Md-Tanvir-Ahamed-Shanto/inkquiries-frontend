'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { name: 'General Settings', href: '/admin/settings/general' },
  { name: 'Notifications Settings', href: '/admin/settings/notification' },
  { name: 'Website CMS', href: '/admin/settings/webcms' },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(false);

  const currentPage = menuItems.find(item => item.href === pathname);

  return (
    <>
      {/* Mobile Navigation - Dropdown */}
      <div className="md:hidden w-full mb-4 px-4">
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(!activeDropdown)}
            className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 flex justify-between items-center"
          >
            <span className="text-gray-800 text-base font-medium">
              {currentPage?.name || 'Settings'}
            </span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${activeDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium border-b border-gray-100 last:border-b-0 transition-colors ${
                      isActive 
                        ? "bg-zinc-950 text-white" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveDropdown(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Original PC Design - Exactly as before */}
      <div className="relative flex min-h-screen">
        {/* Sidebar - Original Design (Desktop Only) */}
        <aside className="hidden md:block absolute top-0 left-0 w-52 bg-white p-2 rounded-2xl outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            const baseClasses =
              'w-full px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition font-["Inter"] text-base leading-relaxed tracking-tight';
            const activeClasses = 'bg-zinc-950 text-white font-semibold';
            const inactiveClasses = 'bg-white text-gray-500 font-medium hover:bg-neutral-100 cursor-pointer';

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              >
                {item.name}
              </Link>
            );
          })}
        </aside>

        {/* Main content - Original Desktop Layout */}
        <main className="w-full md:ml-[14rem] flex-1 px-4 md:px-0">
          {children}
        </main>
      </div>
    </>
  );
}