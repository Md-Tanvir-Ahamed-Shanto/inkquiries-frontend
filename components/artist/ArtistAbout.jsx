"use client";
import React, { useState, useEffect } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { MdOutlineFileUpload } from "react-icons/md";
import backendUrl from "@/utils/baseUrl";
import { getArtistGallery, getMyArtistProfile } from "@/service/profileApi";

function ArtistAbout({artistId}) {

  const [ArtistAboutModal, setArtistAboutModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [personalVibeModal, setPersonalVibeModal] = useState(false);
  const [personalVibeData, setPersonalVibeData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!artistId) {
        setLoading(false);
        setError('No artist ID found. Please log in again.');
        return;
      }
      
      try {
        const data = await getMyArtistProfile(artistId);
        setProfile(data);
        
        // Initialize personal vibe data
        if (data.personalVibe) {
          setPersonalVibeData(data.personalVibe);
        } else {
          setPersonalVibeData({
            meaning: '',
            inspiration: '',
            philosophy: ''
          });
        }
        
        // Fetch gallery images if not included in profile
        if (!data.gallery) {
          try {
            const galleryData = await getArtistGallery(artistId);
            setProfile(prev => ({
              ...prev,
              gallery: galleryData
            }));
          } catch (galleryErr) {
            console.error('Failed to load gallery:', galleryErr);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load artist profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [artistId]);


  if (loading) {
    return <div className="w-full text-center py-8">  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div></div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="w-full text-center py-8">No profile found</div>;
  };

  const baseUrl = backendUrl

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-14">
      {/* ArtistAbout Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="font-semibold text-xl md:text-2xl">About {profile.name}</h1>
          
      </div>
      <p className="text-neutral-600 mt-6 text-sm sm:text-base">
        {profile.ArtistAbout || 'No ArtistAbout information available.'}
      </p>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 md:mt-12">
        {profile.gallery && profile.gallery.map((photo) => (
          <div key={photo.id} className="relative aspect-square">
              
            <img
              src={
                  Array.isArray(photo.imageUrls) && photo.imageUrls[0] 
                    ? `${baseUrl}${photo.imageUrls[0]}` 
                    : photo.imageUrl 
                    ? `${baseUrl}${photo.imageUrl}` 
                    : '/placeholder-image.svg'
                }
              alt={`Gallery photo ${photo.id}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Personal Vibe Section */}
      <div className="mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="font-semibold text-xl md:text-2xl mb-4 md:mb-0">Personal Vibe</h1>
           
        </div>
        
        {profile.personalVibe ? (
          <>
            {profile.personalVibe.meaning && (
              <div className="mt-6">
                <h4 className="font-semibold text-base md:text-lg">What Tattoos Mean to Me</h4>
                <p className="text-neutral-600 mt-1 text-sm md:text-base">
                  "{profile.personalVibe.meaning}"
                </p>
              </div>
            )}
            
            {profile.personalVibe.inspiration && (
              <div className="mt-6">
                <h4 className="font-semibold text-base md:text-lg">My Inspiration</h4>
                <p className="text-neutral-600 mt-1 text-sm md:text-base">
                  "{profile.personalVibe.inspiration}"
                </p>
              </div>
            )}
            
            {profile.personalVibe.philosophy && (
              <div className="mt-6">
                <h4 className="font-semibold text-base md:text-lg">My Tattooing Philosophy</h4>
                <p className="text-neutral-600 mt-1 text-sm md:text-base">
                  "{profile.personalVibe.philosophy}"
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 text-neutral-600">
            <p>No personal vibe information available. Click Edit to add your personal vibe.</p>
          </div>
        )}
      </div>
    
    </div>
  );
}

export default ArtistAbout;