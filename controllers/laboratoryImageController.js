import LaboratoryImage from '../models/LaboratoryImage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all laboratory images
export const getAllLaboratoryImages = async (req, res) => {
  try {
    console.log('📸 GET /api/laboratoryImages - Fetching laboratory images...');
    const images = await LaboratoryImage.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${images.length} laboratory images`);
    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('❌ Error fetching laboratory images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching laboratory images',
      error: error.message
    });
  }
};

// Get single laboratory image
export const getLaboratoryImageById = async (req, res) => {
  try {
    const image = await LaboratoryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory image not found'
      });
    }
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching laboratory image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching laboratory image',
      error: error.message
    });
  }
};

// Create laboratory image
export const createLaboratoryImage = async (req, res) => {
  try {
    console.log('📸 POST /api/laboratoryImages - Creating laboratory image...');
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const image = new LaboratoryImage({
      image: `/uploads/laboratoryImages/${req.file.filename}`
    });

    await image.save();
    console.log('✅ Laboratory image created successfully');

    res.status(201).json({
      success: true,
      message: 'Laboratory image created successfully',
      data: image
    });
  } catch (error) {
    console.error('❌ Error creating laboratory image:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating laboratory image',
      error: error.message
    });
  }
};

// Update laboratory image
export const updateLaboratoryImage = async (req, res) => {
  try {
    const image = await LaboratoryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory image not found'
      });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', image.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      image.image = `/uploads/laboratoryImages/${req.file.filename}`;
    }

    await image.save();

    res.status(200).json({
      success: true,
      message: 'Laboratory image updated successfully',
      data: image
    });
  } catch (error) {
    console.error('Error updating laboratory image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating laboratory image',
      error: error.message
    });
  }
};

// Delete laboratory image
export const deleteLaboratoryImage = async (req, res) => {
  try {
    const image = await LaboratoryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory image not found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', image.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await LaboratoryImage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Laboratory image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting laboratory image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting laboratory image',
      error: error.message
    });
  }
};
