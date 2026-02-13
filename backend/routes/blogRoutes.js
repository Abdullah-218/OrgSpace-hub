import express from 'express';
import {
  getBlogs,
  getTrendingBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from '../controllers/blogController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware.js';
import { requireVerified } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/blogs/trending?limit=10
 * @desc    Get trending blogs (most liked in last 7 days)
 * @access  Public
 */
router.get('/trending', getTrendingBlogs);

/**
 * @route   GET /api/blogs?page=1&limit=10&orgId=...&deptId=...&authorId=...
 * @desc    Get all published blogs with filters and pagination
 * @access  Public
 */
router.get('/', getBlogs);

/**
 * @route   GET /api/blogs/:id
 * @desc    Get blog by ID (increments view count, shows if user liked)
 * @access  Public (optionally authenticated)
 */
router.get('/:id', optionalAuthenticate, getBlogById);

// ==================== PROTECTED ROUTES (VERIFIED USERS) ====================

/**
 * @route   POST /api/blogs
 * @desc    Create new blog (auto-assigned to user's org/dept)
 * @access  Private (Verified users only)
 */
router.post('/', authenticate, requireVerified, createBlog);

/**
 * @route   GET /api/blogs/my/blogs
 * @desc    Get current user's blogs (published and drafts)
 * @access  Private
 */
router.get('/my/blogs', authenticate, getMyBlogs);

/**
 * @route   PATCH /api/blogs/:id
 * @desc    Update blog (author, dept admin, org admin, super admin)
 * @access  Private
 */
router.patch('/:id', authenticate, updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog (author, dept admin, org admin, super admin)
 * @access  Private
 */
router.delete('/:id', authenticate, deleteBlog);

export default router;