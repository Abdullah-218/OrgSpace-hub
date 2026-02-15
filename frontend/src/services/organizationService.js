import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const organizationService = {
  // Get all organizations
  getOrganizations: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ORGANIZATIONS.BASE, { params });
    return response.data;
  },

  // Get organization by ID
  getOrganizationById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORGANIZATIONS.BY_ID(id));
    return response.data;
  },

  // Create organization (Super Admin)
  createOrganization: async (orgData) => {
    const response = await api.post(API_ENDPOINTS.ORGANIZATIONS.BASE, orgData);
    return response.data;
  },

  // Update organization (Org Admin)
  updateOrganization: async (id, orgData) => {
    const response = await api.patch(API_ENDPOINTS.ORGANIZATIONS.BY_ID(id), orgData);
    return response.data;
  },

  // Delete organization (Super Admin)
  deleteOrganization: async (id) => {
    const response = await api.delete(API_ENDPOINTS.ORGANIZATIONS.BY_ID(id));
    return response.data;
  },

  // Get organization stats
  getOrganizationStats: async (id) => {
    const response = await api.get(API_ENDPOINTS.ORGANIZATIONS.STATS(id));
    return response.data;
  },

  // Toggle comments (Org Admin)
  toggleComments: async (id) => {
    const response = await api.patch(API_ENDPOINTS.ORGANIZATIONS.TOGGLE_COMMENTS(id));
    return response.data;
  },
};

export default organizationService;