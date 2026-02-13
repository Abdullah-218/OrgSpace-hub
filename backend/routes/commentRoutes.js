import express from 'express';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireVerified } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// ==================== BLOG COMMENT ROUTES ====================

/**
 * @route   GET /api/blogs/:blogId/comments?page=1&limit=20
 * @desc    Get all comments for a specific blog
 * @access  Public
 */
router.get('/blogs/:blogId/comments', getComments);

/**
 * @route   POST /api/blogs/:blogId/comments
 * @desc    Add comment to blog (only if verified and org allows comments)
 * @access  Private (Verified users only)
 */
router.post('/blogs/:blogId/comments', authenticate, requireVerified, addComment);

// ==================== COMMENT OPERATIONS ====================

/**
 * @route   PATCH /api/comments/:id
 * @desc    Update comment text (comment author only)
 * @access  Private (Comment author)
 */
router.patch('/comments/:id', authenticate, updateComment);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete comment (author, dept admin, org admin, super admin)
 * @access  Private
 */
router.delete('/comments/:id', authenticate, deleteComment);

export default router;