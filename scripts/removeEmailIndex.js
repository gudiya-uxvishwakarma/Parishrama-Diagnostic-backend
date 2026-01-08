import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const removeEmailIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the doctors collection
    const db = mongoose.connection.db;
    const collection = db.collection('doctors');

    // Check existing indexes
    const indexes = await collection.indexes();
    console.log('Existing indexes:', indexes);

    // Remove the email index if it exists
    try {
      await collection.dropIndex('email_1');
      console.log('Successfully removed email_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index email_1 does not exist');
      } else {
        console.error('Error removing index:', error);
      }
    }

    // Check indexes after removal
    const indexesAfter = await collection.indexes();
    console.log('Indexes after removal:', indexesAfter);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

removeEmailIndex();