"use client";
import React, { useState, useEffect } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { MdOutlineFileUpload } from "react-icons/md";
import Modal from "../common/Modal";
import EditAboutUs from "../common/EditAboutUs";
import UploadPhoto from "../common/UploadPhoto";
import { getMyArtistProfile, updateArtistProfile, uploadGalleryPhoto, deleteGalleryPhoto, getArtistGallery } from "../../service/profileApi";
import { toast } from "react-hot-toast";
import backendUrl from "@/utils/baseUrl";

function About() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const artistId = user.id;

  const [aboutModal, setAboutModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
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

  const handleUpdateAbout = async (aboutData) => {
    try {
      const updated = await updateArtistProfile(artistId, aboutData);
      setProfile(prev => ({ ...prev, ...updated }));
      setAboutModal(false);
      toast.success('About section updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update about section');
    }
  };
  
  const handleUpdatePersonalVibe = async (vibeData) => {
    try {
      const updated = await updateArtistProfile(artistId, {
        personalVibe: vibeData
      });
      setProfile(prev => ({ ...prev, personalVibe: vibeData }));
      setPersonalVibeData(vibeData);
      setPersonalVibeModal(false);
      toast.success('Personal vibe updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update personal vibe');
    }
  };

  const handlePhotoUpload = async (file) => {
    setUploadLoading(true);
    try {
      const response = await uploadGalleryPhoto(artistId, file);
      // Check if response and response.data exist
      if (response && response.data) {
        // Add the new gallery image to the profile state
        setProfile(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), response.data]
        }));
        toast.success('Photo uploaded successfully');
      }
      setPhotoModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    
    try {
      await deleteGalleryPhoto(photoId);
      setProfile(prev => ({
        ...prev,
        gallery: prev.gallery.filter(photo => photo.id !== photoId)
      }));
      toast.success('Photo deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete photo');
    }
  };

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
      {/* About Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="font-semibold text-xl md:text-2xl">About {profile.name}</h1>
          <button
            onClick={() => setAboutModal(true)}
            className="w-full mt-4 md:mt-0 md:w-auto p-3 bg-gray-100 rounded-lg flex justify-center items-center gap-2 text-neutral-800 cursor-pointer"
          >
            <FiEdit3 className="text-zinc-400" size={20} /> Edit
          </button>
      </div>
      <p className="text-neutral-600 mt-6 text-sm sm:text-base">
        {profile.about || 'No about information available.'}
      </p>

      {/* Gallery Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-16">
        <h4 className="font-semibold text-lg md:text-xl">Gallery</h4>
          <button
            onClick={() => setPhotoModal(true)}
            className="w-full mt-4 sm:mt-0 sm:w-auto p-3 bg-gray-100 rounded-lg flex justify-center items-center gap-2 text-neutral-800 cursor-pointer"
          >
            <MdOutlineFileUpload className="text-slate-900" size={24} /> Upload Photo
          </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 md:mt-12">
        {profile.gallery && profile.gallery.map((photo) => (
          <div key={photo.id} className="relative aspect-square">
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute w-8 h-8 md:w-10 md:h-10 p-2 top-2 right-2 bg-white/30 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50"
              >
                <FiTrash2 className="text-red-600" size={16} />
              </button>
            <img
              src={
                  Array.isArray(photo.imageUrls) && photo.imageUrls[0] 
                    ? `${baseUrl}${photo.imageUrls[0]}` 
                    : photo.imageUrl 
                    ? `${baseUrl}${photo.imageUrl}` 
                    : '/placeholder-image.svg'
                }
              alt={`Gallery photo ${photo.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Personal Vibe Section */}
      <div className="mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="font-semibold text-xl md:text-2xl mb-4 md:mb-0">Personal Vibe</h1>
            <button 
              onClick={() => setPersonalVibeModal(true)}
              className="w-full md:w-auto p-3 bg-gray-100 rounded-lg flex justify-center items-center gap-2 text-neutral-800 cursor-pointer"
            >
              <FiEdit3 className="text-zinc-400" size={20} /> Edit
            </button>
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

      {/* Modals */}
      {profile && (
        <>
          <Modal isOpen={aboutModal} onClose={() => setAboutModal(false)}>
            <EditAboutUs 
              initialData={{
                about: profile.about || ""
              }}
              onSubmit={handleUpdateAbout}
              onClose={() => setAboutModal(false)}
            />
          </Modal>
          
          <Modal isOpen={photoModal} onClose={() => setPhotoModal(false)}>
            <UploadPhoto 
              onUpload={handlePhotoUpload}
              onClose={() => setPhotoModal(false)}
            />
          </Modal>
          
          <Modal isOpen={personalVibeModal} onClose={() => setPersonalVibeModal(false)}>
            <div className="w-full max-w-[908px] p-4 sm:p-6 bg-white rounded-2xl flex flex-col gap-4">
              <h1 className="font-bold text-xl sm:text-2xl">Edit Personal Vibe</h1>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">What Tattoos Mean to Me</label>
                  <textarea
                    id="meaning"
                    name="meaning"
                    rows={3}
                    className="w-full resize-none border border-zinc-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Share what tattoos mean to you personally..."
                    value={personalVibeData.meaning || ""}
                    onChange={(e) => setPersonalVibeData(prev => ({ ...prev, meaning: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label htmlFor="inspiration" className="block text-sm font-medium text-gray-700 mb-1">My Inspiration</label>
                  <textarea
                    id="inspiration"
                    name="inspiration"
                    rows={3}
                    className="w-full resize-none border border-zinc-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Share what inspires your work..."
                    value={personalVibeData.inspiration || ""}
                    onChange={(e) => setPersonalVibeData(prev => ({ ...prev, inspiration: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label htmlFor="philosophy" className="block text-sm font-medium text-gray-700 mb-1">My Tattooing Philosophy</label>
                  <textarea
                    id="philosophy"
                    name="philosophy"
                    rows={3}
                    className="w-full resize-none border border-zinc-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Share your approach to tattooing..."
                    value={personalVibeData.philosophy || ""}
                    onChange={(e) => setPersonalVibeData(prev => ({ ...prev, philosophy: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-2">
                <button 
                  onClick={() => setPersonalVibeModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 text-center cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdatePersonalVibe(personalVibeData)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black font-medium text-white text-center cursor-pointer hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default About;