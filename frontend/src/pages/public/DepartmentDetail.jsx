import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, Loading, Badge, Button, EmptyState } from '../../components/common';
import { BlogCard } from '../../components/blog';
import { departmentService } from '../../services';
import api from '../../services/api';
import { ROUTES } from '../../utils/constants';
import { formatNumber, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchDepartment();
    fetchMembers();
    fetchBlogs();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const response = await departmentService.getDepartmentById(id);
      if (response.data?.department) {
        setDepartment(response.data.department);
      } else {
        throw new Error('Invalid department data');
      }
    } catch (error) {
      console.error('Error fetching department:', error);
      toast.error(error.response?.data?.message || 'Failed to load department');
      setTimeout(() => navigate(ROUTES.ORGANIZATIONS), 1000);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/users/department/${id}`, {
        params: { limit: 50 }
      });
      setMembers(response.data.data?.users || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs', {
        params: { deptId: id, limit: 20 }
      });
      setBlogs(response.data.data?.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoadingBlogs(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading.Page text="Loading department..." />
      </>
    );
  }

  if (!department) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container className="py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ORGANIZATION_DETAIL(department.organization?.id || department.organization?._id))}
            className="mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {department.organization.name}
          </Button>

          <Card>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                {department.image ? (
                  <img src={department.image} alt={department.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {department.name?.charAt(0) || 'D'}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
                    {department.organization?.name && (
                      <p className="text-gray-600 mt-1">
                        Part of {department.organization.name}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{department.description}</p>

                {department.admins && department.admins.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Admins: </span>
                    {department.admins.map((admin, idx) => (
                      <span key={admin._id}>
                        {admin.name}
                        {idx < department.admins.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
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
                  {formatNumber(department.stats?.membersCount || members.length || 0)}
                </div>
                <div className="text-sm text-gray-600">Members</div>
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
                  {formatNumber(department.stats?.blogsCount || blogs.length || 0)}
                </div>
                <div className="text-sm text-gray-600">Blog Posts</div>
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
                  {department.admins?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Members</h2>
          
          {loadingMembers ? (
            <Loading.Spinner />
          ) : members.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-lg font-bold text-white">
                          {member.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{member.role?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No members yet"
              description="This department doesn't have any verified members"
            />
          )}
        </div>

        {/* Blogs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Posts</h2>
          
          {loadingBlogs ? (
            <Loading.Spinner />
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No blog posts yet"
              description="This department hasn't published any blogs yet"
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

export default DepartmentDetail;
