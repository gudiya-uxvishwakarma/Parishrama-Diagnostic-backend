import Laboratory from '../models/Laboratory.js';
import path from "path";
import fs from "fs";
// @desc    Create new laboratory test
// @route   POST /api/laboratory
// @access  Private (Admin)
export const createLaboratoryTest = async (req, res) => {
  try {
    let { title, image, tests } = req.body;
    
    console.log('📥 Received data:', { title, tests: typeof tests, testsRaw: tests });
    
    // Handle file upload if present
    if (req.file) {
      image = `/uploads/laboratory/${req.file.filename}`;
    }
    
    // Parse tests if it's a JSON string
    if (typeof tests === 'string') {
      try {
        tests = JSON.parse(tests);
        console.log('✅ Parsed tests:', tests);
      } catch (e) {
        console.error('❌ Failed to parse tests:', e);
        tests = [];
      }
    }
    
    // Validate required fields
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title and image are required',
        received: {
          title: title || 'missing',
          image: image ? 'provided' : 'missing',
          tests: tests ? `${tests.length} tests` : 'missing'
        }
      });
    }
    
    // Prepare laboratory test data
    const labTestData = {
      title: title.trim(),
      image,
      tests: tests && Array.isArray(tests) ? tests.filter(t => t.name && t.name.trim() && t.price !== undefined) : []
    };
    
    console.log('💾 Saving to database:', labTestData);
    
    const labTest = await Laboratory.create(labTestData);

    console.log('✅ Saved successfully:', labTest);

    res.status(201).json({
      success: true,
      message: 'Laboratory test created successfully',
      data: labTest
    });

  } catch (error) {
    console.error('❌ Error creating laboratory test:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        details: error.errors
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Laboratory test with this information already exists',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating laboratory test',
      error: error.message,
      errorName: error.name
    });
  }
};

// @desc    Get all laboratory tests
// @route   GET /api/laboratory
// @access  Public
export const getLaboratoryTests = async (req, res) => {
  try {
    console.log('🧪 GET /api/laboratory - Fetching laboratory tests...');
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get laboratory tests with pagination
    const labTests = await Laboratory.find({})
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Laboratory.countDocuments({});

    console.log(`✅ Found ${labTests.length} laboratory tests out of ${total} total`);

    res.json({
      success: true,
      count: labTests.length,
      total,
      data: labTests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error in getLaboratoryTests:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching laboratory tests',
      error: error.message
    });
  }
};

// @desc    Get single laboratory test
// @route   GET /api/laboratory/:id
// @access  Public
export const getLaboratoryTest = async (req, res) => {
  try {
    const labTest = await Laboratory.findById(req.params.id);

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory test not found'
      });
    }

    res.json({
      success: true,
      data: labTest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching laboratory test'
    });
  }
};

// @desc    Update laboratory test
// @route   PUT /api/laboratory/:id
// @access  Private (Admin)
export const updateLaboratoryTest = async (req, res) => {
  try {
    let { title, image, tests } = req.body;
    
    console.log('📥 UPDATE - Received data:', { title, tests: typeof tests, testsRaw: tests });
    
    // Check if laboratory test exists
    const existingTest = await Laboratory.findById(req.params.id);
    if (!existingTest) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory test not found'
      });
    }
    
    console.log('📄 Existing test:', existingTest);
    
    // Handle file upload if present
    if (req.file) {
      image = `/uploads/laboratory/${req.file.filename}`;
      
      // Delete old image file if it exists
      if (existingTest.image && existingTest.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingTest.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (!image) {
      // If no new file and no image provided, keep the existing image
      image = existingTest.image;
    }
    
    // Parse tests if it's a JSON string
    if (typeof tests === 'string') {
      try {
        tests = JSON.parse(tests);
        console.log('✅ Parsed tests:', tests);
      } catch (e) {
        console.error('❌ Failed to parse tests:', e);
        tests = [];
      }
    }
    
    // Validate required fields
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title and image are required'
      });
    }
    
    // Prepare update data
    const updateData = {
      title: title.trim(),
      image,
      tests: tests && Array.isArray(tests) ? tests.filter(t => t.name && t.name.trim() && t.price !== undefined) : []
    };
    
    console.log('💾 Updating with data:', updateData);
    
    const labTest = await Laboratory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('✅ Updated successfully:', labTest);

    res.json({
      success: true,
      message: 'Laboratory test updated successfully',
      data: labTest
    });

  } catch (error) {
    console.error('❌ Error updating laboratory test:', error);
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
        message: 'Invalid laboratory test ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating laboratory test',
      error: error.message
    });
  }
};

// @desc    Delete laboratory test
// @route   DELETE /api/laboratory/:id
// @access  Private (Admin)
export const deleteLaboratoryTest = async (req, res) => {
  try {
    const labTest = await Laboratory.findByIdAndDelete(req.params.id);

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory test not found'
      });
    }

    res.json({
      success: true,
      message: 'Laboratory test deleted successfully',
      data: labTest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting laboratory test'
    });
  }
};

// @desc    Search laboratory tests
// @route   GET /api/laboratory/search/:query
// @access  Public
export const searchLaboratoryTests = async (req, res) => {
  try {
    const { query } = req.params;
    const labTests = await Laboratory.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: labTests.length,
      data: labTests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching laboratory tests'
    });
  }
};

// @desc    Get laboratory statistics
// @route   GET /api/laboratory/stats
// @access  Private (Admin)
export const getLaboratoryStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Laboratory.countDocuments(),
      Laboratory.aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: stats[0],
        averagePrice: stats[1][0]?.avgPrice || 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching laboratory statistics'
    });
  }
};