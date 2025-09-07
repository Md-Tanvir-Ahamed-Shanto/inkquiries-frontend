// Form validation rules and error messages
export const validationRules = {
  // User Profile Validation
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  bio: {
    maxLength: { value: 500, message: "Bio cannot exceed 500 characters" },
  },
  location: {
    maxLength: { value: 100, message: "Location cannot exceed 100 characters" },
  },
  socialLinks: {
    pattern: {
      value: /^https?:\/\/.+/,
      message: "Social links must start with http:// or https://",
    },
  },

  // Artist Profile Validation
  specialties: {
    required: "At least one specialty is required",
    validate: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return "Please select at least one specialty";
      }
      return true;
    },
  },
  socialHandle: {
    pattern: {
      value: /^[a-zA-Z0-9._-]+$/,
      message: "Social handle can only contain letters, numbers, dots, underscores, and hyphens",
    },
    maxLength: { value: 30, message: "Social handle cannot exceed 30 characters" },
  },

  // Password Validation
  currentPassword: {
    required: "Current password is required",
  },
  newPassword: {
    required: "New password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },
  confirmPassword: {
    required: "Please confirm your password",
    validate: (value, formValues) => {
      if (value !== formValues.newPassword) {
        return "Passwords do not match";
      }
      return true;
    },
  },

  // Image Upload Validation
  profileImage: {
    validate: (file) => {
      if (file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          return "Please upload a valid image file (JPEG, PNG, or WebP)";
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          return "Image size should not exceed 5MB";
        }
      }
      return true;
    },
  },
  portfolioImage: {
    validate: (file) => {
      if (file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          return "Please upload a valid image file (JPEG, PNG, or WebP)";
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          return "Image size should not exceed 10MB";
        }
      }
      return true;
    },
  },
};

// Form error handling helper
export const getFormErrors = (errors) => {
  return Object.keys(errors).reduce((acc, key) => {
    acc[key] = errors[key].message;
    return acc;
  }, {});
};

// Form data transformation helper
export const transformFormData = (data, type) => {
  switch (type) {
    case 'userProfile':
      return {
        name: data.name,
        email: data.email,
        bio: data.bio || null,
        location: data.location || null,
        socialLinks: data.socialLinks || null,
      };

    case 'artistProfile':
      return {
        specialties: data.specialties,
        socialHandle: data.socialHandle || null,
        isClaimed: true,
      };

    case 'password':
      return {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

    case 'settings':
      return {
        ...data,
        notifications: {
          email: data.emailNotifications || false,
          push: data.pushNotifications || false,
        },
        preferences: {
          theme: data.theme || 'system',
          language: data.language || 'en',
        },
      };

    default:
      return data;
  }
};