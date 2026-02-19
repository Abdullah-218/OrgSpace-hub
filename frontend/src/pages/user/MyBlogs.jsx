import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Button, Badge, Loading, EmptyState, SearchBar, ConfirmDialog } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES } from '../../utils/constants';
import { formatDate, formatNumber, getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getMyBlogs();
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      await blogService.deleteBlog(deleteId);
      setBlogs(blogs.filter(blog => blog._id !== deleteId));
      toast.success('Blog deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && blog.published) ||
                         (filter === 'draft' && !blog.published);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.published).length,
    drafts: blogs.filter(b => !b.published).length,
  };

  return (
    <ProtectedRoute requireVerified>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container className="py-12 flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">My Blogs</h1>
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.CREATE_BLOG)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Blog
              </Button>
            </div>
            <p className="text-xl text-gray-600">
              Manage all your blog posts in one place
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Blogs</div>
            </Card>
            <Card>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.published}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </Card>
            <Card>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {stats.drafts}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <SearchBar
              placeholder="Search your blogs..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />

            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'published' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('published')}
              >
                Published
              </Button>
              <Button
                variant={filter === 'draft' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('draft')}
              >
                Drafts
              </Button>
            </div>
          </div>

          {/* Blogs List */}
          {loading ? (
            <Loading.CardSkeleton count={5} />
          ) : filteredBlogs.length === 0 ? (
            <EmptyState
              title={searchTerm ? "No blogs found" : "No blogs yet"}
              description={searchTerm ? "Try a different search term" : "Create your first blog post to get started"}
              action={
                !searchTerm && (
                  <Button onClick={() => navigate(ROUTES.CREATE_BLOG)}>
                    Create Your First Blog
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <Card key={blog._id} hover>
                  <div className="flex gap-4">
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(blog.coverImage)}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </div>
                        <Badge variant={blog.published ? 'success' : 'warning'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{formatDate(blog.createdAt, 'short')}</span>
                        <span>·</span>
                        <span>{formatNumber(blog.viewsCount || 0)} views</span>
                        <span>·</span>
                        <span>{formatNumber(blog.likesCount || 0)} likes</span>
                        <span>·</span>
                        <span>{formatNumber(blog.commentsCount || 0)} comments</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.EDIT_BLOG(blog._id))}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(blog._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>

        <Footer />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Blog?"
          description="Are you sure you want to delete this blog? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
          loading={deleting}
        />
      </div>
    </ProtectedRoute>
  );
};

export default MyBlogs;