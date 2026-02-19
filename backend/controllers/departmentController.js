import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Blog from '../models/Blog.js';
import Like from '../models/Like.js';
import { MESSAGES } from '../utils/constants.js';

/**
 * @desc    Get all departments (with optional org filter)
 * @route   GET /api/departments
 * @access  Public
 */
export const getDepartments = async (req, res) => {
  try {
    const { orgId, active, page = 1, limit = 20 } = req.query;

    // Validate ObjectId if provided
    if (orgId && !mongoose.isValidObjectId(orgId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization ID',
      });
    }

    const query = {};
    if (orgId) query.orgId = orgId;
    // Only filter by active if explicitly provided
    if (active !== undefined) {
      query.active = active === 'true' || active === true;
    }

    const departments = await Department.find(query)
      .populate('orgId', 'name logo')
      .populate('adminIds', 'name email avatar')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Department.countDocuments(query);

    res.status(200).json({
      success: true,
      count: departments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        departments: departments.map((dept) => ({
          id: dept._id,
          name: dept.name,
          description: dept.description,
          organization: dept.orgId,
          admins: dept.adminIds,
          image: dept.image,
          stats: dept.stats,
          createdAt: dept.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get department by ID
 * @route   GET /api/departments/:id
 * @access  Public
 */
export const getDepartmentById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID',
      });
    }

    const department = await Department.findById(req.params.id)
      .populate('orgId', 'name logo about')
      .populate('adminIds', 'name email avatar')
      .populate('blogs'); // Virtual populate

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Get recent blogs
    const recentBlogs = await Blog.find({ deptId: department._id, published: true })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Add hasLiked status if user is authenticated
    let blogsWithLikeStatus = recentBlogs;
    if (req.user) {
      blogsWithLikeStatus = await Promise.all(
        recentBlogs.map(async (blog) => {
          const hasLiked = await Like.hasLiked(blog._id, req.user._id);
          return {
            ...blog.toObject(),
            hasLiked,
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      data: {
        department: {
          id: department._id,
          name: department.name,
          description: department.description,
          organization: department.orgId,
          admins: department.adminIds,
          image: department.image,
          stats: department.stats,
          recentBlogs: blogsWithLikeStatus,
          createdAt: department.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create department (Org Admin only)
 * @route   POST /api/departments
 * @access  Private (Org Admin)
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, description, orgId, image } = req.body;

    // Validation
    if (!name || !description || !orgId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, and orgId',
      });
    }

    // Check if department with same name exists in this org
    const existing = await Department.findOne({ name, orgId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists in this organization',
      });
    }

    // Create department
    const department = await Department.create({
      name,
      description,
      orgId,
      image,
    });

    const populatedDept = await Department.findById(department._id).populate('orgId', 'name');

    res.status(201).json({
      success: true,
      message: MESSAGES.SUCCESS.CREATED,
      data: {
        department: populatedDept,
      },
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update department
 * @route   PATCH /api/departments/:id
 * @access  Private (Dept Admin or Org Admin)
 */
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Update fields
    if (name) department.name = name;
    if (description) department.description = description;
    if (image !== undefined) department.image = image;

    await department.save();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.UPDATED,
      data: {
        department,
      },
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete department (Org Admin only)
 * @route   DELETE /api/departments/:id
 * @access  Private (Org Admin)
 */
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.DELETED,
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get departments by organization
 * @route   GET /api/departments/organization/:orgId
 * @access  Public
 */
export const getDepartmentsByOrg = async (req, res) => {
  try {
    const { orgId } = req.params;

    const departments = await Department.findByOrg(orgId);

    res.status(200).json({
      success: true,
      count: departments.length,
      data: {
        departments,
      },
    });
  } catch (error) {
    console.error('Get departments by org error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get department statistics
 * @route   GET /api/departments/:id/stats
 * @access  Public
 */
export const getDepartmentStats = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Update stats
    await Department.updateStats(department._id);

    // Get fresh stats
    const updatedDept = await Department.findById(department._id);

    res.status(200).json({
      success: true,
      data: {
        stats: updatedDept.stats,
      },
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};