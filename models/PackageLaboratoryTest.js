import mongoose from 'mongoose';

const packageLaboratoryTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  features: {
    type: [String],
    required: [true, 'At least one feature is required'],
    validate: {
      validator: function(features) {
        return features && features.length > 0 && features.some(f => f.trim().length > 0);
      },
      message: 'At least one feature is required'
    }
  },
  price: {
    type: Number,
    min: [0, 'Price must be a positive number'],
    default: null
  },
  image: {
    type: String,
    trim: true,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
packageLaboratoryTestSchema.index({ isActive: 1 });

// Pre-save middleware to clean up features array
packageLaboratoryTestSchema.pre('save', function(next) {
  if (this.features) {
    this.features = this.features.filter(feature => feature.trim().length > 0);
  }
  next();
});

const PackageLaboratoryTest = mongoose.model('PackageLaboratoryTest', packageLaboratoryTestSchema);

export default PackageLaboratoryTest;