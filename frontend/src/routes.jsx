import { lazy } from 'react';
import { ProtectedRoute } from './components/layout';
import { ROUTES, ROLES } from './utils/constants';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Organizations = lazy(() => import('./pages/public/Organizations'));
const OrganizationDetail = lazy(() => import('./pages/public/OrganizationDetail'));
const DepartmentDetail = lazy(() => import('./pages/public/DepartmentDetail'));
const BlogFeed = lazy(() => import('./pages/public/BlogFeed'));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RequestVerification = lazy(() => import('./pages/auth/RequestVerification'));

const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const MyBlogs = lazy(() => import('./pages/user/MyBlogs'));
const CreateBlog = lazy(() => import('./pages/user/CreateBlog'));
const EditBlog = lazy(() => import('./pages/user/EditBlog'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Settings = lazy(() => import('./pages/user/Settings'));
const LikedBlogs = lazy(() => import('./pages/user/LikedBlogs'));

const SuperAdminDashboard = lazy(() => import('./pages/admin/SuperAdminDashboard'));
const OrgAdminDashboard = lazy(() => import('./pages/admin/OrgAdminDashboard'));
const DeptAdminDashboard = lazy(() => import('./pages/admin/DeptAdminDashboard'));
const ManageOrganizations = lazy(() => import('./pages/admin/ManageOrganizations'));
const ManageDepartments = lazy(() => import('./pages/admin/ManageDepartments'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const VerificationManagement = lazy(() => import('./pages/admin/VerificationManagement'));
const PlatformSettings = lazy(() => import('./pages/admin/PlatformSettings'));

/**
 * Application Routes Configuration
 */
export const routes = [
  // Public Routes
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.ABOUT,
    element: <About />,
  },
  {
    path: ROUTES.ORGANIZATIONS,
    element: (
      <ProtectedRoute>
        <Organizations />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ORGANIZATION_DETAIL(':id'),
    element: (
      <ProtectedRoute>
        <OrganizationDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DEPARTMENT_DETAIL(':id'),
    element: (
      <ProtectedRoute>
        <DepartmentDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BLOGS,
    element: (
      <ProtectedRoute>
        <BlogFeed />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BLOG_DETAIL(':id'),
    element: (
      <ProtectedRoute>
        <BlogDetailPage />
      </ProtectedRoute>
    ),
  },

  // Auth Routes
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTES.REQUEST_VERIFICATION,
    element: (
      <ProtectedRoute>
        <RequestVerification />
      </ProtectedRoute>
    ),
  },

  // User Routes (Authenticated)
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MY_BLOGS,
    element: (
      <ProtectedRoute requireVerified>
        <MyBlogs />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CREATE_BLOG,
    element: (
      <ProtectedRoute requireVerified>
        <CreateBlog />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EDIT_BLOG(':id'),
    element: (
      <ProtectedRoute requireVerified>
        <EditBlog />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LIKED_BLOGS,
    element: (
      <ProtectedRoute>
        <LikedBlogs />
      </ProtectedRoute>
    ),
  },

  // Admin Routes
  {
    path: ROUTES.SUPER_ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ORG_ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredMinRole={ROLES.ORG_ADMIN}>
        <OrgAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DEPT_ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredMinRole={ROLES.DEPT_ADMIN}>
        <DeptAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_ORGS,
    element: (
      <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
        <ManageOrganizations />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_DEPTS,
    element: (
      <ProtectedRoute requiredMinRole={ROLES.ORG_ADMIN}>
        <ManageDepartments />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_USERS,
    element: (
      <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
        <ManageUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MANAGE_VERIFICATIONS,
    element: (
      <ProtectedRoute requiredMinRole={ROLES.DEPT_ADMIN}>
        <VerificationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PLATFORM_SETTINGS,
    element: (
      <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
        <PlatformSettings />
      </ProtectedRoute>
    ),
  },

  // 404 Route (must be last)
  {
    path: '*',
    element: <NotFound />,
  },
];