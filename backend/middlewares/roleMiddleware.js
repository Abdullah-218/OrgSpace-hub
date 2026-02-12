import { ROLES, ROLE_HIERARCHY, MESSAGES } from '../utils/constants.js';

/**
 * Authorize based on roles
 * Checks if user's role is allowed to access the route
 * 
 * @param {Array} allowedRoles - Array of roles that can access this route
 * @returns {Function} Middleware function
 * 
 * Usage:
 * router.post('/create', authenticate, authorize([ROLES.VERIFIED]), controller)
 * router.post('/admin', authenticate, authorize([ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN]), controller)
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED,
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN,
        info: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Require minimum role level
 * User's role must be at least the specified level
 * 
 * @param {String} minimumRole - Minimum required role
 * @returns {Function} Middleware function
 * 
 * Usage:
 * router.post('/moderate', authenticate, requireMinRole(ROLES.DEPT_ADMIN), controller)
 */
export const requireMinRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED,
      });
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role];
    const minRoleLevel = ROLE_HIERARCHY[minimumRole];

    if (userRoleLevel < minRoleLevel) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN,
        info: `This action requires at least ${minimumRole} role`,
      });
    }

    next();
  };
};

/**
 * Require user to be verified
 * User must have verified status
 * 
 * Usage:
 * router.post('/create-blog', authenticate, requireVerified, controller)
 */
export const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: MESSAGES.ERROR.UNAUTHORIZED,
    });
  }

  if (!req.user.verified) {
    return res.status(403).json({
      success: false,
      message: MESSAGES.ERROR.NOT_VERIFIED,
      info: 'Please request verification for an organization and department first',
    });
  }

  next();
};

/**
 * Check if user is super admin
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin only.',
    });
  }
  next();
};

/**
 * Check if user is organization admin
 * Optionally verify they're admin of a specific org
 * 
 * @param {String} orgIdParam - Request param name containing orgId (optional)
 */
export const requireOrgAdmin = (orgIdParam = null) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== ROLES.ORG_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Organization admin only.',
      });
    }

    // If checking specific org
    if (orgIdParam) {
      const orgId = req.params[orgIdParam] || req.body.orgId;
      
      if (req.user.orgId.toString() !== orgId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only manage your own organization.',
        });
      }
    }

    next();
  };
};

/**
 * Check if user is department admin
 * Optionally verify they're admin of a specific dept
 * 
 * @param {String} deptIdParam - Request param name containing deptId (optional)
 */
export const requireDeptAdmin = (deptIdParam = null) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== ROLES.DEPT_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Department admin only.',
      });
    }

    // If checking specific dept
    if (deptIdParam) {
      const deptId = req.params[deptIdParam] || req.body.deptId;
      
      if (req.user.deptId.toString() !== deptId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only manage your own department.',
        });
      }
    }

    next();
  };
};

/**
 * Check if user belongs to a specific organization
 */
export const requireOrgMembership = (orgIdParam = 'orgId') => {
  return (req, res, next) => {
    if (!req.user || !req.user.verified) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified member to perform this action',
      });
    }

    const orgId = req.params[orgIdParam] || req.body.orgId;

    if (req.user.orgId.toString() !== orgId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only perform this action in your own organization.',
      });
    }

    next();
  };
};

/**
 * Check if user belongs to a specific department
 */
export const requireDeptMembership = (deptIdParam = 'deptId') => {
  return (req, res, next) => {
    if (!req.user || !req.user.verified) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified member to perform this action',
      });
    }

    const deptId = req.params[deptIdParam] || req.body.deptId;

    if (req.user.deptId.toString() !== deptId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only perform this action in your own department.',
      });
    }

    next();
  };
};

export default authorize;