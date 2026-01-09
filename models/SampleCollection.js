import mongoose from 'mongoose';

const sampleCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    maxlength: [300, 'Text cannot be more than 300 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  features: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Feature cannot be more than 100 characters']
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

// Index for better performance
sampleCollectionSchema.index({ title: 1 });

export default mongoose.model('SampleCollection', sampleCollectionSchema);