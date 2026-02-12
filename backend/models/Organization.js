import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Organization name must be at least 3 characters'],
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    about: {
      type: String,
      required: [true, 'Organization description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Media
    logo: {
      type: String, // URL to logo image
      default: null,
    },
    coverImage: {
      type: String, // URL to cover/banner image
      default: null,
    },

    // Contact & Links
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please enter a valid website URL',
      ],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
    },

    // Administration
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organization must have an admin'],
    },

    // Settings
    commentsEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },

    // Status
    active: {
      type: Boolean,
      default: true,
    },

    // Statistics (cached for performance)
    stats: {
      departmentsCount: {
        type: Number,
        default: 0,
      },
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
organizationSchema.index({ name: 1 }); // Unique index for fast lookup
organizationSchema.index({ adminId: 1 }); // Find orgs by admin
organizationSchema.index({ active: 1 }); // Filter active orgs
organizationSchema.index({ createdAt: -1 }); // Sort by newest

// ==================== VIRTUAL FIELDS ====================

// Virtual populate: Get all departments of this organization
organizationSchema.virtual('departments', {
  ref: 'Department',
  localField: '_id',
  foreignField: 'orgId',
});

// Virtual populate: Get all blogs of this organization
organizationSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'orgId',
});

// ==================== MIDDLEWARE ====================

// Validate: Admin must be a verified user
organizationSchema.pre('save', async function (next) {
  if (this.isModified('adminId')) {
    const User = mongoose.model('User');
    const admin = await User.findById(this.adminId);

    if (!admin) {
      return next(new Error('Admin user not found'));
    }

    // Admin should ideally be verified, but we'll allow assignment first
    // The admin will be verified as part of the organization
  }
  next();
});

// After save: Update user's role to org_admin
organizationSchema.post('save', async function (doc) {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(doc.adminId, {
    role: 'org_admin',
    orgId: doc._id,
    verified: true,
  });
});

// ==================== STATIC METHODS ====================

// Get organization with populated departments
organizationSchema.statics.getWithDepartments = function (orgId) {
  return this.findById(orgId).populate('departments');
};

// Get active organizations
organizationSchema.statics.getActive = function () {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

// Update statistics
organizationSchema.statics.updateStats = async function (orgId) {
  const Department = mongoose.model('Department');
  const Blog = mongoose.model('Blog');
  const User = mongoose.model('User');

  const departmentsCount = await Department.countDocuments({ orgId });
  const blogsCount = await Blog.countDocuments({ orgId });
  const membersCount = await User.countDocuments({ orgId, verified: true });

  return this.findByIdAndUpdate(
    orgId,
    {
      $set: {
        'stats.departmentsCount': departmentsCount,
        'stats.blogsCount': blogsCount,
        'stats.membersCount': membersCount,
      },
    },
    { new: true }
  );
};

// ==================== INSTANCE METHODS ====================

// Check if user is admin of this organization
organizationSchema.methods.isAdmin = function (userId) {
  return this.adminId.toString() === userId.toString();
};

// Toggle comments
organizationSchema.methods.toggleComments = async function () {
  this.commentsEnabled = !this.commentsEnabled;
  return await this.save();
};

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;