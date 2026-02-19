import mongoose from 'mongoose';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { MESSAGES } from '../utils/constants.js';

/**
 * @desc    Get user by ID (public profile)
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('orgId', 'name logo')
      .populate('deptId', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's blog count
    const blogCount = await Blog.countDocuments({ authorId: user._id, published: true });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          organization: user.orgId,
          department: user.deptId,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
          blogCount,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all users (with filters)
 * @route   GET /api/users
 * @access  Public
 */
export const getUsers = async (req, res) => {
  try {
    const { orgId, deptId, role, verified, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (orgId) query.orgId = orgId;
    if (deptId) query.deptId = deptId;
    if (role) query.role = role;
    if (verified !== undefined) query.verified = verified === 'true';

    // Get users
    const users = await User.find(query)
      .select('-password')
      .populate('orgId', 'name logo')
      .populate('deptId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          organization: user.orgId,
          department: user.deptId,
          avatar: user.avatar,
          createdAt: user.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Search users by name or email
 * @route   GET /api/users/search
 * @access  Public
 */
export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email avatar role verified orgId deptId')
      .populate('orgId', 'name')
      .populate('deptId', 'name')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get users by organization
 * @route   GET /api/users/organization/:orgId
 * @access  Public
 */
export const getUsersByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const users = await User.findByOrg(orgId)
      .select('-password')
      .populate('deptId', 'name')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ orgId, verified: true });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.deptId,
          avatar: user.avatar,
        })),
      },
    });
  } catch (error) {
    console.error('Get users by org error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get users by department
 * @route   GET /api/users/department/:deptId
 * @access  Public
 */
export const getUsersByDept = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(deptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID',
      });
    }

    const users = await User.findByDept(deptId)
      .select('-password')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ deptId, verified: true });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        })),
      },
    });
  } catch (error) {
    console.error('Get users by dept error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};