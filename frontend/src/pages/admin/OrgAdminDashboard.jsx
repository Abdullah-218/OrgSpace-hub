import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, Badge, Loading } from '../../components/common';
import { ROUTES, ROLES } from '../../utils/constants';
import { formatNumber, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OrgAdminDashboard = () => {
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
        `${import.meta.env.VITE_API_URL}/admin/org/stats`,
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

      // Fetch pending verifications
      const verResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/org/verifications?status=pending`,
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

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: ROUTES.ORG_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Departments',
      path: ROUTES.MANAGE_DEPTS,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
      path: '/admin/org/members',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const orgStats = [
    {
      label: 'Total Members',
      value: formatNumber(stats?.totalMembers || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      label: 'Departments',
      value: formatNumber(stats?.totalDepartments || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'green',
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
  ];

  if (loading) {
    return (
      <ProtectedRoute requiredRole={ROLES.ORG_ADMIN}>
        <Navbar />
        <Loading.Page text="Loading dashboard..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={ROLES.ORG_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title="Organization Admin" />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user?.orgId?.name} Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your organization's departments and members
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {orgStats.map((stat, index) => (
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

              {/* Quick Actions */}
              <Card className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(ROUTES.MANAGE_DEPTS)}
                    className="justify-start"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Department
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(ROUTES.MANAGE_VERIFICATIONS)}
                    className="justify-start"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Review Verifications
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/org/members')}
                    className="justify-start"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    View All Members
                  </Button>
                </div>
              </Card>

              {/* Pending Verifications */}
              {pendingVerifications.length > 0 && (
                <Card className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Pending Verifications
                    </h2>
                    <Badge variant="warning">{pendingVerifications.length} pending</Badge>
                  </div>
                  <div className="space-y-3">
                    {pendingVerifications.slice(0, 5).map((verification) => (
                      <div key={verification._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{verification.userId?.name}</p>
                          <p className="text-sm text-gray-600">
                            {verification.deptId?.name} · {formatDate(verification.createdAt, 'relative')}
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(ROUTES.MANAGE_VERIFICATIONS)}
                        >
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                  {pendingVerifications.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.MANAGE_VERIFICATIONS)}
                      className="mt-4 w-full"
                    >
                      View All {pendingVerifications.length} Requests
                    </Button>
                  )}
                </Card>
              )}

              {/* Departments Overview */}
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Departments
                </h2>
                <div className="space-y-3">
                  {stats?.departments?.slice(0, 5).map((dept) => (
                    <div key={dept._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-sm text-gray-500">
                            {formatNumber(dept.stats?.membersCount || 0)} members · {formatNumber(dept.stats?.blogsCount || 0)} blogs
                        </p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.MANAGE_DEPTS)}
                  className="mt-4 w-full"
                >
                  Manage Departments
                </Button>
              </Card>
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default OrgAdminDashboard;