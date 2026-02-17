import mongoose from 'mongoose';

const laboratoryImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('LaboratoryImage', laboratoryImageSchema);
