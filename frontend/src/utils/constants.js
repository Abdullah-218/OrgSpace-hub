// User Roles
export const ROLES = {
  GLOBAL: 'global',
  VERIFIED: 'verified',
  DEPT_ADMIN: 'dept_admin',
  ORG_ADMIN: 'org_admin',
  SUPER_ADMIN: 'super_admin',
};

// Role Labels (for display)
export const ROLE_LABELS = {
  [ROLES.GLOBAL]: 'Global User',
  [ROLES.VERIFIED]: 'Verified User',
  [ROLES.DEPT_ADMIN]: 'Department Admin',
  [ROLES.ORG_ADMIN]: 'Organization Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Status Labels
export const STATUS_LABELS = {
  [VERIFICATION_STATUS.PENDING]: 'Pending Review',
  [VERIFICATION_STATUS.APPROVED]: 'Approved',
  [VERIFICATION_STATUS.REJECTED]: 'Rejected',
};

// Status Colors (for badges)
export const STATUS_COLORS = {
  [VERIFICATION_STATUS.PENDING]: 'warning',
  [VERIFICATION_STATUS.APPROVED]: 'success',
  [VERIFICATION_STATUS.REJECTED]: 'error',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_VERIFICATION: '/auth/request-verification',
    MY_VERIFICATIONS: '/auth/verifications',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    SEARCH: '/users/search',
    BY_ORG: (orgId) => `/users/organization/${orgId}`,
    BY_DEPT: (deptId) => `/users/department/${deptId}`,
    BY_ID: (id) => `/users/${id}`,
  },
  
  // Organizations
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id) => `/organizations/${id}`,
    STATS: (id) => `/organizations/${id}/stats`,
    TOGGLE_COMMENTS: (id) => `/organizations/${id}/toggle-comments`,
  },
  
  // Departments
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    BY_ORG: (orgId) => `/departments/organization/${orgId}`,
    STATS: (id) => `/departments/${id}/stats`,
  },
  
  // Blogs
  BLOGS: {
    BASE: '/blogs',
    TRENDING: '/blogs/trending',
    MY_BLOGS: '/blogs/my/blogs',
    BY_ID: (id) => `/blogs/${id}`,
  },
  
  // Comments
  COMMENTS: {
    BY_BLOG: (blogId) => `/blogs/${blogId}/comments`,
    BY_ID: (id) => `/comments/${id}`,
  },
  
  // Likes
  LIKES: {
    TOGGLE: (blogId) => `/blogs/${blogId}/like`,
    INFO: (blogId) => `/blogs/${blogId}/likes`,
    USERS: (blogId) => `/blogs/${blogId}/likes/users`,
    USER_LIKED: (userId) => `/users/${userId}/liked-blogs`,
  },
  
  // Admin
  ADMIN: {
    SUPER: {
      ASSIGN_ORG_ADMIN: '/admin/super/assign-org-admin',
      STATS: '/admin/super/stats',
    },
    ORG: {
      ASSIGN_DEPT_ADMIN: '/admin/org/assign-dept-admin',
      REMOVE_DEPT_ADMIN: '/admin/org/remove-dept-admin',
      VERIFICATIONS: '/admin/org/verifications',
      STATS: '/admin/org/stats',
    },
    DEPT: {
      VERIFICATIONS: '/admin/dept/verifications',
      STATS: '/admin/dept/stats',
    },
    VERIFICATIONS: {
      APPROVE: (id) => `/admin/verifications/${id}/approve`,
      REJECT: (id) => `/admin/verifications/${id}/reject`,
    },
  },
  
  // Upload
  UPLOAD: '/upload',
};

// Routes (frontend paths)
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Public
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_DETAIL: (id) => `/organizations/${id}`,
  BLOGS: '/blogs',
  BLOG_DETAIL: (id) => `/blogs/${id}`,
  
  // User
  DASHBOARD: '/dashboard',
  MY_BLOGS: '/my-blogs',
  CREATE_BLOG: '/create-blog',
  EDIT_BLOG: (id) => `/edit-blog/${id}`,
  PROFILE: '/profile',
  REQUEST_VERIFICATION: '/request-verification',
  
  // Admin
  SUPER_ADMIN_DASHBOARD: '/admin/super',
  ORG_ADMIN_DASHBOARD: '/admin/organization',
  DEPT_ADMIN_DASHBOARD: '/admin/department',
  MANAGE_ORGS: '/admin/organizations',
  MANAGE_DEPTS: '/admin/departments',
  MANAGE_VERIFICATIONS: '/admin/verifications',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  BLOG_LIMIT: 12,
  COMMENT_LIMIT: 20,
  USER_LIMIT: 20,
};

// Upload
export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  TYPES: {
    BLOG: 'blogs',
    AVATAR: 'avatars',
    ORG: 'organizations',
    DEPT: 'departments',
  },
};

// Toast duration
export const TOAST_DURATION = 3000;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'blog_platform_token',
  USER: 'blog_platform_user',
  THEME: 'blog_platform_theme',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  BLOG_CREATED: 'Blog created successfully!',
  BLOG_UPDATED: 'Blog updated successfully!',
  BLOG_DELETED: 'Blog deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  VERIFICATION_REQUESTED: 'Verification request submitted!',
  VERIFICATION_APPROVED: 'Verification approved!',
  VERIFICATION_REJECTED: 'Verification rejected!',
};