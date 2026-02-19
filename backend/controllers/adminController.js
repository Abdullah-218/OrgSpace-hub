import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Department from '../models/Department.js';
import Verification from '../models/Verification.js';
import Blog from '../models/Blog.js';
import { ROLES, MESSAGES } from '../utils/constants.js';

// ==================== SUPER ADMIN ACTIONS ====================

/**
 * @desc    Assign organization admin
 * @route   POST /api/admin/super/assign-org-admin
 * @access  Private (Super Admin)
 */
export const assignOrgAdmin = async (req, res) => {
  try {
    const { userId, orgId } = req.body;

    if (!userId || !orgId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and orgId',
      });
    }

    const user = await User.findById(userId);
    const org = await Organization.findById(orgId);

    if (!user || !org) {
      return res.status(404).json({
        success: false,
        message: 'User or Organization not found',
      });
    }

    // Update user
    user.role = ROLES.ORG_ADMIN;
    user.verified = true;
    user.orgId = orgId;
    await user.save();

    // Update organization
    org.adminId = userId;
    await org.save();

    res.status(200).json({
      success: true,
      message: 'Organization admin assigned successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
        organization: {
          id: org._id,
          name: org.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/super/stats
 * @access  Private (Super Admin)
 */
export const getPlatformStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      verifiedUsers: await User.countDocuments({ verified: true }),
      totalOrganizations: await Organization.countDocuments(),
      totalDepartments: await Department.countDocuments(),
      totalBlogs: await Blog.countDocuments(),
      pendingVerifications: await Verification.countDocuments({ status: 'pending' }),
      usersByRole: await User.getStats(),
    };

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users (for super admin)
 * @route   GET /api/admin/super/users
 * @access  Private (Super Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, role, verified, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (verified !== undefined) query.verified = verified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('orgId', 'name')
      .populate('deptId', 'name')
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ORG ADMIN ACTIONS ====================

/**
 * @desc    Assign department admin
 * @route   POST /api/admin/org/assign-dept-admin
 * @access  Private (Org Admin)
 */
export const assignDeptAdmin = async (req, res) => {
  try {
    const { userId, deptId } = req.body;

    if (!userId || !deptId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and deptId',
      });
    }

    const user = await User.findById(userId);
    const dept = await Department.findById(deptId);

    if (!user || !dept) {
      return res.status(404).json({
        success: false,
        message: 'User or Department not found',
      });
    }

    // Verify user belongs to the department
    if (user.deptId.toString() !== deptId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'User must be a member of this department first',
      });
    }

    await dept.addAdmin(userId);

    res.status(200).json({
      success: true,
      message: 'Department admin assigned successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          role: ROLES.DEPT_ADMIN,
        },
        department: {
          id: dept._id,
          name: dept.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Remove department admin
 * @route   POST /api/admin/org/remove-dept-admin
 * @access  Private (Org Admin)
 */
export const removeDeptAdmin = async (req, res) => {
  try {
    const { userId, deptId } = req.body;

    const dept = await Department.findById(deptId);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    await dept.removeAdmin(userId);

    res.status(200).json({
      success: true,
      message: 'Department admin removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get pending verifications for organization
 * @route   GET /api/admin/org/verifications
 * @access  Private (Org Admin)
 */
export const getOrgVerifications = async (req, res) => {
  try {
    const verifications = await Verification.getPendingByOrg(req.user.orgId);

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: { verifications },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get organization statistics
 * @route   GET /api/admin/org/stats
 * @access  Private (Org Admin)
 */
export const getOrgStats = async (req, res) => {
  try {
    const stats = {
      totalMembers: await User.countDocuments({ orgId: req.user.orgId, verified: true }),
      totalDepartments: await Department.countDocuments({ orgId: req.user.orgId }),
      totalBlogs: await Blog.countDocuments({ orgId: req.user.orgId }),
      pendingVerifications: await Verification.countDocuments({
        orgId: req.user.orgId,
        status: 'pending',
      }),
    };

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DEPT ADMIN ACTIONS ====================

/**
 * @desc    Get pending verifications for department
 * @route   GET /api/admin/dept/verifications
 * @access  Private (Dept Admin)
 */
export const getDeptVerifications = async (req, res) => {
  try {
    const verifications = await Verification.getPendingByDept(req.user.deptId);

    res.status(200).json({
      success: true,
      count: verifications.length,
      data: { verifications },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get department statistics
 * @route   GET /api/admin/dept/stats
 * @access  Private (Dept Admin)
 */
export const getDeptStats = async (req, res) => {
  try {
    const stats = {
      totalMembers: await User.countDocuments({ deptId: req.user.deptId, verified: true }),
      totalBlogs: await Blog.countDocuments({ deptId: req.user.deptId }),
      pendingVerifications: await Verification.countDocuments({
        deptId: req.user.deptId,
        status: 'pending',
      }),
    };

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SHARED ADMIN ACTIONS ====================

/**
 * @desc    Approve verification request
 * @route   PATCH /api/admin/verifications/:id/approve
 * @access  Private (Dept Admin, Org Admin, Super Admin)
 */
export const approveVerification = async (req, res) => {
  try {
    const { reviewNote } = req.body;

    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      });
    }

    // Check permission
    const canReview = await verification.canReview(req.user);
    if (!canReview) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to review this request',
      });
    }

    await verification.approve(req.user._id, reviewNote);

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.VERIFICATION_APPROVED,
      data: { verification },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject verification request
 * @route   PATCH /api/admin/verifications/:id/reject
 * @access  Private (Dept Admin, Org Admin, Super Admin)
 */
export const rejectVerification = async (req, res) => {
  try {
    const { reviewNote } = req.body;

    const verification = await Verification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      });
    }

    // Check permission
    const canReview = await verification.canReview(req.user);
    if (!canReview) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to review this request',
      });
    }

    await verification.reject(req.user._id, reviewNote);

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.VERIFICATION_REJECTED,
      data: { verification },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};