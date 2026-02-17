import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  discount: {
    type: String,
    required: true,
    trim: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Offer', offerSchema);
