"use client";
import ReviewCard from "@/components/cards/ReviewCard";
import { getClientProfile, getClientReviews } from "@/service/clientApi";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDate } from "@/utils/formateDate";
import backendUrl from "@/utils/baseUrl";

const ClientProfileDetails = () => {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [clientProfile, setClientProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  
  const baseUrl = backendUrl

  const fetchClientProfile = async () => {
    try {
      setLoading(true);
      const response = await getClientProfile(id );
      setClientProfile(response);
    } catch (err) {
      console.error("Error fetching client profile:", err);
      setError("Failed to load client profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getClientReviews(id);
      setReviews(response.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClientProfile();
      fetchReviews();
    }
  }, []); // Add id as dependency

  // Loading state
  if (loading && !clientProfile.name && reviews.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex flex-col justify-center items-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            if (id) {
              fetchClientProfile();
              fetchReviews();
            }
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 md:px-28">
      <div className="w-full p-4 md:p-8 bg-slate-50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="w-full md:w-96 flex flex-col sm:flex-row justify-start items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
          <img
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full outline outline-gray-100"
            src={`${baseUrl}${clientProfile?.profilePhoto || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg'}`}
            alt="Profile Picture"
          />
          <div className="inline-flex flex-col justify-start items-center sm:items-start gap-1">
            <div className="self-stretch text-zinc-950 text-xl sm:text-2xl font-semibold font-['Inter'] capitalize leading-8 sm:leading-9">
              {clientProfile?.name || 'Loading...'}
            </div>
            <div className="self-stretch flex flex-col justify-start items-center sm:items-start gap-0.5">
              <div className="self-stretch text-neutral-600 text-sm sm:text-base font-normal capitalize leading-normal">
                {clientProfile?.location || 'Location not specified'} 
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-52 inline-flex flex-col justify-start items-center md:items-start gap-2 text-center md:text-left">
          <div className="self-stretch text-neutral-600 text-sm sm:text-base font-normal capitalize leading-normal">
            Joined: {clientProfile?.createdAt ?  formatDate(clientProfile.createdAt): 'N/A'}
          </div>
          <div className="self-stretch text-neutral-600 text-sm sm:text-base font-normal capitalize leading-normal">
            Review: {reviews?.length || 0}
          </div>
        </div>
      </div>
      
      <div className="self-stretch inline-flex py-2 md:py-5 flex-col justify-start items-start gap-3">
        <div className="inline-flex justify-start items-center gap-12">
          <div className="justify-start text-zinc-950 text-3xl font-semibold capitalize leading-[48px]">
            Reviews
          </div>
        </div>
      </div>
      
      <div className="">
        {reviews && reviews.length > 0 ? (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
            {reviews.map((item, index) => (
              <div key={item.id || index} className="break-inside-avoid mb-6">
                <ReviewCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No reviews found for this profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfileDetails;