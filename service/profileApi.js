import { apiFetch, uploadFile } from "../utils/fetchApi";


export const getMyArtistProfile = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/${id}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to fetch my artist profile:", error.message);
    throw error;
  }
};

export const updateArtistProfile = async (id, data) => {
  try {
    const response = await apiFetch(`/api/artists/${id}`, "PUT", data);
    return response;
  } catch (error) {
    console.error("Failed to update artist profile:", error.message);
    throw error;
  }
};


export const updateMyArtistProfile = async (id, data) => {
  try {
    const response = await apiFetch(`/api/artists/${id}`, "PUT", data);
    return response;
  } catch (error) {
    console.error("Failed to update my artist profile:", error.message);
    throw error;
  }
};


export const uploadProfileImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    
    const response = await uploadFile(`/api/artists/${id}/profilePhoto`, formData);
    return response;
  } catch (error) {
    console.error("Failed to upload profile image:", error.message);
    throw error;
  }
};


export const deleteProfilePhoto = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/${id}/profilePhoto`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete profile photo:", error.message);
    throw error;
  }
};

export const getProfilePhoto = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/${id}/profilePhoto`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to get profile photo:", error.message);
    throw error;
  }
};

// Gallery photo management
export const uploadGalleryPhoto = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('gallaryImages', file);
    
    const response = await uploadFile(`/api/artists/gallery/${id}/upload`, formData);
    return response;
  } catch (error) {
    console.error("Failed to upload gallery photo:", error.message);
    throw error;
  }
};

export const deleteGalleryPhoto = async (imageId) => {
  try {
    const response = await apiFetch(`/api/artists/gallery/${imageId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete gallery photo:", error.message);
    throw error;
  }
};

export const getArtistGallery = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/gallery/${id}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to get artist gallery:", error.message);
    throw error;
  }
};

// Account management functions
export const changeEmail = async (id, newEmail, password) => {
  try {
    const response = await apiFetch(`/api/artists/${id}/change-email`, "POST", { newEmail, password });
    return response;
  } catch (error) {
    console.error("Failed to change email:", error.message);
    throw error;
  }
};

export const changePassword = async (id, currentPassword, newPassword, confirmPassword) => {
  try {
    const response = await apiFetch(`/api/artists/${id}/change-password`, "POST", { 
      currentPassword, 
      newPassword, 
      confirmPassword 
    });
    return response;
  } catch (error) {
    console.error("Failed to change password:", error.message);
    throw error;
  }
};

export const disableArtistAccount = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/${id}/disable`, "POST");
    return response;
  } catch (error) {
    console.error("Failed to disable account:", error.message);
    throw error;
  }
};

export const deleteArtistAccount = async (id) => {
  try {
    const response = await apiFetch(`/api/artists/${id}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete account:", error.message);
    throw error;
  }
};
