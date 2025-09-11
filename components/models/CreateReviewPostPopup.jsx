import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronDown,
  Calendar,
  Upload,
  Star,
  ChevronUp,
  Search,
  User,
} from "lucide-react";
import { toast } from "sonner";
import backendUrl from "@/utils/baseUrl";
import CreateArtistPopup from "./CreateArtistPopup";

export default function CreateReviewPostPopup({ onClose, onSuccess }) {
  const [rating, setRating] = useState(0); // This will hold the overall calculated/selected rating
  const [showTattooStyleDropdown, setShowTattooStyleDropdown] = useState(false);
  const [showDetailedRating, setShowDetailedRating] = useState(false);
  const [detailedRatings, setDetailedRatings] = useState({
    bedsideManner: 0,
    accommodation: 0,
    price: 0,
    heavyHandedness: 0,
    tattooQuality: 0,
    artworkQuality: 0,
  });
  const [formData, setFormData] = useState({
    tattooStyle: "",
    location: "",
    artDate: "",
    artistMention: "",
    artistSocial: "",
    review: "",
  });
  const [artistSearchQuery, setArtistSearchQuery] = useState("");
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [showArtistResults, setShowArtistResults] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); // New state for exit animation
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [showCreateArtistPopup, setShowCreateArtistPopup] = useState(false); // State for showing the create artist popup

  const ratingOptions = [
    { value: 1, text: "Very Poor" },
    { value: 2, text: "Poor" },
    { value: 3, text: "Fair" },
    { value: 4, text: "Fair" },
    { value: 5, text: "Average" },
    { value: 6, text: "Above Average" },
    { value: 7, text: "Good" },
    { value: 8, text: "Very Good" },
    { value: 9, text: "Excellent" },
    { value: 10, text: "Outstanding" },
  ];

  const tattooStyles = [
    "Traditional",
    "Neo-Traditional",
    "Realism",
    "Blackwork",
    "Geometric",
    "Watercolor",
    "Japanese",
    "Tribal",
    "Dotwork",
    "Script",
    "Illustrative",
    "Ignorant",
    "Fineline",
    "Chicano",
    "Biomechanical",
    "Abstract",
  ];

  const baseUrl = backendUrl

  // Effect to calculate overall rating from detailed ratings
  useEffect(() => {
    if (showDetailedRating) {
      // Only calculate when detailed rating section is open
      const validDetailedRatings = Object.values(detailedRatings).filter(
        (val) => val > 0
      );
      if (validDetailedRatings.length > 0) {
        const totalRating = validDetailedRatings.reduce(
          (sum, val) => sum + val,
          0
        );
        const avgRating =
          Math.round((totalRating / validDetailedRatings.length) * 10) / 10;
        setRating(avgRating);
      } else {
        setRating(0); // If detailed ratings are open but no values selected, overall is 0
      }
    }
    // IMPORTANT: When showDetailedRating becomes false, we DO NOT reset `rating`.
    // It should retain its last calculated value.
  }, [detailedRatings, showDetailedRating]);

  // Handle closing with animation
  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false); // Reset animation state after closing
    }, 300); // Match this duration with your exit animation duration
  }, [onClose]);

  const updateDetailedRating = useCallback((category, value) => {
    setDetailedRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  }, []);

  const getRatingColor = useCallback((value) => {
    if (value <= 3) return "bg-red-500";
    if (value <= 6) return "bg-yellow-400";
    return "bg-green-500";
  }, []);

  const getRatingText = useCallback(
    (ratingValue) => {
      const option = ratingOptions.find(
        (opt) => opt.value === Math.round(ratingValue)
      );
      return option ? option.text : "Not Rated";
    },
    [ratingOptions]
  );

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (imageFiles.length + files.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If changing the artist mention field, trigger search
    if (name === "artistMention") {
      setArtistSearchQuery(value);
      handleArtistSearch(value);
    }
  };

  // Handle artist search with debounce
  const handleArtistSearch = (query) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query || query.length < 2) {
      setArtistSearchResults([]);
      setShowArtistResults(false);
      return;
    }

    setIsSearching(true);
    setShowArtistResults(true);

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Import the searchArtists function
        const { searchArtists } = await import("@/service/artistApi");
        const results = await searchArtists(query);
        setArtistSearchResults(results || []);
      } catch (error) {
        console.error("Error searching artists:", error);
        toast.error("Failed to search artists");
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  };

  // Handle artist selection
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    setFormData((prev) => ({
      ...prev,
      artistMention: artist.id, // Store the artist ID
    }));
    setArtistSearchQuery(artist.name || artist.user?.name || ""); // Display the artist name
    setShowArtistResults(false);
  };

  const handleTattooStyleSelect = (style) => {
    setFormData((prev) => ({ ...prev, tattooStyle: style }));
    setShowTattooStyleDropdown(false);
  };

  // Handle API submission
  const handleApiSubmission = async (data, photoFiles) => {
    try {
      // Import the createReview function from clientApi
      const { createReview } = await import("@/service/clientApi");

      // Prepare the data for submission
      const artistId = data.artistMention; // This should be the artist ID from selectedArtist

      // Create a clean submission object with required fields
      const reviewSubmission = {
        overallRating: data.overallRating,
        detailedRatings: data.detailedRatings,
        tattooStyle: data.tattooStyle,
        location: data.location,
        artDate: data.artDate,
        review: data.review,
        artistSocial: data.artistSocial || null,
      };

      // Make the API call to create the review with photos in a single request
      const response = await createReview(artistId, reviewSubmission, photoFiles);

      return {
        success: true,
        message: "Review and photos posted successfully!",
        data: response,
      };
    } catch (error) {
      console.error("Error submitting review:", error);
      return {
        success: false,
        message: error.message || "Failed to post review",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button immediately

    // Validate if rating is provided, especially if detailed ratings were opened
    if (rating === 0 && showDetailedRating) {
      toast.error(
        "Please provide detailed ratings or select an overall rating."
      );
      setIsSubmitting(false);
      return;
    }
    // If detailed ratings were not opened, but overall rating is still 0
    if (rating === 0 && !showDetailedRating) {
      toast.error("Please provide an overall rating.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.tattooStyle) {
      toast.error("Please select a Tattoo Style.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.location) {
      toast.error("Please enter a Location.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.artDate) {
      toast.error("Please enter the Art Date.");
      setIsSubmitting(false);
      return;
    }
    if (formData.review.length < 50) {
      toast.error("Please write your review (minimum 50 characters).");
      setIsSubmitting(false);
      return;
    }

    if (!selectedArtist || !formData.artistMention) {
      toast.error("Please select an artist.");
      setIsSubmitting(false);
      return;
    }
    
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one photo.");
      setIsSubmitting(false);
      return;
    }

    const postData = {
      overallRating: rating,
      detailedRatings: detailedRatings, // Always send detailed ratings
      ...formData,
    };

    try {
      // Submit review data and photos together
      const response = await handleApiSubmission(postData, imageFiles);

      if (response.success) {
        toast.success(response.message);

        // Call onSuccess with the new review data if available
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          onSuccess();
          handleClose(); // Use the animated close handler if no onSuccess provided
        }
      } else {
        toast.error(
          response.message || "Failed to post review. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  // Handle successful artist creation
  const handleArtistCreated = (artistData) => {
    // Set the selected artist to the newly created one
    setSelectedArtist(artistData);
    setFormData((prev) => ({
      ...prev,
      artistMention: artistData.id, // Store the artist ID
    }));
    setArtistSearchQuery(artistData.name || ""); // Display the artist name
    setShowArtistResults(false);
    toast.success("Artist profile created and selected!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <style>
        {`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-scaleOut {
          animation: scaleOut 0.3s ease-in forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDownFaster {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-slideDownFaster {
          animation: slideDownFaster 0.2s ease-out forwards;
        }
        `}
      </style>
      <div
        className={`w-full max-w-md md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto relative
           transform transition-all duration-300 ease-out
           ${isAnimatingOut ? "animate-scaleOut" : "animate-scaleIn"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
          <h2 className="text-gray-800 text-xl sm:text-2xl font-semibold font-['Inter'] leading-tight">
            Create Review Post
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close review post popup"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-3">
            {/* Overall Rating Section */}
            <div className="flex flex-col relative">
              <div
                className="h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out
                           hover:border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
                onClick={() => setShowDetailedRating(!showDetailedRating)}
                aria-haspopup="listbox"
                aria-expanded={showDetailedRating}
                aria-controls="rating-options"
                tabIndex="0"
                role="button"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Display logic for overall rating */}
                  {rating > 0 ? ( // Display stars and text if rating is greater than 0
                    <>
                      {/* Star rendering using Lucide Star icon with half-star logic */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Star
                            key={starValue}
                            className={`w-5 h-5 ${
                              rating >= starValue * 2
                                ? "text-orange-500 fill-orange-500"
                                : rating >= starValue * 2 - 1 &&
                                  rating < starValue * 2
                                ? "text-orange-500 fill-orange-500/50"
                                : "text-zinc-300 fill-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-neutral-700 text-base sm:text-lg font-medium">
                        {rating.toFixed(1)} ({getRatingText(rating)})
                      </div>
                    </>
                  ) : (
                    // Otherwise, show the "Select Overall Rating" prompt
                    <div className="text-zinc-500 text-base sm:text-lg font-normal">
                      Select Overall Rating
                    </div>
                  )}
                </div>
                {showDetailedRating ? (
                  <ChevronUp className="w-5 h-5 text-slate-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-700" />
                )}
              </div>

              {/* Detailed Rating Panel */}
              {showDetailedRating && (
                <div className="mt-3 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-slate-50 transition-all duration-300 ease-in-out origin-top animate-slideDown">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6 border-b pb-4 border-gray-100">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-zinc-950 text-base font-medium font-['Inter'] capitalize">
                        Overall
                      </div>
                      <div
                        className={`w-16 h-16 p-2 ${getRatingColor(
                          rating
                        )} rounded-full flex justify-center items-center shadow-md`}
                      >
                        <div className="text-white text-3xl font-black font-['Inter'] capitalize">
                          {rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-zinc-950 text-lg sm:text-xl font-semibold font-['Inter'] capitalize mt-2 sm:mt-0">
                      Service Rating - Overall: {rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="pl-0 sm:pl-20 flex flex-col gap-5 sm:gap-6">
                    {Object.entries(detailedRatings).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4"
                      >
                        <div className="text-zinc-950 text-sm sm:text-base font-semibold font-['Inter'] capitalize min-w-[120px]">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </div>
                        <div className="flex items-center gap-0.5 flex-wrap">
                          {[...Array(10)].map((_, i) => (
                            <button
                              type="button"
                              key={i}
                              className={`w-7 h-5 cursor-pointer ${
                                i < value
                                  ? getRatingColor(value)
                                  : "bg-zinc-200"
                              }
                                           ${i === 0 ? "rounded-l-lg" : ""}
                                           ${i === 9 ? "rounded-r-lg" : ""}
                                           hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-500`}
                              onClick={() => updateDetailedRating(key, i + 1)}
                              role="radio"
                              aria-checked={i < value}
                              aria-label={`${key
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()
                                .replace(/^\w/, (c) =>
                                  c.toUpperCase()
                                )} rating ${i + 1} out of 10`}
                              tabIndex="0"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tattoo Style Dropdown */}
            <div className="relative">
              <div
                className="h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out
                           hover:border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
                onClick={() =>
                  setShowTattooStyleDropdown(!showTattooStyleDropdown)
                }
                aria-haspopup="listbox"
                aria-expanded={showTattooStyleDropdown}
                aria-controls="tattoo-style-options"
                tabIndex="0"
                role="button"
              >
                <div className="flex-1 text-neutral-700 text-base sm:text-lg font-medium leading-snug tracking-tight">
                  {formData.tattooStyle || "Select Tattoo Style"}
                </div>
                {showTattooStyleDropdown ? (
                  <ChevronUp className="w-5 h-5 text-slate-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-700" />
                )}
              </div>
              {showTattooStyleDropdown && (
                <ul
                  id="tattoo-style-options"
                  role="listbox"
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-10 animate-slideDownFaster"
                >
                  {tattooStyles.map((style, index) => (
                    <li
                      key={index}
                      role="option"
                      aria-selected={formData.tattooStyle === style}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-neutral-700 text-base font-medium transition-colors"
                      onClick={() => handleTattooStyleSelect(style)}
                      tabIndex="0"
                    >
                      {style}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location Input */}
            <div
              className="h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex items-center transition-all duration-200 ease-in-out
                           focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
            >
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                className="flex-1 text-neutral-700 text-base sm:text-lg font-medium leading-snug tracking-tight bg-transparent outline-none placeholder-zinc-400"
                aria-label="Location"
              />
            </div>

            {/* Art Date Input */}
            <div
              className="h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex justify-between items-center transition-all duration-200 ease-in-out
                           focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
            >
              <input
                type="date"
                name="artDate"
                value={formData.artDate}
                onChange={handleInputChange}
                className={`flex-1 text-neutral-700 text-base sm:text-lg font-normal leading-snug tracking-tight bg-transparent outline-none
                  ${formData.artDate ? "" : "text-zinc-400"}`} // Keep text-zinc-400 only when no date is selected
                aria-label="Art Date"
              />
            </div>

            {/* Mention Artist Input */}
            <div
              className="relative h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex items-center transition-all duration-200 ease-in-out
                           focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
            >
              <input
                type="text"
                name="artistMention"
                placeholder="Search for artist by name"
                value={artistSearchQuery}
                onChange={handleInputChange}
                className="flex-1 text-gray-600 text-base sm:text-lg font-medium leading-snug tracking-tight bg-transparent outline-none placeholder-zinc-400"
                aria-label="Mention Artist"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* Artist search results dropdown */}
              {showArtistResults && artistSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 top-full left-0 w-full bg-white shadow-lg rounded-xl max-h-60 overflow-auto border border-gray-200">
                  {artistSearchResults.map((artist) => (
                    <div
                      key={artist.id}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectArtist(artist)}
                    >
                      {artist.profilePhoto ? (
                        <img
                          src={`${baseUrl}${artist.profilePhoto}`}
                          alt={artist.name || artist.user?.name}
                          className="w-8 h-8 rounded-full mr-3 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-700">
                          {artist.name || artist.user?.name}
                        </p>
                        {artist.location && (
                          <p className="text-xs text-gray-500">
                            {artist.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showArtistResults &&
                artistSearchQuery.length >= 2 &&
                !isSearching &&
                artistSearchResults.length === 0 && (
                  <div className="absolute z-10 mt-1 top-full left-0 w-full bg-white shadow-lg rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-gray-500">No artists found</p>
                  </div>
                )}
            </div>

            {/* Selected artist display */}
            {selectedArtist && (
              <div className="mt-2 p-3 bg-gray-50 rounded-xl flex items-center justify-between animate-slideDownFaster">
                <div className="flex items-center">
                  {selectedArtist.profileImage ? (
                    <img
                      src={selectedArtist.profileImage}
                      alt={selectedArtist.name || selectedArtist.user?.name}
                      className="w-6 h-6 rounded-full mr-2 object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <User className="h-3 w-3 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {selectedArtist.name || selectedArtist.user?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtist(null);
                    setFormData((prev) => ({ ...prev, artistMention: "" }));
                    setArtistSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Note */}
            <div className="text-xs sm:text-sm text-neutral-600 leading-snug tracking-tight p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-red-500 font-semibold">Note:</span> Please
              mention the artist's Inkquiries profile name. If the artist does
              not yet have a profile on Inkquiries, kindly{" "}
              <span
                className="text-gray-900 font-medium  cursor-pointer hover:text-gray-900"
                onClick={() => setShowCreateArtistPopup(true)}
              >
                Create an Account
              </span>{" "}
              for them using their Facebook or Instagram profile link, and then
              mention that newly created profile.
            </div>

            {/* Artist Social Handle Input */}
            <div
              className="h-14 px-4 py-2 bg-white rounded-xl border border-gray-200 flex items-center transition-all duration-200 ease-in-out
                           focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
            >
              <input
                type="text"
                name="artistSocial"
                placeholder="Artist Social Handle (e.g., instagram.com/artist)"
                value={formData.artistSocial}
                onChange={handleInputChange}
                className="flex-1 text-neutral-700 text-base sm:text-lg font-medium leading-snug tracking-tight bg-transparent outline-none placeholder-zinc-400"
                aria-label="Artist Social Handle"
              />
            </div>

            {/* Review Textarea */}
            <div
              className="min-h-36 h-auto px-4 py-3 bg-white rounded-xl border border-gray-200 flex flex-col transition-all duration-200 ease-in-out
                           focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
            >
              <textarea
                name="review"
                placeholder="Share your experience here... (min 50 characters)"
                value={formData.review}
                onChange={handleInputChange}
                className="flex-1 text-neutral-700 text-base sm:text-lg font-medium leading-relaxed tracking-tight bg-transparent outline-none placeholder-zinc-400 resize-y min-h-[80px]"
                aria-label="Your Review"
                rows="5"
              />
              <div className="flex justify-end pt-2">
                <span
                  role="img"
                  aria-label="pen emoji"
                  className="w-5 h-5 text-zinc-950 opacity-60"
                >
                  📝
                </span>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-full sm:w-[calc(33.33%-12px)] lg:w-[calc(33.33%-16px)] h-32 rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded preview ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label={`Remove image ${file.name}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              {imageFiles.length < 3 && (
                <label
                  htmlFor="file-upload"
                  className="w-full sm:w-[calc(33.33%-12px)] lg:w-[calc(33.33%-16px)] h-32 p-3 bg-white rounded-xl border border-zinc-200 flex flex-col justify-center items-center gap-2.5 cursor-pointer
                                   hover:bg-gray-50 transition-colors duration-200 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500"
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-7 h-7 text-zinc-700" />
                  <div className="text-center text-zinc-500 text-sm sm:text-base font-medium leading-snug tracking-tight">
                    Attach photo (Max 3)
                  </div>
                </label>
              )}
            </div>

            {/* Post Button */}
            <button
              type="submit"
              className="h-12 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 rounded-full flex justify-center items-center transition-all duration-200 mt-4
                           text-white text-base sm:text-lg font-medium leading-tight tracking-wide
                           focus:outline-none focus:ring-2 focus:ring-zinc-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Create Artist Popup */}
      {showCreateArtistPopup && (
        <CreateArtistPopup
          onClose={() => setShowCreateArtistPopup(false)}
          onSuccess={handleArtistCreated}
        />
      )}
    </div>
  );
}
