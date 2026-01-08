import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dropOldIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;

    // Clean up appointments collection
    console.log('\n=== Cleaning up appointments collection ===');
    const appointmentsCollection = db.collection('appointments');

    // Get all indexes for appointments
    const appointmentIndexes = await appointmentsCollection.indexes();
    console.log('Current appointment indexes:', appointmentIndexes.map(idx => idx.name));

    // Drop the confirmationNumber index if it exists
    try {
      await appointmentsCollection.dropIndex('confirmationNumber_1');
      console.log('Successfully dropped confirmationNumber_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('confirmationNumber_1 index does not exist');
      } else {
        console.error('Error dropping confirmationNumber_1 index:', error.message);
      }
    }

    // Drop the status index if it exists
    try {
      await appointmentsCollection.dropIndex('status_1');
      console.log('Successfully dropped status_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('status_1 index does not exist');
      } else {
        console.error('Error dropping status_1 index:', error.message);
      }
    }

    // Clean up doctors collection
    console.log('\n=== Cleaning up doctors collection ===');
    const doctorsCollection = db.collection('doctors');

    // Get all indexes for doctors
    const doctorIndexes = await doctorsCollection.indexes();
    console.log('Current doctor indexes:', doctorIndexes.map(idx => idx.name));

    // Drop the email index if it exists (since email field is not in current model)
    try {
      await doctorsCollection.dropIndex('email_1');
      console.log('Successfully dropped email_1 index from doctors collection');
    } catch (error) {
      if (error.code === 27) {
        console.log('email_1 index does not exist in doctors collection');
      } else {
        console.error('Error dropping email_1 index from doctors collection:', error.message);
      }
    }

    // Remove any documents with null email fields that might be causing issues
    try {
      const result = await doctorsCollection.deleteMany({ email: null });
      console.log(`Removed ${result.deletedCount} doctor documents with null email`);
    } catch (error) {
      console.error('Error removing null email documents:', error.message);
    }

    // Show remaining indexes
    console.log('\n=== Final Index Status ===');
    const remainingAppointmentIndexes = await appointmentsCollection.indexes();
    console.log('Remaining appointment indexes:', remainingAppointmentIndexes.map(idx => idx.name));
    
    const remainingDoctorIndexes = await doctorsCollection.indexes();
    console.log('Remaining doctor indexes:', remainingDoctorIndexes.map(idx => idx.name));

    console.log('\nIndex cleanup completed successfully');
    
  } catch (error) {
    console.error('Error during index cleanup:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

dropOldIndexes();