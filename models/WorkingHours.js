import mongoose from 'mongoose';

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    trim: true
  },
  morningHours: {
    type: String,
    trim: true,
    default: ''
  },
  eveningHours: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('WorkingHours', workingHoursSchema);
