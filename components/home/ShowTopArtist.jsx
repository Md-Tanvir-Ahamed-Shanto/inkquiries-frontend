"use client";

import React, { useState, useEffect } from "react";
import ArtistCard from "../cards/ArtistCard";
import { getTopRankedArtists } from "@/service/artistApi";
import backendUrl from "@/utils/baseUrl";

const ShowTopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = backendUrl

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        const response = await getTopRankedArtists(8);

        // Transform the API response to match the expected format
        const formattedArtists = response.data
          ? response.data.map((artist) => ({
              id: artist.id,
              name: artist.name,
              genre: artist.primaryStyle || "Tattoo Artist",
              location: artist.location || "Unknown",
              rating: artist.averageRating
                ? artist.averageRating.toFixed(1)
                : "0.0",
              promoted: artist.promoted || false,
              image: artist?.profilePhoto
                ? baseUrl + artist.profilePhoto
                : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg",
            }))
          : [];

        setArtists(formattedArtists);
      } catch (err) {
        console.error("Error fetching top artists:", err);
        setError("Failed to load top artists");
        // Fallback to dummy data if API fails
        setArtists([
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <div className="w-full p-4 md:p-20">
      <div className="flex flex-col justify-start items-start gap-4 md:gap-9">
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl md:text-3xl lg:text-5xl font-semibold font-['Inter'] capitalize">
            top ranked artist
          </div>
          {/* <div className="text-black text-[16px] md:text-lg font-medium font-['Inter'] leading-tight cursor-pointer">
            View All
          </div> */}
        </div>

        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="w-full text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTopArtist;
