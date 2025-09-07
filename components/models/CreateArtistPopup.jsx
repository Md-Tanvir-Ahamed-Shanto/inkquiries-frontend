import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/utils/fetchApi";

export default function CreateArtistPopup({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    socialHandle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle closing with animation
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      onClose();
      setIsAnimatingOut(false); // Reset animation state after closing
    }, 300); // Match this duration with your exit animation duration
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createArtist = async (artistData) => {
    try {
      // Create artist with minimal required data
      // The backend will set password as null and role as "artist"
      const response = await apiFetch("/api/artists/create-by-client", "POST", artistData);
      return {
        success: true,
        message: "Artist profile created successfully!",
        data: response,
      };
    } catch (error) {
      console.error("Error creating artist:", error);
      return {
        success: false,
        message: error.message || "Failed to create artist profile",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter the artist's name");
      setIsSubmitting(false);
      return;
    }

    if (!formData.socialHandle.trim()) {
      toast.error("Please enter the artist's social handle");
      setIsSubmitting(false);
      return;
    }

    // Create artist data object
    // Using name as username (with lowercase and no spaces)
    const artistData = {
      name: formData.name,
      username: formData.name.toLowerCase().replace(/\s+/g, ""),
      socialHandle: formData.socialHandle,
      createdByClient: true,
    };

    try {
      const response = await createArtist(artistData);

      if (response.success) {
        toast.success(response.message);
        // Call onSuccess with the new artist data if available
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }
        handleClose();
      } else {
        toast.error(response.message || "Failed to create artist profile");
      }
    } catch (error) {
      console.error("Error submitting artist:", error);
      toast.error("An error occurred while creating the artist profile");
    } finally {
      setIsSubmitting(false);
    }
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
        `}
      </style>
      <div
        className={`w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto relative
           transform transition-all duration-300 ease-out
           ${isAnimatingOut ? "animate-scaleOut" : "animate-scaleIn"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
          <h2 className="text-gray-800 text-xl sm:text-2xl font-semibold font-['Inter'] leading-tight">
            Create Artist Profile
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close artist creation popup"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-3">
            {/* Artist Name Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-gray-700 text-sm font-medium"
              >
                Artist Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter artist's full name"
                className="h-12 px-4 py-2 bg-white rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Social Handle Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="socialHandle"
                className="text-gray-700 text-sm font-medium"
              >
                Social Handle *
              </label>
              <input
                type="text"
                id="socialHandle"
                name="socialHandle"
                value={formData.socialHandle}
                onChange={handleInputChange}
                placeholder="Enter artist's Instagram or Facebook handle"
                className="h-12 px-4 py-2 bg-white rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            <p>
              This will create a basic profile for the artist that they can claim
              later. The artist will be marked as "created by client" until they
              claim their profile.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-12 px-6 py-2 bg-gray-900 hover:bg-gray-950 cursor-pointer text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center
                      ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Creating..." : "Create Artist Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}