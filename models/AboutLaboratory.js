import mongoose from 'mongoose';

const aboutLaboratorySchema = new mongoose.Schema({
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
  photo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('AboutLaboratory', aboutLaboratorySchema);
