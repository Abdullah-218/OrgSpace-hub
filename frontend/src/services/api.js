import axios from 'axios';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error cases
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          error.message = data.message || ERROR_MESSAGES.FORBIDDEN;
          break;
          
        case 404:
          // Not found
          error.message = data.message || ERROR_MESSAGES.NOT_FOUND;
          break;
          
        case 500:
          // Server error
          error.message = data.message || ERROR_MESSAGES.SERVER;
          break;
          
        default:
          error.message = data.message || ERROR_MESSAGES.SERVER;
      }
    } else if (error.request) {
      // Request made but no response
      error.message = ERROR_MESSAGES.NETWORK;
    } else {
      // Something else happened
      error.message = error.message || ERROR_MESSAGES.SERVER;
    }
    
    return Promise.reject(error);
  }
);

export default api;