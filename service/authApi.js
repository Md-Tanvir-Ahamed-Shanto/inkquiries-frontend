import { apiFetch } from "../utils/fetchApi";
import Cookies from "js-cookie";

export const registerArtist = async (data) => {
  try {
    const res = await apiFetch("/api/artists", "POST", data);
    if (res.token) {
      Cookies.set("token", res.token);
      Cookies.set("user", JSON.stringify(res.artist));
    }
    return res;
  } catch (error) {
    console.error("Failed to register artist:", error.message);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await apiFetch("/api/auth/login", "POST", data);
    if (res.token) {
      // Store in both cookies and localStorage for consistency
      Cookies.set("token", res.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      localStorage.setItem("token", res.token);
      
      const userData = res.user || res.artist || res.client;
      if (userData) {
        Cookies.set("user", JSON.stringify(userData), {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
    return res;
  } catch (error) {
    console.error("Failed to login user:", error.message);
    throw error;
  }
};

export const logoutUser = () => {
  try {
    Cookies.remove("token");
    Cookies.remove("user");
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    return true;
  } catch (error) {
    console.error("Failed to logout user:", error.message);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    // Try to get user from cookies first, then localStorage as fallback
    let user = Cookies.get("user");
    if (!user) {
      user = localStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        // Set cookie without httpOnly (client-side can't set httpOnly)
        Cookies.set("user", JSON.stringify(user), {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        return user;
      }
    }
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to get current user:", error.message);
    return null;
  }
};

export const checkUserRole = () => {
  try {
    const user = getCurrentUser();
    return user?.role || null;
  } catch (error) {
    console.error("Failed to check user role:", error.message);
    return null;
  }
};

export const registerClient = async (data) => {
  try {
    const res = await apiFetch("/api/clients", "POST", data);
    if (res.token) {
      Cookies.set("token", res.token);
      Cookies.set("user", JSON.stringify(res.client));
    }
    return res;
  } catch (error) {
    console.error("Failed to register client:", error.message);
    throw error;
  }
};

/**
 * Request a password reset email
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} - Response from the API
 */
export const forgotPassword = async (email) => {
  try {
    const res = await apiFetch("/api/auth/forgot-password", "POST", { email });
    return res;
  } catch (error) {
    console.error("Failed to request password reset:", error.message);
    throw error;
  }
};

/**
 * Verify if a reset token is valid
 * @param {string} token - The reset token
 * @param {string} userType - The user type (admin, client, or artist)
 * @returns {Promise<Object>} - Response from the API
 */
export const verifyResetToken = async (token, userType) => {
  try {
    const res = await apiFetch(`/api/auth/verify-reset-token/${token}/${userType}`, "GET");
    return res;
  } catch (error) {
    console.error("Failed to verify reset token:", error.message);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} data - The reset data
 * @param {string} data.token - The reset token
 * @param {string} data.password - The new password
 * @param {string} data.userType - The user type (admin, client, or artist)
 * @returns {Promise<Object>} - Response from the API
 */
export const resetPassword = async (data) => {
  try {
    const res = await apiFetch("/api/auth/reset-password", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed to reset password:", error.message);
    throw error;
  }
};

export const claimArtistAccount = async (data) => {
  try {
    const res = await apiFetch("/api/artists/claim", "POST", data);
    if (res.token) {
      Cookies.set("token", res.token);
      Cookies.set("user", JSON.stringify(res.artist));
    }
    return res;
  } catch (error) {
    console.error("Failed to claim artist account:", error.message);
    throw error;
  }
};




export const socialLogin = async (data) => {
  try {
    const res = await apiFetch("/api/auth/social-login", "POST", data);
    return res;
  } catch (error) {
    console.error("Failed social login:", error.message);
    throw error;
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<object>} The server response.
 */
export const logout = async () => {
  try {
    const res = await apiFetch("/api/auth/logout", "GET");
    return res;
  } catch (error) {
    console.error("Failed to log out:", error.message);
    throw error;
  }
};