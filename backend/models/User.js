import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },

    // Role & Verification
    role: {
      type: String,
      enum: {
        values: ['global', 'verified', 'dept_admin', 'org_admin', 'super_admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'global',
    },
    verified: {
      type: Boolean,
      default: false,
    },

    // Organization & Department (populated when verified)
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },

    // Profile (optional)
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String, // URL to profile picture
    },

    // Activity tracking
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ==================== INDEXES ====================
// For fast queries

userSchema.index({ email: 1 }); // Unique index automatically created
userSchema.index({ orgId: 1 });
userSchema.index({ deptId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verified: 1 });

// ==================== MIDDLEWARE ====================

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Validate: If verified, must have orgId and deptId
// Validate: Only VERIFIED normal users must have org + dept
userSchema.pre('save', function (next) {
  if (
    this.verified &&
    !['super_admin', 'global'].includes(this.role) &&
    (!this.orgId || !this.deptId)
  ) {
    return next(
      new Error('Verified users must have both organization and department')
    );
  }
  next();
});

// ==================== METHODS ====================

// Instance method: Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method: Check if user can post to a specific org/dept
userSchema.methods.canPostTo = function (orgId, deptId) {
  if (!this.verified) return false;
  return (
    this.orgId.toString() === orgId.toString() &&
    this.deptId.toString() === deptId.toString()
  );
};

// Instance method: Check if user is admin of a department
userSchema.methods.isDeptAdminOf = function (deptId) {
  return (
    this.role === 'dept_admin' &&
    this.deptId &&
    this.deptId.toString() === deptId.toString()
  );
};

// Instance method: Check if user is org admin of an organization
userSchema.methods.isOrgAdminOf = function (orgId) {
  return (
    this.role === 'org_admin' &&
    this.orgId &&
    this.orgId.toString() === orgId.toString()
  );
};

// ==================== STATIC METHODS ====================

// Static method: Find users by organization
userSchema.statics.findByOrg = function (orgId) {
  return this.find({ orgId, verified: true });
};

// Static method: Find users by department
userSchema.statics.findByDept = function (deptId) {
  return this.find({ deptId, verified: true });
};

// Static method: Get user statistics
userSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};

const User = mongoose.model('User', userSchema);

export default User;