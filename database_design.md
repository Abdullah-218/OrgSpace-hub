# DATABASE DESIGN & RELATIONSHIPS

## Complete Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM HIERARCHY                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  SUPER ADMIN    │
                              │    (User)       │
                              └────────┬────────┘
                                       │
                                       │ creates & manages
                                       ⬇
                              ┌─────────────────┐
                              │  ORGANIZATION   │
                              │                 │
                              │ • _id           │
                              │ • name          │
                              │ • about         │
                              │ • adminId   ────┼───────┐
                              │ • commentsOn    │       │ assigned by
                              └────────┬────────┘       │ super admin
                                       │                │
                                       │ contains       │
                                       ⬇                │
                              ┌─────────────────┐       │
                              │   DEPARTMENT    │       │
                              │                 │       │
                              │ • _id           │       │
                              │ • name          │       │
                              │ • orgId     ────┼───────┘
                              │ • adminIds[]────┼───────┐
                              └────────┬────────┘       │ assigned by
                                       │                │ org admin
                                       │ contains       │
                                       ⬇                │
                              ┌─────────────────┐       │
                              │      BLOG       │       │
                              │                 │       │
                              │ • _id           │       │
                              │ • title         │       │
                              │ • content       │       │
                              │ • authorId  ────┼───────┼──────┐
                              │ • orgId     ────┼───────┘      │
                              │ • deptId    ────┼──────────────┤
                              │ • likesCount    │              │
                              │ • commentsCount │              │
                              └────────┬────────┘              │
                                       │                       │
                 ┌─────────────────────┼───────────────┐       │
                 │                     │               │       │
                 ⬇                     ⬇               ⬇       │
        ┌─────────────────┐   ┌─────────────────┐  ┌─────────────────┐
        │    COMMENT      │   │      LIKE       │  │      USER       │
        │                 │   │                 │  │                 │
        │ • blogId        │   │ • blogId        │  │ • _id           │
        │ • userId    ────┼───┼─• userId    ────┼──┤ • name          │
        │ • text          │   │                 │  │ • email         │
        └─────────────────┘   └─────────────────┘  │ • password      │
                                                    │ • role          │
                                                    │ • orgId         │
                                                    │ • deptId        │
                                                    │ • verified      │
                                                    └────────┬────────┘
                                                             │
                                                             │ requests
                                                             ⬇
                                                    ┌─────────────────┐
                                                    │  VERIFICATION   │
                                                    │                 │
                                                    │ • userId        │
                                                    │ • orgId         │
                                                    │ • deptId        │
                                                    │ • status        │
                                                    │ • reviewedBy    │
                                                    └─────────────────┘
```

---

## Detailed Relationship Explanations

### 1. User ↔ Organization (Many-to-One)

**Relationship Type**: Many users belong to one organization

**How it Works**:
```javascript
// User Model
{
  orgId: ObjectId  // References Organization._id
}

// To get user's organization:
User.findById(userId).populate('orgId')
```

**Business Rules**:
- User can belong to ONLY ONE organization at a time
- User must be verified to have an orgId
- When user is assigned to org, `orgId` field is populated
- Unverified users have `orgId: null`

---

### 2. User ↔ Department (Many-to-One)

**Relationship Type**: Many users belong to one department

**How it Works**:
```javascript
// User Model
{
  deptId: ObjectId  // References Department._id
}

// To get user's department:
User.findById(userId).populate('deptId')
```

**Business Rules**:
- User can belong to ONLY ONE department at a time
- User must be verified to have a deptId
- User's department MUST belong to the same organization as user's orgId
- Department assignment happens during verification approval

---

### 3. Organization ↔ User (One-to-One for Admin)

**Relationship Type**: One organization has one admin user

**How it Works**:
```javascript
// Organization Model
{
  adminId: ObjectId  // References User._id
}

// To get organization's admin:
Organization.findById(orgId).populate('adminId')
```

**Business Rules**:
- Only ONE admin per organization
- Admin must be a verified user
- When assigned as org admin:
  - User's role changes to `'org_admin'`
  - User's `orgId` is set to this organization
  - User automatically becomes verified

---

### 4. Organization ↔ Department (One-to-Many)

**Relationship Type**: One organization has many departments

**How it Works**:
```javascript
// Department Model
{
  orgId: ObjectId  // References Organization._id
}

// To get organization's departments:
Department.find({ orgId: organizationId })

// Or using virtual populate:
Organization.findById(orgId).populate('departments')
```

**Business Rules**:
- Department MUST belong to exactly one organization
- Cannot change department's organization after creation
- Department names must be unique WITHIN an organization
  - Example: "Computer Science" can exist in multiple orgs but not twice in the same org
- When organization is deleted, all its departments should be deleted (cascade)

---

### 5. Department ↔ User (One-to-Many for Admins)

**Relationship Type**: One department has many admin users

**How it Works**:
```javascript
// Department Model
{
  adminIds: [ObjectId]  // Array of User._id references
}

// To get department's admins:
Department.findById(deptId).populate('adminIds')

// To check if user is dept admin:
department.adminIds.includes(userId)
```

**Business Rules**:
- Department can have MULTIPLE admins (0 or more)
- All admins must be verified users of that department
- When user is made dept admin:
  - User's role changes to `'dept_admin'`
  - User must already be a member (have deptId set)
- User can be dept admin of only ONE department at a time

---

### 6. Blog ↔ User (Many-to-One for Author)

**Relationship Type**: Many blogs belong to one author

**How it Works**:
```javascript
// Blog Model
{
  authorId: ObjectId  // References User._id
}

// To get blog's author:
Blog.findById(blogId).populate('authorId')

// To get user's blogs:
Blog.find({ authorId: userId })
```

**Business Rules**:
- Every blog MUST have an author
- Author must be a verified user
- Author cannot be changed after blog creation
- Author can only post to their own org/dept

---

### 7. Blog ↔ Organization (Many-to-One)

**Relationship Type**: Many blogs belong to one organization

**How it Works**:
```javascript
// Blog Model
{
  orgId: ObjectId  // References Organization._id
}

// To get organization's blogs:
Blog.find({ orgId: organizationId })
```

**Business Rules**:
- Every blog MUST belong to an organization
- Blog's orgId must match author's orgId
- Cannot change blog's organization after creation
- Used for filtering blogs by organization

---

### 8. Blog ↔ Department (Many-to-One)

**Relationship Type**: Many blogs belong to one department

**How it Works**:
```javascript
// Blog Model
{
  deptId: ObjectId  // References Department._id
}

// To get department's blogs:
Blog.find({ deptId: departmentId })
```

**Business Rules**:
- Every blog MUST belong to a department
- Blog's deptId must match author's deptId
- Blog's department must belong to blog's organization
- Cannot change blog's department after creation

---

### 9. Blog ↔ Comment (One-to-Many)

**Relationship Type**: One blog has many comments

**How it Works**:
```javascript
// Comment Model
{
  blogId: ObjectId  // References Blog._id
}

// To get blog's comments:
Comment.find({ blogId: blogId })

// Or using virtual populate:
Blog.findById(blogId).populate('comments')
```

**Business Rules**:
- Comment must belong to exactly one blog
- When blog is deleted, all its comments are deleted (cascade)
- Comment count is cached in `Blog.commentsCount` for performance
- Comments can only be added if organization has `commentsEnabled: true`

---

### 10. Comment ↔ User (Many-to-One)

**Relationship Type**: Many comments belong to one user

**How it Works**:
```javascript
// Comment Model
{
  userId: ObjectId  // References User._id
}

// To get comment's author:
Comment.findById(commentId).populate('userId')

// To get user's comments:
Comment.find({ userId: userId })
```

**Business Rules**:
- Comment must have an author
- Author must be a verified user
- Author can edit/delete their own comments
- Dept/org admins can moderate comments in their scope

---

### 11. Blog ↔ Like (One-to-Many)

**Relationship Type**: One blog has many likes

**How it Works**:
```javascript
// Like Model
{
  blogId: ObjectId  // References Blog._id
}

// To get blog's likes:
Like.find({ blogId: blogId })

// To count likes:
Like.countDocuments({ blogId: blogId })
```

**Business Rules**:
- Like must belong to exactly one blog
- When blog is deleted, all its likes are deleted (cascade)
- Like count is cached in `Blog.likesCount` for performance
- Same user cannot like same blog twice (enforced by compound unique index)

---

### 12. Like ↔ User (Many-to-One)

**Relationship Type**: Many likes belong to one user

**How it Works**:
```javascript
// Like Model
{
  userId: ObjectId  // References User._id
}

// To get user's likes:
Like.find({ userId: userId }).populate('blogId')

// To check if user liked a blog:
Like.findOne({ blogId: blogId, userId: userId })
```

**Business Rules**:
- Like must have a user
- User can be ANY authenticated user (not just verified)
- User can like multiple blogs
- User can only like a blog ONCE
- Compound unique index on (blogId, userId) enforces this

---

### 13. User ↔ Verification (One-to-Many)

**Relationship Type**: One user has many verification requests

**How it Works**:
```javascript
// Verification Model
{
  userId: ObjectId  // References User._id
}

// To get user's verification history:
Verification.find({ userId: userId })
```

**Business Rules**:
- User can request verification for multiple org/dept combinations
- User can only have ONE pending request per org/dept at a time
- User can have multiple rejected requests (can re-apply)
- When verification is approved:
  - User's `verified` becomes `true`
  - User's `role` changes to `'verified'`
  - User's `orgId` and `deptId` are set

---

### 14. Verification ↔ Organization (Many-to-One)

**Relationship Type**: Many verifications belong to one organization

**How it Works**:
```javascript
// Verification Model
{
  orgId: ObjectId  // References Organization._id
}

// To get org's pending verifications:
Verification.find({ orgId: orgId, status: 'pending' })
```

**Business Rules**:
- Verification must specify target organization
- Organization admin can approve verifications for their org
- Used to track which organization user wants to join

---

### 15. Verification ↔ Department (Many-to-One)

**Relationship Type**: Many verifications belong to one department

**How it Works**:
```javascript
// Verification Model
{
  deptId: ObjectId  // References Department._id
}

// To get dept's pending verifications:
Verification.find({ deptId: deptId, status: 'pending' })
```

**Business Rules**:
- Verification must specify target department
- Department must belong to the specified organization
- Department admin can approve verifications for their dept
- Used to track which department user wants to join

---

### 16. Verification ↔ User (Many-to-One for Reviewer)

**Relationship Type**: Many verifications are reviewed by one user

**How it Works**:
```javascript
// Verification Model
{
  reviewedBy: ObjectId  // References User._id (dept/org admin)
}

// To get verifications reviewed by an admin:
Verification.find({ reviewedBy: adminId })
```

**Business Rules**:
- Only dept admins, org admins, or super admins can review
- Reviewer must have permission for that org/dept
- `reviewedBy` is null until verification is reviewed
- Tracks accountability (who approved/rejected)

---

## Key Database Constraints

### Unique Constraints

1. **User.email**: Must be unique across all users
2. **Organization.name**: Must be unique across all organizations
3. **Organization.adminId**: One admin per organization (unique index)
4. **Department (name + orgId)**: Department name must be unique within organization
5. **Like (blogId + userId)**: User can like a blog only once
6. **Verification (userId + orgId + deptId + status='pending')**: One pending request per user per org/dept

### Referential Integrity

All ObjectId references are validated before save:
- User must exist before being referenced
- Organization must exist before being referenced
- Department must exist and belong to correct org
- Blog must reference valid author, org, dept

### Cascading Deletes

When parent is deleted, children should be deleted:
- Delete Organization → Delete all Departments
- Delete Department → Delete all Blogs in that dept
- Delete Blog → Delete all Comments and Likes
- Delete User → Handle carefully (may want to preserve content or reassign)

---

## Indexes for Performance

### User Collection
```javascript
email: 1           // Unique, for login
orgId: 1           // Get org members
deptId: 1          // Get dept members
role: 1            // Filter by role
verified: 1        // Filter verified users
```

### Organization Collection
```javascript
name: 1            // Unique, for search
adminId: 1         // Get admin's org
active: 1          // Filter active orgs
createdAt: -1      // Sort by newest
```

### Department Collection
```javascript
{ name: 1, orgId: 1 }  // Compound unique
orgId: 1               // Get org's depts
adminIds: 1            // Get admin's depts
active: 1              // Filter active depts
```

### Blog Collection
```javascript
authorId: 1                 // Get author's blogs
orgId: 1                    // Filter by org
deptId: 1                   // Filter by dept
createdAt: -1               // Sort by date
likesCount: -1              // Sort by popularity
{ orgId: 1, createdAt: -1 } // Compound for org feed
{ deptId: 1, createdAt: -1 }// Compound for dept feed
{ title: 'text', content: 'text' } // Text search
```

### Comment Collection
```javascript
{ blogId: 1, createdAt: 1 } // Get blog comments chronologically
userId: 1                    // Get user's comments
```

### Like Collection
```javascript
{ blogId: 1, userId: 1 }    // Compound unique (one like per user per blog)
blogId: 1                    // Count blog likes
userId: 1                    // Get user's liked blogs
```

### Verification Collection
```javascript
{ userId: 1, orgId: 1, deptId: 1, status: 1 } // Prevent duplicate pending
{ deptId: 1, status: 1 }     // Dept admin queries
{ orgId: 1, status: 1 }      // Org admin queries
userId: 1                     // User's history
```

---

## Data Flow Examples

### Example 1: User Requests Verification

```
1. User submits form: { orgId, deptId, message }
2. POST /api/verifications
3. Create Verification document:
   {
     userId: currentUser._id,
     orgId: selectedOrg._id,
     deptId: selectedDept._id,
     message: "I'm a student here",
     status: 'pending'
   }
4. Verification appears in dept admin's dashboard
```

### Example 2: Dept Admin Approves Verification

```
1. Dept admin clicks "Approve"
2. PATCH /api/admin/dept/verifications/:id
3. Backend checks:
   - Is reviewer a dept admin?
   - Is verification for their department?
4. If valid:
   a. Update Verification: status = 'approved', reviewedBy = adminId
   b. Update User: verified = true, role = 'verified', orgId, deptId
   c. Update Department stats: membersCount++
   d. Update Organization stats: membersCount++
5. User can now post blogs!
```

### Example 3: Verified User Posts Blog

```
1. User fills blog form and submits
2. POST /api/blogs
3. Backend extracts from JWT: userId, orgId, deptId
4. Validation:
   - Is user verified?
   - Does user's orgId match request orgId?
   - Does user's deptId match request deptId?
5. If valid, create Blog:
   {
     title, content,
     authorId: user._id,
     orgId: user.orgId,
     deptId: user.deptId
   }
6. Update Department stats: blogsCount++
7. Update Organization stats: blogsCount++
8. Return blog to frontend
```

### Example 4: Global User Likes Blog

```
1. User clicks like button
2. POST /api/blogs/:id/like
3. Backend checks:
   - Is user authenticated? (any user, not just verified)
   - Does blog exist?
4. Try to create Like:
   { blogId, userId }
5. If already liked (unique constraint fails):
   - Delete the like (unlike)
   - Decrement Blog.likesCount
6. If not liked:
   - Create new like
   - Increment Blog.likesCount
7. Return new like status to frontend
```

### Example 5: Org Admin Disables Comments

```
1. Org admin toggles "Comments Enabled" switch
2. PATCH /api/admin/org/settings
3. Backend checks: Is user org admin of this org?
4. Update Organization: commentsEnabled = false
5. Effect: No one can comment on ANY blog in this organization
6. When user tries to comment:
   - Backend checks org.commentsEnabled
   - If false, reject with error
```

---

## Statistics Caching Strategy

For performance, we cache counts instead of counting on every query:

### Blog Counts (in Blog model)
- `likesCount`: Updated when Like is created/deleted
- `commentsCount`: Updated when Comment is created/deleted
- `viewsCount`: Incremented when blog is viewed

### Department Counts (in Department model)
- `stats.blogsCount`: Recalculated when blog is created/deleted
- `stats.membersCount`: Recalculated when user is verified/removed

### Organization Counts (in Organization model)
- `stats.departmentsCount`: Recalculated when department is created/deleted
- `stats.blogsCount`: Recalculated when blog is created/deleted
- `stats.membersCount`: Recalculated when user is verified/removed

**Trade-off**: 
- ✅ Fast queries (no counting needed)
- ❌ Risk of count mismatch if operation fails
- ✅ Solution: Use atomic operations (`$inc`) and handle errors

---

## Virtual Populates

Virtual fields that don't exist in database but are populated on query:

```javascript
// Organization virtual
virtual('departments')  // Get all departments of this org

// Department virtual
virtual('blogs')        // Get all blogs in this dept
virtual('organization') // Get dept's organization details

// Blog virtual
virtual('author')       // Get blog's author details
virtual('department')   // Get blog's department details
virtual('organization') // Get blog's org details
virtual('comments')     // Get all comments on this blog
```

Usage:
```javascript
// Without virtual
const org = await Organization.findById(orgId);
const depts = await Department.find({ orgId: org._id });

// With virtual
const org = await Organization.findById(orgId).populate('departments');
// org.departments is now populated!
```

---

## Summary

This database design achieves:

1. **Hierarchical Organization**: Platform → Org → Dept → Blog
2. **Role-Based Permissions**: Different access levels based on role
3. **Scalability**: Indexed queries, cached counts
4. **Data Integrity**: Validation at every level
5. **Audit Trail**: Track who approved what, when
6. **Performance**: Smart caching, efficient queries

The relationships are normalized to avoid duplication while maintaining query performance through strategic denormalization (cached counts).