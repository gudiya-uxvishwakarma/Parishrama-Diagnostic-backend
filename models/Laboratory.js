import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    maxlength: [500, 'Text cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot be more than 100 characters']
  }],
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
laboratorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
laboratorySchema.index({ title: 'text' });

export default mongoose.model('Laboratory', laboratorySchema);