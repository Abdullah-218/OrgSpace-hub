import Like from '../models/Like.js';

/**
 * @desc    Toggle like on blog
 * @route   POST /api/blogs/:blogId/like
 * @access  Private (Authenticated users)
 */
export const toggleLike = async (req, res) => {
  try {
    const result = await Like.toggleLike(req.params.blogId, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        liked: result.liked,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get blog like status and count
 * @route   GET /api/blogs/:blogId/likes
 * @access  Public
 */
export const getLikeInfo = async (req, res) => {
  try {
    const likesCount = await Like.countByBlog(req.params.blogId);
    
    let hasLiked = false;
    if (req.user) {
      hasLiked = await Like.hasLiked(req.params.blogId, req.user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        likesCount,
        hasLiked,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get users who liked a blog
 * @route   GET /api/blogs/:blogId/likes/users
 * @access  Public
 */
export const getLikeUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const likes = await Like.getByBlog(req.params.blogId, { page, limit });

    res.status(200).json({
      success: true,
      count: likes.length,
      data: {
        users: likes.map((like) => like.userId),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get blogs liked by user
 * @route   GET /api/users/:userId/liked-blogs
 * @access  Public
 */
export const getUserLikedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const likes = await Like.getByUser(req.params.userId, { page, limit });

    res.status(200).json({
      success: true,
      count: likes.length,
      data: {
        blogs: likes.map((like) => like.blogId),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};