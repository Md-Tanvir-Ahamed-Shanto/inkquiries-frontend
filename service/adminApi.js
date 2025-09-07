import { apiFetch } from "../utils/fetchApi";
import Cookies from "js-cookie";

/**
 * Create a new admin user
 * @param {Object} data - Admin data including email, password, name, profilePhoto, isSuper
 * @returns {Promise<Object>} The created admin data
 */
export const createAdmin = async (data) => {
  try {
    const res = await apiFetch("/api/admins", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    throw error;
  }
};

/**
 * Login as an admin
 * @param {Object} data - Login credentials (email, password)
 * @returns {Promise<Object>} Login response with token and admin data
 */
export const loginAdmin = async (data) => {
  try {
    const res = await apiFetch("/api/admins/login", "POST", data);
    if (res.token) {
      // Store in both cookies and localStorage for consistency
      Cookies.set("token", res.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      localStorage.setItem("token", res.token);
      
      if (res.admin) {
        Cookies.set("user", JSON.stringify(res.admin), {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        localStorage.setItem("user", JSON.stringify(res.admin));
      }
    }
    return res;
  } catch (error) {
    console.error("Failed to login as admin:", error.message);
    throw error;
  }
};

/**
 * Logout the current admin
 * @returns {Promise<Object>} Logout response
 */
export const logoutAdmin = async () => {
  try {
    const res = await apiFetch("/api/admins/logout", "POST");
    Cookies.remove("token");
    Cookies.remove("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return res;
  } catch (error) {
    console.error("Failed to logout admin:", error.message);
    throw error;
  }
};

/**
 * Get all admin users
 * @returns {Promise<Array>} List of admin users
 */
export const getAllAdmins = async () => {
  try {
    const res = await apiFetch("/api/admins", "GET");
    return res;
  } catch (error) {
    console.error("Failed to get all admins:", error.message);
    throw error;
  }
};

/**
 * Get admin by ID
 * @param {string} id - Admin ID
 * @returns {Promise<Object>} Admin data
 */
export const getAdminById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get admin with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update admin data
 * @param {string} id - Admin ID
 * @param {Object} data - Updated admin data
 * @returns {Promise<Object>} Updated admin data
 */
export const updateAdmin = async (id, data) => {
  try {
    const res = await apiFetch(`/api/admins/${id}`, "PUT", data);
    return res;
  } catch (error) {
    console.error(`Failed to update admin with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete an admin
 * @param {string} id - Admin ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteAdmin = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete admin with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get dashboard overview data
 * @returns {Promise<Object>} Dashboard overview data
 */
export const getDashboardOverview = async () => {
  try {
    const res = await apiFetch("/api/admins/dashboard/overview", "GET");
    return res;
  } catch (error) {
    console.error("Failed to get dashboard overview:", error.message);
    throw error;
  }
};

/**
 * Get all reviews with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Reviews data with pagination
 */
export const getAllReviews = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/reviews?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get reviews:", error.message);
    throw error;
  }
};

/**
 * Get review by ID
 * @param {string} id - Review ID
 * @returns {Promise<Object>} Review data
 */
export const getReviewById = async (id) => {
  try {
    const res = await apiFetch(`/api/reviews/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get review with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update review status
 * @param {string} id - Review ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated review data
 */
export const updateReviewStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/api/reviews/${id}/status`, "PUT", { status });
    return res;
  } catch (error) {
    console.error(`Failed to update review status for ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete a review
 * @param {string} id - Review ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteReview = async (id) => {
  try {
    const res = await apiFetch(`/api/reviews/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete review with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all promotions with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Promotions data with pagination
 */
export const getAllPromotions = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/admins/promotions?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get promotions:", error.message);
    throw error;
  }
};

/**
 * Get promotion by ID
 * @param {string} id - Promotion ID
 * @returns {Promise<Object>} Promotion data
 */
export const getPromotionById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/promotions/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get promotion with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Create a new promotion
 * @param {Object} data - Promotion data
 * @returns {Promise<Object>} Created promotion data
 */
export const createPromotion = async (data) => {
  try {
    const res = await apiFetch("/api/admins/promotions", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed to create promotion:", error.message);
    throw error;
  }
};

/**
 * Update a promotion
 * @param {string} id - Promotion ID
 * @param {Object} data - Updated promotion data
 * @returns {Promise<Object>} Updated promotion data
 */
export const updatePromotion = async (id, data) => {
  try {
    const res = await apiFetch(`/api/admins/promotions/${id}`, "PUT", data);
    return res;
  } catch (error) {
    console.error(`Failed to update promotion with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete a promotion
 * @param {string} id - Promotion ID
 * @returns {Promise<Object>} Delete response
 */
export const deletePromotion = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/promotions/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete promotion with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all reports with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Reports data with pagination
 */
export const getAllReports = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/admins/reports?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get reports:", error.message);
    throw error;
  }
};

/**
 * Get all review reports
 * @returns {Promise<Object>} Review reports data
 */
export const getAllReviewReports = async () => {
  try {
    const res = await apiFetch(`/api/reviews/reports/all`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get review reports:", error.message);
    throw error;
  }
};

/**
 * Get report by ID
 * @param {string} id - Report ID
 * @returns {Promise<Object>} Report data
 */
export const getReportById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/reports/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get report with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update report status
 * @param {string} id - Report ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated report data
 */
export const updateReportStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/api/admins/reports/${id}/status`, "PUT", { status });
    return res;
  } catch (error) {
    console.error(`Failed to update report status for ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Accept a review report (deletes the review and all associated reports)
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Response data
 */
export const acceptReviewReport = async (reportId) => {
  try {
    const res = await apiFetch(`/api/reviews/reports/${reportId}/accept`, "POST");
    return res;
  } catch (error) {
    console.error(`Failed to accept review report with ID ${reportId}:`, error.message);
    throw error;
  }
};

/**
 * Reject a review report (keeps the review but removes the report)
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Response data
 */
export const rejectReviewReport = async (reportId) => {
  try {
    const res = await apiFetch(`/api/reviews/reports/${reportId}/reject`, "POST");
    return res;
  } catch (error) {
    console.error(`Failed to reject review report with ID ${reportId}:`, error.message);
    throw error;
  }
};

/**
 * Delete a report
 * @param {string} id - Report ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteReport = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/reports/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete report with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all support tickets with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Support tickets data with pagination
 */
export const getAllSupportTickets = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/admins/support-tickets?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get support tickets:", error.message);
    throw error;
  }
};

/**
 * Get support ticket by ID
 * @param {string} id - Support ticket ID
 * @returns {Promise<Object>} Support ticket data
 */
export const getSupportTicketById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/support-tickets/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get support ticket with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update support ticket status
 * @param {string} id - Support ticket ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated support ticket data
 */
export const updateSupportTicketStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/api/admins/support-tickets/${id}/status`, "PUT", { status });
    return res;
  } catch (error) {
    console.error(`Failed to update support ticket status for ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete a support ticket
 * @param {string} id - Support ticket ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSupportTicket = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/support-tickets/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete support ticket with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get admin profile
 * @returns {Promise<Object>} Admin profile data
 */
export const getAdminProfile = async () => {
  try {
    const res = await apiFetch("/api/admins/profile", "GET");
    return res;
  } catch (error) {
    console.error("Failed to get admin profile:", error.message);
    throw error;
  }
};

/**
 * Update admin profile
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} Updated admin profile
 */
export const updateAdminProfile = async (data) => {
  try {
    const res = await apiFetch("/api/admins/profile", "PUT", data);
    return res;
  } catch (error) {
    console.error("Failed to update admin profile:", error.message);
    throw error;
  }
};

/**
 * Change admin password
 * @param {Object} data - Password data (currentPassword, newPassword)
 * @returns {Promise<Object>} Response message
 */
export const changeAdminPassword = async (data) => {
  try {
    const res = await apiFetch("/api/admins/profile/password", "PUT", data);
    return res;
  } catch (error) {
    console.error("Failed to change admin password:", error.message);
    throw error;
  }
};

/**
 * Upload admin profile photo
 * @param {FormData} formData - Form data with photo file
 * @returns {Promise<Object>} Response with profile photo URL
 */
export const uploadAdminProfilePhoto = async (formData) => {
  try {
    const res = await apiFetch("/api/admins/profile/photo", "POST", formData, true);
    return res;
  } catch (error) {
    console.error("Failed to upload profile photo:", error.message);
    throw error;
  }
};

/**
 * Delete admin profile photo
 * @returns {Promise<Object>} Response message
 */
export const deleteAdminProfilePhoto = async () => {
  try {
    const res = await apiFetch("/api/admins/profile/photo", "DELETE");
    return res;
  } catch (error) {
    console.error("Failed to delete profile photo:", error.message);
    throw error;
  }
};

/**
 * Get social links
 * @returns {Promise<Object>} Social links data
 */
export const getSocialLinks = async () => {
  try {
    const res = await apiFetch("/api/social-links", "GET");
    return res;
  } catch (error) {
    console.error("Failed to get social links:", error.message);
    throw error;
  }
};

/**
 * Update social links
 * @param {Object} data - Social links data including logo, facebook, twitter, instagram, linkedin, youtube
 * @returns {Promise<Object>} Updated social links
 */
export const updateSocialLinks = async (data) => {
  try {
    const res = await apiFetch("/api/social-links", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed to update social links:", error.message);
    throw error;
  }
};

/**
 * Get all subscription plans
 * @returns {Promise<Array>} List of subscription plans
 */
export const getAllSubscriptionPlans = async () => {
  try {
    const res = await apiFetch("/api/admins/subscription-plans", "GET");
    return res;
  } catch (error) {
    console.error("Failed to get subscription plans:", error.message);
    throw error;
  }
};

/**
 * Get subscription plan by ID
 * @param {string} id - Subscription plan ID
 * @returns {Promise<Object>} Subscription plan data
 */
export const getSubscriptionPlanById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/subscription-plans/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get subscription plan with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Create a new subscription plan
 * @param {Object} data - Subscription plan data
 * @returns {Promise<Object>} Created subscription plan
 */
export const createSubscriptionPlan = async (data) => {
  try {
    const res = await apiFetch("/api/admins/subscription-plans", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed to create subscription plan:", error.message);
    throw error;
  }
};

/**
 * Update a subscription plan
 * @param {string} id - Subscription plan ID
 * @param {Object} data - Updated subscription plan data
 * @returns {Promise<Object>} Updated subscription plan
 */
export const updateSubscriptionPlan = async (id, data) => {
  try {
    const res = await apiFetch(`/api/admins/subscription-plans/${id}`, "PUT", data);
    return res;
  } catch (error) {
    console.error(`Failed to update subscription plan with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete a subscription plan
 * @param {string} id - Subscription plan ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSubscriptionPlan = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/subscription-plans/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete subscription plan with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all clients with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Clients data with pagination
 */
export const getAllClients = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/admins/clients?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get clients:", error.message);
    throw error;
  }
};

/**
 * Get client by ID
 * @param {string} id - Client ID
 * @returns {Promise<Object>} Client data
 */
export const getClientById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/clients/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get client with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update client status (activate/restrict)
 * @param {string} id - Client ID
 * @param {string} status - New status (active/restricted)
 * @returns {Promise<Object>} Updated client data
 */
export const updateClientStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/api/admins/clients/${id}/status`, "PUT", { status });
    return res;
  } catch (error) {
    console.error(`Failed to update client status for ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete a client
 * @param {string} id - Client ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteClient = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/clients/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete client with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get all artists with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} Artists data with pagination
 */
export const getAllArtists = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await apiFetch(`/api/admins/artists?${queryString}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to get artists:", error.message);
    throw error;
  }
};

/**
 * Get artist by ID
 * @param {string} id - Artist ID
 * @returns {Promise<Object>} Artist data
 */
export const getArtistById = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/artists/${id}`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get artist with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Update artist status (activate/restrict)
 * @param {string} id - Artist ID
 * @param {string} status - New status (active/restricted)
 * @returns {Promise<Object>} Updated artist data
 */
export const updateArtistStatus = async (id, status) => {
  try {
    const res = await apiFetch(`/api/admins/artists/${id}/status`, "PUT", { status });
    return res;
  } catch (error) {
    console.error(`Failed to update artist status for ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Delete an artist
 * @param {string} id - Artist ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteArtist = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/artists/${id}`, "DELETE");
    return res;
  } catch (error) {
    console.error(`Failed to delete artist with ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get artist subscription history
 * @param {string} id - Artist ID
 * @returns {Promise<Array>} List of artist subscriptions
 */
export const getArtistSubscriptions = async (id) => {
  try {
    const res = await apiFetch(`/api/admins/artists/${id}/subscriptions`, "GET");
    return res;
  } catch (error) {
    console.error(`Failed to get subscriptions for artist ID ${id}:`, error.message);
    throw error;
  }
};