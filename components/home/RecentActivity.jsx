"use client";

import React, { useState, useEffect } from "react";
import ReviewCard from "../cards/ReviewCard";
import { getRecentReviews } from "@/service/reviewApi";
import Link from "next/link";

const RecentActivity = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        setLoading(true);
        const response = await getRecentReviews({ limit: 6 });
        
        // Transform the API response to match the expected format
        const formattedReviews = response && response.reviews;
        
        setReviews(formattedReviews);
      } catch (err) {
        console.error("Error fetching recent reviews:", err);
        setError("Failed to load recent activity");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentReviews();
  }, []);

  return (
    <div className="w-full p-4 md:p-20">
      <div className="self-stretch flex flex-col justify-start items-start gap-4 md:gap-9">
        {/* Header */}
        <div className="self-stretch flex pb-2 justify-between items-center">
          <div className="text-black text-2xl md:text-3xl lg:text-5xl font-semibold font-['Inter'] capitalize">
            Recent Activity
          </div>
          <div className="text-black text-[16px] md:text-lg font-medium font-['Inter'] leading-tight cursor-pointer">
            <Link href="/explore">
              View All
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="w-full text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="w-full">
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {reviews.map((item, index) => (
                <div key={item.id || index} className="break-inside-avoid mb-6">
                  <ReviewCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
