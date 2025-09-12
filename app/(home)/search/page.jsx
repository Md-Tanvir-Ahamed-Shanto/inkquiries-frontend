"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchArtists } from "@/service/artistApi";
import ArtistCard from "@/components/cards/ArtistCard";
import Hero from "@/components/common/Hero";
import backendUrl from "@/utils/baseUrl";

// Search content component that uses useSearchParams
const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const style = searchParams.get("style") || "";
  const location = searchParams.get("location") || "";


  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = backendUrl;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // If no search parameters at all, return empty results
        if (!query && !style && !location) {
          setArtists([]);
          setLoading(false);
          return;
        }
        
        console.log('Search parameters:', { query, style, location });

        try {
            // Pass separate parameters for query, location, and style
            const response = await searchArtists(
              query, 
              location && location !== 'None' ? location : null, 
              style && style !== 'None' ? style : null
            );

            // Format the artists data
            console.log('API Response:', response); // Debug log
            
            // The backend returns the array directly without wrapping it in a data property
            let artistsData = response;
            
            console.log('Artists data to format:', artistsData);
            
            if (artistsData && artistsData.length > 0) {
            const formattedArtists = artistsData.map((artist) => {
                console.log('Processing artist:', artist);
                return {
                  id: artist.id || `artist-${Math.random().toString(36).substr(2, 9)}`,
                  name: artist.name || artist.username || "Unknown Artist",
                  genre: artist.specialties?.[0] || (style !== "None" ? style : "Tattoo Artist"),
                  location: artist.location || (location !== "None" ? location : "Unknown Location"),
                  rating: artist.averageRating
                    ? artist.averageRating.toFixed(1)
                    : "0.0",
                  promoted: artist.promoted || false,
                  image: artist.profilePhoto
                    ? baseUrl + artist.profilePhoto
                    : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg",
                };
              });

            console.log('Formatted artists:', formattedArtists);
            setArtists(formattedArtists);
            setError(null);
          } else {
            throw new Error('No artists found in API response');
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          
          // Filter mock artists based on search query if present
          let filteredMockArtists = mockArtists;
          
          if (searchQuery) {
            filteredMockArtists = mockArtists.filter(
              (artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artist.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          // Additional filtering for style and location if they're not 'None'
          if (style && style !== 'None') {
            filteredMockArtists = filteredMockArtists.filter(
              (artist) => artist.genre.toLowerCase() === style.toLowerCase()
            );
          }
          
          if (location && location !== 'None') {
            filteredMockArtists = filteredMockArtists.filter(
              (artist) => artist.location.toLowerCase() === location.toLowerCase()
            );
          }

          console.log('Using mock data:', filteredMockArtists);
          setArtists(filteredMockArtists);
          setError("Something went wrong try again!");
        }
      } catch (err) {
        console.error("Error searching artists:", err);
        setError("Failed to load search results");
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, style, location]);

  // Construct search title
  const searchTitle = query || (style && style !== "None") || (location && location !== "None") 
    ? `Search Results for ${[query, (style && style !== "None") ? style : "", (location && location !== "None") ? location : ""].filter(Boolean).join(" ")}` 
    : "Search Results";

  return (
    <div className="flex flex-col p-4">
      <Hero title={searchTitle} />

      <div className="w-full p-4 md:p-20">
        <div className="flex flex-col justify-start items-start gap-4 md:gap-9">
          <div className="self-stretch flex justify-between items-center">
            <div className="text-black text-xl md:text-3xl lg:text-5xl font-semibold font-['Inter'] capitalize">
              {artists.length > 0 ? `Found ${artists.length} Artists` : "No Artists Found"}
            </div>
          </div>

          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="w-full text-center py-10 text-red-500">{error}</div>
          ) : artists.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-20 text-gray-500">
              No artists found matching your search criteria. Try different keywords or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main page component wrapped in Suspense
const SearchPage = () => {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;