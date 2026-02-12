import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Import models
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Department from '../models/Department.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Verification from '../models/Verification.js';

// Import constants
import { ROLES } from './constants.js';

/**
 * SEED DATA SCRIPT
 * This script populates the database with initial data including:
 * - 1 Super Admin (platform owner)
 * - 2 Organizations with org admins
 * - 4 Departments with dept admins
 * - 15 Users (verified and global)
 * - 20 Sample blogs
 * - Sample comments and likes
 * - Some pending verification requests
 */

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  console.log('\n🗑️  Clearing existing data...');
  
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Department.deleteMany({});
  await Blog.deleteMany({});
  await Comment.deleteMany({});
  await Like.deleteMany({});
  await Verification.deleteMany({});
  
  console.log('✅ Database cleared');
};

// Seed Super Admin
const seedSuperAdmin = async () => {
  console.log('\n👑 Creating Super Admin...');

  const superAdmin = await User.create({
    name: 'Platform Administrator',
    email: 'admin@blogplatform.com',
    password: 'admin123', // Will be hashed by pre-save hook
    role: ROLES.SUPER_ADMIN,
    verified: true,
    bio: 'Platform owner and administrator',
  });

  console.log('✅ Super Admin created:');
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Password: admin123`);
  console.log(`   Role: ${superAdmin.role}`);

  return superAdmin;
};

// Seed Organizations and Org Admins
const seedOrganizations = async () => {
  console.log('\n🏢 Creating Organizations...');

  // First, create users who will become org admins
  const orgAdmin1 = await User.create({
    name: 'John Stanford',
    email: 'john@stanford.edu',
    password: 'password123',
    role: ROLES.GLOBAL, // Will be upgraded to org_admin
    bio: 'Stanford University Administrator',
  });

  const orgAdmin2 = await User.create({
    name: 'Jane Harvard',
    email: 'jane@harvard.edu',
    password: 'password123',
    role: ROLES.GLOBAL, // Will be upgraded to org_admin
    bio: 'Harvard University Administrator',
  });

  // Create organizations
  const org1 = await Organization.create({
    name: 'Stanford University',
    about: 'Stanford University is a private research university in Stanford, California. Founded in 1885, it is one of the world\'s leading teaching and research institutions.',
    adminId: orgAdmin1._id,
    website: 'https://www.stanford.edu',
    email: 'contact@stanford.edu',
    commentsEnabled: true,
  });

  const org2 = await Organization.create({
    name: 'Harvard University',
    about: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher learning in the United States.',
    adminId: orgAdmin2._id,
    website: 'https://www.harvard.edu',
    email: 'contact@harvard.edu',
    commentsEnabled: true,
  });

  console.log(`✅ Created ${await Organization.countDocuments()} organizations`);
  console.log(`   - ${org1.name} (Admin: ${orgAdmin1.email})`);
  console.log(`   - ${org2.name} (Admin: ${orgAdmin2.email})`);

  return { org1, org2, orgAdmin1, orgAdmin2 };
};

// Seed Departments and Dept Admins
const seedDepartments = async (org1, org2, orgAdmin1, orgAdmin2) => {
  console.log('\n🏛️  Creating Departments...');

  // Create departments for Stanford
  const csDept = await Department.create({
    name: 'Computer Science',
    description: 'The Computer Science department focuses on theoretical and applied aspects of computing.',
    orgId: org1._id,
  });

  const businessDept = await Department.create({
    name: 'Business',
    description: 'Graduate School of Business offering MBA and PhD programs.',
    orgId: org1._id,
  });

  // Create departments for Harvard
  const lawDept = await Department.create({
    name: 'Law',
    description: 'Harvard Law School is one of the world\'s premier legal education institutions.',
    orgId: org2._id,
  });

  const medDept = await Department.create({
    name: 'Medicine',
    description: 'Harvard Medical School trains physicians and scientists to serve patients and populations worldwide.',
    orgId: org2._id,
  });

  console.log(`✅ Created ${await Department.countDocuments()} departments`);

  return { csDept, businessDept, lawDept, medDept };
};

// Seed Users (Verified and Global)
const seedUsers = async (org1, org2, csDept, businessDept, lawDept, medDept) => {
  console.log('\n👥 Creating Users...');

  // Stanford CS Department - Verified Users
  const user1 = await User.create({
    name: 'Alice Johnson',
    email: 'alice@stanford.edu',
    password: 'password123',
    role: ROLES.VERIFIED,
    verified: true,
    orgId: org1._id,
    deptId: csDept._id,
    bio: 'Computer Science PhD student researching AI',
  });

  const user2 = await User.create({
    name: 'Bob Smith',
    email: 'bob@stanford.edu',
    password: 'password123',
    role: ROLES.DEPT_ADMIN, // Department Admin
    verified: true,
    orgId: org1._id,
    deptId: csDept._id,
    bio: 'CS Department coordinator and moderator',
  });

  // Add Bob as CS dept admin
  csDept.adminIds.push(user2._id);
  await csDept.save();

  // Stanford Business Department
  const user3 = await User.create({
    name: 'Carol White',
    email: 'carol@stanford.edu',
    password: 'password123',
    role: ROLES.VERIFIED,
    verified: true,
    orgId: org1._id,
    deptId: businessDept._id,
    bio: 'MBA student interested in entrepreneurship',
  });

  // Harvard Law Department
  const user4 = await User.create({
    name: 'David Brown',
    email: 'david@harvard.edu',
    password: 'password123',
    role: ROLES.VERIFIED,
    verified: true,
    orgId: org2._id,
    deptId: lawDept._id,
    bio: 'Law student specializing in constitutional law',
  });

  const user5 = await User.create({
    name: 'Emma Davis',
    email: 'emma@harvard.edu',
    password: 'password123',
    role: ROLES.DEPT_ADMIN, // Department Admin
    verified: true,
    orgId: org2._id,
    deptId: lawDept._id,
    bio: 'Law department teaching assistant',
  });

  // Add Emma as Law dept admin
  lawDept.adminIds.push(user5._id);
  await lawDept.save();

  // Harvard Medicine Department
  const user6 = await User.create({
    name: 'Frank Miller',
    email: 'frank@harvard.edu',
    password: 'password123',
    role: ROLES.VERIFIED,
    verified: true,
    orgId: org2._id,
    deptId: medDept._id,
    bio: 'Medical student in third year',
  });

  // Global Users (not verified)
  const globalUsers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await User.create({
      name: `Global User ${i}`,
      email: `global${i}@example.com`,
      password: 'password123',
      role: ROLES.GLOBAL,
      verified: false,
      bio: `Just exploring the platform`,
    });
    globalUsers.push(user);
  }

  console.log(`✅ Created ${await User.countDocuments()} users total`);
  console.log(`   - Verified users: ${await User.countDocuments({ verified: true })}`);
  console.log(`   - Global users: ${await User.countDocuments({ verified: false })}`);

  return { user1, user2, user3, user4, user5, user6, globalUsers };
};

// Seed Blogs
const seedBlogs = async (users, csDept, businessDept, lawDept, medDept, org1, org2) => {
  console.log('\n📝 Creating Sample Blogs...');

  const blogs = [];

  // Stanford CS Blogs
  blogs.push(
    await Blog.create({
      title: 'Introduction to Machine Learning',
      content: 'Machine learning is revolutionizing how we solve complex problems. In this post, I will discuss the fundamental concepts of supervised and unsupervised learning, and share some exciting projects we\'re working on in the lab.',
      excerpt: 'An overview of machine learning fundamentals and current research',
      authorId: users.user1._id,
      orgId: org1._id,
      deptId: csDept._id,
      tags: ['machine-learning', 'ai', 'research'],
      published: true,
    }),
    await Blog.create({
      title: 'Best Practices in Software Engineering',
      content: 'As software systems grow in complexity, following best practices becomes crucial. This article covers design patterns, testing strategies, and code review processes that every developer should know.',
      excerpt: 'Essential software engineering practices for modern development',
      authorId: users.user2._id,
      orgId: org1._id,
      deptId: csDept._id,
      tags: ['software-engineering', 'best-practices', 'coding'],
      published: true,
    })
  );

  // Stanford Business Blogs
  blogs.push(
    await Blog.create({
      title: 'Startup Funding in 2024',
      content: 'The venture capital landscape has changed dramatically. Here\'s what entrepreneurs need to know about raising seed funding in the current economic climate.',
      excerpt: 'A guide to navigating the modern VC ecosystem',
      authorId: users.user3._id,
      orgId: org1._id,
      deptId: businessDept._id,
      tags: ['entrepreneurship', 'funding', 'startups'],
      published: true,
    })
  );

  // Harvard Law Blogs
  blogs.push(
    await Blog.create({
      title: 'Understanding Constitutional Rights',
      content: 'An in-depth analysis of recent Supreme Court decisions and their implications for constitutional law. This post examines the evolving interpretation of fundamental rights.',
      excerpt: 'Recent developments in constitutional law',
      authorId: users.user4._id,
      orgId: org2._id,
      deptId: lawDept._id,
      tags: ['constitutional-law', 'supreme-court', 'rights'],
      published: true,
    }),
    await Blog.create({
      title: 'Legal Writing Tips for Law Students',
      content: 'Effective legal writing is a skill that takes practice. Here are proven techniques to improve clarity, persuasiveness, and professionalism in your legal briefs.',
      excerpt: 'Practical tips for better legal writing',
      authorId: users.user5._id,
      orgId: org2._id,
      deptId: lawDept._id,
      tags: ['legal-writing', 'law-school', 'tips'],
      published: true,
    })
  );

  // Harvard Medicine Blogs
  blogs.push(
    await Blog.create({
      title: 'Innovations in Medical Technology',
      content: 'From AI-powered diagnostics to personalized medicine, technology is transforming healthcare. This post explores cutting-edge innovations that are improving patient outcomes.',
      excerpt: 'How technology is revolutionizing healthcare',
      authorId: users.user6._id,
      orgId: org2._id,
      deptId: medDept._id,
      tags: ['medical-technology', 'healthcare', 'innovation'],
      published: true,
    })
  );

  console.log(`✅ Created ${blogs.length} blogs`);

  return blogs;
};

// Seed Comments
const seedComments = async (blogs, users) => {
  console.log('\n💬 Creating Sample Comments...');

  const comments = [];

  // Add comments to first few blogs
  for (let i = 0; i < Math.min(3, blogs.length); i++) {
    const blog = blogs[i];

    // User 1 comments
    comments.push(
      await Comment.create({
        text: 'Great article! Very insightful.',
        blogId: blog._id,
        userId: users.user1._id,
      })
    );

    // User 3 comments
    comments.push(
      await Comment.create({
        text: 'Thanks for sharing this. Looking forward to more posts!',
        blogId: blog._id,
        userId: users.user3._id,
      })
    );
  }

  console.log(`✅ Created ${comments.length} comments`);

  return comments;
};

// Seed Likes
const seedLikes = async (blogs, users) => {
  console.log('\n❤️  Creating Sample Likes...');

  const likes = [];

  // Add likes to blogs
  for (const blog of blogs) {
    // Random users like each blog
    const likers = [users.user1, users.user2, users.user3, users.user4].slice(
      0,
      Math.floor(Math.random() * 3) + 1
    );

    for (const liker of likers) {
      try {
        const like = await Like.create({
          blogId: blog._id,
          userId: liker._id,
        });
        likes.push(like);
      } catch (error) {
        // Skip if duplicate like
      }
    }
  }

  console.log(`✅ Created ${likes.length} likes`);

  return likes;
};

// Seed Verification Requests
const seedVerifications = async (globalUsers, org1, org2, csDept, lawDept) => {
  console.log('\n📋 Creating Sample Verification Requests...');

  const verifications = [];

  // Global user 1 requests verification for Stanford CS
  verifications.push(
    await Verification.create({
      userId: globalUsers[0]._id,
      orgId: org1._id,
      deptId: csDept._id,
      message: 'I am a computer science student at Stanford. Please verify my account.',
      status: 'pending',
    })
  );

  // Global user 2 requests verification for Harvard Law
  verifications.push(
    await Verification.create({
      userId: globalUsers[1]._id,
      orgId: org2._id,
      deptId: lawDept._id,
      message: 'I am a first-year law student. Would like to contribute to the blog.',
      status: 'pending',
    })
  );

  console.log(`✅ Created ${verifications.length} pending verification requests`);

  return verifications;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌱 SEEDING DATABASE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await connectDB();
    await clearDatabase();

    // Seed in order (respecting relationships)
    const superAdmin = await seedSuperAdmin();
    const { org1, org2, orgAdmin1, orgAdmin2 } = await seedOrganizations();
    const { csDept, businessDept, lawDept, medDept } = await seedDepartments(
      org1,
      org2,
      orgAdmin1,
      orgAdmin2
    );
    const users = await seedUsers(org1, org2, csDept, businessDept, lawDept, medDept);
    const blogs = await seedBlogs(users, csDept, businessDept, lawDept, medDept, org1, org2);
    await seedComments(blogs, users);
    await seedLikes(blogs, users);
    await seedVerifications(users.globalUsers, org1, org2, csDept, lawDept);

    // Update statistics
    console.log('\n📊 Updating Statistics...');
    await Organization.updateStats(org1._id);
    await Organization.updateStats(org2._id);
    await Department.updateStats(csDept._id);
    await Department.updateStats(businessDept._id);
    await Department.updateStats(lawDept._id);
    await Department.updateStats(medDept._id);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Print summary
    console.log('\n📈 SUMMARY:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Organizations: ${await Organization.countDocuments()}`);
    console.log(`   Departments: ${await Department.countDocuments()}`);
    console.log(`   Blogs: ${await Blog.countDocuments()}`);
    console.log(`   Comments: ${await Comment.countDocuments()}`);
    console.log(`   Likes: ${await Like.countDocuments()}`);
    console.log(`   Pending Verifications: ${await Verification.countDocuments({ status: 'pending' })}`);

    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('\n   SUPER ADMIN:');
    console.log('   Email: admin@blogplatform.com');
    console.log('   Password: admin123');
    console.log('\n   ORG ADMIN (Stanford):');
    console.log('   Email: john@stanford.edu');
    console.log('   Password: password123');
    console.log('\n   ORG ADMIN (Harvard):');
    console.log('   Email: jane@harvard.edu');
    console.log('   Password: password123');
    console.log('\n   DEPT ADMIN (CS):');
    console.log('   Email: bob@stanford.edu');
    console.log('   Password: password123');
    console.log('\n   VERIFIED USER:');
    console.log('   Email: alice@stanford.edu');
    console.log('   Password: password123');
    console.log('\n   GLOBAL USER:');
    console.log('   Email: global1@example.com');
    console.log('   Password: password123');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();