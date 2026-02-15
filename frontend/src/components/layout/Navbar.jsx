import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge, Dropdown, Button } from '../common';
import { ROUTES, ROLES, ROLE_LABELS } from '../../utils/constants';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getDashboardRoute = () => {
    if (!user) return ROUTES.DASHBOARD;
    
    switch (user.role) {
      case ROLES.SUPER_ADMIN:
        return ROUTES.SUPER_ADMIN_DASHBOARD;
      case ROLES.ORG_ADMIN:
        return ROUTES.ORG_ADMIN_DASHBOARD;
      case ROLES.DEPT_ADMIN:
        return ROUTES.DEPT_ADMIN_DASHBOARD;
      default:
        return ROUTES.DASHBOARD;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Blog Platform
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to={ROUTES.BLOGS}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Blogs
            </Link>
            <Link
              to={ROUTES.ORGANIZATIONS}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Organizations
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Create Blog Button (Verified users only) */}
                {user?.verified && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(ROUTES.CREATE_BLOG)}
                    className="hidden md:flex"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Blog
                  </Button>
                )}

                {/* User Menu */}
                <Dropdown
                  align="right"
                  trigger={
                    <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
                      <Avatar
                        src={user?.avatar}
                        name={user?.name}
                        size="sm"
                        status={user?.verified ? 'online' : 'offline'}
                      />
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{ROLE_LABELS[user?.role]}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  }
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    <div className="mt-1">
                      <Badge variant={user?.verified ? 'success' : 'warning'} size="sm">
                        {user?.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>

                  <Dropdown.Item
                    onClick={() => navigate(getDashboardRoute())}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    }
                  >
                    Dashboard
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => navigate(ROUTES.MY_BLOGS)}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    }
                  >
                    My Blogs
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => navigate(ROUTES.PROFILE)}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  >
                    Profile
                  </Dropdown.Item>

                  {!user?.verified && (
                    <Dropdown.Item
                      onClick={() => navigate(ROUTES.REQUEST_VERIFICATION)}
                      icon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    >
                      Request Verification
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />

                  <Dropdown.Item
                    onClick={handleLogout}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    }
                  >
                    Sign Out
                  </Dropdown.Item>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.BLOGS}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                to={ROUTES.ORGANIZATIONS}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Organizations
              </Link>
              {isAuthenticated && user?.verified && (
                <Link
                  to={ROUTES.CREATE_BLOG}
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Blog
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;