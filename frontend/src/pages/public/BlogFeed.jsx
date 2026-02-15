import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, SearchBar, Loading, EmptyState, Badge, Avatar, Pagination, Button } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES } from '../../utils/constants';
import { formatDate, truncate, formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BlogFeed = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchBlogs();
  }, [page, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        published: true,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await blogService.getBlogs(params);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    setSearchParams({ page: 1, ...(value && { search: value }) });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage, ...(searchTerm && { search: searchTerm }) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container className="py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Blogs</h1>
          <p className="text-xl text-gray-600">
            Explore stories from verified members across organizations
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1"
          />
        </div>

        {/* Blog Grid */}
        {loading ? (
          <Loading.BlogCardSkeleton count={6} />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No blogs found"
            description={searchTerm ? "Try a different search term" : "No blogs published yet"}
            icon={
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  hover
                  padding={false}
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}
                >
                  {/* Cover Image */}
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
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="gray" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 2 && (
                          <Badge variant="gray" size="sm">
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {blog.excerpt || truncate(blog.content, 120)}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={blog.authorId?.avatar}
                          name={blog.authorId?.name}
                          size="sm"
                        />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {blog.authorId?.name}
                          </div>
                          <div className="text-gray-500">
                            {formatDate(blog.createdAt, 'relative')}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
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
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default BlogFeed;