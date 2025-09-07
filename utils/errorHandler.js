import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.name === 'AbortError') {
    toast.error('Request was cancelled');
    return false;
  }

  if (error.name === 'TypeError' && !navigator.onLine) {
    toast.error('No internet connection');
    return false;
  }

  if (error instanceof ApiError) {
    if (error.errors && error.errors.length > 0) {
      error.errors.forEach(err => toast.error(err));
    } else {
      toast.error(error.message);
    }

    // Handle specific status codes
    switch (error.statusCode) {
      case 401:
        window.location.href = '/auth/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('The requested resource was not found');
        break;
      case 422:
        // Validation errors are handled above
        break;
      case 429:
        toast.error('Too many requests. Please try again later');
        break;
      default:
        if (error.statusCode >= 500) {
          toast.error('Server error. Please try again later');
        }
    }
  } else if (error.message === 'Failed to fetch') {
    toast.error('Network error. Please check your connection');
  } else {
    toast.error('An unexpected error occurred. Please try again');
  }

  return false;
};

export const handleFormError = (error, setError) => {
  if (error instanceof ApiError && error.errors) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      setError(field, {
        type: 'manual',
        message: Array.isArray(messages) ? messages[0] : messages
      });
    });
    return;
  }
  handleApiError(error);
};

export const handleUploadError = (error) => {
  if (error.code === 'file-too-large') {
    toast.error('File is too large. Maximum size is 5MB');
    return;
  }

  if (error.code === 'file-invalid-type') {
    toast.error('Invalid file type. Please upload an image');
    return;
  }

  if (error.code === 'too-many-files') {
    toast.error('Too many files. Please upload fewer files');
    return;
  }

  handleApiError(error);
};

// Higher-order function to handle errors in API calls
export const withErrorHandler = (apiCall) => async (...args) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Higher-order function to manage loading states
export const withLoading = (loadingState, setLoadingState) => (apiCall) => async (...args) => {
  const key = typeof apiCall === 'function' ? apiCall.name : 'loading';
  try {
    setLoadingState({ ...loadingState, [key]: true });
    const result = await apiCall(...args);
    return result;
  } catch (error) {
    throw error;
  } finally {
    setLoadingState({ ...loadingState, [key]: false });
  }
};