"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "../cards/ReviewCard";
import { getRecentReviews, checkBatchUserLikeStatus } from "@/service/reviewApi";
import CategoryTab from "./CategoryTab";

const Explore = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [likeStatusMap, setLikeStatusMap] = useState({});
  
  // Ref for the intersection observer
  const observer = useRef();
  const loadingRef = useRef();

  // Intersection observer callback
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreData) {
        loadMoreReviews();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMoreData]);

  // Batch fetch like statuses for reviews
  const fetchBatchLikeStatus = async (reviewIds) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return {}; // Return empty object if no user logged in
      
      const response = await checkBatchUserLikeStatus(reviewIds);
      return response.likeStatus || {};
    } catch (err) {
      console.error("Error fetching batch like status:", err);
      return {}; // Return empty object on error
    }
  };

  // Initial fetch function
  const fetchReviews = async (page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await getRecentReviews({ 
        limit: 10, // Increased from 6 for infinite scroll
        page 
      });
      
      if (response && response.reviews) {
        const newReviews = response.reviews;
        
        // Batch fetch like statuses for new reviews
        const reviewIds = newReviews.map(review => review.id);
        const batchLikeStatus = await fetchBatchLikeStatus(reviewIds);
        
        if (isLoadMore) {
          // Append new reviews to existing ones
          setReviews(prevReviews => [...prevReviews, ...newReviews]);
          // Merge new like statuses with existing ones
          setLikeStatusMap(prevMap => ({ ...prevMap, ...batchLikeStatus }));
        } else {
          // Replace reviews (initial load)
          setReviews(newReviews);
          // Replace like status map
          setLikeStatusMap(batchLikeStatus);
        }

        // Check if we have more data based on API response
        if (response.meta) {
          const { totalPages, page: currentPageFromApi } = response.meta;
          setHasMoreData(currentPageFromApi < totalPages);
        } else {
          // Fallback: if no meta, check if we got fewer reviews than requested
          setHasMoreData(newReviews.length === 10);
        }
        
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
      if (!isLoadMore) {
        // Only set fallback data on initial load error, not on load more error
        setReviews([]); // You can set fallbackData here if you have it
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more reviews function
  const loadMoreReviews = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      fetchReviews(currentPage + 1, true);
    }
  }, [currentPage, loadingMore, hasMoreData]);

  // Initial data fetch
  useEffect(() => {
    fetchReviews(1, false);
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (loading && reviews.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
        <CategoryTab />
        <div className="lg:px-16 mt-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
        <CategoryTab />
        <div className="lg:px-16 mt-10">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => fetchReviews(1, false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
      <CategoryTab />
      <div className="lg:px-16 mt-10">
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
          {reviews?.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="break-inside-avoid mb-6"
              ref={index === reviews.length - 1 ? lastElementRef : null}
            >
              <ReviewCard 
                item={item} 
                initialLikeStatus={likeStatusMap[item.id]} 
              />
            </div>
          ))}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className="break-inside-avoid mb-6 w-full">
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-600">Loading more reviews...</span>
              </div>
            </div>
          )}
        </div>

        {/* No more data indicator */}
        {!hasMoreData && reviews.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end! No more reviews to load.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;