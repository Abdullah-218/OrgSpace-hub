import BlogCard from './BlogCard';
import { EmptyState, Loading } from '../common';

const BlogList = ({ blogs, loading = false, emptyMessage = 'No blogs found', className = '' }) => {
  if (loading) {
    return <Loading.BlogCardSkeleton count={6} />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Check back later for new content"
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;