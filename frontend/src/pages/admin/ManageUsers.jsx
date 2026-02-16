platform/frontend/src/pages/admin/ManageUsers.jsx << 'ENDOFFILE'
import { useState, useEffect } from 'react';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Badge, Loading, EmptyState, Avatar, SearchBar, Button } from '../../components/common';
import { ROUTES, ROLES, ROLE_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: ROUTES.SUPER_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title="Super Admin" />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Users</h1>
                <p className="text-xl text-gray-600">View and manage platform users</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SearchBar
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="flex-1"
                />

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={roleFilter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setRoleFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={roleFilter === ROLES.VERIFIED ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setRoleFilter(ROLES.VERIFIED)}
                  >
                    Verified
                  </Button>
                  <Button
                    variant={roleFilter === ROLES.DEPT_ADMIN ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setRoleFilter(ROLES.DEPT_ADMIN)}
                  >
                    Dept Admins
                  </Button>
                  <Button
                    variant={roleFilter === ROLES.ORG_ADMIN ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setRoleFilter(ROLES.ORG_ADMIN)}
                  >
                    Org Admins
                  </Button>
                </div>
              </div>

              {loading ? (
                <Loading.CardSkeleton count={8} />
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  title="No users found"
                  description="Try adjusting your search or filters"
                />
              ) : (
                <Card padding={false}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organization
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar src={user.avatar} name={user.name} size="sm" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-gray-900">{user.orgId?.name || '-'}</p>
                              {user.deptId && (
                                <p className="text-xs text-gray-500">{user.deptId.name}</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={user.verified ? 'success' : 'gray'}>
                                {user.verified ? 'Verified' : 'Unverified'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.createdAt, 'short')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ManageUsers;