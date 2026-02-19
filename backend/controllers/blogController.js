import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import { MESSAGES, PAGINATION } from '../utils/constants.js';

/**
 * @desc    Get all blogs (with filters)
 * @route   GET /api/blogs
 * @access  Public
 */
export const getBlogs = async (req, res) => {
  try {
    const {
      orgId,
      deptId,
      authorId,
      published = true,
      featured,
      tags,
      search,
      page = 1,
      limit = PAGINATION.DEFAULT_LIMIT,
      sort = '-createdAt',
    } = req.query;

    // Validate ObjectIds
    if (orgId && !mongoose.isValidObjectId(orgId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization ID',
      });
    }
    if (deptId && !mongoose.isValidObjectId(deptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID',
      });
    }
    if (authorId && !mongoose.isValidObjectId(authorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid author ID',
      });
    }

    const blogs = await Blog.getFiltered(
      { orgId, deptId, authorId, published, featured, tags, search },
      { page, limit, sort }
    );

    // Add hasLiked status for each blog if user is authenticated
    let blogsWithLikeStatus = blogs;
    if (req.user) {
      blogsWithLikeStatus = await Promise.all(
        blogs.map(async (blog) => {
          const hasLiked = await Like.hasLiked(blog._id, req.user._id);
          return {
            ...blog.toObject(),
            hasLiked,
          };
        })
      );
    }

    const query = { published };
    if (orgId) query.orgId = orgId;
    if (deptId) query.deptId = deptId;
    if (authorId) query.authorId = authorId;

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        blogs: blogsWithLikeStatus,
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get trending blogs
 * @route   GET /api/blogs/trending
 * @access  Public
 */
export const getTrendingBlogs = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const blogs = await Blog.getTrending(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    console.error('Get trending blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('authorId', 'name email avatar')
      .populate('orgId', 'name logo')
      .populate('deptId', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Increment view count
    await Blog.incrementViews(blog._id);

    // Check if current user has liked (if authenticated)
    let hasLiked = false;
    if (req.user) {
      hasLiked = await Like.hasLiked(blog._id, req.user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        blog: {
          id: blog._id,
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          coverImage: blog.coverImage,
          author: blog.authorId,
          organization: blog.orgId,
          department: blog.deptId,
          likesCount: blog.likesCount,
          commentsCount: blog.commentsCount,
          viewsCount: blog.viewsCount + 1,
          tags: blog.tags,
          slug: blog.slug,
          published: blog.published,
          featured: blog.featured,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          hasLiked,
        },
      },
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create blog
 * @route   POST /api/blogs
 * @access  Private (Verified users only)
 */
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, published = true } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content',
      });
    }

    // User must be verified
    if (!req.user.verified) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.NOT_VERIFIED,
      });
    }

    // Create blog with user's org and dept
    const blog = await Blog.create({
      title,
      content,
      excerpt,
      coverImage,
      tags: tags || [],
      published,
      authorId: req.user._id,
      orgId: req.user.orgId,
      deptId: req.user.deptId,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name avatar')
      .populate('orgId', 'name logo')
      .populate('deptId', 'name');

    res.status(201).json({
      success: true,
      message: MESSAGES.SUCCESS.CREATED,
      data: {
        blog: populatedBlog,
      },
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update blog
 * @route   PATCH /api/blogs/:id
 * @access  Private (Author, Dept Admin, Org Admin, Super Admin)
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, tags, published, featured, pinned } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if user can edit
    if (!blog.canEdit(req.user)) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN,
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (tags) blog.tags = tags;
    if (published !== undefined) blog.published = published;
    if (featured !== undefined) blog.featured = featured;
    if (pinned !== undefined) blog.pinned = pinned;

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate('authorId', 'name avatar')
      .populate('orgId', 'name')
      .populate('deptId', 'name');

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.UPDATED,
      data: {
        blog: populatedBlog,
      },
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private (Author, Dept Admin, Org Admin, Super Admin)
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if user can edit
    if (!blog.canEdit(req.user)) {
      return res.status(403).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN,
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.DELETED,
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get my blogs
 * @route   GET /api/blogs/my-blogs
 * @access  Private
 */
export const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, published } = req.query;

    const query = { authorId: req.user._id };
    if (published !== undefined) query.published = published === 'true';

    const blogs = await Blog.find(query)
      .populate('orgId', 'name')
      .populate('deptId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        blogs,
      },
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};