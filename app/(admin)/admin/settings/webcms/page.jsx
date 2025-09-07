"use client";
import React, { useState, useEffect } from 'react';
import { getSocialLinks, updateSocialLinks } from '../../../../../service/adminApi';
import { toast } from 'react-hot-toast';

const LogoAndSocialUpdate = () => {
  // State for logo images
  const [logos, setLogos] = useState({
    heroLogo: null,
    footerLogo: null
  });

  // State for social links
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    logo: ''
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch social links on component mount
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const data = await getSocialLinks();
        if (data && Object.keys(data).length > 0) {
          setSocialLinks({
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            twitter: data.twitter || '',
            youtube: data.youtube || '',
            logo: data.logo || ''
          });
          
          // If logo exists, set it in logos state
          if (data.logo) {
            setLogos(prev => ({
              ...prev,
              heroLogo: data.logo
            }));
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching social links:', err);
        setError('Failed to load social links. Please try again.');
        toast.error('Failed to load social links');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocialLinks();
  }, []);

  // Handle logo upload
  const handleLogoUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogos(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo delete
  const handleLogoDelete = (type) => {
    setLogos(prev => ({
      ...prev,
      [type]: null
    }));
  };

  // Handle social link change
  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for API
      const socialLinkData = {
        ...socialLinks,
        logo: logos.heroLogo // Use the hero logo as the main logo
      };
      
      // Send data to API
      await updateSocialLinks(socialLinkData);
      
      toast.success('Social links updated successfully');
    } catch (err) {
      console.error('Error updating social links:', err);
      setError('Failed to update social links. Please try again.');
      toast.error('Failed to update social links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4 md:p-8 bg-white rounded-xl md:rounded-2xl border border-neutral-100 flex flex-col gap-4 md:gap-5">
      {/* Header */}
      <div className="w-full h-6 md:h-8 flex items-center">
        <h2 className="text-gray-800 text-lg md:text-xl font-medium font-['Inter'] tracking-tight">
          Logo Update
        </h2>
      </div>

      {/* Logo Update Section */}
      <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* Hero Logo */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4">
            <label className="text-neutral-600 text-sm md:text-base font-normal">
              Hero Nav Logo Change
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Logo Preview */}
              <div className="w-full md:w-52 h-16 px-4 md:px-8 py-3.5 rounded-lg flex items-center justify-center border md:border-0">
                {logos.heroLogo ? (
                  <img src={logos.heroLogo} alt="Hero logo" className="h-full" />
                ) : (
                  <div className="flex">
                    <span className="text-black text-2xl md:text-3xl font-bold font-['Inter'] capitalize">Ink</span>
                    <span className="text-zinc-600 text-2xl md:text-3xl font-bold font-['Inter'] capitalize">quiries</span>
                  </div>
                )}
              </div>
              
              {/* Logo Actions */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="file"
                    id="hero-logo-upload"
                    className="hidden"
                    onChange={(e) => handleLogoUpload('heroLogo', e)}
                    accept="image/*"
                  />
                  <label
                    htmlFor="hero-logo-upload"
                    className="w-full md:w-auto h-10 px-5 py-2 bg-neutral-100 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-neutral-800 text-sm md:text-base font-medium">
                      + Upload
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  className="w-full md:w-auto h-10 px-5 py-1.5 bg-neutral-100 rounded-lg flex items-center justify-center"
                  onClick={() => handleLogoDelete('heroLogo')}
                >
                  <span className="text-neutral-600 text-sm md:text-base font-medium">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="flex flex-col gap-4">
            <label className="text-neutral-600 text-sm md:text-base font-normal">
              Footer Logo Change
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Logo Preview */}
              <div className="w-full md:w-52 h-16 px-4 md:px-8 py-3.5 rounded-lg flex items-center justify-center border md:border-0">
                {logos.footerLogo ? (
                  <img src={logos.footerLogo} alt="Footer logo" className="h-full" />
                ) : (
                  <div className="flex">
                    <span className="text-black text-2xl md:text-3xl font-bold font-['Inter'] capitalize">Ink</span>
                    <span className="text-zinc-600 text-2xl md:text-3xl font-bold font-['Inter'] capitalize">quiries</span>
                  </div>
                )}
              </div>
              
              {/* Logo Actions */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="file"
                    id="footer-logo-upload"
                    className="hidden"
                    onChange={(e) => handleLogoUpload('footerLogo', e)}
                    accept="image/*"
                  />
                  <label
                    htmlFor="footer-logo-upload"
                    className="w-full md:w-auto h-10 px-5 py-2 bg-neutral-100 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-neutral-800 text-sm md:text-base font-medium">
                      + Upload
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  className="w-full md:w-auto h-10 px-5 py-1.5 bg-neutral-100 rounded-lg flex items-center justify-center"
                  onClick={() => handleLogoDelete('footerLogo')}
                >
                  <span className="text-neutral-600 text-sm md:text-base font-medium">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="w-full flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <h3 className="text-gray-800 text-lg md:text-xl font-medium font-['Inter']">
              Social Link Update
            </h3>
            
            {/* Facebook */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal">
                    Facebook
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal"
                    value={socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Instagram */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal">
                    Instagram
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* LinkedIn */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal"
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Twitter */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal">
                    Twitter
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal"
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* YouTube */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal">
                    YouTube
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal"
                    value={socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-4">
          {error}
        </div>
      )}
      
      {/* Save Button */}
      <button
        type="submit"
        className={`w-full md:w-40 h-10 md:h-12 px-4 py-2 md:py-3 ${loading ? 'bg-gray-500' : 'bg-gray-800'} rounded-xl flex justify-center items-center`}
        disabled={loading}
      >
        <span className="text-white text-sm md:text-base font-medium font-['Inter']">
          {loading ? 'Saving...' : 'Save Changes'}
        </span>
      </button>
    </form>
  );
};

export default LogoAndSocialUpdate;