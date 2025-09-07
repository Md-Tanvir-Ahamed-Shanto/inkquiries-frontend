import { apiFetch, uploadFile } from "../utils/fetchApi";

export const getArtistPortfolio = async (artistId) => {
  try {
    const query = artistId ? `?artistId=${artistId}` : "";
    const response = await apiFetch(`/api/portfolios${query}`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to fetch artist portfolio:", error.message);
    throw error;
  }
};

export const addPortfolioItem = async (formData) => {
  try {
    const response = await uploadFile("/api/portfolios", formData);
    return response;
  } catch (error) {
    console.error("Failed to add portfolio item:", error.message);
    throw error;
  }
};

export const updatePortfolioItem = async (id, data) => {
  try {
    const response = await apiFetch(`/api/portfolios/${id}`, "PUT", data);
    return response;
  } catch (error) {
    console.error("Failed to update portfolio item:", error.message);
    throw error;
  }
};

export const deletePortfolioItem = async (id) => {
  try {
    const response = await apiFetch(`/api/portfolios/${id}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete portfolio item:", error.message);
    throw error;
  }
};

export const addPortfolioComment = async (portfolioImageId, content) => {
  try {
    const response = await apiFetch(`/api/portfolios/${portfolioImageId}/comments`, "POST", { content });
    return response;
  } catch (error) {
    console.error("Failed to add portfolio comment:", error.message);
    throw error;
  }
};


export const getPortfolioComments = async (portfolioImageId) => {
  try {
    const response = await apiFetch(`/api/portfolios/${portfolioImageId}/comments`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to fetch portfolio comments:", error.message);
    throw error;
  }
};


export const deletePortfolioComment = async (commentId) => {
  try {
    const response = await apiFetch(`/api/portfolios/comments/${commentId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Failed to delete portfolio comment:", error.message);
    throw error;
  }
};


export const likePortfolioItem = async (portfolioImageId) => {
  try {
    const response = await apiFetch(`/api/portfolios/${portfolioImageId}/like`, "POST");
    return response;
  } catch (error) {
    console.error("Failed to like portfolio item:", error.message);
    throw error;
  }
};

export const unlikePortfolioItem = async (portfolioImageId) => {
  try {
    const response = await apiFetch(`/api/portfolios/${portfolioImageId}/unlike`, "POST");
    return response;
  } catch (error) {
    console.error("Failed to unlike portfolio item:", error.message);
    throw error;
  }
};

export const checkPortfolioLikeStatus = async (portfolioImageId) => {
  try {
    const response = await apiFetch(`/api/portfolios/${portfolioImageId}/like-status`, "GET");
    return response;
  } catch (error) {
    console.error("Failed to check portfolio like status:", error.message);
    throw error;
  }
};

export const checkBatchPortfolioLikeStatus = async (portfolioImageIds) => {
  try {
    const response = await apiFetch(`/api/portfolios/batch-like-status`, "POST", {
      portfolioImageIds: portfolioImageIds
    });
    return response;
  } catch (error) {
    console.error("Failed to check batch portfolio like status:", error.message);
    throw error;
  }
};

// Cache for batch like status to avoid redundant API calls
let batchLikeStatusCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const checkBatchPortfolioLikeStatusCached = async (portfolioImageIds) => {
  if (!Array.isArray(portfolioImageIds) || portfolioImageIds.length === 0) {
    return {};
  }

  // Limit batch size to prevent large requests
  const limitedIds = portfolioImageIds.slice(0, 50);
  const cacheKey = limitedIds.sort().join(',');
  const now = Date.now();

  // Check cache first
  if (batchLikeStatusCache.has(cacheKey)) {
    const { data, timestamp } = batchLikeStatusCache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await checkBatchPortfolioLikeStatus(limitedIds);
    // Cache the result
    batchLikeStatusCache.set(cacheKey, {
      data: response,
      timestamp: now
    });
    return response;
  } catch (error) {
    console.error("Failed to check cached batch portfolio like status:", error.message);
    throw error;
  }
};

export const clearBatchPortfolioLikeStatusCache = () => {
  batchLikeStatusCache.clear();
};

