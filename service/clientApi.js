import { apiFetch, uploadFile } from "../utils/fetchApi";

// Client Authentication
export const registerClient = async (clientData) => {
  try {
    const response = await apiFetch("/api/clients", "POST", clientData);
    return response;
  } catch (error) {
    console.error("Failed to register client:", error.message);
    throw error;
  }
};

export const loginClient = async (credentials) => {
  try {
    const response = await apiFetch("/auth/login", "POST", credentials);
    return response;
  } catch (error) {
    console.error("Failed to login client:", error.message);
    throw error;
  }
};

export const logoutClient = async () => {
  try {
    const response = await apiFetch("/api/clients/logout", "POST");
    return response;
  } catch (error) {
    console.error("Failed to logout client:", error.message);
    throw error;
  }
};

// Direct Client Operations
export const getClientById = async (clientId) => {
  try {
    const response = await apiFetch(`/api/clients/${clientId}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to get client:", error.message);
    throw error;
  }
};

export const updateClient = async (clientId, clientData) => {
  try {
    const response = await apiFetch(`/api/clients/${clientId}`, "PUT", clientData);
    return response;
  } catch (error) {
    console.error("Failed to update client:", error.message);
    throw error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await apiFetch(`/api/clients/${clientId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete client:", error.message);
    throw error;
  }
};

export const getClientProfile = async (id) => {
  try {
    // Get the current logged-in client's profile
    const response = await apiFetch(`/api/clients/${id}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to get client profile:", error.message);
    throw error;
  }
};

export const updateClientProfile = async (id, clientData) => {
  try {
    // Update the current logged-in client's profile
    const response = await apiFetch(`/api/clients/${id}`, "PUT", clientData);
    return response;
  } catch (error) {
    console.error("Failed to update client profile:", error.message);
    throw error;
  }
};

export const uploadClientProfilePhoto = async (id, photo) => {
  try {
    // Upload profile photo for the current logged-in client
    const formData = new FormData();
    formData.append('profilePhoto', photo);
    const response = await uploadFile(`/api/clients/${id}/profilePhoto`, formData);
    return response;
  } catch (error) {
    console.error("Failed to upload client profile photo:", error.message);
    throw error;
  }
};

export const getClientReviews = async (id) => {
  try {
    const response = await apiFetch(`/api/reviews?clientId=${id}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to get client reviews:", error.message);
    throw error;
  }
};

export const deleteProfilePhoto = async (id) => {
  try {
    const response = await apiFetch(`/api/clients/${id}/profilePhoto`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete profile photo:", error.message);
    throw error;
  }
};

export const createReview = async (artistId, reviewData, photoFiles) => {
  try {
    // Create FormData to handle both review data and photos in a single request
    const formData = new FormData();
    
    // Add review data fields to FormData
     formData.append('artistId', artistId);
    formData.append('tattooDate', reviewData.artDate);
    formData.append('bedsideManner', reviewData.detailedRatings?.bedsideManner || Math.floor(reviewData.overallRating) || 0);
    formData.append('accommodation', reviewData.detailedRatings?.accommodation || Math.floor(reviewData.overallRating) || 0);
    formData.append('price', reviewData.detailedRatings?.price || Math.floor(reviewData.overallRating) || 0);
    formData.append('heavyHandedness', reviewData.detailedRatings?.heavyHandedness || Math.floor(reviewData.overallRating) || 0);
    formData.append('artworkQuality', reviewData.detailedRatings?.artworkQuality || Math.floor(reviewData.overallRating) || 0);
    formData.append('tattooQuality', reviewData.detailedRatings?.tattooQuality || Math.floor(reviewData.overallRating) || 0);
    formData.append('overallExperience', reviewData.overallRating);
    formData.append('tattooStyle', reviewData.tattooStyle);
    formData.append('location', reviewData.location);
    formData.append('artDate', reviewData.artDate);
    formData.append('content', reviewData.review);
    
    // Add photos to FormData
    if (photoFiles && photoFiles.length > 0) {
      photoFiles.forEach((file, index) => {
        formData.append('photos', file);
      });
    }
    
    // Send the combined data to the server
    const response = await uploadFile('/api/reviews', formData);
    return response;
  } catch (error) {
    console.error("Failed to create review:", error.message);
    throw error;
  }
};

// Note: The uploadReviewPhotos function has been integrated into the createReview function
// to handle photos and review data in a single request