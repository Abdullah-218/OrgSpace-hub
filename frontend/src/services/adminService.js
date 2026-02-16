import api from './api';

const adminService = {
  // ==================== SUPER ADMIN ====================
  
  // Get platform statistics
  getPlatformStats: async () => {
    const response = await api.get('/admin/super/stats');
    return response.data;
  },

  // Get all verifications (Super Admin)
  getAllVerifications: async (params = {}) => {
    const response = await api.get('/admin/super/verifications', { params });
    return response.data;
  },

  // Get all users (Super Admin)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/super/users', { params });
    return response.data;
  },

  // Get platform activity
  getPlatformActivity: async (params = {}) => {
    const response = await api.get('/admin/super/activity', { params });
    return response.data;
  },

  // Update platform settings
  updatePlatformSettings: async (settings) => {
    const response = await api.patch('/admin/super/settings', settings);
    return response.data;
  },

  // Get platform settings
  getPlatformSettings: async () => {
    const response = await api.get('/admin/super/settings');
    return response.data;
  },

  // ==================== ORG ADMIN ====================

  // Get organization statistics
  getOrgStats: async () => {
    const response = await api.get('/admin/org/stats');
    return response.data;
  },

  // Get organization verifications
  getOrgVerifications: async (params = {}) => {
    const response = await api.get('/admin/org/verifications', { params });
    return response.data;
  },

  // Get organization members
  getOrgMembers: async (params = {}) => {
    const response = await api.get('/admin/org/members', { params });
    return response.data;
  },

  // Get organization departments
  getOrgDepartments: async (params = {}) => {
    const response = await api.get('/admin/org/departments', { params });
    return response.data;
  },

  // Assign organization admin
  assignOrgAdmin: async (orgId, userId) => {
    const response = await api.patch(`/admin/org/${orgId}/assign-admin`, { userId });
    return response.data;
  },

  // Remove organization admin
  removeOrgAdmin: async (orgId, userId) => {
    const response = await api.patch(`/admin/org/${orgId}/remove-admin`, { userId });
    return response.data;
  },

  // ==================== DEPT ADMIN ====================

  // Get department statistics
  getDeptStats: async () => {
    const response = await api.get('/admin/dept/stats');
    return response.data;
  },

  // Get department verifications
  getDeptVerifications: async (params = {}) => {
    const response = await api.get('/admin/dept/verifications', { params });
    return response.data;
  },

  // Get department members
  getDeptMembers: async (params = {}) => {
    const response = await api.get('/admin/dept/members', { params });
    return response.data;
  },

  // Get department blogs
  getDeptBlogs: async (params = {}) => {
    const response = await api.get('/admin/dept/blogs', { params });
    return response.data;
  },

  // ==================== VERIFICATION MANAGEMENT ====================

  // Approve verification request
  approveVerification: async (verificationId) => {
    const response = await api.patch(`/admin/verifications/${verificationId}/approve`);
    return response.data;
  },

  // Reject verification request
  rejectVerification: async (verificationId, reason) => {
    const response = await api.patch(`/admin/verifications/${verificationId}/reject`, { reason });
    return response.data;
  },

  // Get verification details
  getVerificationDetails: async (verificationId) => {
    const response = await api.get(`/admin/verifications/${verificationId}`);
    return response.data;
  },

  // Bulk approve verifications
  bulkApproveVerifications: async (verificationIds) => {
    const response = await api.post('/admin/verifications/bulk-approve', { verificationIds });
    return response.data;
  },

  // Bulk reject verifications
  bulkRejectVerifications: async (verificationIds, reason) => {
    const response = await api.post('/admin/verifications/bulk-reject', { verificationIds, reason });
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Toggle user verification status
  toggleUserVerification: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-verification`);
    return response.data;
  },

  // Ban/Unban user
  toggleUserBan: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-ban`);
    return response.data;
  },

  // Delete user (Super Admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get user details (Admin)
  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // ==================== BLOG MANAGEMENT ====================

  // Get all blogs (Admin)
  getAllBlogs: async (params = {}) => {
    const response = await api.get('/admin/blogs', { params });
    return response.data;
  },

  // Toggle blog publish status
  toggleBlogPublish: async (blogId) => {
    const response = await api.patch(`/admin/blogs/${blogId}/toggle-publish`);
    return response.data;
  },

  // Feature/Unfeature blog
  toggleBlogFeature: async (blogId) => {
    const response = await api.patch(`/admin/blogs/${blogId}/toggle-feature`);
    return response.data;
  },

  // Delete blog (Admin)
  deleteBlog: async (blogId) => {
    const response = await api.delete(`/admin/blogs/${blogId}`);
    return response.data;
  },

  // Get flagged content
  getFlaggedContent: async (params = {}) => {
    const response = await api.get('/admin/flagged-content', { params });
    return response.data;
  },

  // Resolve flagged content
  resolveFlaggedContent: async (flagId, action) => {
    const response = await api.patch(`/admin/flagged-content/${flagId}/resolve`, { action });
    return response.data;
  },

  // ==================== ANALYTICS ====================

  // Get user growth analytics
  getUserGrowthAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/user-growth', { params });
    return response.data;
  },

  // Get blog analytics
  getBlogAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/blogs', { params });
    return response.data;
  },

  // Get engagement analytics
  getEngagementAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/engagement', { params });
    return response.data;
  },

  // Get organization analytics
  getOrganizationAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics/organizations', { params });
    return response.data;
  },

  // ==================== SYSTEM HEALTH ====================

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/admin/system/health');
    return response.data;
  },

  // Get system logs
  getSystemLogs: async (params = {}) => {
    const response = await api.get('/admin/system/logs', { params });
    return response.data;
  },

  // Clear cache
  clearCache: async () => {
    const response = await api.post('/admin/system/clear-cache');
    return response.data;
  },

  // Run database maintenance
  runDatabaseMaintenance: async () => {
    const response = await api.post('/admin/system/db-maintenance');
    return response.data;
  },
};

export default adminService;