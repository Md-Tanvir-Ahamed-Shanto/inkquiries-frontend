"use client";
import ReviewCard from "@/components/cards/ReviewCard";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArtistProfile } from "@/service/artistApi";
import { getArtistReviews } from "@/service/reviewApi";
import { getArtistPortfolio } from "@/service/portfolioApi";
import StarRating from "@/components/common/StarRating";
import Image from "next/image";
import { formatDate } from "@/utils/formateDate";
import CardPortfolio from "@/components/common/CardPortfolio";
import PortfolioDetails from "@/components/artist/PortfolioDetails";
import backendUrl from "@/utils/baseUrl";
import ArtistAbout from "@/components/artist/ArtistAbout";

const ArtistProfileDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [artistProfile, setArtistProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    reviewCount: 0,
    rating: 0,
  });
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [user, setUser] = useState(null);

  const baseUrl = backendUrl;

  const fetchArtistProfile = async () => {
    try {
      setLoading(true);
      const response = await getArtistProfile(id);
      setArtistProfile(response);
    } catch (err) {
      console.error("Error fetching artist profile:", err);
      setError("Failed to load artist profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getArtistReviews(id);
      setReviews(response.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await getArtistPortfolio(id);
      setPortfolio(response);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArtistProfile();
      fetchReviews();
      fetchPortfolio();
    }
    
    // Get user from localStorage
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.overallExperience, 0);
      const averageRating = totalRating / reviews.length;
      setStatistics({
        reviewCount: reviews.length,
        rating: (averageRating).toFixed(1),
      });
    } else {
      setStatistics({
        reviewCount: 0,
        rating: 0,
      });
    }
  }, [reviews]);

  // Loading state
  if (loading && !artistProfile.name && reviews.length === 0) {
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
              fetchArtistProfile();
              fetchReviews();
            }
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }


  return (
    <div className="w-full flex flex-col p-4 md:px-28">
     <div className="w-full p-3 sm:p-4 md:p-8 bg-slate-50 rounded-xl sm:rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
  {/* Main Profile Section */}
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto">
    {/* Profile Image */}
    <div className="flex-shrink-0">
      {artistProfile?.profilePhoto ? (
        <Image
          src={`${baseUrl}${artistProfile.profilePhoto}`}
          alt="Profile"
          width={64}
          height={64}
          className="object-cover rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28"
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
  <span className="text-neutral-800 text-sm sm:text-base md:text-3xl font-medium">
    {artistProfile?.name?.trim()
      ? artistProfile.name.trim().charAt(0).toUpperCase()
      : "?"}
  </span>
</div>

      )}
    </div>
    
    {/* Profile Info */}
    <div className="text-center sm:text-left flex-grow min-w-0">
      <h1 className="font-semibold text-lg sm:text-xl md:text-2xl text-neutral-900 truncate">
        {artistProfile?.name || "Loading..."}
      </h1>
      <p className="text-neutral-600 mt-1 text-sm sm:text-base truncate">
        {artistProfile?.location || "Location not set"}
      </p>
      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 md:mt-[9px] flex-wrap">
        <p className="font-medium text-neutral-800 border-b leading-[100%] text-xs sm:text-sm md:text-base whitespace-nowrap">
          Reviews {statistics.reviewCount || 0}
        </p>
        <div className="flex-shrink-0">
          <StarRating
            rating={statistics?.rating || 0}
          />
        </div>
      </div>
    </div>
  </div>
  
  {/* Join Date Section */}
  <div className="w-full sm:w-auto lg:w-52 flex flex-col justify-start items-center sm:items-start lg:items-end gap-2 text-center sm:text-left lg:text-right mt-2 lg:mt-0">
    <div className="text-neutral-600 text-xs sm:text-sm md:text-base font-normal leading-normal">
      <span className="hidden sm:inline">Joined: </span>
      <span className="sm:hidden">Member since </span>
      {artistProfile?.createdAt
        ? formatDate(artistProfile.createdAt)
        : "N/A"}
    </div>
  </div>
</div>

      {/* Tab Navigation */}
      <div className="self-stretch inline-flex py-2 md:py-5 flex-col justify-start items-start gap-3">
        <div className="inline-flex justify-start items-center gap-8">
          <button
            onClick={() => {
              setActiveTab('reviews');
              setSelectedPortfolioItem(null);
            }}
            className={`text-sm md:text-xl font-semibold capitalize leading-[48px] transition-colors ${
              activeTab === 'reviews' 
                ? 'text-zinc-950 border-b-2 border-zinc-950' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => {
              setActiveTab('portfolio');
              setSelectedPortfolioItem(null);
            }}
            className={`text-sm md:text-xl font-semibold capitalize leading-[48px] transition-colors ${
              activeTab === 'portfolio' 
                ? 'text-zinc-950 border-b-2 border-zinc-950' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Portfolio
          </button>
           <button
            onClick={() => {
              setActiveTab('about');
              setSelectedPortfolioItem(null);
            }}
            className={`text-sm md:text-xl font-semibold capitalize leading-[48px] transition-colors ${
              activeTab === 'about' 
                ? 'text-zinc-950 border-b-2 border-zinc-950' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            About
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {selectedPortfolioItem !== null ? (
        <PortfolioDetails
          item={portfolio[selectedPortfolioItem]}
          onBack={() => setSelectedPortfolioItem(null)}
          isOwner={false}
          user={user}
        />
      ) : (
        <div className="">
          {activeTab === 'reviews' && (
            <>
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
            </>
          )}
          
          {activeTab === 'portfolio' && (
            <>
              {portfolio && portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {portfolio.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      onClick={() => setSelectedPortfolioItem(index)}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <CardPortfolio
                        title={item.title}
                        style={item.style}
                        imageUrl={item.imageUrls}
                        description={item.description}
                        likesCount={item.likesCount || 0}
                        commentsCount={item.commentsCount || 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No portfolio items found for this artist.</p>
                </div>
              )}
            </>
          )}
          {activeTab === 'about' && (
            <>
             <ArtistAbout artistId={id} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistProfileDetails;
