import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      minlength: [2, 'Department name must be at least 2 characters'],
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Department description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Organization Relationship
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Department must belong to an organization'],
    },

    // Administration (can have multiple admins)
    adminIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Media
    image: {
      type: String, // URL to department image
      default: null,
    },

    // Status
    active: {
      type: Boolean,
      default: true,
    },

    // Statistics (cached for performance)
    stats: {
      blogsCount: {
        type: Number,
        default: 0,
      },
      membersCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================
// Compound unique index: Department name must be unique within an organization
departmentSchema.index({ name: 1, orgId: 1 }, { unique: true });
departmentSchema.index({ orgId: 1 }); // Query depts by org
departmentSchema.index({ adminIds: 1 }); // Query depts by admin
departmentSchema.index({ active: 1 }); // Filter active depts

// ==================== VIRTUAL FIELDS ====================

// Virtual populate: Get all blogs in this department
departmentSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'deptId',
});

// Virtual populate: Get organization details
departmentSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'orgId',
  foreignField: '_id',
  justOne: true,
});

// ==================== MIDDLEWARE ====================

// Validate: Organization exists
departmentSchema.pre('save', async function (next) {
  if (this.isModified('orgId')) {
    const Organization = mongoose.model('Organization');
    const org = await Organization.findById(this.orgId);

    if (!org) {
      return next(new Error('Organization not found'));
    }

    if (!org.active) {
      return next(new Error('Cannot create department for inactive organization'));
    }
  }
  next();
});

// Validate: All admins are verified users of this department
departmentSchema.pre('save', async function (next) {
  if (this.isModified('adminIds') && this.adminIds.length > 0) {
    const User = mongoose.model('User');

    for (const adminId of this.adminIds) {
      const user = await User.findById(adminId);

      if (!user) {
        return next(new Error(`Admin user ${adminId} not found`));
      }

      if (!user.verified) {
        return next(new Error(`User ${user.name} must be verified to be a department admin`));
      }

      if (user.deptId.toString() !== this._id.toString()) {
        return next(
          new Error(`User ${user.name} must be a member of this department to be an admin`)
        );
      }
    }
  }
  next();
});

// After save: Update organization stats
departmentSchema.post('save', async function (doc) {
  const Organization = mongoose.model('Organization');
  await Organization.updateStats(doc.orgId);
});

// After remove: Update organization stats
departmentSchema.post('remove', async function (doc) {
  const Organization = mongoose.model('Organization');
  await Organization.updateStats(doc.orgId);
});

// ==================== STATIC METHODS ====================

// Get departments by organization
departmentSchema.statics.findByOrg = function (orgId) {
  return this.find({ orgId, active: true }).populate('organization', 'name logo');
};

// Get departments administered by a user
departmentSchema.statics.findByAdmin = function (adminId) {
  return this.find({ adminIds: adminId, active: true }).populate('organization', 'name');
};

// Update statistics
departmentSchema.statics.updateStats = async function (deptId) {
  const Blog = mongoose.model('Blog');
  const User = mongoose.model('User');

  const blogsCount = await Blog.countDocuments({ deptId });
  const membersCount = await User.countDocuments({ deptId, verified: true });

  return this.findByIdAndUpdate(
    deptId,
    {
      $set: {
        'stats.blogsCount': blogsCount,
        'stats.membersCount': membersCount,
      },
    },
    { new: true }
  );
};

// ==================== INSTANCE METHODS ====================

// Check if user is admin of this department
departmentSchema.methods.isAdmin = function (userId) {
  return this.adminIds.some((adminId) => adminId.toString() === userId.toString());
};

// Add an admin
departmentSchema.methods.addAdmin = async function (userId) {
  const User = mongoose.model('User');

  // Check if user exists and is verified
  const user = await User.findById(userId);
  if (!user || !user.verified) {
    throw new Error('User must be verified to be added as admin');
  }

  // Check if user belongs to this department
  if (user.deptId.toString() !== this._id.toString()) {
    throw new Error('User must be a member of this department');
  }

  // Check if already admin
  if (this.isAdmin(userId)) {
    throw new Error('User is already an admin');
  }

  // Add admin and update user role
  this.adminIds.push(userId);
  user.role = 'dept_admin';

  await Promise.all([this.save(), user.save()]);

  return this;
};

// Remove an admin
departmentSchema.methods.removeAdmin = async function (userId) {
  const User = mongoose.model('User');

  if (!this.isAdmin(userId)) {
    throw new Error('User is not an admin of this department');
  }

  // Remove from adminIds
  this.adminIds = this.adminIds.filter((id) => id.toString() !== userId.toString());

  // Update user role back to verified
  await User.findByIdAndUpdate(userId, { role: 'verified' });

  return await this.save();
};

const Department = mongoose.model('Department', departmentSchema);

export default Department;