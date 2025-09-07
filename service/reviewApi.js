import { apiFetch, uploadFile } from "../utils/fetchApi";

export const getArtistReviews = async (artistId) => {
  try {
    const response = await apiFetch(`/api/reviews?artistId=${artistId}`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch artist reviews" };
  }
};

export const createReview = async (reviewData, photos) => {
  try {
    const formData = new FormData();
    Object.keys(reviewData).forEach((key) => {
      formData.append(key, reviewData[key]);
    });
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    const response = await apiFetch("/api/reviews", "POST", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error || { message: "Failed to create review" };
  }
};

export const getMyReviews = async () => {
  try {
    // Corrected route to match the backend: /api/reviews/me
    const response = await apiFetch("/api/reviews", "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch your reviews" };
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiFetch(
      `/api/reviews/${reviewId}`,
      "PUT",
      reviewData
    );
    return response;
  } catch (error) {
    throw error || { message: "Failed to update review" };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}`, "DELETE");
    return response;
  } catch (error) {
    throw error || { message: "Failed to delete review" };
  }
};

export const likeReview = async (reviewId) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}/like`, "POST");
    // Clear batch cache to ensure consistency
    clearBatchLikeStatusCache();
    return response;
  } catch (error) {
    throw error || { message: "Failed to like review" };
  }
};

export const unLikeReview = async (reviewId) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}/unlike`, "POST");
    // Clear batch cache to ensure consistency
    clearBatchLikeStatusCache();
    return response;
  } catch (error) {
    throw error || { message: "Failed to unlike review" };
  }
};

export const addReviewComment = async (reviewId, content, parentId = null) => {
  try {
    const response = await apiFetch(
      `/api/reviews/${reviewId}/comments`,
      "POST",
      {
        // Corrected route
        content,
        parentId,
      }
    );
    return response;
  } catch (error) {
    throw error || { message: "Failed to add comment" };
  }
};

export const getAllCommentByReviewId = async (reviewId) => {
  try {
    const response = await apiFetch(
      `/api/reviews/${reviewId}/comments`,
      "GET"
    );
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch comments" };
  }
};

export const checkUserLikeStatus = async (reviewId) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}/like-status`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to check like status" };
  }
};

// Cache for batch like status to avoid redundant API calls
const batchLikeStatusCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const checkBatchUserLikeStatus = async (reviewIds) => {
  // Input validation
  if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
    throw { message: "reviewIds array is required and cannot be empty" };
  }

  // Limit batch size to match backend validation
  if (reviewIds.length > 50) {
    throw { message: "Maximum 50 reviewIds allowed per batch request" };
  }

  // Check cache for existing data
  const now = Date.now();
  const cacheKey = reviewIds.sort().join(',');
  const cachedData = batchLikeStatusCache.get(cacheKey);
  
  if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const response = await apiFetch('/api/reviews/batch/like-status', "POST", {
      reviewIds
    });
    
    // Cache the response
    batchLikeStatusCache.set(cacheKey, {
      data: response,
      timestamp: now
    });
    
    // Clean up old cache entries (simple cleanup)
    if (batchLikeStatusCache.size > 100) {
      const oldestKey = batchLikeStatusCache.keys().next().value;
      batchLikeStatusCache.delete(oldestKey);
    }
    
    return response;
  } catch (error) {
    console.error('Batch like status check failed:', error);
    throw error || { message: "Failed to check batch like status" };
  }
};

// Function to clear cache when needed (e.g., after like/unlike actions)
export const clearBatchLikeStatusCache = () => {
  batchLikeStatusCache.clear();
};

export const reportReview = async (reviewId, data) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}/report`, "POST",data);
    return response;
  } catch (error) {
    throw error || { message: "Failed to report review" };
  }
};

export const deleteReviewComment = async (commentId) => {
  try {
    const response = await apiFetch(
      `/api/reviews/comments/${commentId}`,
      "DELETE"
    );
    return response;
  } catch (error) {
    throw error || { message: "Failed to delete comment" };
  }
};

export const getAllReviews = async (reportedOnly = false) => {
  try {
    const query = reportedOnly ? "?reportedOnly=true" : "";
    const response = await apiFetch(`/api/admin/reviews${query}`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch all reviews" };
  }
};

export const getRecentReviews = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 6,
      sortBy: "createdAt",
      sortOrder: "desc",
    }).toString();

    const response = await apiFetch(`/api/reviews?${queryParams}`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch recent reviews" };
  }
};

export const getTrendingTattoos = async (limit = 8) => {
  try {
    // This endpoint doesn't exist yet, but we'll assume it will be implemented
    // For now, we'll use the reviews endpoint with a high rating filter
    const queryParams = new URLSearchParams({
      limit: limit,
      sortBy: "overallRating",
      sortOrder: "desc",
    }).toString();

    const response = await apiFetch(`/api/reviews?${queryParams}`, "GET");
    return response;
  } catch (error) {
    throw (
      error || { message: "Failed to fetch trending tattoos" }
    );
  }
};

export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await apiFetch(`/api/reviews/${reviewId}`, "DELETE");
    return response;
  } catch (error) {
    throw (
      error || { message: "Failed to delete review as admin" }
    );
  }
};

export const getAllReportsReview = async () => {
  try {
    const response = await apiFetch(`/api/reviews/reports/all`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch all reports review" };
  }
}

export const rejectReviewReport = async (reportId) => {
  try {
    const response = await apiFetch(`/api/reviews/reports/${reportId}/reject`, "POST");
    return response;
  } catch (error) {
    throw error || { message: "Failed to reject report review" };
  }
}

export const acceptReviewReport = async (reportId) =>{
  try {
     const response = await apiFetch(`/api/reviews/reports/${reportId}/accept`, "DELETE");
    return response;
  } catch (error) {
    throw error || { message: "Failed to accept report review" };
  }
}

export const getReviewReportById = async (reportId) => {
  try {
    const response = await apiFetch(`/api/reviews/reports/${reportId}`, "GET");
    return response;
  } catch (error) {
    throw error || { message: "Failed to fetch review report" };
  }
}
