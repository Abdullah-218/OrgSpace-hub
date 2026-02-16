import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, Badge, Loading, Avatar } from '../../components/common';
import { ROUTES, ROLES } from '../../utils/constants';
import { formatNumber, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DeptAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/dept/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      }

      const verResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/dept/verifications?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );
      const verData = await verResponse.json();
      if (verData.success) {
        setPendingVerifications(verData.data.verifications);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/verifications/${verificationId}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('blog_platform_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        toast.success('Verification approved!');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to approve verification');
    }
  };

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: ROUTES.DEPT_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Verifications',
      path: ROUTES.MANAGE_VERIFICATIONS,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: pendingVerifications.length,
      badgeVariant: 'warning',
    },
    {
      label: 'Members',
      path: '/admin/dept/members',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Blogs',
      path: '/admin/dept/blogs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const deptStats = [
    {
      label: 'Department Members',
      value: formatNumber(stats?.totalMembers || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      label: 'Total Blogs',
      value: formatNumber(stats?.totalBlogs || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'purple',
    },
    {
      label: 'Pending Verifications',
      value: formatNumber(pendingVerifications.length),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'yellow',
    },
    {
      label: 'Active Contributors',
      value: formatNumber(stats?.activeContributors || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      color: 'green',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute requiredMinRole={ROLES.DEPT_ADMIN}>
        <Navbar />
        <Loading.Page text="Loading dashboard..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredMinRole={ROLES.DEPT_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title="Department Admin" />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user?.deptId?.name} Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your department members and verifications
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {deptStats.map((stat, index) => (
                  <Card key={index}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600`}>
                        {stat.icon}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {pendingVerifications.length > 0 && (
                <Card className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Pending Verification Requests
                    </h2>
                    <Badge variant="warning">{pendingVerifications.length} pending</Badge>
                  </div>
                  <div className="space-y-4">
                    {pendingVerifications.map((verification) => (
                      <Card key={verification._id} className="bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={verification.userId?.avatar}
                              name={verification.userId?.name}
                              size="md"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{verification.userId?.name}</p>
                              <p className="text-sm text-gray-600">{verification.userId?.email}</p>
                              {verification.message && (
                                <p className="text-sm text-gray-700 mt-2 italic">"{verification.message}"</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Requested {formatDate(verification.createdAt, 'relative')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(verification._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(ROUTES.MANAGE_VERIFICATIONS)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Members
                  </h2>
                  <div className="space-y-3">
                    {stats?.recentMembers?.slice(0, 5).map((member) => (
                      <div key={member._id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <Avatar src={member.avatar} name={member.name} size="sm" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">Joined {formatDate(member.createdAt, 'relative')}</p>
                        </div>
                        <Badge variant="success">Verified</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Contributors
                  </h2>
                  <div className="space-y-3">
                    {stats?.topContributors?.slice(0, 5).map((contributor) => (
                      <div key={contributor._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <Avatar src={contributor.avatar} name={contributor.name} size="sm" />
                          <p className="font-medium text-gray-900">{contributor.name}</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatNumber(contributor.blogCount || 0)} blogs
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DeptAdminDashboard;