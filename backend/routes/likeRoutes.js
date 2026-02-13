import express from 'express';
import {
  toggleLike,
  getLikeInfo,
  getLikeUsers,
  getUserLikedBlogs,
} from '../controllers/likeController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==================== BLOG LIKE ROUTES ====================

/**
 * @route   POST /api/blogs/:blogId/like
 * @desc    Toggle like on blog (like if not liked, unlike if already liked)
 * @access  Private (Any authenticated user)
 */
router.post('/blogs/:blogId/like', authenticate, toggleLike);

/**
 * @route   GET /api/blogs/:blogId/likes
 * @desc    Get like count and whether current user has liked
 * @access  Public (optionally authenticated to see hasLiked)
 */
router.get('/blogs/:blogId/likes', optionalAuthenticate, getLikeInfo);

/**
 * @route   GET /api/blogs/:blogId/likes/users?page=1&limit=20
 * @desc    Get list of users who liked the blog
 * @access  Public
 */
router.get('/blogs/:blogId/likes/users', getLikeUsers);

// ==================== USER LIKE ROUTES ====================

/**
 * @route   GET /api/users/:userId/liked-blogs?page=1&limit=10
 * @desc    Get all blogs liked by a specific user
 * @access  Public
 */
router.get('/users/:userId/liked-blogs', getUserLikedBlogs);

export default router;