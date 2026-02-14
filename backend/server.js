import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Serve static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// ==================== ROUTES ====================

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', commentRoutes); // Includes /api/blogs/:blogId/comments and /api/comments/:id
app.use('/api', likeRoutes); // Includes /api/blogs/:blogId/like, etc.
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Blog Platform API - Normal base slash',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      organizations: '/api/organizations',
      departments: '/api/departments',
      blogs: '/api/blogs',
      comments: '/api/comments',
      likes: '/api/likes',
      admin: '/api/admin',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Checking API health',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API route slash
app.get('/api', (req,res) => {
  res.json({
    message: 'Blog Platform API - Base API route',
    status: 'running',
    version: '1.0.0',
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📋 Available Routes:');
  console.log(`   Auth:          http://localhost:${PORT}/api/auth`);
  console.log(`   Users:         http://localhost:${PORT}/api/users`);
  console.log(`   Organizations: http://localhost:${PORT}/api/organizations`);
  console.log(`   Departments:   http://localhost:${PORT}/api/departments`);
  console.log(`   Blogs:         http://localhost:${PORT}/api/blogs`);
  console.log(`   Admin:         http://localhost:${PORT}/api/admin`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});