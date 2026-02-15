import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  // Request verification
  requestVerification: async (verificationData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REQUEST_VERIFICATION, verificationData);
    return response.data;
  },

  // Get my verifications
  getMyVerifications: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.MY_VERIFICATIONS);
    return response.data;
  },
};

export default authService;