import Laboratory from '../models/Laboratory.js';

// @desc    Create new laboratory test
// @route   POST /api/laboratory
// @access  Private (Admin)
export const createLaboratoryTest = async (req, res) => {
  try {
    console.log('Received laboratory test data:', req.body);
    
    const { title, text, image, features, price } = req.body;
    
    // Validate required fields
    if (!title || !text || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, text, and image are required',
        received: {
          title: title || 'missing',
          text: text || 'missing',
          image: image ? 'provided' : 'missing',
          features: features ? `${features.length} features` : 'missing'
        }
      });
    }
    
    // Prepare laboratory test data
    const labTestData = {
      title: title.trim(),
      text: text.trim(),
      image,
      features: features && Array.isArray(features) ? features.filter(f => f && f.trim()) : [],
      price: price ? parseFloat(price) : undefined
    };
    
    console.log('Creating laboratory test with processed data:', labTestData);
    
    const labTest = await Laboratory.create(labTestData);
    
    console.log('Laboratory test created successfully:', labTest);

    res.status(201).json({
      success: true,
      message: 'Laboratory test created successfully',
      data: labTest
    });

  } catch (error) {
    console.error('Create laboratory test error:', error);
    
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
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get laboratory tests with pagination
    const labTests = await Laboratory.find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Laboratory.countDocuments({});

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
    console.error('Get laboratory tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching laboratory tests'
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
    console.error('Get laboratory test error:', error);
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
    console.log('Updating laboratory test ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const { title, text, image, features, price } = req.body;
    
    // Check if laboratory test exists
    const existingTest = await Laboratory.findById(req.params.id);
    if (!existingTest) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory test not found'
      });
    }
    
    // Validate required fields
    if (!title || !text || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, text, and image are required'
      });
    }
    
    // Prepare update data
    const updateData = {
      title: title.trim(),
      text: text.trim(),
      image,
      features: features && Array.isArray(features) ? features.filter(f => f && f.trim()) : [],
      price: price ? parseFloat(price) : undefined
    };
    
    const labTest = await Laboratory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Laboratory test updated successfully:', labTest);

    res.json({
      success: true,
      message: 'Laboratory test updated successfully',
      data: labTest
    });

  } catch (error) {
    console.error('Update laboratory test error:', error);
    
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
    console.error('Delete laboratory test error:', error);
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
        { title: { $regex: query, $options: 'i' } },
        { text: { $regex: query, $options: 'i' } },
        { features: { $in: [new RegExp(query, 'i')] } }
      ]
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: labTests.length,
      data: labTests
    });

  } catch (error) {
    console.error('Search laboratory tests error:', error);
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
    console.error('Get laboratory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching laboratory statistics'
    });
  }
};