import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, Loading, Badge, Button, EmptyState } from '../../components/common';
import { BlogCard } from '../../components/blog';
import organizationService from '../../services/organizationService';
import { ROUTES } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const response = await organizationService.getOrganizationById(id);
      if (response.data?.organization) {
        setOrganization(response.data.organization);
      } else {
        throw new Error('Invalid organization data');
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast.error(error.response?.data?.message || 'Failed to load organization');
      setTimeout(() => navigate(ROUTES.ORGANIZATIONS), 1000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading.Page text="Loading organization..." />
      </>
    );
  }

  if (!organization) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container className="py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ORGANIZATIONS)}
            className="mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Organizations
          </Button>

          <Card>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                {organization.logo ? (
                  <img src={organization.logo} alt={organization.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {organization.name?.charAt(0) || 'O'}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
                  {organization.active && (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{organization.about}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {organization.website && (
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website
                    </a>
                  )}
                  {organization.email && (
                    <a
                      href={`mailto:${organization.email}`}
                      className="flex items-center gap-1 hover:text-primary-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(organization.stats?.membersCount || 0)}
                </div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(organization.stats?.departmentsCount || 0)}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(organization.stats?.blogsCount || 0)}
                </div>
                <div className="text-sm text-gray-600">Blog Posts</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Departments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Departments</h2>

          {organization.departments && organization.departments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organization.departments.map((dept) => (
                <Card 
                  key={dept._id} 
                  hover 
                  className="cursor-pointer"
                  onClick={() => navigate(ROUTES.DEPARTMENT_DETAIL(dept.id || dept._id))}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {dept.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatNumber(dept.stats?.membersCount || 0)} members</span>
                    <span>{formatNumber(dept.stats?.blogsCount || 0)} posts</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No departments yet"
              description="This organization hasn't created any departments"
            />
          )}
        </div>

        {/* Blog Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Blog Posts</h2>
          
          {organization.recentBlogs && organization.recentBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organization.recentBlogs.map((blog) => (
                <BlogCard key={blog.id || blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No blog posts yet"
              description="This organization hasn't published any blogs yet"
              icon={
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default OrganizationDetail;