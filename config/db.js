import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const isAtlas = process.env.MONGO_URI.includes('mongodb+srv');

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: isAtlas ? 10000 : 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
    };

    if (isAtlas) {
      options.ssl = true;
      options.authSource = 'admin';
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(` MongoDB Connected Successfully`);
    console.log(` Database: ${conn.connection.name}`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(' MongoDB Connection Error:', error.message);
  }
};

export default connectDB;