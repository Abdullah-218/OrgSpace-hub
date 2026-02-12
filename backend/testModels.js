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
    console.log(`Can post to random dept: ${user.canPostTo(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId())}`);

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