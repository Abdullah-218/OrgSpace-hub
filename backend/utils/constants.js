/**
 * Application-wide constants
 * These should match the enum values in your Mongoose models
 */

// User Roles
export const ROLES = {
  GLOBAL: 'global',           // Unverified user (can read, like, share)
  VERIFIED: 'verified',       // Verified user (can post blogs)
  DEPT_ADMIN: 'dept_admin',   // Department admin (can moderate dept)
  ORG_ADMIN: 'org_admin',     // Organization admin (can manage org)
  SUPER_ADMIN: 'super_admin', // Platform admin (can manage platform)
};

// Role hierarchy (for permission checking)
export const ROLE_HIERARCHY = {
  [ROLES.GLOBAL]: 0,
  [ROLES.VERIFIED]: 1,
  [ROLES.DEPT_ADMIN]: 2,
  [ROLES.ORG_ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

// API Response Messages
export const MESSAGES = {
  // Success
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    VERIFICATION_APPROVED: 'Verification request approved',
    VERIFICATION_REJECTED: 'Verification request rejected',
  },
  
  // Errors
  ERROR: {
    UNAUTHORIZED: 'Not authorized',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION: 'Validation error',
    SERVER: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    ALREADY_VERIFIED: 'User is already verified',
    NOT_VERIFIED: 'User must be verified to perform this action',
    INVALID_ROLE: 'Invalid user role',
  },
};

// JWT Configuration
export const JWT_CONFIG = {
  EXPIRES_IN: '7d', // Token expiration time
  COOKIE_EXPIRES_IN: 7, // Cookie expiration in days
};

// Helper function to check if role has permission
export const hasPermission = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Helper function to check if user can access resource
export const canAccessOrg = (user, orgId) => {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if (user.role === ROLES.ORG_ADMIN && user.orgId?.toString() === orgId.toString()) return true;
  return false;
};

export const canAccessDept = (user, deptId) => {
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if (user.role === ROLES.ORG_ADMIN && user.orgId) return true; // Org admin can access all depts in their org
  if (user.role === ROLES.DEPT_ADMIN && user.deptId?.toString() === deptId.toString()) return true;
  return false;
};