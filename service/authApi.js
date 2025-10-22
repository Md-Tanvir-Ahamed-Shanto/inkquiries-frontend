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
    console.log('loginUser - API response:', res);
    
    if (res.token) {
      // Store token in both cookies and localStorage
      Cookies.set("token", res.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      localStorage.setItem("token", res.token);
      console.log('loginUser - token stored in localStorage and cookies');
      
      const userData = res.user || res.artist || res.client;
      if (userData) {
        Cookies.set("user", JSON.stringify(userData), {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        localStorage.setItem("user", JSON.stringify(userData));
        console.log('loginUser - user data stored in localStorage:', userData);
        console.log('loginUser - localStorage user check:', localStorage.getItem("user"));
      } else {
        console.warn('loginUser - no user data found in response');
      }
    } else {
      console.warn('loginUser - no token found in response');
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
    console.log('getCurrentUser - Starting function execution');
    
    // Check if we're in a browser environment (client-side)
    if (typeof window === 'undefined') {
      console.log('getCurrentUser - Server-side execution, checking cookies only');
      // Server-side: only check cookies
      const user = Cookies.get("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          console.log('getCurrentUser - found in cookies (server-side):', userData);
          return userData;
        } catch (parseError) {
          console.error('getCurrentUser - failed to parse cookie user (server-side):', parseError);
        }
      }
      return null;
    }
    
    // Client-side execution
    console.log('getCurrentUser - Client-side execution');
    
    // Check localStorage first
    let user = null;
    try {
      user = localStorage.getItem("user");
      console.log('getCurrentUser - localStorage raw value:', user);
    } catch (localStorageError) {
      console.error('getCurrentUser - localStorage access error:', localStorageError);
    }
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('getCurrentUser - found in localStorage:', userData);
        
        // Sync with cookies if not already there
        const cookieUser = Cookies.get("user");
        if (!cookieUser) {
          console.log('getCurrentUser - syncing localStorage to cookies');
          Cookies.set("user", JSON.stringify(userData), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
        }
        return userData;
      } catch (parseError) {
        console.error('getCurrentUser - failed to parse localStorage user:', parseError);
        try {
          localStorage.removeItem("user"); // Clear corrupted data
        } catch (removeError) {
          console.error('getCurrentUser - failed to remove corrupted localStorage:', removeError);
        }
      }
    }
    
    // Fallback to cookies if localStorage is empty or corrupted
    console.log('getCurrentUser - checking cookies...');
    user = Cookies.get("user");
    console.log('getCurrentUser - cookies raw value:', user);
    
    if (user) {
      try {
        // Clean the cookie data before parsing
        let cleanUser = user;
        
        // Trim whitespace
        cleanUser = cleanUser.trim();
        
        // Handle potential double-encoding issues
        if (cleanUser.startsWith('"') && cleanUser.endsWith('"')) {
          cleanUser = cleanUser.slice(1, -1);
        }
        
        // Handle escaped quotes
        cleanUser = cleanUser.replace(/\\"/g, '"');
        
        console.log('getCurrentUser - cleaned cookie data:', cleanUser);
        
        const userData = JSON.parse(cleanUser);
        console.log('getCurrentUser - found in cookies:', userData);
        
        // Clean the userData object
        if (userData.profilePhoto && typeof userData.profilePhoto === 'string') {
          userData.profilePhoto = userData.profilePhoto.trim();
        }
        
        // Sync with localStorage (only on client-side)
        try {
          console.log('getCurrentUser - syncing cookies to localStorage');
          localStorage.setItem("user", JSON.stringify(userData));
          console.log('getCurrentUser - localStorage sync completed');
        } catch (syncError) {
          console.error('getCurrentUser - failed to sync to localStorage:', syncError);
        }
        
        return userData;
      } catch (parseError) {
        console.error('getCurrentUser - failed to parse cookie user:', parseError);
        console.error('getCurrentUser - problematic cookie data:', user);
        Cookies.remove("user"); // Clear corrupted data
      }
    }
    
    console.log('getCurrentUser - no valid user data found in localStorage or cookies');
    return null;
  } catch (error) {
    console.error("getCurrentUser - unexpected error:", error.message, error.stack);
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

export const handleOAuthCallback = async () => {
  try {
    // Get user data and token from cookies (set by backend OAuth)
    const userCookie = Cookies.get('user');
    const tokenCookie = Cookies.get('token');

    console.log('OAuth callback - userCookie:', userCookie);
    console.log('OAuth callback - tokenCookie:', tokenCookie);

    if (userCookie && tokenCookie) {
      const userData = JSON.parse(userCookie);
      
      // Store in localStorage for frontend access
      localStorage.setItem('token', tokenCookie);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('OAuth callback - userData stored:', userData);

      return { success: true, user: userData, token: tokenCookie };
    }

    // If no cookies found, check if data is already in localStorage
    const localUser = localStorage.getItem('user');
    const localToken = localStorage.getItem('token');
    
    if (localUser && localToken) {
      const userData = JSON.parse(localUser);
      console.log('OAuth callback - found in localStorage:', userData);
      return { success: true, user: userData, token: localToken };
    }

    console.log('OAuth callback - no authentication data found');
    return { success: false, error: 'No authentication data found' };
  } catch (error) {
    console.error("Failed to handle OAuth callback:", error.message);
    return { success: false, error: error.message };
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