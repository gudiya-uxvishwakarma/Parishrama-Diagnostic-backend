import HealthCheckup from '../models/HealthCheckup.js';
import path from "path";
import fs from "fs";

// @desc    Create new health checkup package
// @route   POST /api/healthCheckup
// @access  Private (Admin)
export const createHealthCheckup = async (req, res) => {
  try {
    let { title, price, packageDetailsHeading, packageDetails } = req.body;

    console.log('Received data:', { title, price, packageDetailsHeading, packageDetails });

    // Parse packageDetails if it's a JSON string
    if (typeof packageDetails === 'string') {
      try {
        packageDetails = JSON.parse(packageDetails);
      } catch (e) {
        packageDetails = [packageDetails];
      }
    }

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Price is required'
      });
    }

    if (!packageDetails || !Array.isArray(packageDetails) || packageDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one package detail is required'
      });
    }

    const serviceData = {
      title: title.trim(),
      price: parseFloat(price),
      packageDetails: packageDetails.filter(d => d && d.trim())
    };

    // Only add packageDetailsHeading if provided
    if (packageDetailsHeading && packageDetailsHeading.trim()) {
      serviceData.packageDetailsHeading = packageDetailsHeading.trim();
    }

    const service = await HealthCheckup.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Health checkup package created successfully',
      data: service
    });

  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating health checkup package'
    });
  }
};

// @desc    Get all sample collection services
// @route   GET /api/HealthCheckup
// @access  Public
export const getHealthCheckups = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get sample collection services with pagination - sorted by oldest first
    const services = await HealthCheckup.find()
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await HealthCheckup.countDocuments();

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
// @route   GET /api/HealthCheckup/:id
// @access  Public
export const getHealthCheckup = async (req, res) => {
  try {
    const service = await HealthCheckup.findById(req.params.id);

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
// @route   PUT /api/HealthCheckup/:id
// @access  Private (Admin)
export const updateHealthCheckup = async (req, res) => {
  try {
    // Check if service exists
    const existingService = await HealthCheckup.findById(req.params.id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Health checkup package not found'
      });
    }

    let { title, price, packageDetailsHeading, packageDetails } = req.body;

    // Parse packageDetails if it's a JSON string
    if (typeof packageDetails === 'string') {
      try {
        packageDetails = JSON.parse(packageDetails);
      } catch (e) {
        packageDetails = [packageDetails];
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (price !== undefined) updateData.price = price;
    if (packageDetailsHeading) updateData.packageDetailsHeading = packageDetailsHeading;
    if (packageDetails) updateData.packageDetails = packageDetails;

    const service = await HealthCheckup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Health checkup package updated successfully',
      data: service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating health checkup package'
    });
  }
};

// @desc    Delete sample collection service
// @route   DELETE /api/HealthCheckup/:id
// @access  Private (Admin)
export const deleteHealthCheckup = async (req, res) => {
  try {
    const service = await HealthCheckup.findByIdAndDelete(req.params.id);

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
// @route   GET /api/HealthCheckup/search/:query
// @access  Public
export const searchHealthCheckups = async (req, res) => {
  try {
    const { query } = req.params;
    const services = await HealthCheckup.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { packageDetails: { $in: [new RegExp(query, 'i')] } }
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
// @route   GET /api/HealthCheckup/stats
// @access  Private (Admin)
export const getHealthCheckupStats = async (req, res) => {
  try {
    const total = await HealthCheckup.countDocuments();

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

