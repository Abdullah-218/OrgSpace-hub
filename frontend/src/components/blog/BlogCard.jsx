import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '../common';
import { ROUTES } from '../../utils/constants';
import { formatDate, truncate, formatNumber } from '../../utils/helpers';

const BlogCard = ({ blog, showAuthor = true, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-200 ${className}`}
    >
      {blog.coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="gray" size="sm">{tag}</Badge>
            ))}
            {blog.tags.length > 3 && <Badge variant="gray" size="sm">+{blog.tags.length - 3}</Badge>}
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt || truncate(blog.content, 150)}
        </p>

        {showAuthor && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Avatar src={blog.authorId?.avatar} name={blog.authorId?.name} size="sm" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{blog.authorId?.name}</div>
                <div className="text-gray-500">{formatDate(blog.createdAt, 'relative')}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{formatNumber(blog.likeCount || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{formatNumber(blog.commentCount || 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;