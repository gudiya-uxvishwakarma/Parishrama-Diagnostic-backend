import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  tests: [{
    name: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true,
      maxlength: [200, 'Test name cannot be more than 200 characters']
    },
    price: {
      type: Number,
      required: [true, 'Test price is required'],
      min: [0, 'Price cannot be negative']
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
laboratorySchema.index({ title: 'text' });

export default mongoose.model('Laboratory', laboratorySchema);