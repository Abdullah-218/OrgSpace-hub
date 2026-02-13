# 📡 COMPLETE API ROUTES REFERENCE

## Overview

This document contains **all 60+ API endpoints** organized by category.

---

## 🔐 **1. AUTHENTICATION ROUTES** (`/api/auth`)

### Public Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |

### Protected Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/auth/me` | Get current user profile | Private |
| PATCH | `/api/auth/profile` | Update profile | Private |
| PATCH | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/request-verification` | Request org/dept verification | Private |
| GET | `/api/auth/verifications` | Get verification history | Private |

---

## 👥 **2. USER ROUTES** (`/api/users`)

All user endpoints are **public**.

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/users` | Get all users | `?orgId=...&deptId=...&role=...&verified=true&page=1&limit=20` |
| GET | `/api/users/search` | Search users | `?q=john&limit=10` |
| GET | `/api/users/organization/:orgId` | Get org users | `?page=1&limit=20` |
| GET | `/api/users/department/:deptId` | Get dept users | `?page=1&limit=20` |
| GET | `/api/users/:id` | Get user by ID | - |

---

## 🏢 **3. ORGANIZATION ROUTES** (`/api/organizations`)

### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/organizations` | Get all organizations | `?active=true&page=1&limit=20` |
| GET | `/api/organizations/:id` | Get org by ID | - |
| GET | `/api/organizations/:id/stats` | Get org statistics | - |

### Super Admin Only

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/organizations` | Create organization | Super Admin |
| DELETE | `/api/organizations/:id` | Delete organization | Super Admin |

### Org Admin Only

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PATCH | `/api/organizations/:id` | Update organization | Org Admin |
| PATCH | `/api/organizations/:id/toggle-comments` | Enable/disable comments | Org Admin |

---

## 🏛️ **4. DEPARTMENT ROUTES** (`/api/departments`)

### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/departments` | Get all departments | `?orgId=...&active=true&page=1&limit=20` |
| GET | `/api/departments/organization/:orgId` | Get org's departments | - |
| GET | `/api/departments/:id` | Get dept by ID | - |
| GET | `/api/departments/:id/stats` | Get dept statistics | - |

### Org Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/departments` | Create department | Org Admin |
| PATCH | `/api/departments/:id` | Update department | Org/Dept Admin |
| DELETE | `/api/departments/:id` | Delete department | Org Admin |

---

## 📝 **5. BLOG ROUTES** (`/api/blogs`)

### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/blogs` | Get all blogs | `?page=1&limit=10&orgId=...&deptId=...&authorId=...&tags=...&sort=-createdAt` |
| GET | `/api/blogs/trending` | Get trending blogs | `?limit=10` |
| GET | `/api/blogs/:id` | Get blog by ID | - |

### Verified Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/blogs` | Create blog | Verified |
| GET | `/api/blogs/my/blogs` | Get my blogs | Private |
| PATCH | `/api/blogs/:id` | Update blog | Author/Admin |
| DELETE | `/api/blogs/:id` | Delete blog | Author/Admin |

---

## 💬 **6. COMMENT ROUTES** (`/api`)

### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/blogs/:blogId/comments` | Get blog comments | `?page=1&limit=20` |

### Verified Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/blogs/:blogId/comments` | Add comment | Verified |
| PATCH | `/api/comments/:id` | Update comment | Author |
| DELETE | `/api/comments/:id` | Delete comment | Author/Admin |

---

## ❤️ **7. LIKE ROUTES** (`/api`)

### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/blogs/:blogId/likes` | Get like info | - |
| GET | `/api/blogs/:blogId/likes/users` | Get users who liked | `?page=1&limit=20` |
| GET | `/api/users/:userId/liked-blogs` | Get user's liked blogs | `?page=1&limit=10` |

### Authenticated Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/blogs/:blogId/like` | Toggle like | Private |

---

## 👑 **8. ADMIN ROUTES** (`/api/admin`)

### Super Admin Only

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/admin/super/assign-org-admin` | Assign org admin | `{ userId, orgId }` |
| GET | `/api/admin/super/stats` | Platform statistics | - |

### Org Admin Only

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/admin/org/assign-dept-admin` | Assign dept admin | `{ userId, deptId }` |
| POST | `/api/admin/org/remove-dept-admin` | Remove dept admin | `{ userId, deptId }` |
| GET | `/api/admin/org/verifications` | Get pending verifications | - |
| GET | `/api/admin/org/stats` | Org statistics | - |

### Dept Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dept/verifications` | Get pending verifications |
| GET | `/api/admin/dept/stats` | Dept statistics |

### Shared Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PATCH | `/api/admin/verifications/:id/approve` | Approve verification | Dept/Org/Super Admin |
| PATCH | `/api/admin/verifications/:id/reject` | Reject verification | Dept/Org/Super Admin |

---

## 📊 **ROUTE SUMMARY BY COUNT**

| Category | Endpoints | Public | Protected |
|----------|-----------|--------|-----------|
| Authentication | 7 | 2 | 5 |
| Users | 5 | 5 | 0 |
| Organizations | 7 | 3 | 4 |
| Departments | 7 | 4 | 3 |
| Blogs | 8 | 3 | 5 |
| Comments | 4 | 1 | 3 |
| Likes | 4 | 3 | 1 |
| Admin | 12 | 0 | 12 |
| **TOTAL** | **54** | **21** | **33** |

---

## 🔑 **AUTHORIZATION MATRIX**

| Route Type | Global User | Verified User | Dept Admin | Org Admin | Super Admin |
|------------|-------------|---------------|------------|-----------|-------------|
| View content | ✅ | ✅ | ✅ | ✅ | ✅ |
| Like | ✅ | ✅ | ✅ | ✅ | ✅ |
| Comment | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create blog | ❌ | ✅ | ✅ | ✅ | ❌ |
| Edit own blog | ❌ | ✅ | ✅ | ✅ | ❌ |
| Edit dept blog | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve verification | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create dept | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign dept admin | ❌ | ❌ | ❌ | ✅ | ✅ |
| Create org | ❌ | ❌ | ❌ | ❌ | ✅ |
| Assign org admin | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 **QUICK TESTING GUIDE**

### 1. Test Authentication Flow
```bash
# Register
POST /api/auth/register
Body: { name, email, password }

# Login (save token!)
POST /api/auth/login
Body: { email, password }

# Get profile
GET /api/auth/me
Headers: Authorization: Bearer TOKEN
```

### 2. Test Verification Flow
```bash
# Request verification
POST /api/auth/request-verification
Headers: Authorization: Bearer USER_TOKEN
Body: { orgId, deptId, message }

# Dept admin approves
PATCH /api/admin/verifications/:id/approve
Headers: Authorization: Bearer DEPT_ADMIN_TOKEN
Body: { reviewNote }
```

### 3. Test Blog Flow
```bash
# Create blog (verified user)
POST /api/blogs
Headers: Authorization: Bearer VERIFIED_USER_TOKEN
Body: { title, content }

# Like blog
POST /api/blogs/:blogId/like
Headers: Authorization: Bearer ANY_USER_TOKEN

# Comment on blog
POST /api/blogs/:blogId/comments
Headers: Authorization: Bearer VERIFIED_USER_TOKEN
Body: { text }
```

### 4. Test Admin Flow
```bash
# Super admin creates org
POST /api/organizations
Headers: Authorization: Bearer SUPER_ADMIN_TOKEN
Body: { name, about, adminId }

# Super admin assigns org admin
POST /api/admin/super/assign-org-admin
Headers: Authorization: Bearer SUPER_ADMIN_TOKEN
Body: { userId, orgId }

# Org admin creates dept
POST /api/departments
Headers: Authorization: Bearer ORG_ADMIN_TOKEN
Body: { name, description, orgId }

# Org admin assigns dept admin
POST /api/admin/org/assign-dept-admin
Headers: Authorization: Bearer ORG_ADMIN_TOKEN
Body: { userId, deptId }
```

---

## 📝 **REQUEST EXAMPLES**

### Example 1: Get All Blogs with Filters
```http
GET /api/blogs?orgId=64abc123&deptId=64def456&page=1&limit=10&sort=-createdAt
```

### Example 2: Create Blog
```http
POST /api/blogs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Introduction to AI",
  "content": "Artificial Intelligence is...",
  "excerpt": "A beginner's guide to AI",
  "tags": ["ai", "technology"],
  "published": true
}
```

### Example 3: Approve Verification
```http
PATCH /api/admin/verifications/64xyz789/approve
Authorization: Bearer DEPT_ADMIN_TOKEN
Content-Type: application/json

{
  "reviewNote": "Verified with student ID card"
}
```

---

## ✅ **TESTING CHECKLIST**

- [ ] Can register new user
- [ ] Can login and receive token
- [ ] Can view organizations (public)
- [ ] Can view blogs (public)
- [ ] Can request verification
- [ ] Dept admin can approve verification
- [ ] Verified user can create blog
- [ ] Verified user can comment
- [ ] Any user can like
- [ ] Author can edit own blog
- [ ] Admin can edit department blogs
- [ ] Super admin can create organization
- [ ] Org admin can create department
- [ ] Org admin can assign dept admin

---

**All routes are now documented and ready to test! 🚀**