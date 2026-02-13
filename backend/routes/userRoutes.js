import express from 'express';
import {
  getUserById,
  getUsers,
  searchUsers,
  getUsersByOrg,
  getUsersByDept,
} from '../controllers/userController.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/users/search?q=john
 * @desc    Search users by name or email
 * @access  Public
 */
router.get('/search', searchUsers);

/**
 * @route   GET /api/users/organization/:orgId
 * @desc    Get all verified users in an organization
 * @access  Public
 */
router.get('/organization/:orgId', getUsersByOrg);

/**
 * @route   GET /api/users/department/:deptId
 * @desc    Get all verified users in a department
 * @access  Public
 */
router.get('/department/:deptId', getUsersByDept);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (public profile)
 * @access  Public
 */
router.get('/:id', getUserById);

/**
 * @route   GET /api/users?orgId=...&deptId=...&role=...&verified=true
 * @desc    Get all users with optional filters
 * @access  Public
 */
router.get('/', getUsers);

export default router;