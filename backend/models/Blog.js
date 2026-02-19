import mongoose from 'mongoose';
import Department from './Department.js';

const blogSchema = new mongoose.Schema(
  {
    // Content
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },

    // Media
    coverImage: {
      type: String, // URL to cover image
      default: null,
    },

    // Ownership (Hierarchical: User → Department → Organization)
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog must have an author'],
    },
    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Blog must belong to a department'],
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Blog must belong to an organization'],
    },

    // Engagement (cached counts for performance)
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status
    published: {
      type: Boolean,
      default: true,
    },

    // SEO & Metadata
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Moderation
    featured: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================
// For performance on queries
blogSchema.index({ authorId: 1 });
blogSchema.index({ orgId: 1 });
blogSchema.index({ deptId: 1 });
blogSchema.index({ createdAt: -1 }); // Latest first
blogSchema.index({ likesCount: -1 }); // Most popular
blogSchema.index({ published: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });

// Compound indexes for common queries
blogSchema.index({ orgId: 1, createdAt: -1 }); // Org blogs sorted by date
blogSchema.index({ deptId: 1, createdAt: -1 }); // Dept blogs sorted by date
blogSchema.index({ authorId: 1, createdAt: -1 }); // Author blogs sorted by date

// Text index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// ==================== VIRTUAL FIELDS ====================

// Virtual populate: Get author details
blogSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate: Get department details
blogSchema.virtual('department', {
  ref: 'Department',
  localField: 'deptId',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate: Get organization details
blogSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'orgId',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate: Get all comments
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blogId',
});

// ==================== MIDDLEWARE ====================

// Generate slug from title before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Add timestamp to ensure uniqueness
    this.slug = `${this.slug}-${Date.now()}`;
  }
  next();
});

// Generate excerpt from content if not provided
blogSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  next();
});

// Validate: Author must belong to the specified org and dept
blogSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('authorId') || this.isModified('orgId') || this.isModified('deptId')) {
    const User = mongoose.model('User');
    const author = await User.findById(this.authorId);

    if (!author) {
      return next(new Error('Author not found'));
    }

    if (!author.verified) {
      return next(new Error('Author must be verified to post blogs'));
    }

    // Check if author belongs to the specified org and dept
    if (
      author.orgId.toString() !== this.orgId.toString() ||
      author.deptId.toString() !== this.deptId.toString()
    ) {
      return next(
        new Error('Author can only post blogs to their own organization and department')
      );
    }
  }
  next();
});

// Validate: Organization and Department exist and are related
blogSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('orgId') || this.isModified('deptId')) {
    const Department = mongoose.model('Department');
    const dept = await Department.findById(this.deptId);

    if (!dept) {
      return next(new Error('Department not found'));
    }

    if (dept.orgId.toString() !== this.orgId.toString()) {
      return next(new Error('Department does not belong to the specified organization'));
    }
  }
  next();
});

// After save: Update department and organization stats
blogSchema.post('save', async function (doc) {
  const Department = mongoose.model('Department');
  const Organization = mongoose.model('Organization');

  await Promise.all([
    Department.updateStats(doc.deptId),
    Organization.updateStats(doc.orgId),
  ]);
});

// After remove: Update counts and stats
blogSchema.post('remove', async function (doc) {
  const Comment = mongoose.model('Comment');
  const Like = mongoose.model('Like');
  const Department = mongoose.model('Department');
  const Organization = mongoose.model('Organization');

  // Delete all associated comments and likes
  await Promise.all([
    Comment.deleteMany({ blogId: doc._id }),
    Like.deleteMany({ blogId: doc._id }),
    Department.updateStats(doc.deptId),
    Organization.updateStats(doc.orgId),
  ]);
});

// ==================== STATIC METHODS ====================

// Get blogs with filters and pagination
blogSchema.statics.getFiltered = function (filters = {}, options = {}) {
  const {
    orgId,
    deptId,
    authorId,
    published = true,
    featured,
    tags,
    search,
  } = filters;

  const { page = 1, limit = 10, sort = '-createdAt' } = options;

  const query = { published };

  if (orgId) query.orgId = orgId;
  if (deptId) query.deptId = deptId;
  if (authorId) query.authorId = authorId;
  if (featured !== undefined) query.featured = featured;
  if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  if (search) query.$text = { $search: search };

  return this.find(query)
    .populate('author', 'name email avatar')
    .populate('department', 'name')
    .populate('organization', 'name logo')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);
};

// Get trending blogs (most liked in last 7 days)
blogSchema.statics.getTrending = function (limit = 10) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return this.find({
    published: true,
    createdAt: { $gte: sevenDaysAgo },
  })
    .sort({ likesCount: -1, viewsCount: -1 })
    .limit(limit)
    .populate('author', 'name avatar')
    .populate('department', 'name')
    .populate('organization', 'name logo');
};

// Increment view count
blogSchema.statics.incrementViews = function (blogId) {
  return this.findByIdAndUpdate(blogId, { $inc: { viewsCount: 1 } }, { new: true });
};

// ==================== INSTANCE METHODS ====================

// Check if user can edit this blog
blogSchema.methods.canEdit = function (user) {
  // Author can always edit
  if (this.authorId.toString() === user._id.toString()) {
    return true;
  }

  // Department admin can edit if blog is in their department
  if (user.role === 'dept_admin' && user.deptId.toString() === this.deptId.toString()) {
    return true;
  }

  // Org admin can edit if blog is in their organization
  if (user.role === 'org_admin' && user.orgId.toString() === this.orgId.toString()) {
    return true;
  }

  // Super admin can edit any blog
  if (user.role === 'super_admin') {
    return true;
  }

  return false;
};

// Increment likes count
blogSchema.methods.incrementLikes = async function () {
  this.likesCount += 1;
  return await this.save();
};

// Decrement likes count
blogSchema.methods.decrementLikes = async function () {
  if (this.likesCount > 0) {
    this.likesCount -= 1;
  }
  return await this.save();
};

// Increment comments count
blogSchema.methods.incrementComments = async function () {
  this.commentsCount += 1;
  return await this.save();
};

// Decrement comments count
blogSchema.methods.decrementComments = async function () {
  if (this.commentsCount > 0) {
    this.commentsCount -= 1;
  }
  return await this.save();
};

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;