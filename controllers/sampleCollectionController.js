import SampleCollection from '../models/SampleCollection.js';
import path from "path";
import fs from "fs";

// @desc    Create new sample collection service
// @route   POST /api/sampleCollection
// @access  Private (Admin)
export const createSampleCollection = async (req, res) => {
  try {
    let { text, title, image, features, price } = req.body;

    // Handle file upload if present
    if (req.file) {
      image = `/uploads/sampleCollection/${req.file.filename}`;
    }

    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features];
      }
    }

    // Validation
    if (!text || !title || !image || !features || features.length === 0 || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text, title, image, features, and price'
      });
    }

    const service = await SampleCollection.create({
      text: text.toUpperCase(),
      title,
      image,
      features,
      price
    });

    res.status(201).json({
      success: true,
      message: 'Sample collection service created successfully',
      data: service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating sample collection service'
    });
  }
};

// @desc    Get all sample collection services
// @route   GET /api/sampleCollection
// @access  Public
export const getSampleCollections = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get sample collection services with pagination
    const services = await SampleCollection.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await SampleCollection.countDocuments();

    res.json({
      success: true,
      count: services.length,
      total,
      data: services,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sample collection services'
    });
  }
};

// @desc    Get single sample collection service
// @route   GET /api/sampleCollection/:id
// @access  Public
export const getSampleCollection = async (req, res) => {
  try {
    const service = await SampleCollection.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Sample collection service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sample collection service'
    });
  }
};

// @desc    Update sample collection service
// @route   PUT /api/sampleCollection/:id
// @access  Private (Admin)
export const updateSampleCollection = async (req, res) => {
  try {
    // Check if service exists
    const existingService = await SampleCollection.findById(req.params.id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Sample collection service not found'
      });
    }

    let { text, title, image, features, price } = req.body;

    // Handle file upload if present
    if (req.file) {
      image = `/uploads/sampleCollection/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingService.image && existingService.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingService.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (!image) {
      image = existingService.image;
    }

    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features];
      }
    }

    const updateData = {};
    if (text) updateData.text = text.toUpperCase();
    if (title) updateData.title = title;
    if (image) updateData.image = image;
    if (features) updateData.features = features;
    if (price !== undefined) updateData.price = price;

    const service = await SampleCollection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Sample collection service updated successfully',
      data: service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating sample collection service'
    });
  }
};

// @desc    Delete sample collection service
// @route   DELETE /api/sampleCollection/:id
// @access  Private (Admin)
export const deleteSampleCollection = async (req, res) => {
  try {
    const service = await SampleCollection.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Sample collection service not found'
      });
    }

    res.json({
      success: true,
      message: 'Sample collection service deleted successfully',
      data: service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting sample collection service'
    });
  }
};

// @desc    Search sample collection services
// @route   GET /api/sampleCollection/search/:query
// @access  Public
export const searchSampleCollections = async (req, res) => {
  try {
    const { query } = req.params;
    const services = await SampleCollection.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { text: { $regex: query, $options: 'i' } },
        { features: { $in: [new RegExp(query, 'i')] } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching sample collection services'
    });
  }
};

// @desc    Get sample collection statistics
// @route   GET /api/sampleCollection/stats
// @access  Private (Admin)
export const getSampleCollectionStats = async (req, res) => {
  try {
    const total = await SampleCollection.countDocuments();

    res.json({
      success: true,
      data: {
        total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sample collection statistics'
    });
  }
};