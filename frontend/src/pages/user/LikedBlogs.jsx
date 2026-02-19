import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Loading, EmptyState, Badge, Avatar, SearchBar } from '../../components/common';
import blogService from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { formatDate, truncate, formatNumber, getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LikedBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchLikedBlogs();
    }
  }, [user]);

  const fetchLikedBlogs = async () => {
    try {
      // This would use the API endpoint to get user's liked blogs
      // For now, we'll simulate it
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/liked-blogs`
      );
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data.blogs);
      }
    } catch (error) {
      toast.error('Failed to load liked blogs');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container className="py-12 flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Liked Blogs</h1>
            <p className="text-xl text-gray-600">
              All the blog posts you've liked
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar
              placeholder="Search liked blogs..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="max-w-2xl"
            />
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <Loading.BlogCardSkeleton count={6} />
          ) : filteredBlogs.length === 0 ? (
            <EmptyState
              title={searchTerm ? "No blogs found" : "No liked blogs yet"}
              description={searchTerm ? "Try a different search term" : "Start liking blogs to see them here"}
              icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <Card
                    key={blog._id}
                    hover
                    padding={false}
                    className="overflow-hidden cursor-pointer group"
                    onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}
                  >
                    {blog.coverImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={getImageUrl(blog.coverImage)}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="gray" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {blog.excerpt || truncate(blog.content, 120)}
                      </p>

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

                        <div className="flex items-center gap-1 text-red-500">
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Container>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default LikedBlogs;