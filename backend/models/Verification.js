import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    // Request Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Verification must have a user'],
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Verification must specify an organization'],
    },
    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Verification must specify a department'],
    },

    // Request Details
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Status
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },

    // Review Information
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Review note cannot exceed 500 characters'],
    },
    reviewedAt: {
      type: Date,
    },

    // Timestamps
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==================== INDEXES ====================
verificationSchema.index({ userId: 1, orgId: 1, deptId: 1, status: 1 }); // Unique pending requests
verificationSchema.index({ status: 1, createdAt: -1 }); // Filter by status
verificationSchema.index({ deptId: 1, status: 1 }); // Dept admin queries
verificationSchema.index({ orgId: 1, status: 1 }); // Org admin queries
verificationSchema.index({ userId: 1 }); // User's verification history

// ==================== MIDDLEWARE ====================

// Validate: User exists
verificationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);

    if (!user) {
      return next(new Error('User not found'));
    }

    if (user.verified && user.orgId && user.deptId) {
      return next(new Error('User is already verified'));
    }
  }
  next();
});

// Validate: Organization and Department exist and are related
verificationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Department = mongoose.model('Department');
    const Organization = mongoose.model('Organization');

    const dept = await Department.findById(this.deptId);
    const org = await Organization.findById(this.orgId);

    if (!dept) {
      return next(new Error('Department not found'));
    }

    if (!org) {
      return next(new Error('Organization not found'));
    }

    if (dept.orgId.toString() !== this.orgId.toString()) {
      return next(new Error('Department does not belong to the specified organization'));
    }
  }
  next();
});

// Validate: User doesn't have a pending request for same org/dept
verificationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingRequest = await this.constructor.findOne({
      userId: this.userId,
      orgId: this.orgId,
      deptId: this.deptId,
      status: 'pending',
    });

    if (existingRequest) {
      return next(
        new Error('You already have a pending verification request for this department')
      );
    }
  }
  next();
});

// ==================== STATIC METHODS ====================

// Get pending verifications for a department
verificationSchema.statics.getPendingByDept = function (deptId) {
  return this.find({ deptId, status: 'pending' })
    .populate('userId', 'name email avatar')
    .populate('orgId', 'name')
    .populate('deptId', 'name')
    .sort({ requestedAt: 1 }); // Oldest first
};

// Get pending verifications for an organization
verificationSchema.statics.getPendingByOrg = function (orgId) {
  return this.find({ orgId, status: 'pending' })
    .populate('userId', 'name email avatar')
    .populate('orgId', 'name')
    .populate('deptId', 'name')
    .sort({ requestedAt: 1 });
};

// Get user's verification history
verificationSchema.statics.getByUser = function (userId) {
  return this.find({ userId })
    .populate('orgId', 'name')
    .populate('deptId', 'name')
    .populate('reviewedBy', 'name')
    .sort({ requestedAt: -1 });
};

// Get verification statistics for a department
verificationSchema.statics.getStatsForDept = async function (deptId) {
  const stats = await this.aggregate([
    { $match: { deptId: mongoose.Types.ObjectId(deptId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    pending: stats.find((s) => s._id === 'pending')?.count || 0,
    approved: stats.find((s) => s._id === 'approved')?.count || 0,
    rejected: stats.find((s) => s._id === 'rejected')?.count || 0,
  };
};

// ==================== INSTANCE METHODS ====================

// Approve verification request
verificationSchema.methods.approve = async function (reviewerId, reviewNote = '') {
  if (this.status !== 'pending') {
    throw new Error('Only pending verifications can be approved');
  }

  const User = mongoose.model('User');
  const Department = mongoose.model('Department');
  const Organization = mongoose.model('Organization');

  // Update verification status
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewNote = reviewNote;
  this.reviewedAt = new Date();

  // Update user status
  const user = await User.findById(this.userId);
  user.verified = true;
  user.role = 'verified';
  user.orgId = this.orgId;
  user.deptId = this.deptId;

  // Save both
  await Promise.all([this.save(), user.save()]);

  // Update department and organization stats
  await Promise.all([
    Department.updateStats(this.deptId),
    Organization.updateStats(this.orgId),
  ]);

  return this;
};

// Reject verification request
verificationSchema.methods.reject = async function (reviewerId, reviewNote = '') {
  if (this.status !== 'pending') {
    throw new Error('Only pending verifications can be rejected');
  }

  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewNote = reviewNote;
  this.reviewedAt = new Date();

  return await this.save();
};

// Check if reviewer has permission to review this verification
verificationSchema.methods.canReview = async function (reviewer) {
  // Department admin can review if verification is for their department
  if (
    reviewer.role === 'dept_admin' &&
    reviewer.deptId.toString() === this.deptId.toString()
  ) {
    return true;
  }

  // Organization admin can review if verification is for their organization
  if (
    reviewer.role === 'org_admin' &&
    reviewer.orgId.toString() === this.orgId.toString()
  ) {
    return true;
  }

  // Super admin can review any verification
  if (reviewer.role === 'super_admin') {
    return true;
  }

  return false;
};

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;