import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import Department from '../models/Department.js';
import Blog from '../models/Blog.js';
import Like from '../models/Like.js';
import { MESSAGES } from '../utils/constants.js';

/**
 * @desc    Get all organizations
 * @route   GET /api/organizations
 * @access  Public
 */
export const getOrganizations = async (req, res) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;

    const query = {};
    // Only filter by active if explicitly provided
    if (active !== undefined) {
      query.active = active === 'true' || active === true;
    }

    const organizations = await Organization.find(query)
      .populate('adminId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Organization.countDocuments(query);

    res.status(200).json({
      success: true,
      count: organizations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: {
        organizations: organizations.map((org) => ({
          id: org._id,
          name: org.name,
          about: org.about,
          logo: org.logo,
          coverImage: org.coverImage,
          website: org.website,
          admin: org.adminId,
          commentsEnabled: org.commentsEnabled,
          stats: org.stats,
          createdAt: org.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get organization by ID
 * @route   GET /api/organizations/:id
 * @access  Public
 */
export const getOrganizationById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization ID',
      });
    }

    const organization = await Organization.findById(req.params.id)
      .populate('adminId', 'name email avatar')
      .populate('departments'); // Virtual populate

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Get recent blogs
    const recentBlogs = await Blog.find({ orgId: organization._id, published: true })
      .populate('authorId', 'name avatar')
      .populate('deptId', 'name')
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
        organization: {
          id: organization._id,
          name: organization.name,
          about: organization.about,
          logo: organization.logo,
          coverImage: organization.coverImage,
          website: organization.website,
          email: organization.email,
          phone: organization.phone,
          admin: organization.adminId,
          commentsEnabled: organization.commentsEnabled,
          stats: organization.stats,
          departments: organization.departments,
          recentBlogs: blogsWithLikeStatus,
          createdAt: organization.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create organization (Super Admin only)
 * @route   POST /api/organizations
 * @access  Private (Super Admin)
 */
export const createOrganization = async (req, res) => {
  try {
    const { name, about, logo, coverImage, website, email, phone, adminId } = req.body;

    // Validation
    if (!name || !about || !adminId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, about, and adminId',
      });
    }

    // Check if organization with same name exists
    const existing = await Organization.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this name already exists',
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      about,
      logo,
      coverImage,
      website,
      email,
      phone,
      adminId,
      commentsEnabled: true,
    });

    const populatedOrg = await Organization.findById(organization._id).populate(
      'adminId',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: MESSAGES.SUCCESS.CREATED,
      data: {
        organization: populatedOrg,
      },
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update organization
 * @route   PATCH /api/organizations/:id
 * @access  Private (Org Admin or Super Admin)
 */
export const updateOrganization = async (req, res) => {
  try {
    const { name, about, logo, coverImage, website, email, phone } = req.body;

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Update fields
    if (name) organization.name = name;
    if (about) organization.about = about;
    if (logo !== undefined) organization.logo = logo;
    if (coverImage !== undefined) organization.coverImage = coverImage;
    if (website !== undefined) organization.website = website;
    if (email !== undefined) organization.email = email;
    if (phone !== undefined) organization.phone = phone;

    await organization.save();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.UPDATED,
      data: {
        organization,
      },
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Toggle comments for organization
 * @route   PATCH /api/organizations/:id/toggle-comments
 * @access  Private (Org Admin)
 */
export const toggleComments = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    await organization.toggleComments();

    res.status(200).json({
      success: true,
      message: `Comments ${organization.commentsEnabled ? 'enabled' : 'disabled'} successfully`,
      data: {
        commentsEnabled: organization.commentsEnabled,
      },
    });
  } catch (error) {
    console.error('Toggle comments error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete organization (Super Admin only)
 * @route   DELETE /api/organizations/:id
 * @access  Private (Super Admin)
 */
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Delete all departments first
    await Department.deleteMany({ orgId: organization._id });

    // Delete organization
    await organization.deleteOne();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.DELETED,
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get organization statistics
 * @route   GET /api/organizations/:id/stats
 * @access  Public
 */
export const getOrganizationStats = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Update stats
    await Organization.updateStats(organization._id);

    // Get fresh stats
    const updatedOrg = await Organization.findById(organization._id);

    res.status(200).json({
      success: true,
      data: {
        stats: updatedOrg.stats,
      },
    });
  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};