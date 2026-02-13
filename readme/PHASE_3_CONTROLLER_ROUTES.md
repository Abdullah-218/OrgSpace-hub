# 🎉 PHASE 3 COMPLETE - API ENDPOINTS GUIDE

## ✅ What You've Built

You now have a **fully functional RESTful API** with:

- ✅ 7 Controllers (60+ endpoints)
- ✅ 8 Route files  
- ✅ Complete CRUD operations
- ✅ Role-based access control
- ✅ Authentication & Authorization
- ✅ Admin management system

---

## 🚀 GETTING STARTED

### Step 1: Start MongoDB
```bash
cd blog-platform
docker-compose up -d
```

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Setup Environment
```bash
# Copy and edit .env
cp .env.example .env

# Make sure these are set:
MONGO_URI=mongodb://admin:securepassword123@localhost:27017/blog_platform?authSource=admin
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Step 4: Seed Database
```bash
npm run seed
```

### Step 5: Start Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully!
🚀 Server running in development mode
📡 Server URL: http://localhost:5000
```

---

## 📡 COMPLETE API REFERENCE

### **1. AUTHENTICATION ENDPOINTS**

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "bio": "Hello world"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@blogplatform.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

#### Request Verification
```http
POST /api/auth/request-verification
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "orgId": "ORGANIZATION_ID",
  "deptId": "DEPARTMENT_ID",
  "message": "I'm a student here"
}
```

---

### **2. USER ENDPOINTS**

#### Get All Users
```http
GET /api/users?page=1&limit=20
```

#### Get User by ID
```http
GET /api/users/:userId
```

#### Search Users
```http
GET /api/users/search?q=john
```

#### Get Users by Organization
```http
GET /api/users/organization/:orgId
```

---

### **3. ORGANIZATION ENDPOINTS**

#### Get All Organizations
```http
GET /api/organizations?page=1&limit=20
```

#### Get Organization by ID
```http
GET /api/organizations/:orgId
```

#### Create Organization (Super Admin Only)
```http
POST /api/organizations
Authorization: Bearer SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "MIT",
  "about": "Massachusetts Institute of Technology",
  "adminId": "USER_ID_WHO_WILL_BE_ADMIN",
  "website": "https://mit.edu",
  "email": "contact@mit.edu"
}
```

#### Update Organization (Org Admin)
```http
PATCH /api/organizations/:orgId
Authorization: Bearer ORG_ADMIN_TOKEN
Content-Type: application/json

{
  "about": "Updated description",
  "website": "https://newsite.com"
}
```

#### Toggle Comments (Org Admin)
```http
PATCH /api/organizations/:orgId/toggle-comments
Authorization: Bearer ORG_ADMIN_TOKEN
```

---

### **4. DEPARTMENT ENDPOINTS**

#### Get All Departments
```http
GET /api/departments?orgId=ORGANIZATION_ID
```

#### Get Department by ID
```http
GET /api/departments/:deptId
```

#### Create Department (Org Admin)
```http
POST /api/departments
Authorization: Bearer ORG_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Physics",
  "description": "Physics department",
  "orgId": "ORGANIZATION_ID"
}
```

---

### **5. BLOG ENDPOINTS**

#### Get All Blogs
```http
GET /api/blogs?page=1&limit=10&orgId=ORG_ID&deptId=DEPT_ID
```

#### Get Trending Blogs
```http
GET /api/blogs/trending?limit=10
```

#### Get Blog by ID
```http
GET /api/blogs/:blogId
```

#### Create Blog (Verified User)
```http
POST /api/blogs
Authorization: Bearer VERIFIED_USER_TOKEN
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is the blog content...",
  "excerpt": "Short summary",
  "tags": ["tech", "ai"],
  "published": true
}
```

#### Update Blog
```http
PATCH /api/blogs/:blogId
Authorization: Bearer AUTHOR_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Blog
```http
DELETE /api/blogs/:blogId
Authorization: Bearer AUTHOR_TOKEN
```

#### Get My Blogs
```http
GET /api/blogs/my/blogs
Authorization: Bearer USER_TOKEN
```

---

### **6. COMMENT ENDPOINTS**

#### Get Blog Comments
```http
GET /api/blogs/:blogId/comments?page=1&limit=20
```

#### Add Comment (Verified User)
```http
POST /api/blogs/:blogId/comments
Authorization: Bearer VERIFIED_USER_TOKEN
Content-Type: application/json

{
  "text": "Great article!"
}
```

#### Update Comment
```http
PATCH /api/comments/:commentId
Authorization: Bearer COMMENT_AUTHOR_TOKEN
Content-Type: application/json

{
  "text": "Updated comment text"
}
```

#### Delete Comment
```http
DELETE /api/comments/:commentId
Authorization: Bearer AUTHOR_OR_ADMIN_TOKEN
```

---

### **7. LIKE ENDPOINTS**

#### Toggle Like
```http
POST /api/blogs/:blogId/like
Authorization: Bearer USER_TOKEN
```

#### Get Like Info
```http
GET /api/blogs/:blogId/likes
```

#### Get Users Who Liked
```http
GET /api/blogs/:blogId/likes/users
```

---

### **8. ADMIN ENDPOINTS**

#### Super Admin: Assign Org Admin
```http
POST /api/admin/super/assign-org-admin
Authorization: Bearer SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "userId": "USER_ID",
  "orgId": "ORGANIZATION_ID"
}
```

#### Super Admin: Get Platform Stats
```http
GET /api/admin/super/stats
Authorization: Bearer SUPER_ADMIN_TOKEN
```

#### Org Admin: Assign Dept Admin
```http
POST /api/admin/org/assign-dept-admin
Authorization: Bearer ORG_ADMIN_TOKEN
Content-Type: application/json

{
  "userId": "USER_ID",
  "deptId": "DEPARTMENT_ID"
}
```

#### Org Admin: Get Pending Verifications
```http
GET /api/admin/org/verifications
Authorization: Bearer ORG_ADMIN_TOKEN
```

#### Dept Admin: Get Pending Verifications
```http
GET /api/admin/dept/verifications
Authorization: Bearer DEPT_ADMIN_TOKEN
```

#### Approve Verification
```http
PATCH /api/admin/verifications/:verificationId/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "reviewNote": "Approved - verified student ID"
}
```

#### Reject Verification
```http
PATCH /api/admin/verifications/:verificationId/reject
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "reviewNote": "Invalid student ID"
}
```

---

## 🧪 TESTING WORKFLOW

### Test 1: Complete User Journey

```bash
# 1. Register as new user
POST /api/auth/register
{
  "name": "Alice",
  "email": "alice@test.com",
  "password": "password123"
}
# Save the token!

# 2. Login (optional, already have token)
POST /api/auth/login
{
  "email": "alice@test.com",
  "password": "password123"
}

# 3. Request verification
POST /api/auth/request-verification
Authorization: Bearer ALICE_TOKEN
{
  "orgId": "STANFORD_ID",
  "deptId": "CS_DEPT_ID",
  "message": "I'm a CS student"
}

# 4. Login as dept admin to approve
POST /api/auth/login
{
  "email": "bob@stanford.edu",
  "password": "password123"
}

# 5. Approve verification
PATCH /api/admin/verifications/:verificationId/approve
Authorization: Bearer BOB_TOKEN
{
  "reviewNote": "Verified"
}

# 6. Alice can now post blogs!
POST /api/blogs
Authorization: Bearer ALICE_TOKEN
{
  "title": "My First Blog",
  "content": "Hello world!"
}
```

### Test 2: Admin Hierarchy

```bash
# 1. Super Admin creates organization
POST /api/organizations
Authorization: Bearer SUPER_ADMIN_TOKEN
{
  "name": "Yale University",
  "about": "Ivy League university",
  "adminId": "JOHN_USER_ID"
}

# 2. Super Admin assigns org admin
POST /api/admin/super/assign-org-admin
Authorization: Bearer SUPER_ADMIN_TOKEN
{
  "userId": "JOHN_USER_ID",
  "orgId": "YALE_ID"
}

# 3. Org Admin creates department
POST /api/departments
Authorization: Bearer JOHN_TOKEN
{
  "name": "Engineering",
  "description": "Engineering dept",
  "orgId": "YALE_ID"
}

# 4. Org Admin assigns dept admin
POST /api/admin/org/assign-dept-admin
Authorization: Bearer JOHN_TOKEN
{
  "userId": "ALICE_USER_ID",
  "deptId": "ENGINEERING_DEPT_ID"
}
```

---

## 🔐 TEST CREDENTIALS (From Seed Data)

```
SUPER ADMIN:
Email: admin@blogplatform.com
Password: admin123

ORG ADMIN (Stanford):
Email: john@stanford.edu
Password: password123

DEPT ADMIN (CS):
Email: bob@stanford.edu
Password: password123

VERIFIED USER:
Email: alice@stanford.edu
Password: password123

GLOBAL USER:
Email: global1@example.com
Password: password123
```

---

## 📊 API RESPONSE FORMAT

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Paginated:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": {
    "items": [...]
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Not authorized, no token provided"
**Solution**: Add Authorization header with Bearer token

### Issue: "User must be verified to perform this action"
**Solution**: Request and get approval for verification first

### Issue: "Access denied. Organization admin only"
**Solution**: Use correct role's token for the endpoint

### Issue: "ValidationError: ..."
**Solution**: Check required fields in request body

---

## 🎯 NEXT STEPS

**Phase 4 Tomorrow: Frontend Implementation**

We'll build React components that consume these APIs:
- Login/Register forms
- Blog listing and creation
- Admin dashboards
- Verification management UI

---

**Congratulations! You have a production-ready backend API! 🚀**