import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    console.log('=== NEW APPOINTMENT REQUEST ===');
    console.log('Received appointment data:', req.body);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    
    const appointmentData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'address', 'date', 'time', 'service', 'category'];
    const missingFields = requiredFields.filter(field => !appointmentData[field] || appointmentData[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(appointmentData.email)) {
      console.log('❌ Invalid email format:', appointmentData.email);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate date format
    const appointmentDate = new Date(appointmentData.date);
    if (isNaN(appointmentDate.getTime())) {
      console.log('❌ Invalid date format:', appointmentData.date);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid date'
      });
    }

    console.log('✅ All validations passed');

    // Check for duplicate appointment (same email, date, time)
    const existingAppointment = await Appointment.findOne({
      email: appointmentData.email,
      date: appointmentData.date,
      time: appointmentData.time
    });

    if (existingAppointment) {
      console.log('❌ Duplicate appointment found:', existingAppointment._id);
      return res.status(400).json({
        success: false,
        message: 'An appointment already exists for this time slot'
      });
    }

    console.log('✅ No duplicate found, creating appointment...');

    // Create appointment
    const appointment = await Appointment.create(appointmentData);
    console.log('✅ Appointment created successfully:', appointment._id);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });

  } catch (error) {
    console.error('❌ Create appointment error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        details: error.errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('❌ Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry found',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating appointment',
      error: error.message
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public (for admin)
export const getAppointments = async (req, res) => {
  try {
    const { service, category, date, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (service) filter.service = service;
    if (category) filter.category = category;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get appointments with pagination
    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      count: appointments.length,
      total,
      data: appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      error: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Get appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private (Admin)
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment',
      error: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public (for admin)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Delete appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting appointment',
      error: error.message
    });
  }
};

// @desc    Get appointment statistics with category breakdown
// @route   GET /api/appointments/stats
// @access  Public (for admin)
export const getAppointmentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get basic stats
    const [todayCount, totalCount] = await Promise.all([
      Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments()
    ]);

    // Get category-wise stats
    const categoryStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get service-wise stats
    const serviceStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        today: todayCount,
        total: totalCount,
        byCategory: categoryStats,
        byService: serviceStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

// @desc    Search appointments
// @route   GET /api/appointments/search/:query
// @access  Public
export const searchAppointments = async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, 'i');

    const appointments = await Appointment.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { service: searchRegex },
        { category: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error('Search appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching appointments',
      error: error.message
    });
  }
};

// @desc    Get appointments by category
// @route   GET /api/appointments/category/:category
// @access  Public
export const getAppointmentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get appointments with pagination
    const appointments = await Appointment.find({ category })
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Appointment.countDocuments({ category });

    res.json({
      success: true,
      count: appointments.length,
      total,
      data: appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get appointments by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments by category',
      error: error.message
    });
  }
};

// @desc    Get all categories with counts
// @route   GET /api/appointments/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    // Get categories with counts
    const categoriesWithCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { category: 1 }
      }
    ]);

    // Get distinct categories (for simple list)
    const categories = await Appointment.distinct('category');

    res.json({
      success: true,
      count: categories.length,
      data: {
        categories: categories.sort(),
        categoriesWithCounts
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/appointments/categories/stats
// @access  Public
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          latestAppointment: { $max: '$createdAt' },
          oldestAppointment: { $min: '$createdAt' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          latestAppointment: 1,
          oldestAppointment: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category statistics',
      error: error.message
    });
  }
};