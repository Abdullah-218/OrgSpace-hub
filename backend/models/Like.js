import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    // Relationships
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Like must belong to a blog'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Like must have a user'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation, not updates
  }
);

// ==================== INDEXES ====================
// Compound unique index: One like per user per blog
likeSchema.index({ blogId: 1, userId: 1 }, { unique: true });
likeSchema.index({ blogId: 1 }); // Get all likes for a blog
likeSchema.index({ userId: 1 }); // Get all likes by a user

// ==================== MIDDLEWARE ====================

// Validate: Blog exists
likeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Blog = mongoose.model('Blog');
    const blog = await Blog.findById(this.blogId);

    if (!blog) {
      return next(new Error('Blog not found'));
    }
  }
  next();
});

// Validate: User exists
likeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const user = await User.findById(this.userId);

    if (!user) {
      return next(new Error('User not found'));
    }
  }
  next();
});

// After save: Increment blog's like count
likeSchema.post('save', async function (doc) {
  const Blog = mongoose.model('Blog');
  await Blog.findByIdAndUpdate(doc.blogId, { $inc: { likesCount: 1 } });
});

// After remove: Decrement blog's like count
likeSchema.post('remove', async function (doc) {
  const Blog = mongoose.model('Blog');
  const blog = await Blog.findById(doc.blogId);
  if (blog && blog.likesCount > 0) {
    blog.likesCount -= 1;
    await blog.save();
  }
});

// ==================== STATIC METHODS ====================

// Toggle like (like if not liked, unlike if liked)
likeSchema.statics.toggleLike = async function (blogId, userId) {
  try {
    // Check if already liked
    const existingLike = await this.findOne({ blogId, userId });

    if (existingLike) {
      // Unlike: Remove the like
      await existingLike.remove();
      return { liked: false, message: 'Blog unliked successfully' };
    } else {
      // Like: Create new like
      const newLike = await this.create({ blogId, userId });
      return { liked: true, message: 'Blog liked successfully', like: newLike };
    }
  } catch (error) {
    throw new Error('Error toggling like: ' + error.message);
  }
};

// Check if user has liked a blog
likeSchema.statics.hasLiked = async function (blogId, userId) {
  const like = await this.findOne({ blogId, userId });
  return !!like;
};

// Get all likes for a blog
likeSchema.statics.getByBlog = function (blogId, options = {}) {
  const { page = 1, limit = 50 } = options;

  return this.find({ blogId })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Get all blogs liked by a user
likeSchema.statics.getByUser = function (userId, options = {}) {
  const { page = 1, limit = 20 } = options;

  return this.find({ userId })
    .populate({
      path: 'blogId',
      select: 'title slug coverImage excerpt authorId orgId deptId',
      populate: [
        { path: 'authorId', select: 'name avatar' },
        { path: 'orgId', select: 'name logo' },
        { path: 'deptId', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Get like count for a blog
likeSchema.statics.countByBlog = function (blogId) {
  return this.countDocuments({ blogId });
};

// Delete all likes for a blog (used when blog is deleted)
likeSchema.statics.deleteByBlog = function (blogId) {
  return this.deleteMany({ blogId });
};

// Get blogs liked by multiple users (for recommendations)
likeSchema.statics.getPopularBlogs = async function (limit = 10) {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$blogId',
        likeCount: { $sum: 1 },
      },
    },
    { $sort: { likeCount: -1 } },
    { $limit: limit },
  ]);

  const blogIds = result.map((r) => r._id);

  const Blog = mongoose.model('Blog');
  return Blog.find({ _id: { $in: blogIds } })
    .populate('authorId', 'name avatar')
    .populate('orgId', 'name logo')
    .populate('deptId', 'name');
};

const Like = mongoose.model('Like', likeSchema);

export default Like;