import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, Button, Badge, Loading, EmptyState } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES, ROLE_LABELS } from '../../utils/constants';
import { formatNumber, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const response = await blogService.getMyBlogs({ limit: 5 });
      setMyBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      label: 'My Blogs',
      value: formatNumber(myBlogs.length),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'blue',
      onClick: () => navigate(ROUTES.MY_BLOGS),
    },
    {
      label: 'Role',
      value: ROLE_LABELS[user?.role],
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'purple',
    },
    {
      label: 'Status',
      value: user?.verified ? 'Verified' : 'Unverified',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: user?.verified ? 'green' : 'yellow',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container className="py-12 flex-1">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              hover={!!stat.onClick}
              className={stat.onClick ? 'cursor-pointer' : ''}
              onClick={stat.onClick}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Verification Prompt */}
        {!user?.verified && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Get Verified</h3>
                <p className="text-gray-700 mb-3">
                  Request verification to start creating blog posts and engaging with the community.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.REQUEST_VERIFICATION)}
                >
                  Request Verification
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Create Blog CTA */}
        {user?.verified && (
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ready to share your story?</h3>
                <p className="text-gray-700">Create a new blog post and share it with your community</p>
              </div>
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
          </Card>
        )}

        {/* Recent Blogs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Recent Blogs</h2>
            {myBlogs.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.MY_BLOGS)}>
                View All
              </Button>
            )}
          </div>

          {loading ? (
            <Loading.CardSkeleton count={3} />
          ) : myBlogs.length === 0 ? (
            <EmptyState
              title="No blogs yet"
              description={user?.verified ? "Create your first blog post to get started" : "Get verified to start creating blog posts"}
              action={
                user?.verified ? (
                  <Button onClick={() => navigate(ROUTES.CREATE_BLOG)}>
                    Create Your First Blog
                  </Button>
                ) : (
                  <Button onClick={() => navigate(ROUTES.REQUEST_VERIFICATION)}>
                    Request Verification
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {myBlogs.map((blog) => (
                <Card
                  key={blog._id}
                  hover
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTES.BLOG_DETAIL(blog._id))}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(blog.createdAt, 'relative')}</span>
                        <span>·</span>
                        <span>{formatNumber(blog.likeCount || 0)} likes</span>
                        <span>·</span>
                        <span>{formatNumber(blog.commentCount || 0)} comments</span>
                      </div>
                    </div>
                    <Badge variant={blog.published ? 'success' : 'warning'}>
                      {blog.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default Dashboard;