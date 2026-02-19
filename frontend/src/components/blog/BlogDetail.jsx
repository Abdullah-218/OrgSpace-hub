import { Avatar, Badge, Button } from '../common';
import { formatDate, formatNumber } from '../../utils/helpers';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';

const BlogDetail = ({ blog, onLike, showComments = true }) => {
  if (!blog) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <Badge key={index} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {blog.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Avatar
              src={blog.authorId?.avatar}
              name={blog.authorId?.name}
              size="lg"
            />
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                {blog.authorId?.name}
              </div>
              <div className="text-gray-600">
                {formatDate(blog.createdAt, 'long')} · {formatNumber(blog.viewCount || 0)} views
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <LikeButton
              blogId={blog._id}
              initialLiked={blog.hasLiked}
              initialCount={blog.likeCount || 0}
              onLike={onLike}
            />
            <ShareButton blog={blog} />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Footer */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Share this post:</span>
            <ShareButton blog={blog} size="sm" />
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{formatNumber(blog.likeCount || 0)} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{formatNumber(blog.commentCount || 0)} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="pt-8 border-t border-gray-200">
          <CommentSection blogId={blog._id} />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;