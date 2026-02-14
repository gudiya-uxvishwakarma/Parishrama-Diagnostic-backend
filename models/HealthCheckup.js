import mongoose from 'mongoose';

const healthCheckupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  packageDetailsHeading: {
    type: String,
    trim: true,
    maxlength: [100, 'Package details heading cannot be more than 100 characters'],
    default: 'Package Details'
  },
  packageDetails: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Package detail cannot be more than 100 characters']
  }]
}, {
  timestamps: true
});

// Index for better performance
healthCheckupSchema.index({ title: 1 });

export default mongoose.model('HealthCheckup', healthCheckupSchema);