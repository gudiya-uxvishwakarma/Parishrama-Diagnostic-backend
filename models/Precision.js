import mongoose from 'mongoose';

const precisionSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    maxlength: [300, 'Subtitle cannot be more than 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
precisionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
precisionSchema.index({ isActive: 1 });
precisionSchema.index({ createdAt: -1 });

export default mongoose.model('Precision', precisionSchema);