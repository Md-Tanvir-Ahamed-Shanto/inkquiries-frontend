import { apiFetch } from "../utils/fetchApi";

export const getArtistDashboardStats = async () => {
  try {
    const response = await apiFetch('/api/artists/me/dashboard/stats', 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch dashboard statistics' };
  }
};

export const searchArtists = async (query, location, style) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location && location !== 'None') params.append('location', location);
    if (style && style !== 'None') params.append('style', style);
    
    const queryString = params.toString();
    const response = await apiFetch(`/api/artists/find/artist?${queryString}`, 'GET');
    console.log('Search API Response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error || { message: 'Failed to search artists' };
  }
};

export const getArtistDashboardReviews = async (artistId) => {
  try {
    
    const response = await apiFetch(`/api/reviews?artistId=${artistId}`, 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch dashboard reviews' };
  }
};

export const getArtistDashboardPortfolio = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    }).toString();
    
    const response = await apiFetch(`/api/artists/me/dashboard/portfolio?${queryParams}`, 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch dashboard portfolio' };
  }
};

export const updateArtistSettings = async (data) => {
  try {
    const response = await apiFetch(`/api/artists/me/dashboard/settings`, 'PUT', data);
    return response;
  } catch (error) {
    throw error || { message: 'Failed to update settings' };
  }
};

export const getArtistSettings = async () => {
  try {
    const response = await apiFetch(`/api/artists/me/dashboard/settings`, 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch settings' };
  }
};

export const getArtistProfile = async (artistId) => {
  try {
    const response = await apiFetch(`/api/artists/${artistId}`, 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch artist profile' };
  }
};

export const updateArtistProfile = async (artistId, data) => {
  try {
    const response = await apiFetch(`/api/artists/${artistId}`, 'PUT', data);
    return response;
  } catch (error) {
    throw error || { message: 'Failed to update artist profile' };
  }
};

/**
 * @desc Get top-ranked artists.
 * @param {number} limit - The number of artists to fetch.
 * @returns {Promise<Object>} The response data containing top-ranked artists.
 */
export const getTopRankedArtists = async (limit = 8) => {
  try {
    const response = await apiFetch(`/api/artists/find/top-ranked?limit=${limit}`, 'GET');
    return response;
  } catch (error) {
    throw error || { message: 'Failed to fetch top-ranked artists' };
  }
};
