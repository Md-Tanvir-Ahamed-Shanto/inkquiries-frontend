"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchArtists } from '@/service/artistApi';

export default function Search() {
  const [style, setStyle] = useState('None');
  const [city, setCity] = useState('None');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const ChevronDownIcon = () => (
    <svg
      className="w-5 h-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const SearchIcon = () => (
    <svg
      className="w-6 h-6 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <div className="flex items-center justify-center  font-sans p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl md:rounded-full shadow-lg p-3 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-2">
          
          <div className="relative w-full md:w-xs">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="appearance-none w-full bg-transparent border border-gray-300 md:border-none rounded-full py-3 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="None">Select Style</option>
              <option value="Traditional Style">Traditional Style</option>
              <option value="Modern Style">Modern Style</option>
              <option value="Abstract Style">Abstract Style</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <ChevronDownIcon />
            </div>
          </div>

          {/* City Dropdown */}
          <div className="relative w-full md:w-xs">
            {/* On mobile, this select also has its own border */}
            <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="appearance-none w-full bg-transparent border border-gray-300 md:border-none rounded-full py-3 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="None">Select City</option>
                <option value="Salt Lake City">Salt Lake City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Miami">Miami</option>
              </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <ChevronDownIcon />
            </div>
          </div>
          
          {/* Divider: hidden on mobile, visible on desktop */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          {/* Search Group: Input + Button */}
          {/* This div wraps the search input and button to keep them on the same row */}
          <div className="flex items-center w-full flex-grow border border-gray-300 md:border-none rounded-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('q', searchQuery);
                  if (style && style !== 'None') params.append('style', style);
                  if (city && city !== 'None') params.append('location', city);
                  router.push(`/search?${params.toString()}`);
                }
              }}
              placeholder="Search by artist style or location"
              className="w-full flex-grow bg-transparent py-3 pl-4 pr-2 text-gray-700 focus:outline-none"
            />
            <button 
              onClick={async () => {
                try {
                  setIsSearching(true);
                  
                  // Build search query parameters
                  const params = new URLSearchParams();
                  if (searchQuery) params.append('q', searchQuery);
                  if (style && style !== 'None') params.append('style', style);
                  if (city && city !== 'None') params.append('location', city);
                  
                  // Navigate to search results page
                  router.push(`/search?${params.toString()}`);
                } catch (error) {
                  console.error('Search error:', error);
                } finally {
                  setIsSearching(false);
                }
              }}
              disabled={isSearching}
              className="bg-black text-white rounded-full p-3 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300 ease-in-out flex-shrink-0 disabled:bg-gray-500"
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SearchIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
