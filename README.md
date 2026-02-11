# 🏛️ Multi-Organization Blogging Platform

# OrgSpace-hub — A Hierarchical Multi-Organization Blogging Platform

A scalable, production-ready MERN stack application that enables multiple organizations (colleges, institutions) to manage their own blogging ecosystems with role-based access control and hierarchical content management.

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Core Concept](#core-concept)
3. [User Roles & Permissions](#user-roles--permissions)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [Tech Stack](#tech-stack)
7. [Project Phases](#project-phases)
8. [Setup Instructions](#setup-instructions)
9. [API Documentation](#api-documentation)
10. [Learning Objectives](#learning-objectives)

---

## 🎯 PROJECT OVERVIEW

### What Problem Does It Solve?

Traditional blogging platforms are either:
- **Too open**: Anyone can post anything anywhere (Medium, Blogger)
- **Too closed**: Single organization systems (WordPress for one company)

This platform bridges the gap by providing:
- **Global discoverability**: All content is publicly readable
- **Local accountability**: Content is always tied to specific organizations/departments
- **Hierarchical moderation**: Multiple levels of admin control
- **Verification system**: Users must be verified to post under an organization

### Real-World Use Cases

1. **University Portal**: Multiple colleges, each with departments, students post blogs
2. **Corporate Network**: Company divisions sharing knowledge articles
3. **Government Departments**: Ministries publishing updates by department
4. **Hospital Network**: Different hospitals with specialized departments

---

## 🧠 CORE CONCEPT

### Multi-Tenant Architecture

```
Platform
└── Organizations (e.g., MIT, Stanford, Harvard)
    └── Departments (e.g., Computer Science, Biology, Mathematics)
        └── Blogs (written by verified members)
            └── Comments & Likes (by verified users)
```

### Key Principles

1. **Read Access = Global**
   - Anyone can view any organization, department, or blog
   - No login required for browsing

2. **Write Access = Verified**
   - Users must be verified under an org/dept to post
   - Verification approved by department/org admins

3. **Moderation = Hierarchical**
   ```
   Super Admin → Manages platform
   Organization Admin → Manages their organization
   Department Admin → Manages their department
   ```

4. **Content Ownership**
   - Every blog belongs to: Organization + Department + Author
   - No cross-posting allowed
   - Content is scoped and traceable

---


## 🗂️ COMPLETE PROJECT FOLDER STRUCTURE

```

Multi-Org-Blog-Platform/
│
├── backend/
│   ├── config/
│   │   └── db.js                          # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js                        # User model with roles
│   │   ├── Organization.js                # Organization model
│   │   ├── Department.js                  # Department model
│   │   ├── Blog.js                        # Blog/Post model
│   │   ├── Comment.js                     # Comment model
│   │   ├── Like.js                        # Like model
│   │   └── Verification.js                # Verification request model
│   │
│   ├── controllers/
│   │   ├── authController.js              # Authentication logic
│   │   ├── userController.js              # User profile & verification requests
│   │   ├── organizationController.js      # Organization CRUD
│   │   ├── departmentController.js        # Department CRUD
│   │   ├── blogController.js              # Blog CRUD & filtering
│   │   ├── commentController.js           # Comment CRUD
│   │   ├── likeController.js              # Like/Unlike logic
│   │   └── adminController.js             # Admin-specific actions
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js              # JWT verification & role checking
│   │   ├── roleMiddleware.js              # Role-based authorization
│   │   ├── membershipMiddleware.js        # Org/Dept membership checks
│   │   ├── validationMiddleware.js        # Input validation
│   │   └── errorMiddleware.js             # Global error handler
│   │
│   ├── routes/
│   │   ├── authRoutes.js                  # /api/auth/*
│   │   ├── userRoutes.js                  # /api/users/*
│   │   ├── organizationRoutes.js          # /api/organizations/*
│   │   ├── departmentRoutes.js            # /api/departments/*
│   │   ├── blogRoutes.js                  # /api/blogs/*
│   │   ├── commentRoutes.js               # /api/comments/*
│   │   ├── likeRoutes.js                  # /api/likes/*
│   │   └── adminRoutes.js                 # /api/admin/*
│   │
│   ├── utils/
│   │   ├── generateToken.js               # JWT token generation
│   │   ├── seedData.js                    # Database seeding script
│   │   └── constants.js                   # Role constants, enums
│   │
│   ├── .env                               # Environment variables
│   ├── .gitignore                         # Git ignore file
│   ├── package.json                       # Backend dependencies
│   └── server.js                          # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── BlogCard.jsx
│   │   │   │   ├── BlogList.jsx
│   │   │   │   ├── BlogDetail.jsx
│   │   │   │   ├── BlogForm.jsx
│   │   │   │   ├── CommentSection.jsx
│   │   │   │   └── LikeButton.jsx
│   │   │   │
│   │   │   ├── organization/
│   │   │   │   ├── OrganizationCard.jsx
│   │   │   │   ├── OrganizationList.jsx
│   │   │   │   └── OrganizationDetail.jsx
│   │   │   │
│   │   │   ├── department/
│   │   │   │   ├── DepartmentCard.jsx
│   │   │   │   ├── DepartmentList.jsx
│   │   │   │   └── DepartmentDetail.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── SuperAdminPanel.jsx
│   │   │       ├── OrgAdminPanel.jsx
│   │   │       ├── DeptAdminPanel.jsx
│   │   │       ├── VerificationRequests.jsx
│   │   │       └── StatisticsCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Login.jsx
│   │   │   │
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx               # Landing page with global feed
│   │   │   │   ├── Organizations.jsx      # List all organizations
│   │   │   │   ├── OrganizationPage.jsx   # Single org page
│   │   │   │   ├── DepartmentPage.jsx     # Single dept page
│   │   │   │   └── BlogPage.jsx           # Single blog view
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.jsx          # User dashboard
│   │   │   │   ├── MyBlogs.jsx
│   │   │   │   ├── CreateBlog.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── RequestVerification.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── SuperAdminDashboard.jsx
│   │   │       ├── OrgAdminDashboard.jsx
│   │   │       └── DeptAdminDashboard.jsx
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── OrganizationContext.jsx
│   │   │   └── BlogContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                     # Axios instance
│   │   │   ├── authAPI.js
│   │   │   ├── organizationAPI.js
│   │   │   ├── departmentAPI.js
│   │   │   ├── blogAPI.js
│   │   │   ├── commentAPI.js
│   │   │   └── adminAPI.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useOrganizations.js
│   │   │   └── useBlogs.js
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js               # Role constants matching backend
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── docker-compose.yml                     # MongoDB + Backend containers
├── .gitignore
└── README.md                              # Project documentation

```

---

## 👥 USER ROLES & PERMISSIONS

### 1. 🌍 GLOBAL USER (Unverified)

**Can Do:**
- ✅ Browse all organizations and blogs
- ✅ Search and filter content
- ✅ Like blogs
- ✅ Share blogs

**Cannot Do:**
- ❌ Post blogs
- ❌ Comment (unless verified)

**Dashboard:** Basic user dashboard with global feed

---

### 2. ✅ VERIFIED USER

**Can Do:**
- ✅ Everything a global user can do
- ✅ Post blogs under their organization/department
- ✅ Comment on blogs (if org allows comments)
- ✅ Edit/delete their own blogs

**Cannot Do:**
- ❌ Post in other organizations/departments
- ❌ Moderate content

**How to Become Verified:**
1. Register as global user
2. Request verification for an organization/department
3. Wait for department/org admin approval

**Dashboard:** User dashboard + Create Blog feature

---

### 3. 🛡️ DEPARTMENT ADMIN

**Can Do:**
- ✅ Everything a verified user can do
- ✅ Approve/reject verification requests for their department
- ✅ Moderate all blogs in their department
- ✅ Edit/delete any blog in their department
- ✅ View department analytics

**Assigned By:** Organization Admin

**Dashboard:** Department Admin Panel

**Key Responsibility:** Managing department members and content quality

---

### 4. 👑 ORGANIZATION ADMIN

**Can Do:**
- ✅ Everything a verified user can do
- ✅ Create new departments
- ✅ Assign department admins
- ✅ Approve/reject verification requests for their organization
- ✅ Toggle comment settings (enable/disable org-wide)
- ✅ Edit organization profile (about, images, info)
- ✅ View organization analytics

**Assigned By:** Super Admin

**Dashboard:** Organization Admin Panel

**Key Responsibility:** Managing entire organization structure

---

### 5. ⚡ SUPER ADMIN

**Can Do:**
- ✅ Create new organizations
- ✅ Assign organization admins
- ✅ View platform-wide analytics
- ✅ Monitor system health

**Cannot Do:**
- ❌ Post blogs (not part of any organization)
- ❌ Moderate individual content (delegates to org/dept admins)

**Dashboard:** Super Admin Panel

**Key Responsibility:** Platform governance and organization creation

---

## 🏗️ SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                      (React Frontend)                        │
│  • Public Pages  • User Dashboard  • Admin Panels           │
└─────────────────────────────────────────────────────────────┘
                            ⬇ REST API
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│                    (Express Backend)                         │
│                                                              │
│  Routes → Middleware → Controllers → Services               │
│                                                              │
│  • Authentication (JWT)                                      │
│  • Authorization (Role-Based)                               │
│  • Business Logic                                            │
│  • Data Validation                                           │
└─────────────────────────────────────────────────────────────┘
                            ⬇ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                     (MongoDB)                                │
│                                                              │
│  Collections: users, organizations, departments, blogs,     │
│               comments, likes, verifications                 │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example: Creating a Blog

```
1. USER ACTION
   User clicks "Create Blog" → Fills form → Submits

2. FRONTEND
   CreateBlog.jsx → blogService.createBlog() → POST /api/blogs

3. BACKEND MIDDLEWARE
   authenticate() → Verifies JWT → Extracts user
   authorize(['verified_user']) → Checks role
   checkVerification() → Ensures user is verified

4. BACKEND CONTROLLER
   blogController.createBlog()
   → Validates: user belongs to org/dept
   → Creates blog with orgId, deptId, authorId

5. DATABASE
   Blog document saved with relationships

6. RESPONSE
   → Returns created blog
   → Frontend updates UI
   → User sees their new blog
```

---

## 💾 DATABASE SCHEMA

### Entity Relationship Diagram

```
┌──────────────┐
│ User         │
├──────────────┤
│ _id          │◄────────────┐
│ name         │             │
│ email        │             │
│ password     │             │
│ role         │             │ (author)
│ orgId        │─────┐       │
│ deptId       │────┐│       │
│ verified     │    ││       │
│ createdAt    │    ││       │
└──────────────┘    ││       │
                    ││       │
┌──────────────┐    ││       │
│Organization  │◄───┘│       │
├──────────────┤     │       │
│ _id          │     │       │
│ name         │     │       │
│ slug         │     │       │
│ about        │     │       │
│ logo         │     │       │
│ adminId      │─────┼───────┤ (refers to User)
│ commentsOn   │     │       │
│ createdAt    │     │       │
└──────────────┘     │       │
        │            │       │
        │ has many   │       │
        ⬇            │       │
┌──────────────┐     │       │
│ Department   │◄────┘       │
├──────────────┤             │
│ _id          │             │
│ name         │             │
│ slug         │             │
│ description  │             │
│ orgId        │─────────────┤ (belongs to Organization)
│ adminIds[]   │─────────────┤ (multiple dept admins)
│ createdAt    │             │
└──────────────┘             │
        │                    │
        │ has many           │
        ⬇                    │
┌──────────────┐             │
│ Blog         │             │
├──────────────┤             │
│ _id          │             │
│ title        │             │
│ slug         │             │
│ content      │             │
│ excerpt      │             │
│ coverImage   │             │
│ authorId     │─────────────┘
│ orgId        │─────────────┐ (belongs to Org)
│ deptId       │─────────────┤ (belongs to Dept)
│ tags[]       │             │
│ status       │             │
│ likesCount   │             │
│ commentsCount│             │
│ createdAt    │             │
└──────────────┘             │
        │                    │
        │ has many           │
        ⬇                    │
┌──────────────┐             │
│ Comment      │             │
├──────────────┤             │
│ _id          │             │
│ blogId       │─────────────┤
│ userId       │─────────────┤
│ text         │             │
│ createdAt    │             │
└──────────────┘             │
                             │
┌──────────────┐             │
│ Like         │             │
├──────────────┤             │
│ _id          │             │
│ blogId       │─────────────┤
│ userId       │─────────────┘
│ createdAt    │
└──────────────┘

┌──────────────┐
│Verification  │
├──────────────┤
│ _id          │
│ userId       │───────────┐
│ orgId        │───────────┤
│ deptId       │───────────┤
│ status       │ (pending/approved/rejected)
│ requestedAt  │
│ reviewedAt   │
│ reviewedBy   │───────────┘ (dept/org admin who reviewed)
└──────────────┘
```

### Collection Descriptions

#### **Users Collection**
Stores all user accounts with role-based access.

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['global_user', 'verified_user', 'dept_admin', 'org_admin', 'super_admin'],
  orgId: ObjectId (nullable, ref: Organization),
  deptId: ObjectId (nullable, ref: Department),
  verified: Boolean,
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Organizations Collection**
Top-level entities (colleges, companies, institutions).

```javascript
{
  _id: ObjectId,
  name: String (unique),
  slug: String (unique),
  about: String,
  logo: String (URL),
  coverImage: String (URL),
  adminId: ObjectId (ref: User),
  commentsEnabled: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Departments Collection**
Sub-units within organizations.

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  orgId: ObjectId (ref: Organization),
  adminIds: [ObjectId] (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Blogs Collection**
User-generated content tied to org/dept.

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  content: String (HTML/Markdown),
  excerpt: String,
  coverImage: String (URL),
  authorId: ObjectId (ref: User),
  orgId: ObjectId (ref: Organization),
  deptId: ObjectId (ref: Department),
  tags: [String],
  status: Enum ['draft', 'published'],
  likesCount: Number,
  commentsCount: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Comments Collection**
User comments on blogs (if enabled by org).

```javascript
{
  _id: ObjectId,
  blogId: ObjectId (ref: Blog),
  userId: ObjectId (ref: User),
  text: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Likes Collection**
Tracks user likes (prevents duplicate likes).

```javascript
{
  _id: ObjectId,
  blogId: ObjectId (ref: Blog),
  userId: ObjectId (ref: User),
  createdAt: Date
}
// Compound index on (blogId, userId) for uniqueness
```

#### **Verifications Collection**
Tracks pending/approved/rejected verification requests.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  orgId: ObjectId (ref: Organization),
  deptId: ObjectId (ref: Department),
  status: Enum ['pending', 'approved', 'rejected'],
  message: String (user's request message),
  requestedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId (ref: User)
}
```

---

## 🛠️ TECH STACK

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Docker)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Context API + useReducer
- **HTTP Client**: Axios
- **Styling**: CSS Modules / Styled Components

### DevOps
- **Containerization**: Docker (MongoDB)
- **Version Control**: Git
- **Deployment**: 
  - Backend: Railway / Render
  - Frontend: Vercel / Netlify

---

## 📅 PROJECT PHASES

### **PHASE 1: Database Design & Models** (Day 1-2)
- Design complete ER diagram
- Create all 7 Mongoose models
- Set up relationships (refs, virtuals, populations)
- Write seed script for test data
- Test relationships in MongoDB

### **PHASE 2: Enhanced Authentication** (Day 3-4)
- Extend User model with roles
- Build JWT authentication
- Create role-based middleware
- Implement verification request system
- Test auth flow with different roles

### **PHASE 3: Organization & Department Management** (Day 5-6)
- Build Organization CRUD APIs
- Build Department CRUD APIs
- Implement hierarchy rules (org admin creates dept)
- Add public listing and detail endpoints
- Test with Postman

### **PHASE 4: Blog System** (Day 7-9)
- Build Blog CRUD APIs
- Implement permission checks (can only post to own org/dept)
- Add filtering (by org, dept, tags)
- Add pagination and sorting
- Test blog creation flow

### **PHASE 5: Engagement Features** (Day 10-11)
- Build Like system
- Build Comment system (with org.commentsEnabled check)
- Implement counters (likesCount, commentsCount)
- Add moderation endpoints for admins

### **PHASE 6: Admin Panels** (Day 12-14)
- Build Super Admin APIs (create orgs, assign admins)
- Build Org Admin APIs (create depts, manage settings)
- Build Dept Admin APIs (approve verifications, moderate)
- Create statistics endpoints

### **PHASE 7: Frontend Development** (Day 15-17)
- Build public pages (landing, org list, blog detail)
- Build user dashboard
- Build 3 admin dashboards
- Implement protected routes
- Add forms and validation

### **PHASE 8: Polish & Deploy** (Day 18-21)
- Testing all user flows
- Bug fixes and edge cases
- Deploy backend and frontend
- Write comprehensive documentation
- Create demo video

---

## 🚀 SETUP INSTRUCTIONS

### Prerequisites
- Node.js (v18+)
- Docker Desktop
- MongoDB Compass (optional, for GUI)
- Git

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd multi-org-blog-platform
```

#### 2. Start MongoDB with Docker
```bash
docker-compose up -d
```

Verify MongoDB is running:
```bash
docker ps
```

#### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
```

#### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

#### 5. Seed Database (Optional)
```bash
cd backend
npm run seed
```

### Environment Variables

#### Backend `.env`
```env
MONGO_URI=mongodb://admin:securepass@localhost:27017/multi_org_blog?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=development
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API DOCUMENTATION

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Organization Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/organizations` | List all organizations | Public |
| GET | `/api/organizations/:id` | Get organization details | Public |
| POST | `/api/organizations` | Create organization | Super Admin |
| PATCH | `/api/organizations/:id` | Update organization | Org Admin |

### Department Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/departments?orgId=` | List departments by org | Public |
| GET | `/api/departments/:id` | Get department details | Public |
| POST | `/api/departments` | Create department | Org Admin |
| PATCH | `/api/departments/:id` | Update department | Dept Admin |

### Blog Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/blogs` | List all blogs (with filters) | Public |
| GET | `/api/blogs/:id` | Get blog details | Public |
| POST | `/api/blogs` | Create blog | Verified User |
| PATCH | `/api/blogs/:id` | Update blog | Author/Admin |
| DELETE | `/api/blogs/:id` | Delete blog | Author/Admin |

### Comment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/blogs/:blogId/comments` | Get blog comments | Public |
| POST | `/api/blogs/:blogId/comments` | Add comment | Verified User |
| DELETE | `/api/comments/:id` | Delete comment | Author/Admin |

### Like Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/blogs/:blogId/like` | Like blog | Authenticated |
| DELETE | `/api/blogs/:blogId/unlike` | Unlike blog | Authenticated |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/verifications` | Get pending verifications | Dept/Org Admin |
| PATCH | `/api/admin/verifications/:id` | Approve/reject verification | Dept/Org Admin |
| GET | `/api/admin/stats` | Get dashboard statistics | Any Admin |

---

## 🎓 LEARNING OBJECTIVES

By completing this project, you will master:

### **Backend Skills**
1. **Multi-Tenant Architecture**
   - Designing systems for multiple organizations
   - Data isolation and scoping
   - Hierarchical permission structures

2. **Advanced RBAC**
   - Dynamic role assignment
   - Context-aware permissions
   - Middleware composition

3. **Complex Data Modeling**
   - One-to-many relationships
   - Many-to-many relationships
   - Referencing vs embedding

4. **RESTful API Design**
   - Resource-based routing
   - Query parameters for filtering
   - Pagination and sorting

### **Frontend Skills**
1. **React Context API**
   - Managing global state
   - Multiple contexts
   - Context composition

2. **Protected Routes**
   - Role-based routing
   - Conditional rendering
   - Route guards

3. **Form Management**
   - Controlled components
   - Validation
   - Error handling

4. **Component Architecture**
   - Reusable components
   - Container/Presenter pattern
   - Component composition

### **General Skills**
1. **System Design**
   - Breaking down requirements
   - Designing scalable architectures
   - Making trade-offs

2. **Security**
   - JWT authentication
   - Role-based authorization
   - Input validation

3. **Database Design**
   - Normalization
   - Indexing strategies
   - Query optimization

---

