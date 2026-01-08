import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🧪 Testing MongoDB Connection...');
    console.log('📍 URI:', process.env.MONGO_URI ? 'Found' : 'Missing');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env file');
    }
    
    const isAtlas = process.env.MONGO_URI.includes('mongodb+srv');
    console.log('🌐 Type:', isAtlas ? 'Atlas Cloud' : 'Local');
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    };
    
    console.log('⏳ Connecting...');
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log('✅ Connection Successful!');
    console.log('📊 Database:', conn.connection.name);
    console.log('🌐 Host:', conn.connection.host);
    
    // Test a simple operation
    console.log('🧪 Testing database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection Test Failed:');
    console.error('🔍 Error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('💡 Solution: Try local MongoDB or check internet connection');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Solution: Check username/password in connection string');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Solution: Check network access settings in MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

testConnection();