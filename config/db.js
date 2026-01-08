import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    const isAtlas = process.env.MONGO_URI.includes('mongodb+srv');
    console.log('📍 MongoDB URI:', isAtlas ? 'Atlas Cloud Database' : 'Local Database');
    
    // Connection options based on database type
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: isAtlas ? 10000 : 5000, // Longer timeout for Atlas
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
    };
    
    // Add Atlas-specific options
    if (isAtlas) {
      options.ssl = true;
      options.authSource = 'admin';
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    if (conn.connection.port) {
      console.log(`🔌 Port: ${conn.connection.port}`);
    }
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('🔍 Error Details:', error.message);
    
    // More specific error messages
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('🚨 Authentication Failed - Check your username/password in MONGO_URI');
      console.error('💡 Solutions:');
      console.error('   1. Verify username/password in MongoDB Atlas Dashboard');
      console.error('   2. Check if user has proper database permissions (readWrite)');
      console.error('   3. Try creating a new database user with simple password');
      console.error('   4. Ensure password doesn\'t contain special characters');
      
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('🚨 DNS/Network Error - Cannot resolve MongoDB Atlas hostname');
      console.error('💡 Solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Try using Google DNS (8.8.8.8, 8.8.4.4)');
      console.error('   3. Disable VPN if using one');
      console.error('   4. Try connecting from a different network');
      console.error('   5. Use local MongoDB for development');
      
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.error('🚨 Connection Refused/Timeout');
      console.error('💡 Solutions:');
      console.error('   1. Check MongoDB Atlas Network Access (whitelist your IP)');
      console.error('   2. Verify cluster is running and not paused');
      console.error('   3. Try local MongoDB for development');
      
    } else if (error.message.includes('MONGO_URI is not defined')) {
      console.error('🚨 Environment Variable Missing - MONGO_URI not found in .env file');
    }
    
    console.error('');
    console.error('💡 Quick Fix Options:');
    console.error('   1. Try local MongoDB: MONGO_URI=mongodb://127.0.0.1:27017/Parishrama_Diagnostic_Laboratory');
    console.error('   2. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.error('   3. Check MongoDB Atlas Network Access settings');
    console.error('   4. Verify Atlas cluster is not paused');
    
    // Don't exit the process, let the server run without database for now
    console.error('');
    console.error('⚠️  Server will continue running without database connection');
    console.error('🔧 Fix the database connection and restart the server');
    console.error('📖 See setup-mongodb.md for detailed setup instructions');
  }
};

export default connectDB;