import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Handles connection errors and logs connection status
 */
const connectDB = async () => {
  try {
    // Connection options for better stability
    const options = {
      // useNewUrlParser: true,      // Not needed in Mongoose 6+
      // useUnifiedTopology: true,    // Not needed in Mongoose 6+
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ MongoDB Connected Successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🖥️  Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('\n✅ MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ MongoDB Connection Error');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error Message:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Common error messages and solutions
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solution: Make sure MongoDB is running');
      console.error('   Run: docker-compose up -d');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Solution: Check your MONGO_URI credentials in .env');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('💡 Solution: Check your MongoDB host address');
    }

    process.exit(1); // Exit with failure
  }
};

export default connectDB;