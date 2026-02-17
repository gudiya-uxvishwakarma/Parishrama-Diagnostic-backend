import mongoose from 'mongoose';

const homeSampleBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    required: true,
    trim: true
  },
  pdfReport: {
    type: String,
    default: null
  },
  pdfUploadDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('HomeSampleBooking', homeSampleBookingSchema);
