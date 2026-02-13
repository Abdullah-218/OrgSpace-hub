import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import Organization from '../models/Organization.js';
import { MESSAGES } from '../utils/constants.js';

/**
 * @desc    Get comments for a blog
 * @route   GET /api/blogs/:blogId/comments
 * @access  Public
 */
export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.getByBlog(req.params.blogId, { page, limit });

    const total = await Comment.countDocuments({ blogId: req.params.blogId });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: { comments },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add comment to blog
 * @route   POST /api/blogs/:blogId/comments
 * @access  Private (Verified users, if org allows comments)
 */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const comment = await Comment.create({
      text,
      blogId: req.params.blogId,
      userId: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: populatedComment },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update comment
 * @route   PATCH /api/comments/:id
 * @access  Private (Comment author only)
 */
export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: MESSAGES.ERROR.FORBIDDEN });
    }

    await comment.updateText(text);

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.UPDATED,
      data: { comment },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Author, Dept Admin, Org Admin, Super Admin)
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const canDelete = await comment.canDelete(req.user);
    if (!canDelete) {
      return res.status(403).json({ success: false, message: MESSAGES.ERROR.FORBIDDEN });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.DELETED,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};