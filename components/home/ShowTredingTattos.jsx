"use client";

import React, { useState, useEffect } from "react";
import TattoCard from "../cards/TattoCard";
import { getTrendingTattoos } from "@/service/reviewApi";
import backendUrl from "@/utils/baseUrl";

const ShowTredingTattos = () => {
  const [tattoos, setTattoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data for when API fails
  const fallbackTattoos = [
    {
      id: 'fallback-1',
      imageUrl: 'https://d1kq2dqeox7x40.cloudfront.net/web/guides/covers/fineline.jpg',
      title: 'Fine Line Tattoo'
    },
    {
      id: 'fallback-2', 
      imageUrl: 'https://d1kq2dqeox7x40.cloudfront.net/web/guides/covers/traditional.jpg',
      title: 'Traditional Tattoo'
    },
    {
      id: 'fallback-3',
      imageUrl: 'https://d1kq2dqeox7x40.cloudfront.net/web/guides/covers/realism.jpg', 
      title: 'Realistic Tattoo'
    },
    {
      id: 'fallback-4',
      imageUrl: 'https://d1kq2dqeox7x40.cloudfront.net/web/guides/covers/watercolor.jpg',
      title: 'Watercolor Tattoo'
    }
  ];

  useEffect(() => {
    const fetchTrendingTattoos = async () => {
      try {
        setLoading(true);
        const response = await getTrendingTattoos(8);
        
        // Transform the API response to match the expected format
        const formattedTattoos = response && response.reviews ? response.reviews.map(review => {
          // Get the first photo from the review if available
          const photoUrl = review.photoUrls && review.photoUrls.length > 0 
            ? `${backendUrl}${review.photoUrls[0]}`
            : "https://d1kq2dqeox7x40.cloudfront.net/web/guides/covers/fineline.jpg";
          
          // Use tattoo style as title, or fallback to a generic title
          const title = review.tattooStyle || "Beautiful Tattoo";
          
          return {
            id: review.id,
            imageUrl: photoUrl,
            title: title,
          };
        }) : [];
        
        setTattoos(formattedTattoos);
      } catch (err) {
        console.error("Error fetching trending tattoos:", err);
        setError("Failed to load trending tattoos");
        setTattoos(fallbackTattoos);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrendingTattoos();
  }, []);
  return (
    <div className="w-full p-4 md:p-20">
      <div className="self-stretch flex flex-col justify-start items-start gap-4 md:gap-9">
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-2xl md:text-3xl lg:text-5xl font-semibold font-['Inter'] capitalize">
            Trending tattoos
          </div>
          <div className="text-black text-[16px] md:text-lg font-medium font-['Inter_Tight']  leading-tight cursor-pointer">
            View All
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 w-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tattoos.map((tattoo) => <TattoCard key={tattoo.id} tatto={tattoo} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowTredingTattos;
