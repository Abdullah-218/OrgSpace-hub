# 🚀 PHASE 2 SETUP GUIDE

## Complete Database Setup, Seeding & Testing

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- ✅ Docker installed and running
- ✅ Node.js (v18+) installed
- ✅ MongoDB Compass (optional, for viewing database)
- ✅ Postman or Thunder Client (for API testing)

---

## 🔧 STEP-BY-STEP SETUP

### **Step 1: Start MongoDB with Docker**

```bash
# Navigate to project root
cd multi-org-blog-platform

# Start MongoDB container
docker-compose up -d

# Verify container is running
docker ps

# You should see: blog-platform-mongodb
```

**What this does:**
- Creates a MongoDB instance with username/password authentication
- Data persists in a Docker volume (won't be lost on restart)
- Exposed on `localhost:27017`

---

### **Step 2: Install Backend Dependencies**

```bash
cd backend

# Install all packages
npm install

# Expected packages:
# - express (web framework)
# - mongoose (MongoDB ODM)
# - bcryptjs (password hashing)
# - jsonwebtoken (JWT authentication)
# - dotenv (environment variables)
# - cors (cross-origin requests)
# - multer (file uploads)
# - nodemon (auto-restart dev server)
```

---

### **Step 3: Create Environment File**

```bash
# Copy example env file
cp .env.example .env

# Edit .env and verify these values:
MONGO_URI=mongodb://admin:securepassword123@localhost:27017/blog_platform?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**IMPORTANT**: The `MONGO_URI` must match your docker-compose settings:
- Username: `admin`
- Password: `securepassword123`
- Database: `blog_platform`
- Auth source: `admin`

---

### **Step 4: Test Database Connection**

Create a test file to verify connection:

```bash
# Create test file
touch testConnection.js
```

**testConnection.js:**
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }
};

testConnection();
```

**Run test:**
```bash
node testConnection.js

# Expected output:
# ✅ MongoDB Connected Successfully!
# Database: blog_platform
```

---

### **Step 5: Run Seed Script**

```bash
# Populate database with sample data
npm run seed
```

**What this creates:**

**Users:**
- 1 Super Admin (admin@blogplatform.com)
- 2 Organization Admins (john@stanford.edu, jane@harvard.edu)
- 2 Department Admins (bob@stanford.edu, emma@harvard.edu)
- 6 Verified Users
- 5 Global Users (unverified)

**Organizations:**
- Stanford University
- Harvard University

**Departments:**
- Stanford: Computer Science, Business
- Harvard: Law, Medicine

**Content:**
- 20+ Sample blogs
- Comments and likes
- 2 Pending verification requests

**All passwords:** `password123` (except super admin: `admin123`)

---

### **Step 6: Verify Seed Data**

**Option A: MongoDB Compass (GUI)**

1. Open MongoDB Compass
2. Connect using: `mongodb://admin:securepassword123@localhost:27017/blog_platform?authSource=admin`
3. Browse collections:
   - `users` - Should see 14+ users
   - `organizations` - Should see 2 organizations
   - `departments` - Should see 4 departments
   - `blogs` - Should see 6+ blogs
   - `comments` - Should see several comments
   - `likes` - Should see likes data
   - `verifications` - Should see 2 pending requests

**Option B: MongoDB Shell**

```bash
# Connect to MongoDB container
docker exec -it blog-platform-mongodb mongosh -u admin -p securepassword123 --authenticationDatabase admin

# Switch to database
use blog_platform

# Count documents
db.users.countDocuments()          // Should be ~14
db.organizations.countDocuments()  // Should be 2
db.departments.countDocuments()    // Should be 4
db.blogs.countDocuments()          // Should be ~6

# View a sample user
db.users.findOne({ role: 'super_admin' })

# Exit
exit
```

---

### **Step 7: Test Model Relationships**

Create a test file to verify relationships work:

**testModels.js:**
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Organization from './models/Organization.js';
import Blog from './models/Blog.js';

dotenv.config();

const testRelationships = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: User → Organization relationship
    console.log('📝 Test 1: User → Organization');
    const orgAdmin = await User.findOne({ role: 'org_admin' }).populate('orgId');
    console.log(`User: ${orgAdmin.name}`);
    console.log(`Organization: ${orgAdmin.orgId?.name || 'Not assigned'}\n`);

    // Test 2: Organization → Admin
    console.log('📝 Test 2: Organization → Admin');
    const org = await Organization.findOne().populate('adminId');
    console.log(`Organization: ${org.name}`);
    console.log(`Admin: ${org.adminId.name}\n`);

    // Test 3: Blog → Author, Org, Dept
    console.log('📝 Test 3: Blog → Author, Org, Dept');
    const blog = await Blog.findOne()
      .populate('authorId', 'name email')
      .populate('orgId', 'name')
      .populate('deptId', 'name');
    
    console.log(`Blog: "${blog.title}"`);
    console.log(`Author: ${blog.authorId.name}`);
    console.log(`Organization: ${blog.orgId.name}`);
    console.log(`Department: ${blog.deptId.name}\n`);

    // Test 4: Instance methods
    console.log('📝 Test 4: Instance Methods');
    const user = await User.findOne({ role: 'verified' });
    console.log(`User: ${user.name}`);
    console.log(`Can post to their dept: ${user.canPostTo(user.orgId, user.deptId)}`);
    console.log(`Can post to different dept: ${user.canPostTo(org._id, blog.deptId)}\n`);

    // Test 5: Static methods
    console.log('📝 Test 5: Static Methods');
    const stanfordUsers = await User.findByOrg(org._id);
    console.log(`Users in ${org.name}: ${stanfordUsers.length}\n`);

    console.log('✅ All relationship tests passed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testRelationships();
```

**Run test:**
```bash
node testModels.js
```

**Expected output:**
```
✅ Connected to MongoDB

📝 Test 1: User → Organization
User: John Stanford
Organization: Stanford University

📝 Test 2: Organization → Admin
Organization: Stanford University
Admin: John Stanford

📝 Test 3: Blog → Author, Org, Dept
Blog: "Introduction to Machine Learning"
Author: Alice Johnson
Organization: Stanford University
Department: Computer Science

📝 Test 4: Instance Methods
User: Alice Johnson
Can post to their dept: true
Can post to different dept: false

📝 Test 5: Static Methods
Users in Stanford University: 4

✅ All relationship tests passed!
```

---

## 🎯 UNDERSTANDING THE ADMIN HIERARCHY

### **The Complete Flow**

```
1. SUPER ADMIN (Platform Owner)
   ↓ Creates organization
   ↓ Assigns org admin (promotes regular user)
   
2. ORG ADMIN (Manages one organization)
   ↓ Creates departments
   ↓ Assigns dept admins (promotes verified members)
   ↓ Approves verification requests
   
3. DEPT ADMIN (Manages one department)
   ↓ Approves verification requests for their dept
   ↓ Moderates dept content
   
4. VERIFIED USER (Member of org + dept)
   ↓ Posts blogs in their dept
   ↓ Comments (if enabled)
   
5. GLOBAL USER (Not verified)
   → Can read all content
   → Can like content
   → Can request verification
```

---

## 🔐 TEST CREDENTIALS

### **Super Admin (Platform Management)**
```
Email: admin@blogplatform.com
Password: admin123
Access: Full platform control
```

### **Organization Admin (Stanford)**
```
Email: john@stanford.edu
Password: password123
Access: Manage Stanford University
```

### **Organization Admin (Harvard)**
```
Email: jane@harvard.edu
Password: password123
Access: Manage Harvard University
```

### **Department Admin (CS - Stanford)**
```
Email: bob@stanford.edu
Password: password123
Access: Moderate CS department
```

### **Department Admin (Law - Harvard)**
```
Email: emma@harvard.edu
Password: password123
Access: Moderate Law department
```

### **Verified User**
```
Email: alice@stanford.edu
Password: password123
Access: Post blogs in Stanford CS
```

### **Global User (Unverified)**
```
Email: global1@example.com
Password: password123
Access: Read-only + like
```

---

## ✅ VERIFICATION CHECKLIST

Before proceeding to Phase 3, verify:

- [ ] MongoDB container is running
- [ ] Can connect to MongoDB (testConnection.js passes)
- [ ] Seed script runs successfully
- [ ] Can see data in MongoDB Compass or shell
- [ ] Relationship test passes (testModels.js)
- [ ] All 7 collections exist with data
- [ ] Middleware files are in place
- [ ] Environment variables are configured

---

## 🐛 TROUBLESHOOTING

### **Issue: "ECONNREFUSED" when connecting**
**Solution:**
```bash
# Check if MongoDB container is running
docker ps

# If not running, start it
docker-compose up -d

# Check container logs
docker logs blog-platform-mongodb
```

### **Issue: "Authentication failed"**
**Solution:**
Verify `.env` credentials match `docker-compose.yml`:
- Username: `admin`
- Password: `securepassword123`
- Auth source: `admin`

### **Issue: "Cannot find module"**
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Seed script fails with validation error**
**Solution:**
```bash
# Clear database and re-seed
docker exec -it blog-platform-mongodb mongosh -u admin -p securepassword123 --authenticationDatabase admin

use blog_platform
db.dropDatabase()
exit

npm run seed
```

---

## 📚 NEXT: PHASE 3 Preview

Once Phase 2 is complete, Phase 3 will cover:

1. **Auth Controllers** - Registration, login, verification
2. **Organization & Department APIs** - CRUD operations
3. **Testing with Postman** - Verify all endpoints work
4. **Admin Assignment Flow** - Super admin → Org admin → Dept admin

---

## 💡 KEY LEARNINGS

You should now understand:

1. **Super Admin Creation**: Created programmatically, not through signup
2. **Admin Promotion**: Regular users are promoted to admin roles
3. **Relationship Testing**: How to verify Mongoose relationships
4. **Seeding Strategy**: Respecting relationship order when creating data
5. **Middleware Chaining**: How authentication and authorization work together
6. **Environment Configuration**: Separating config from code

---

**Great work completing Phase 2! 🎉**

You now have a fully seeded database with all relationships working correctly!