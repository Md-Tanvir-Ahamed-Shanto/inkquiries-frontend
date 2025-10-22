import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(endpoint, method = "GET", body = null, isFormData = false) {
  // Try to get token from cookies first, then localStorage as fallback
  let token = Cookies.get("token");
  if (!token) {
    token = localStorage.getItem("token");
  }
  
  const options = {
    method,
    headers: {},
    credentials: "include",
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    if (isFormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
        console.log(`API Response for ${endpoint}:`, data); // Debug log
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        data = await response.text();
        console.log(`API Text Response for ${endpoint}:`, data);
      }
    } else {
      data = await response.text();
      console.log(`API Text Response for ${endpoint}:`, data);
    }

    if (!response.ok) {
      // Handle 401 Unauthorized errors (expired token)
      if (response.status === 401) {
        console.log('Token expired or invalid, logging out...');
        // Clear auth data
        Cookies.remove("token");
        Cookies.remove("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login page if we're in the browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      console.log("data",data)
      throw new Error(data.message || data.error || response.statusText);
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request was aborted");
    }
    if (error.name === "TypeError") {
      throw new Error("Network error occurred");
    }
    console.log("error",error)
    throw error;
  }
}

// Specific request helpers
export const getData = (endpoint) => apiFetch(endpoint, "GET");
export const postData = (endpoint, body, isFormData = false) => apiFetch(endpoint, "POST", body, isFormData);
export const putData = (endpoint, body, isFormData = false) => apiFetch(endpoint, "PUT", body, isFormData);
export const deleteData = (endpoint) => apiFetch(endpoint, "DELETE");

// File upload helper
export const uploadFile = (endpoint, formData) => {
  return apiFetch(endpoint, "POST", formData, true);
};