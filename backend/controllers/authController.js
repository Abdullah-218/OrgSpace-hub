import User from '../models/User.js';
import Verification from '../models/Verification.js';
import Organization from '../models/Organization.js';
import Department from '../models/Department.js';
import generateToken from '../utils/generateToken.js';
import { ROLES, MESSAGES } from '../utils/constants.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.ERROR.EMAIL_EXISTS,
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      bio: bio || '',
      role: ROLES.GLOBAL, // Default role
      verified: false,
    });

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      role: user.role,
      email: user.email,
      verified: user.verified,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          bio: user.bio,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email })
      .select('+password')
      .populate('orgId', 'name logo')
      .populate('deptId', 'name');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      role: user.role,
      email: user.email,
      verified: user.verified,
      orgId: user.orgId?._id,
      deptId: user.deptId?._id,
    });

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGIN,
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
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('orgId', 'name logo about')
      .populate('deptId', 'name description');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.ERROR.NOT_FOUND,
      });
    }

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
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.ERROR.NOT_FOUND,
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.UPDATED,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Request verification for organization and department
 * @route   POST /api/auth/request-verification
 * @access  Private (authenticated users only)
 * @body    Can accept either:
 *          - { orgId, deptId } OR
 *          - { organizationName, departmentName } OR
 *          - Mix of both
 */
export const requestVerification = async (req, res) => {
  try {
    const { 
      orgId, 
      deptId, 
      organizationName, 
      departmentName, 
      message 
    } = req.body;

    let finalOrgId = orgId;
    let finalDeptId = deptId;

    // If organization name provided, look up ID
    if (organizationName && !orgId) {
      const org = await Organization.findOne({ 
        name: { $regex: new RegExp(`^${organizationName}$`, 'i') } // Case-insensitive
      });

      if (!org) {
        return res.status(404).json({
          success: false,
          message: `Organization "${organizationName}" not found`,
        });
      }

      finalOrgId = org._id;
    }

    // If department name provided, look up ID
    if (departmentName && !deptId) {
      const query = { 
        name: { $regex: new RegExp(`^${departmentName}$`, 'i') } 
      };
      
      // If we have orgId, search only in that organization
      if (finalOrgId) {
        query.orgId = finalOrgId;
      }

      const dept = await Department.findOne(query);

      if (!dept) {
        const orgInfo = finalOrgId ? ' in this organization' : '';
        return res.status(404).json({
          success: false,
          message: `Department "${departmentName}" not found${orgInfo}`,
        });
      }

      finalDeptId = dept._id;
      
      // If org wasn't specified, use the dept's org
      if (!finalOrgId) {
        finalOrgId = dept.orgId;
      }
    }

    // Validation
    if (!finalOrgId || !finalDeptId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide organization and department (either IDs or names)',
        hint: 'You can use: { orgId, deptId } OR { organizationName, departmentName }',
      });
    }

    // Verify department belongs to organization
    const dept = await Department.findById(finalDeptId);
    if (dept.orgId.toString() !== finalOrgId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Department does not belong to the specified organization',
      });
    }

    // Check if user is already verified
    if (req.user.verified) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.ERROR.ALREADY_VERIFIED,
      });
    }

    // Check if user already has a pending request for this org/dept
    const existingRequest = await Verification.findOne({
      userId: req.user._id,
      orgId: finalOrgId,
      deptId: finalDeptId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending verification request for this department',
      });
    }

    // Create verification request
    const verification = await Verification.create({
      userId: req.user._id,
      orgId: finalOrgId,
      deptId: finalDeptId,
      message: message || '',
      status: 'pending',
    });

    const populatedVerification = await Verification.findById(verification._id)
      .populate('orgId', 'name logo')
      .populate('deptId', 'name');

    res.status(201).json({
      success: true,
      message: 'Verification request submitted successfully',
      data: {
        verification: {
          id: populatedVerification._id,
          organization: populatedVerification.orgId,
          department: populatedVerification.deptId,
          message: populatedVerification.message,
          status: populatedVerification.status,
          requestedAt: populatedVerification.requestedAt,
        },
      },
    });
  } catch (error) {
    console.error('Request verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get user's verification history
 * @route   GET /api/auth/verifications
 * @access  Private
 */
export const getMyVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ userId: req.user._id })
      .populate('orgId', 'name logo')
      .populate('deptId', 'name')
      .populate('reviewedBy', 'name email')
      .sort({ requestedAt: -1 });

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: {
        verifications: verifications.map((v) => ({
          id: v._id,
          organization: v.orgId,
          department: v.deptId,
          message: v.message,
          status: v.status,
          requestedAt: v.requestedAt,
          reviewedBy: v.reviewedBy,
          reviewNote: v.reviewNote,
          reviewedAt: v.reviewedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Change password
 * @route   PATCH /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Will be hashed by pre-save hook

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};