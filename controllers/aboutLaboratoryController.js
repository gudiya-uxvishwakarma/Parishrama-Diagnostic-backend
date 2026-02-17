import AboutLaboratory from '../models/AboutLaboratory.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get about laboratory data
export const getAboutLaboratory = async (req, res) => {
  try {
    const about = await AboutLaboratory.findOne().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching about laboratory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about laboratory',
      error: error.message
    });
  }
};

// Create or update about laboratory
export const createOrUpdateAboutLaboratory = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    let photo = '';
    if (req.file) {
      photo = `/uploads/aboutLaboratory/${req.file.filename}`;
    }

    // Check if about laboratory already exists
    const existingAbout = await AboutLaboratory.findOne();

    if (existingAbout) {
      // Update existing
      if (photo) {
        // Delete old photo if new one is uploaded
        if (existingAbout.photo) {
          const oldPhotoPath = path.join(__dirname, '..', existingAbout.photo);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        existingAbout.photo = photo;
      }
      existingAbout.title = title;
      existingAbout.description = description;
      await existingAbout.save();

      res.status(200).json({
        success: true,
        message: 'About laboratory updated successfully',
        data: existingAbout
      });
    } else {
      // Create new
      if (!photo) {
        return res.status(400).json({
          success: false,
          message: 'Photo is required'
        });
      }

      const about = new AboutLaboratory({
        title,
        description,
        photo
      });

      await about.save();

      res.status(201).json({
        success: true,
        message: 'About laboratory created successfully',
        data: about
      });
    }
  } catch (error) {
    console.error('Error creating/updating about laboratory:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating about laboratory',
      error: error.message
    });
  }
};

// Delete about laboratory
export const deleteAboutLaboratory = async (req, res) => {
  try {
    const about = await AboutLaboratory.findById(req.params.id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About laboratory not found'
      });
    }

    // Delete photo file
    if (about.photo) {
      const photoPath = path.join(__dirname, '..', about.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await AboutLaboratory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'About laboratory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about laboratory:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting about laboratory',
      error: error.message
    });
  }
};
