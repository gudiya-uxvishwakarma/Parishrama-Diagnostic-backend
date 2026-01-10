import Home from '../models/Home.js';
import path from "path";
import fs from "fs";

export const getHomeItems = async (req, res) => {
  try {
    console.log('📋 GET /api/home - Fetching home items...');
    const { page = 1, limit = 10, isActive } = req.query;
    
    // Build filter object
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get home items with pagination
    const homeItems = await Home.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Home.countDocuments(filter);

    console.log(`✅ Found ${homeItems.length} home items out of ${total} total`);

    res.json({
      success: true,
      count: homeItems.length,
      total,
      data: homeItems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error in getHomeItems:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching home items',
      error: error.message
    });
  }
};


export const getHomeItem = async (req, res) => {
  try {
    const homeItem = await Home.findById(req.params.id);

    if (!homeItem) {
      return res.status(404).json({
        success: false,
        message: 'Home item not found'
      });
    }

    res.json({
      success: true,
      data: homeItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching home item'
    });
  }
};

// @desc    Create new home item
// @route   POST /api/home
// @access  Private (Admin)
export const createHomeItem = async (req, res) => {
  try {
    let { title, text, image, features, isActive } = req.body;

    // Handle file upload if present
    if (req.file) {
      image = `/uploads/home/${req.file.filename}`;
    }

    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features]; // If it's not valid JSON, treat as single feature
      }
    }

    // Validation
    if (!title || !text || !image || !features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, text, image, and at least one feature',
        received: {
          title: title || 'missing',
          text: text || 'missing', 
          image: image ? 'provided' : 'missing',
          features: features ? `${features.length} features` : 'missing'
        }
      });
    }

    // Filter out empty features
    const cleanFeatures = features.filter(feature => feature && feature.trim().length > 0);
    
    if (cleanFeatures.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one non-empty feature is required'
      });
    }

    // Create home item
    const homeItem = await Home.create({
      title: title.trim(),
      text: text.trim(),
      image,
      features: cleanFeatures,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Home item created successfully',
      data: homeItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating home item',
      error: error.message
    });
  }
};

// @desc    Update home item
// @route   PUT /api/home/:id
// @access  Private (Admin)
export const updateHomeItem = async (req, res) => {
  try {
    let { title, text, image, features, isActive } = req.body;

    // Check if home item exists
    const existingItem = await Home.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Home item not found'
      });
    }

    // Handle file upload if present
    if (req.file) {
      image = `/uploads/home/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingItem.image && existingItem.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (!image) {
      // If no new file and no image provided, keep the existing image
      image = existingItem.image;
    }

    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features]; // If it's not valid JSON, treat as single feature
      }
    }

    // Validation
    if (!title || !text || !image || !features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, text, image, and at least one feature'
      });
    }

    // Filter out empty features
    const cleanFeatures = features.filter(feature => feature && feature.trim().length > 0);
    
    if (cleanFeatures.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one non-empty feature is required'
      });
    }

    const homeItem = await Home.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        text: text.trim(),
        image,
        features: cleanFeatures,
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Home item updated successfully',
      data: homeItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid home item ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating home item',
      error: error.message
    });
  }
};

// @desc    Delete home item
// @route   DELETE /api/home/:id
// @access  Private (Admin)
export const deleteHomeItem = async (req, res) => {
  try {
    const homeItem = await Home.findByIdAndDelete(req.params.id);

    if (!homeItem) {
      return res.status(404).json({
        success: false,
        message: 'Home item not found'
      });
    }

    res.json({
      success: true,
      message: 'Home item deleted successfully',
      data: homeItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting home item'
    });
  }
};

// @desc    Get active home items (for frontend)
// @route   GET /api/home/active
// @access  Public
export const getActiveHomeItems = async (req, res) => {
  try {
    const homeItems = await Home.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: homeItems.length,
      data: homeItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active home items'
    });
  }
};

// @desc    Get home statistics
// @route   GET /api/home/stats
// @access  Private (Admin)
export const getHomeStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Home.countDocuments(),
      Home.countDocuments({ isActive: true }),
      Home.countDocuments({ isActive: false })
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        active: stats[1],
        inactive: stats[2]
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching home statistics'
    });
  }
};

// @desc    Search home items
// @route   GET /api/home/search/:query
// @access  Public
export const searchHomeItems = async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, 'i');

    const homeItems = await Home.find({
      $or: [
        { title: searchRegex },
        { text: searchRegex },
        { features: { $in: [searchRegex] } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: homeItems.length,
      data: homeItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching home items'
    });
  }
};