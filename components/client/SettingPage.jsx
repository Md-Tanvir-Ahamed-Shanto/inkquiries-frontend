"use client";
import { deleteProfilePhoto, getClientProfile, updateClientProfile, uploadClientProfilePhoto } from "@/service/clientApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import DeleteModal from "../common/DeleteModal";
import DisableModal from "../common/DisableModal";

const SettingPage = ({onSubmit}) => {
    const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isGeneralSaving, setIsGeneralSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("general");
 const [securityData, setSecurityData] = useState({
    newEmail: '',
    emailPassword: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
    const [loading, setLoading] = useState(true);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [error, setError] = useState(null);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

   const userData = JSON.parse(localStorage.getItem("user"));
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

     const fetchProfile = async () => {
      try {
        const profileData = await getClientProfile(userData.id);
        setProfile(profileData);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

   useEffect(() => {
 
    fetchProfile();
  }, []);
  
  useEffect(() => {
    if (profile) {
      const [first, ...rest] = (profile.name || "").split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
      setLocation(profile.location || "");
      setProfilePic(profile.profilePhoto || "https://placehold.co/64x64");
    }
  }, [profile]);

    const handleSecurityInputChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear previous error/success messages when user starts typing
    setSecurityError(null);
    setSecuritySuccess(null);
  };

  const handleGeneralSave = async () => {
    setIsGeneralSaving(true);
    try {
      const data = {
        name: `${firstName} ${lastName}`.trim(),
        location,
      }
      const response = await updateClientProfile(profile.id,data);
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        name: `${firstName} ${lastName}`.trim(),
      }));
      onSubmit();
      setProfile(response);
      fetchProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsGeneralSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    try {
      const response = await uploadClientProfilePhoto(profile.id, file);
      if (response && response.profilePhoto) {
        setProfile(prev => ({ ...prev, profilePhoto: response.profilePhoto }));
      }
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        profilePhoto: response.profilePhoto,
      }));
      onSubmit();
      fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setPhotoLoading(true);
    try {
      await deleteProfilePhoto(profile.id);
      setProfile(prev => ({ ...prev, profilePhoto: null }));
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        profilePhoto: null,
      }));
      onSubmit();
      fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    } finally {
      setPhotoLoading(false);
    }
  };
  
  const handleChangeEmail = async () => {
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);
    
    try {
      const response = await changeEmail(profile.id, securityData.newEmail, securityData.emailPassword);
      setSecuritySuccess('Email updated successfully');
      // Update the form data with the new email
      setFormData(prev => ({ ...prev, email: securityData.newEmail }));
      // Clear the form fields
      setSecurityData(prev => ({ ...prev, newEmail: '', emailPassword: '' }));
    } catch (err) {
      setSecurityError(err.message || 'Failed to update email');
    } finally {
      setSecurityLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityError('New password and confirm password do not match');
      setSecurityLoading(false);
      return;
    }
    
    try {
      await changePassword(
        artistId, 
        securityData.currentPassword, 
        securityData.newPassword, 
        securityData.confirmPassword
      );
      setSecuritySuccess('Password updated successfully');
      // Clear the form fields
      setSecurityData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));
    } catch (err) {
      setSecurityError(err.message || 'Failed to update password');
    } finally {
      setSecurityLoading(false);
    }
  };
  
  const handleDisableAccount = async () => {
    try {
      await disableArtistAccount(artistId);
      // Redirect to logout or login page
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    } catch (err) {
      setError(err.message || 'Failed to disable account');
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await deleteArtistAccount(artistId);
      // Redirect to logout or login page
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    }
  };
  

  if (!profile) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-neutral-600">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full inline-flex flex-col justify-start items-center gap-8 sm:gap-12 max-w-4xl">
        {/* Tabs */}
        <div className="self-stretch flex border-b border-gray-200">
          <button
            className={`py-2 px-4 ${activeTab === "general" ? "border-b-2 border-zinc-950 text-zinc-950 font-semibold" : "text-gray-500"}`}
          >
            General Settings
          </button>
        </div>
      
        <div className="self-stretch flex flex-col justify-start items-start gap-6 sm:gap-9 w-full">
          <div className="self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
            <div className="flex-1 flex justify-start items-center gap-2 sm:gap-4">
              <div className="justify-start text-neutral-800 text-xl sm:text-2xl font-semibold font-['Inter'] leading-normal sm:leading-loose">
                General Settings
              </div>
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="inline-flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <div className="rounded-[10px] flex justify-start items-center gap-2">
                <div className="w-16 h-16 relative">
                  <img
                    className="w-16 h-16 left-0 top-0 absolute rounded-full object-cover"
                    src={`${baseUrl}${profilePic}`}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                />
                <label
                  htmlFor="profilePhoto"
                  className="w-full sm:w-auto h-10 px-4 py-2 bg-neutral-100 rounded-lg inline-flex justify-center items-center gap-5 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <div className="text-center justify-start text-neutral-800 text-base font-normal leading-tight">
                    + Upload photo
                  </div>
                </label>
                <button
                  onClick={handlePhotoDelete}
                  className="w-full sm:w-auto h-10 px-4 py-1.5 bg-neutral-100 rounded-lg inline-flex justify-center items-center gap-5 hover:bg-neutral-200 transition-colors"
                >
                  <div className="text-center justify-start text-neutral-600 text-base font-normal leading-tight">
                    Delete photo
                  </div>
                </button>
              </div>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-6 sm:gap-8">
              <div className="self-stretch flex flex-col sm:flex-row justify-start items-start gap-5">
                <div className="flex-1 w-full sm:w-auto inline-flex flex-col justify-start items-start gap-2">
                  <label htmlFor="firstName" className="self-stretch justify-start text-neutral-600 text-base font-medium leading-normal tracking-tight">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="self-stretch h-10 sm:h-12 px-3.5 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5 text-neutral-600 text-base font-normal leading-tight focus:outline-gray-500 focus:ring-1 focus:ring-gray-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="flex-1 w-full sm:w-auto inline-flex flex-col justify-start items-start gap-2">
                  <label htmlFor="lastName" className="self-stretch justify-start text-neutral-600 text-base font-medium leading-normal tracking-tight">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="self-stretch h-10 sm:h-12 px-3.5 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5 text-neutral-600 text-base font-normal leading-tight focus:outline-gray-500 focus:ring-1 focus:ring-gray-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <label htmlFor="location" className="self-stretch justify-start text-neutral-600 text-base font-medium leading-normal tracking-tight">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="self-stretch h-10 sm:h-12 px-3.5 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex justify-start items-center gap-5 text-neutral-600 text-base font-normal leading-tight focus:outline-gray-500 focus:ring-1 focus:ring-gray-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleGeneralSave}
            disabled={isGeneralSaving}
            className="w-full sm:w-auto h-10 sm:h-12 px-5 py-2.5 sm:px-6 sm:py-4 bg-zinc-950 rounded-lg flex justify-center items-center gap-2.5 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-normal">
              {isGeneralSaving ? 'Saving...' : 'Save changes'}
            </div>
          </button>
            <div>
        <div className="flex flex-col sm:flex-row justify-between mb-6 md:mb-9 items-start sm:items-center">
          <h1 className="font-semibold text-xl md:text-2xl">Security Settings</h1>
          {securityError && (
            <div className="text-red-500 mb-4">{securityError}</div>
          )}
          {securitySuccess && (
            <div className="text-green-500 mb-4">{securitySuccess}</div>
          )}
        </div>
        <div className="flex flex-col gap-6 md:gap-12">
          <div>
            <h1 className="font-medium text-base md:text-lg">Email Change</h1>
            <hr className="text-zinc-200 my-4 md:my-6" />
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-neutral-600 font-medium mb-1">
                  New email
                </label>
                <input
                  type="email"
                  name="newEmail"
                  value={securityData.newEmail}
                  onChange={handleSecurityInputChange}
                  className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-neutral-600 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="emailPassword"
                  value={securityData.emailPassword}
                  onChange={handleSecurityInputChange}
                  className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <button 
              onClick={() => handleChangeEmail()}
              disabled={securityLoading || !securityData.newEmail || !securityData.emailPassword}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg cursor-pointer disabled:bg-gray-400"
            >
              {securityLoading ? 'Updating...' : 'Update Email'}
            </button>
          </div>
          <div>
            <h1 className="font-medium text-base md:text-lg">Password Change</h1>
            <hr className="text-zinc-200 my-4 md:my-6" />
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-neutral-600 font-medium mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={securityData.currentPassword}
                  onChange={handleSecurityInputChange}
                  className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-neutral-600 font-medium mb-1">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={securityData.newPassword}
                  onChange={handleSecurityInputChange}
                  className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-neutral-600 font-medium mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityInputChange}
                  className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <button 
              onClick={() => handleChangePassword()}
              disabled={securityLoading || !securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg cursor-pointer disabled:bg-gray-400"
            >
              {securityLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
{/* Account Settings */}
      <div>
        <h1 className="font-semibold text-xl md:text-2xl mb-6 mt-6 md:mb-4">Account Settings</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-9">
          <div onClick={() => setDeleteModal(true)} className="cursor-pointer">
            <p className="text-zinc-500 mb-2">Delete account</p>
            <div className="w-40 h-12 bg-red-500 rounded-lg text-white font-semibold flex items-center justify-center text-center">
              Delete
            </div>
          </div>
          <div onClick={() => setDisableModal(true)} className="cursor-pointer">
            <p className="text-zinc-500 mb-2">Disable account</p>
            <div className="w-40 h-12 bg-black rounded-lg text-white font-semibold flex items-center justify-center text-center">
              Disable
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <DeleteModal onClose={() => setDeleteModal(false)} onDelete={handleDeleteAccount} />
      </Modal>
      <Modal isOpen={disableModal} onClose={() => setDisableModal(false)}>
        <DisableModal onClose={() => setDisableModal(false)} onDisable={handleDisableAccount} />
      </Modal>
      </div>
        </div>
        
      </div>
    </div>
  );
};

export default SettingPage;