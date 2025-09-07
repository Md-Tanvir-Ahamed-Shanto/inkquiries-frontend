import { apiFetch } from "../utils/fetchApi";

/**
 * @desc Get all notifications for the authenticated user
 * @returns {Promise<Object>} The response data containing user notifications
 */
export const getUserNotifications = async () => {
  try {
    const response = await apiFetch('/api/notifications', 'GET');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

/**
 * @desc Mark a specific notification as read
 * @param {string} notificationId - The ID of the notification to mark as read
 * @returns {Promise<Object>} The response data for the updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiFetch(`/api/notifications/${notificationId}`, 'PUT');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark notification as read' };
  }
};

/**
 * @desc Mark all notifications as read for the authenticated user
 * @returns {Promise<Object>} The response data confirming the operation
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiFetch('/api/notifications/mark-all-read', 'PUT');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark all notifications as read' };
  }
};

/**
 * @desc Delete a specific notification
 * @param {string} notificationId - The ID of the notification to delete
 * @returns {Promise<Object>} The response data confirming deletion
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiFetch(`/api/notifications/${notificationId}`, 'DELETE');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete notification' };
  }
};

/**
 * @desc Get user's notification preferences
 * @returns {Promise<Object>} The response data containing user notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await apiFetch('/api/notifications/preferences', 'GET');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch notification preferences' };
  }
};

/**
 * @desc Update user's notification preferences
 * @param {Object} preferences - The updated notification preferences
 * @returns {Promise<Object>} The response data for the updated preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await apiFetch('/api/notifications/preferences', 'PUT', preferences);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update notification preferences' };
  }
};