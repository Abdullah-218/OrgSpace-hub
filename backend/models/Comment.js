import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // Content
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },

    // Relationships
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Comment must belong to a blog'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
    },

    // Moderation
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ==================== INDEXES ====================
commentSchema.index({ blogId: 1, createdAt: 1 }); // Get comments for a blog chronologically
commentSchema.index({ userId: 1 }); // Get user's comments
commentSchema.index({ createdAt: -1 }); // Recent comments

// ==================== MIDDLEWARE ====================

// Validate: User must be verified to comment
commentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);

    if (!user) {
      return next(new Error('User not found'));
    }

    if (!user.verified) {
      return next(new Error('Only verified users can comment'));
    }
  }
  next();
});

// Validate: Blog exists and comments are enabled for its organization
commentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Blog = mongoose.model('Blog');
    const Organization = mongoose.model('Organization');

    const blog = await Blog.findById(this.blogId);
    if (!blog) {
      return next(new Error('Blog not found'));
    }

    const org = await Organization.findById(blog.orgId);
    if (!org) {
      return next(new Error('Organization not found'));
    }

    if (!org.commentsEnabled) {
      return next(new Error('Comments are disabled for this organization'));
    }
  }
  next();
});

// After save: Increment blog's comment count
commentSchema.post('save', async function (doc) {
  const Blog = mongoose.model('Blog');
  await Blog.findByIdAndUpdate(doc.blogId, { $inc: { commentsCount: 1 } });
});

// After remove: Decrement blog's comment count
commentSchema.post('remove', async function (doc) {
  const Blog = mongoose.model('Blog');
  const blog = await Blog.findById(doc.blogId);
  if (blog && blog.commentsCount > 0) {
    blog.commentsCount -= 1;
    await blog.save();
  }
});

// ==================== STATIC METHODS ====================

// Get comments for a specific blog
commentSchema.statics.getByBlog = function (blogId, options = {}) {
  const { page = 1, limit = 20, sort = 'createdAt' } = options;

  return this.find({ blogId })
    .populate('userId', 'name avatar')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);
};

// Get user's comments
commentSchema.statics.getByUser = function (userId, options = {}) {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;

  return this.find({ userId })
    .populate('blogId', 'title slug')
    .sort(sort)
    .limit(limit)
    .skip((page - 1) * limit);
};

// Delete all comments for a blog (used when blog is deleted)
commentSchema.statics.deleteByBlog = function (blogId) {
  return this.deleteMany({ blogId });
};

// ==================== INSTANCE METHODS ====================

// Check if user can delete this comment
commentSchema.methods.canDelete = async function (user) {
  // Comment author can delete their own comment
  if (this.userId.toString() === user._id.toString()) {
    return true;
  }

  // Get the blog to check admins
  const Blog = mongoose.model('Blog');
  const blog = await Blog.findById(this.blogId);

  if (!blog) return false;

  // Department admin can delete if comment is on blog in their department
  if (user.role === 'dept_admin' && user.deptId.toString() === blog.deptId.toString()) {
    return true;
  }

  // Org admin can delete if comment is on blog in their organization
  if (user.role === 'org_admin' && user.orgId.toString() === blog.orgId.toString()) {
    return true;
  }

  // Super admin can delete any comment
  if (user.role === 'super_admin') {
    return true;
  }

  return false;
};

// Update comment text
commentSchema.methods.updateText = async function (newText) {
  this.text = newText;
  this.edited = true;
  this.editedAt = new Date();
  return await this.save();
};

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;