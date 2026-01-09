import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image is required'],
    trim: true
  },
  text: {
    type: String,
    
  },
  title: {
    type: String,
   
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