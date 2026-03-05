import mongoose from 'mongoose';

const homeSampleCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  packageDetails: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  strict: false
});

export default mongoose.model('HomeSampleCollection', homeSampleCollectionSchema);
