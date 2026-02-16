import api from './api';

const departmentService = {
  // Get all departments
  getDepartments: async (params = {}) => {
    const response = await api.get('/departments', { params });
    return response.data;
  },

  // Get departments by organization
  getDepartmentsByOrganization: async (orgId, params = {}) => {
    const response = await api.get(`/departments/organization/${orgId}`, { params });
    return response.data;
  },

  // Get single department by ID
  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  // Create new department (Org Admin)
  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  // Update department (Org Admin)
  updateDepartment: async (id, departmentData) => {
    const response = await api.patch(`/departments/${id}`, departmentData);
    return response.data;
  },

  // Delete department (Org Admin)
  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },

  // Get department stats
  getDepartmentStats: async (id) => {
    const response = await api.get(`/departments/${id}/stats`);
    return response.data;
  },

  // Get department members
  getDepartmentMembers: async (id, params = {}) => {
    const response = await api.get(`/departments/${id}/members`, { params });
    return response.data;
  },

  // Get department blogs
  getDepartmentBlogs: async (id, params = {}) => {
    const response = await api.get(`/departments/${id}/blogs`, { params });
    return response.data;
  },

  // Add member to department
  addMember: async (id, userId) => {
    const response = await api.post(`/departments/${id}/members`, { userId });
    return response.data;
  },

  // Remove member from department
  removeMember: async (id, userId) => {
    const response = await api.delete(`/departments/${id}/members/${userId}`);
    return response.data;
  },

  // Assign department admin
  assignAdmin: async (id, userId) => {
    const response = await api.patch(`/departments/${id}/assign-admin`, { userId });
    return response.data;
  },

  // Remove department admin
  removeAdmin: async (id, userId) => {
    const response = await api.patch(`/departments/${id}/remove-admin`, { userId });
    return response.data;
  },

  // Toggle department active status
  toggleActive: async (id) => {
    const response = await api.patch(`/departments/${id}/toggle-active`);
    return response.data;
  },
};

export default departmentService;