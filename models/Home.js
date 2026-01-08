import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image is required'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    maxlength: [100, 'Text cannot be more than 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  features: {
    type: [String],
    required: [true, 'At least one feature is required'],
    validate: {
      validator: function(features) {
        return features && features.length > 0;
      },
      message: 'At least one feature is required'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
homeSchema.index({ isActive: 1 });
homeSchema.index({ createdAt: -1 });

export default mongoose.model('Home', homeSchema);