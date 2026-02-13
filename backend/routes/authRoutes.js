import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  requestVerification,
  getMyVerifications,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/auth/register
 * @desc    Register new user (becomes global user by default)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and receive JWT token
 * @access  Public
 */
router.post('/login', login);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile with org/dept info
 * @access  Private (any authenticated user)
 */
router.get('/me', authenticate, getMe);

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update user profile (name, bio, avatar)
 * @access  Private
 */
router.patch('/profile', authenticate, updateProfile);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.patch('/change-password', authenticate, changePassword);

/**
 * @route   POST /api/auth/request-verification
 * @desc    Request verification to join an organization and department
 * @access  Private (authenticated users)
 */
router.post('/request-verification', authenticate, requestVerification);

/**
 * @route   GET /api/auth/verifications
 * @desc    Get user's verification request history
 * @access  Private
 */
router.get('/verifications', authenticate, getMyVerifications);

export default router;