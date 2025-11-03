import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import DisableModal from "../common/DisableModal";
import DeleteModal from "../common/DeleteModal";
import Subscription from "./Subscription";
import { 
  getMyArtistProfile, 
  updateMyArtistProfile, 
  uploadProfileImage, 
  deleteProfilePhoto,
  changeEmail,
  changePassword,
  disableArtistAccount,
  deleteArtistAccount
} from "../../service/profileApi";
import backendUrl from "@/utils/baseUrl";

function Setting() {
 const user = JSON.parse(localStorage.getItem("user"))
  const artistId = user.id
  const baseUrl = backendUrl

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
  });
  
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
  const [activeTab, setActiveTab] = useState('profile');


    const fetchProfileAndSettings = async () => {
      try {
        const profileData = await getMyArtistProfile(artistId);
        // const settingsData = await getArtistSettings();
        // const notificationPrefs = await getArtistNotificationPreferences(artistId);
        
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          location: profileData.location || '',
          email: profileData.email || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfileAndSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
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

  const handleNotificationToggle = async (key) => {
    const updatedNotifications = {
      ...formData.notifications,
      [key]: !formData.notifications[key]
    };
    
    setFormData(prev => ({
      ...prev,
      notifications: updatedNotifications
    }));
    
    try {
      await updateArtistNotificationPreferences(updatedNotifications);
    } catch (err) {
      setError(err.message || 'Failed to update notification preferences');
      // Revert the toggle if the API call fails
      setFormData(prev => ({
        ...prev,
        notifications: prev.notifications
      }));
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Create a proper data object for the API
      const dataToSend = {
        name: formData.name,
        location: formData.location
      };
      
      const updated = await updateMyArtistProfile(artistId, dataToSend);
      setProfile(updated);
      setFormData({
        name: updated.name,
        location: updated.location,
      });
      localStorage.setItem("user", JSON.stringify({
        ...user,
        name: updated.name,
        location: updated.location,
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    try {
      const response = await uploadProfileImage(artistId, file);
      if (response && response.profilePhoto) {
        setProfile(prev => ({ ...prev, profilePhoto: response.profilePhoto }));
        localStorage.setItem("user", JSON.stringify({
          ...user,
          profilePhoto: response.profilePhoto,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setPhotoLoading(true);
    try {
      await deleteProfilePhoto(artistId);
      setProfile(prev => ({ ...prev, profilePhoto: null }));
      localStorage.setItem("user", JSON.stringify({
        ...user,
        profilePhoto: null,
      }));
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
      const response = await changeEmail(artistId, securityData.newEmail, securityData.emailPassword);
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

  if (loading) {
    return <div className="w-full text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-lg mb-4">Settings</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`text-left px-3 py-2 rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`text-left px-3 py-2 rounded-md ${
                  activeTab === 'security'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`text-left px-3 py-2 rounded-md ${
                  activeTab === 'subscription'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              <div>
                <div className="flex flex-col sm:flex-row justify-between mb-6 md:mb-9 items-start sm:items-center">
                  <h1 className="font-semibold text-xl md:text-2xl">General Settings</h1>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 bg-black text-white rounded-lg cursor-pointer text-center disabled:bg-gray-400"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16">
             {
              profile.profilePhoto ? (
                <img 
                  className="rounded-full w-full h-full object-contain" 
                  src={`${baseUrl}${profile.profilePhoto}`} 
                  alt="Profile" 
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 rounded-full flex items-center justify-center">
                  {/* show name first latter in circle */}
                  <span className="text-neutral-400 text-lg">{profile.name?.charAt(0)}</span>
                </div>
              )
             }
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="px-5 py-2 bg-neutral-100 rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={photoLoading}
                />
                {photoLoading ? 'Uploading...' : '+ Upload photo'}
              </label>
              <button 
                onClick={handlePhotoDelete}
                disabled={!profile.profilePhoto || photoLoading}
                className="px-5 py-2 bg-neutral-100 rounded-lg cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Delete photo
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="text-neutral-600 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </div>
          
          </div>
          <div className="flex flex-col w-full">
            <label className="text-neutral-600 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-zinc-200 text-neutral-600 rounded-lg focus:outline-none"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="New York, USA"
            />
          </div>
        </div>
      </div>

      <hr className="text-zinc-200" />

      {/* Security Settings */}
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
      </div>

      <hr className="text-zinc-200" />


      {/* Account Settings */}
      <div>
        <h1 className="font-semibold text-xl md:text-2xl mb-6 md:mb-9">Account Settings</h1>
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

            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
              {/* Security Settings Content */}
              <div>
                {securityError && (
                  <div className="text-red-500 mb-4">{securityError}</div>
                )}
                {securitySuccess && (
                  <div className="text-green-500 mb-4">{securitySuccess}</div>
                )}
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
                      onClick={handleChangeEmail}
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
                      onClick={handleChangePassword}
                      disabled={securityLoading || !securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword}
                      className="mt-4 px-6 py-2 bg-black text-white rounded-lg cursor-pointer disabled:bg-gray-400"
                    >
                      {securityLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
                
                <hr className="text-zinc-200 my-6" />
                
                {/* Account Settings */}
                <div>
                  <h1 className="font-semibold text-xl md:text-2xl mb-6 md:mb-9">Account Settings</h1>
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
              </div>
            </div>
          )}
          
          {activeTab === 'subscription' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Subscription</h2>
              <Subscription />
            </div>
          )}

          <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
            <DeleteModal onClose={() => setDeleteModal(false)} onDelete={handleDeleteAccount} />
          </Modal>
          <Modal isOpen={disableModal} onClose={() => setDisableModal(false)}>
            <DisableModal onClose={() => setDisableModal(false)} onDisable={handleDisableAccount} />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Setting;