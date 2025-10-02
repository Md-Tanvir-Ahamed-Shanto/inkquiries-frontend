"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  uploadAdminProfilePhoto,
  deleteAdminProfilePhoto,
} from "../../../../../service/adminApi";
import backendUrl from "@/utils/baseUrl";
export default function GeneralSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePhoto: "/assets/profile.png",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await getAdminProfile();
      setProfile({
        name: response.name || "",
        email: response.email || "",
        profilePhoto: response.profilePhoto ? `${backendUrl}${response.profilePhoto}` : "/assets/profile.png",
      });
    } catch (err) {
      console.error("Error fetching admin profile:", err);
      setError("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div></div>;
  }

  return (
    <div className="w-full p-4 md:p-8 bg-white rounded-xl md:rounded-2xl border border-neutral-100 flex flex-col gap-4 md:gap-5">
      {/* Header */}
      <div className="w-full h-6 md:h-8 flex items-center">
        <h2 className="text-gray-800 text-lg md:text-xl font-medium font-['Inter'] tracking-tight">
          Edit admin info
        </h2>
      </div>

      {/* Profile Picture Section */}
      <div className="w-full flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Profile Image */}
          <div className="w-10 h-10">
            <img
              className="w-10 h-10 rounded-full object-contain"
              src={profile.profilePhoto}
              alt="Admin profile"
            />
          </div>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  try {
                    setSaving(true);
                    const formData = new FormData();
                    formData.append("profilePhoto", e.target.files[0]);

                    const response = await uploadAdminProfilePhoto(formData);
                    setProfile({
                      ...profile,
                      profilePhoto: `${backendUrl}${response.profilePhoto}`,
                    });

                    setSuccess("Profile photo uploaded successfully!");
                    setTimeout(() => setSuccess(null), 3000);
                  } catch (err) {
                    console.error("Error uploading profile photo:", err);
                    setError("Failed to upload profile photo");
                    setTimeout(() => setError(null), 3000);
                  } finally {
                    setSaving(false);
                    e.target.value = "";
                  }
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 cursor-pointer sm:flex-none sm:w-auto h-10 px-5 py-2 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              <span className="text-neutral-800 text-sm md:text-base font-medium tracking-tight">
                + Upload photo
              </span>
            </button>

            {/* Delete Button */}
            <button
              onClick={async () => {
                try {
                  setSaving(true);
                  await deleteAdminProfilePhoto();
                  fetchAdminProfile();

                  setSuccess("Profile photo deleted successfully!");
                  setTimeout(() => setSuccess(null), 3000);
                } catch (err) {
                  console.error("Error deleting profile photo:", err);
                  setError("Failed to delete profile photo");
                  setTimeout(() => setError(null), 3000);
                } finally {
                  setSaving(false);
                }
              }}
              className="flex-1 sm:flex-none cursor-pointer sm:w-auto h-10 px-5 py-1.5 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                saving || profile.profilePhoto === "/assets/profile.png"
              }
            >
              <span className="text-neutral-600 cursor-pointer text-sm md:text-base font-medium tracking-tight">
                Delete photo
              </span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="w-full flex flex-col gap-8 md:gap-12">
          {/* Personal Info Section */}
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col md:flex-row gap-4 md:gap-5">
              {/* First Name */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-neutral-600 text-sm md:text-base font-normal tracking-tight">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full flex">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-neutral-600 text-sm md:text-base font-normal tracking-tight">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Password Update Section */}
          <div className="w-full flex flex-col gap-4 md:gap-6">
            <h3 className="text-gray-800 text-lg md:text-xl font-medium font-['Inter'] tracking-tight">
              Password Update
            </h3>

            <div className="w-full flex flex-col gap-4">
              {/* Current Password */}
              <div className="w-full flex">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal tracking-tight">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              {/* New Password and Confirm Password */}
              <div className="w-full flex flex-col md:flex-row gap-4 md:gap-5">
                {/* New Password */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal tracking-tight">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
                    placeholder="••••••••••"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-neutral-600 text-sm md:text-base font-normal tracking-tight">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full h-10 md:h-12 px-3 md:px-3.5 py-2 bg-white rounded-lg border border-zinc-200 text-neutral-600 text-sm md:text-base font-normal tracking-tight focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              {/* Change Password Button */}
              <button 
                onClick={async () => {
                  try {
                    if (passwords.newPassword !== passwords.confirmPassword) {
                      alert("New password and confirm password do not match");
                      return;
                    }

                    setSaving(true);
                    await changeAdminPassword({
                      currentPassword: passwords.currentPassword,
                      newPassword: passwords.newPassword,
                    });

                    setPasswords({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });

                    setSuccess("Password changed successfully!");
                    setTimeout(() => setSuccess(null), 3000);
                  } catch (err) {
                    console.error("Error changing password:", err);
                    setError(
                      "Failed to change password. Please check your current password."
                    );
                    setTimeout(() => setError(null), 3000);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="w-full md:w-40 h-10 md:h-12 px-4 py-2 md:py-3 bg-gray-800 rounded-xl flex justify-center items-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  saving ||
                  !passwords.currentPassword ||
                  !passwords.newPassword ||
                  !passwords.confirmPassword
                }
              >
                <span className="text-white cursor-pointer text-sm md:text-base font-medium font-['Inter'] tracking-tight">
                  {saving ? "Changing..." : "Change Password"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="w-full p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={async () => {
          try {
            setSaving(true);
            await updateAdminProfile({
              name: profile.name,
              email: profile.email,
            });
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
          } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
            setTimeout(() => setError(null), 3000);
          } finally {
            setSaving(false);
          }
        }}
        className="w-full md:w-40 cursor-pointer h-10 md:h-12 px-4 py-2 md:py-3 bg-gray-800 rounded-xl flex justify-center items-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={saving || loading}
      >
        <span className="text-white text-sm md:text-base font-medium font-['Inter'] tracking-tight">
          {saving ? "Saving..." : "Save Changes"}
        </span>
      </button>
    </div>
  );
}
