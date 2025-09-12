"use client";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import React, { useState, useEffect, Suspense } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";
import Reviews from "@/components/artist/Reviews";
import About from "@/components/artist/About";
import Portfolio from "@/components/artist/Portfolio";
import Notification from "@/components/artist/Notification";
import Setting from "@/components/artist/Setting";
import Review from "@/components/common/Review";
import CreatePortfolio from "@/components/common/CreatePortfolio";
import Modal from "@/components/common/Modal";
import { getMyArtistProfile } from "@/service/profileApi";
import StarRating from "@/components/common/StarRating";
import backendUrl from "@/utils/baseUrl";
import Link from "next/link";

// Dashboard content component that uses useSearchParams
const DashboardContent = () => {
  const [user, setUser] = useState(null);
  const [artistId, setArtistId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioModal, setPortfolioModal] = useState(false);
  
  // Get URL query parameters
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  // Set active tab based on URL query parameter or default to "Reviews"
  const [activeTab, setActiveTab] = useState(
    tabParam ? 
      tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase() : 
      "Reviews"
  );

  // Get user from localStorage after component mounts (client-side only)
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.id) {
        setUser(userData);
        setArtistId(userData.id);
        setProfile(userData); // Initial profile data
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Could not load user data. Please log in again.");
    }
  }, []);
console.log("profile data",profile)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!artistId) return; // Don't fetch if artistId is not available
      
      try {
        const data = await getMyArtistProfile(artistId);
        
        // Calculate rating from reviews if reviews exist
        if (data.reviews && data.reviews.length > 0) {
          const totalRating = data.reviews.reduce((sum, review) => sum + review.overallExperience, 0);
          const averageRating = totalRating / data.reviews.length;
          data.rating = (averageRating).toFixed(1); // Convert from 10-point to 5-point scale
          data.reviewCount = data.reviews.length;
        } else {
          data.rating = 0;
          data.reviewCount = 0;
        }
        
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [artistId]);

  const isOwner = user?.role === "artist";

  const tabs = [
    { name: "Reviews", visible: true },
    { name: "About", visible: true },
    { name: "Portfolio", visible: true },
    { name: "Notification", visible: isOwner },
    { name: "Settings", visible: isOwner },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "Reviews":
        return <Reviews />;
      case "About":
        return <About />;
      case "Portfolio":
        return <Portfolio />;
      case "Notification":
        return <Notification />;
      case "Settings":
        return <Setting />;
      default:
        return null;
    }
  };
  console.log("profile",profile)
  // Show loading state if profile is still loading
  if (loading) {
    return (
      <div className="flex p-4 flex-col items-center min-h-screen justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  // Show error state if there was an error
  if (error) {
    return (
      <div className="flex p-4 flex-col items-center min-h-screen justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex p-4 flex-col items-center min-h-screen">
      <div className="w-full max-w-7xl p-4 md:p-8 bg-slate-50 rounded-2xl flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {
            profile?.profilePhoto ? (
              <Image
                src={profile?.profilePhoto ? `${backendUrl}${profile.profilePhoto}` : '/placeholder-image.svg'}
                alt="Profile"
                width={80}
                height={80}
                className="object-cover rounded-full md:w-28 md:h-28"
              />
            ):(
            <div className="md:w-28 md:h-28 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="text-neutral-400 text-lg">{profile?.name?.charAt(0) || '?'}</span>
                </div>
            )
          }
          <div>
            <h1 className="font-semibold text-lg md:text-2xl">
              {profile?.name || 'Loading...'}
            </h1>
            <p className="text-neutral-600 mt-1 text-sm md:text-base">
              {profile?.location || 'Location not set'}
            </p>
            <div className="flex items-center gap-3 mt-2 md:mt-[9px]">
              <p className="font-medium text-neutral-800 border-b leading-[100%] text-sm md:text-base">
                <div onClick={()=> setActiveTab("Reviews")} className="cursor-pointer">Reviews {profile?.reviewCount || 0}</div>
              </p>
              <StarRating rating={profile?.rating || 0} />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center md:items-start mt-4 md:mt-0">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {isOwner && (
              <div
                onClick={() => setPortfolioModal(true)}
                className={`px-4 py-2 rounded-lg flex gap-2.5 bg-black text-white cursor-pointer`}
              >
                <FiEdit3 size={16} />
                <p className="font-medium text-sm">Create Portfolio</p>
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg flex justify-center gap-2.5 ${
                isOwner
                  ? "bg-gray-100"
                  : "bg-[linear-gradient(to_bottom_right,#FFF1C7,#FFCA2A)]"
              }`}
            >
              <div className="relative w-4 h-4 ">
                <Image
                  src="/images/thunder.svg"
                  alt="Profile"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-medium text-sm">Promoted</p>
            </div>
          </div>
          {!isOwner && profile && (
            <div className="mt-6 text-sm md:text-base">
              <div>
                <span className="text-zinc-500">Joined:</span>{" "}
                <span>{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="mt-[6px]">
                <span className="text-zinc-500">Style:</span>{" "}
                <span>{profile.styles?.join(', ') || 'Not specified'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-7xl mt-4 md:mt-[43px] flex items-center gap-2 md:gap-12 border-b border-zinc-200 overflow-x-auto">
        {tabs.map(
          (tab) =>
            tab.visible && (
              <div
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  // Update URL with the selected tab
                  const params = new URLSearchParams(searchParams);
                  params.set("tab", tab.name.toLowerCase());
                  router.push(`?${params.toString()}`);
                }}
                className={`flex-shrink-0 h-[42px] flex items-center cursor-pointer ${
                  activeTab === tab.name
                    ? "border-b-2 border-black text-black font-medium"
                    : "text-neutral-600"
                }`}
              >
                {tab.name}
              </div>
            )
        )}
      </div>
      {renderTabContent()}

      <Modal isOpen={portfolioModal} onClose={() => setPortfolioModal(false)}>
        <CreatePortfolio 
          onClose={() => setPortfolioModal(false)}
          onSuccess={() => {
            // Refresh the portfolio data after successful creation
            if (activeTab === "Portfolio" && profile) {
              // Force a refresh of the portfolio data
              setProfile({...profile});
            }
          }}
        />
      </Modal>
    </div>
  );
};

// Main Page component with Suspense boundary
const Page = () => {
  return (
    <Suspense fallback={<div className="w-full flex justify-center items-center p-4 md:px-28">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
    </div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default Page;