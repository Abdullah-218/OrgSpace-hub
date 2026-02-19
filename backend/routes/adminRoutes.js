import express from 'express';
import {
  // Super Admin actions
  assignOrgAdmin,
  getPlatformStats,
  getAllUsers,
  // Org Admin actions
  assignDeptAdmin,
  removeDeptAdmin,
  getOrgVerifications,
  getOrgStats,
  // Dept Admin actions
  getDeptVerifications,
  getDeptStats,
  // Shared admin actions
  approveVerification,
  rejectVerification,
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  requireSuperAdmin,
  requireOrgAdmin,
  requireDeptAdmin,
} from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ==================== SUPER ADMIN ROUTES ====================

/**
 * @route   POST /api/admin/super/assign-org-admin
 * @desc    Assign a user as organization admin
 * @access  Private (Super Admin only)
 * @body    { userId, orgId }
 */
router.post('/super/assign-org-admin', authenticate, requireSuperAdmin, assignOrgAdmin);

/**
 * @route   GET /api/admin/super/stats
 * @desc    Get platform-wide statistics
 * @access  Private (Super Admin only)
 */
router.get('/super/stats', authenticate, requireSuperAdmin, getPlatformStats);

/**
 * @route   GET /api/admin/super/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Super Admin only)
 */
router.get('/super/users', authenticate, requireSuperAdmin, getAllUsers);

// ==================== ORG ADMIN ROUTES ====================

/**
 * @route   POST /api/admin/org/assign-dept-admin
 * @desc    Assign a verified user as department admin
 * @access  Private (Org Admin)
 * @body    { userId, deptId }
 */
router.post('/org/assign-dept-admin', authenticate, requireOrgAdmin(), assignDeptAdmin);

/**
 * @route   POST /api/admin/org/remove-dept-admin
 * @desc    Remove department admin (demote to verified user)
 * @access  Private (Org Admin)
 * @body    { userId, deptId }
 */
router.post('/org/remove-dept-admin', authenticate, requireOrgAdmin(), removeDeptAdmin);

/**
 * @route   GET /api/admin/org/verifications
 * @desc    Get all pending verification requests for organization
 * @access  Private (Org Admin)
 */
router.get('/org/verifications', authenticate, requireOrgAdmin(), getOrgVerifications);

/**
 * @route   GET /api/admin/org/stats
 * @desc    Get organization statistics (members, depts, blogs, pending verifications)
 * @access  Private (Org Admin)
 */
router.get('/org/stats', authenticate, requireOrgAdmin(), getOrgStats);

// ==================== DEPT ADMIN ROUTES ====================

/**
 * @route   GET /api/admin/dept/verifications
 * @desc    Get all pending verification requests for department
 * @access  Private (Dept Admin)
 */
router.get('/dept/verifications', authenticate, requireDeptAdmin(), getDeptVerifications);

/**
 * @route   GET /api/admin/dept/stats
 * @desc    Get department statistics (members, blogs, pending verifications)
 * @access  Private (Dept Admin)
 */
router.get('/dept/stats', authenticate, requireDeptAdmin(), getDeptStats);

// ==================== SHARED ADMIN ROUTES ====================
// These can be accessed by Dept Admin, Org Admin, or Super Admin
// Permission checking happens in the controller based on context

/**
 * @route   PATCH /api/admin/verifications/:id/approve
 * @desc    Approve verification request (user becomes verified)
 * @access  Private (Dept Admin, Org Admin, Super Admin)
 * @body    { reviewNote: "optional note" }
 */
router.patch('/verifications/:id/approve', authenticate, approveVerification);

/**
 * @route   PATCH /api/admin/verifications/:id/reject
 * @desc    Reject verification request (user stays unverified)
 * @access  Private (Dept Admin, Org Admin, Super Admin)
 * @body    { reviewNote: "optional note" }
 */
router.patch('/verifications/:id/reject', authenticate, rejectVerification);

export default router;