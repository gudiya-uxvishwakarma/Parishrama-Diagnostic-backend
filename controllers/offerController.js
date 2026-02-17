import Offer from '../models/Offer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
};

// Get single offer
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: error.message
    });
  }
};

// Create offer
export const createOffer = async (req, res) => {
  try {
    const { title, description, discount, validUntil } = req.body;

    if (!title || !description || !discount || !validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const offer = new Offer({
      title,
      description,
      discount,
      validUntil,
      image: `/uploads/offers/${req.file.filename}`
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: error.message
    });
  }
};

// Update offer
export const updateOffer = async (req, res) => {
  try {
    const { title, description, discount, validUntil } = req.body;

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', offer.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      offer.image = `/uploads/offers/${req.file.filename}`;
    }

    if (title) offer.title = title;
    if (description) offer.description = description;
    if (discount) offer.discount = discount;
    if (validUntil) offer.validUntil = validUntil;

    await offer.save();

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: error.message
    });
  }
};

// Delete offer
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', offer.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: error.message
    });
  }
};
