"use client"
import React, { useState, useEffect } from "react";
import ReviewCard from "../cards/ReviewCard";
import { getArtistDashboardReviews } from "../../service/artistApi";

function Reviews() {
   const user = JSON.parse(localStorage.getItem("user"))
  const artistId = user.id

  const [reviews, setReviews] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getArtistDashboardReviews(artistId);
        console.log("response", response)
        const data = response.reviews || [];
        setData(data);
        const formattedReviews = data.map(review => ({
          user_info: {
            profile_picture: review.client?.profilePhoto?.url || "https://placehold.co/36x36",
            name: review.isAnonymous ? "Anonymous" : review.client?.name || "Unknown User",
            time_ago: new Date(review.createdAt).toLocaleDateString(),
            id: review.client?.id
          },
          post_content: {
            type: "image_review",
            image_urls: review.photoUrls || [],
            artist_name: review.artist?.name || "Unknown Artist",
            rating: review.overallExperience,
            tattoo_style: review.style || "Not specified",
            location: review.artist?.location || "Location not specified",
            review_text: review.comment || ""
          },
          engagement_stats: {
            likes: review.likesCount || 0,
            comments: review.commentsCount || 0,
            shares: 0
          }
        }));
        setReviews(formattedReviews);
      } catch (err) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="w-full text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }
  console.log("reviews", reviews);

  return (
    <div className="w-full max-w-7xl mx-auto p-2">
      <div className="self-stretch flex flex-col justify-start items-start gap-4 md:gap-9">
        {reviews.length === 0 ? (
          <div className="w-full text-center py-8 text-gray-500">
            No reviews found.
          </div>
        ) : (
          <div className="w-full">
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
              {data.map((item, index) => (
                <div key={item.id || index} className="break-inside-avoid mb-6">
                  <ReviewCard item={item} reviewId={item.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
