import Precision from '../models/Precision.js';
import path from "path";
import fs from "fs";

// @desc    Create new precision
// @route   POST /api/precision
// @access  Private (Admin)
export const createPrecision = async (req, res) => {
  try {
    console.log('🎯 CREATE PRECISION - Request received');
    console.log('📋 Content-Type:', req.get('Content-Type'));
    console.log('📦 req.body:', req.body);
    console.log('📁 req.file:', req.file);
    
    let { title, subtitle, description } = req.body;
    let image = null;
    
    // Handle file upload if present
    if (req.file) {
      image = `/uploads/precision/${req.file.filename}`;
      console.log('📸 File uploaded, image path set to:', image);
    }
    
    console.log('✅ Final values before validation:');
    console.log('  - image:', image);
    console.log('  - title:', title);
    console.log('  - subtitle:', subtitle);
    console.log('  - description:', description);
    
    // Validate required fields
    if (!title || !subtitle || !description) {
      console.log('❌ Validation failed - missing text fields');
      return res.status(400).json({
        success: false,
        message: 'Title, subtitle, and description are required',
        received: { title, subtitle, description }
      });
    }

    if (!image) {
      console.log('❌ Validation failed - no image provided');
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
        received: { hasFile: !!req.file }
      });
    }

    // Create precision with processed data
    const precisionData = {
      image,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      isActive: true
    };

    console.log('🚀 Creating precision with data:', precisionData);
    const precision = await Precision.create(precisionData);

    res.status(201).json({
      success: true,
      message: 'Precision created successfully',
      data: precision
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating precision',
      error: error.message
    });
  }
};

// @desc    Get all precisions
// @route   GET /api/precision
// @access  Public
export const getPrecisions = async (req, res) => {
  try {
    console.log('🎯 GET /api/precision - Fetching precision sections...');
    const { isActive, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Calculate pagination
    const skip = (page - 1) * limit;

    const precisions = await Precision.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Precision.countDocuments(filter);

    console.log(`✅ Found ${precisions.length} precision sections out of ${total} total`);

    res.json({
      success: true,
      count: precisions.length,
      data: precisions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error in getPrecisions:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching precisions',
      error: error.message
    });
  }
};


export const getPrecision = async (req, res) => {
  try {
    const precision = await Precision.findById(req.params.id);

    if (!precision) {
      return res.status(404).json({
        success: false,
        message: 'Precision not found'
      });
    }

    res.json({
      success: true,
      data: precision
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching precision'
    });
  }
};


export const updatePrecision = async (req, res) => {
  try {
    // Check if precision exists
    const existingPrecision = await Precision.findById(req.params.id);
    if (!existingPrecision) {
      return res.status(404).json({
        success: false,
        message: 'Precision not found'
      });
    }

    let updateData = { ...req.body };
    
    // Handle file upload if present
    if (req.file) {
      updateData.image = `/uploads/precision/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingPrecision.image && existingPrecision.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingPrecision.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const precision = await Precision.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Precision updated successfully',
      data: precision
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
        details: error.errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating precision',
      error: error.message
    });
  }
};

export const deletePrecision = async (req, res) => {
  try {
    const precision = await Precision.findByIdAndDelete(req.params.id);

    if (!precision) {
      return res.status(404).json({
        success: false,
        message: 'Precision not found'
      });
    }

    res.json({
      success: true,
      message: 'Precision deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting precision'
    });
  }
};

// @desc    Get precision statistics
// @route   GET /api/precision/stats/overview
// @access  Private (Admin)
export const getPrecisionStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Precision.countDocuments(),
      Precision.countDocuments({ isActive: true }),
      Precision.countDocuments({ isActive: false }),
      Precision.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        active: stats[1],
        inactive: stats[2],
        recent: stats[3]
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching precision statistics'
    });
  }
};

// @desc    Test endpoint to check model requirements
// @route   GET /api/precision/test/model
// @access  Public
export const testModelRequirements = async (req, res) => {
  try {
    const modelSchema = Precision.schema.paths;
    const requiredFields = [];
    
    for (const [fieldName, fieldSchema] of Object.entries(modelSchema)) {
      if (fieldSchema.isRequired) {
        requiredFields.push({
          field: fieldName,
          type: fieldSchema.instance,
          required: true
        });
      }
    }

    res.json({
      success: true,
      message: 'Model requirements',
      requiredFields,
      sampleData: {
        image: "https://example.com/image.jpg",
        title: "Where Precision",
        subtitle: "Meets Compassion",
        description: "Our commitment to excellence in healthcare diagnostics combines cutting-edge technology with compassionate care."
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while testing model',
      error: error.message
    });
  }
};