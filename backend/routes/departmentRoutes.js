import express from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByOrg,
  getDepartmentStats,
} from '../controllers/departmentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireOrgAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/departments?orgId=...&page=1&limit=20
 * @desc    Get all departments with optional organization filter
 * @access  Public
 */
router.get('/', getDepartments);

/**
 * @route   GET /api/departments/organization/:orgId
 * @desc    Get all departments for a specific organization
 * @access  Public
 */
router.get('/organization/:orgId', getDepartmentsByOrg);

/**
 * @route   GET /api/departments/:id
 * @desc    Get department by ID with recent blogs
 * @access  Public
 */
router.get('/:id', getDepartmentById);

/**
 * @route   GET /api/departments/:id/stats
 * @desc    Get department statistics (members, blogs count)
 * @access  Public
 */
router.get('/:id/stats', getDepartmentStats);

// ==================== ORG ADMIN ROUTES ====================

/**
 * @route   POST /api/departments
 * @desc    Create new department in organization
 * @access  Private (Org Admin)
 */
router.post('/', authenticate, createDepartment);

/**
 * @route   PATCH /api/departments/:id
 * @desc    Update department details
 * @access  Private (Dept Admin or Org Admin)
 */
router.patch('/:id', authenticate, updateDepartment);

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department
 * @access  Private (Org Admin)
 */
router.delete('/:id', authenticate, deleteDepartment);

export default router;