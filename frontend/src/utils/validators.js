/**
 * Validation utilities
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidUsername = (username) => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const isValidPhone = (phone) => {
  // Basic phone validation (10-15 digits)
  const phoneRegex = /^\+?[\d\s-]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (!isValidPassword(password)) return 'Password must be at least 6 characters';
  return null;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateUrl = (url) => {
  if (!url) return null; // URL is optional
  if (!isValidUrl(url)) return 'Please enter a valid URL';
  return null;
};
