import express from 'express';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  toggleComments,
  deleteOrganization,
  getOrganizationStats,
} from '../controllers/organizationController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware.js';
import { requireSuperAdmin, requireOrgAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/organizations?page=1&limit=20&active=true
 * @desc    Get all organizations with pagination
 * @access  Public
 */
router.get('/', getOrganizations);

/**
 * @route   GET /api/organizations/:id
 * @desc    Get organization by ID with departments and recent blogs
 * @access  Public (optionally authenticated to see hasLiked)
 */
router.get('/:id', optionalAuthenticate, getOrganizationById);

/**
 * @route   GET /api/organizations/:id/stats
 * @desc    Get organization statistics (members, depts, blogs count)
 * @access  Public
 */
router.get('/:id/stats', getOrganizationStats);

// ==================== SUPER ADMIN ROUTES ====================

/**
 * @route   POST /api/organizations
 * @desc    Create new organization
 * @access  Private (Super Admin only)
 */
router.post('/', authenticate, requireSuperAdmin, createOrganization);

/**
 * @route   DELETE /api/organizations/:id
 * @desc    Delete organization and all its departments
 * @access  Private (Super Admin only)
 */
router.delete('/:id', authenticate, requireSuperAdmin, deleteOrganization);

// ==================== ORG ADMIN ROUTES ====================

/**
 * @route   PATCH /api/organizations/:id
 * @desc    Update organization details
 * @access  Private (Org Admin of this organization)
 */
router.patch('/:id', authenticate, requireOrgAdmin('id'), updateOrganization);

/**
 * @route   PATCH /api/organizations/:id/toggle-comments
 * @desc    Enable/disable comments for entire organization
 * @access  Private (Org Admin of this organization)
 */
router.patch('/:id/toggle-comments', authenticate, requireOrgAdmin('id'), toggleComments);

export default router;