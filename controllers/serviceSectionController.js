import ServiceSection from '../models/ServiceSection.js';

// @desc    Get all service sections
// @route   GET /api/service-section
// @access  Public
export const getServiceSections = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const sections = await ServiceSection.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceSection.countDocuments(filter);

    res.json({
      success: true,
      count: sections.length,
      total,
      data: sections,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get service sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service sections'
    });
  }
};

// @desc    Get single service section
// @route   GET /api/service-section/:id
// @access  Public
export const getServiceSection = async (req, res) => {
  try {
    const section = await ServiceSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Service section not found'
      });
    }

    res.json({
      success: true,
      data: section
    });

  } catch (error) {
    console.error('Get service section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service section'
    });
  }
};

// @desc    Create new service section
// @route   POST /api/service-section
// @access  Private (Admin)
export const createServiceSection = async (req, res) => {
  try {
    const { title, subtitle, description, services, isActive } = req.body;

    if (!title || !subtitle || !description || !services || !Array.isArray(services)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subtitle, description, and services array'
      });
    }

    const section = await ServiceSection.create({
      title,
      subtitle,
      description,
      services,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Service section created successfully',
      data: section
    });

  } catch (error) {
    console.error('Create service section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating service section'
    });
  }
};

// @desc    Update service section
// @route   PUT /api/service-section/:id
// @access  Private (Admin)
export const updateServiceSection = async (req, res) => {
  try {
    const { title, subtitle, description, services, isActive } = req.body;

    const section = await ServiceSection.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        description,
        services,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Service section not found'
      });
    }

    res.json({
      success: true,
      message: 'Service section updated successfully',
      data: section
    });

  } catch (error) {
    console.error('Update service section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service section'
    });
  }
};

// @desc    Delete service section
// @route   DELETE /api/service-section/:id
// @access  Private (Admin)
export const deleteServiceSection = async (req, res) => {
  try {
    const section = await ServiceSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Service section not found'
      });
    }

    res.json({
      success: true,
      message: 'Service section deleted successfully',
      data: section
    });

  } catch (error) {
    console.error('Delete service section error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service section'
    });
  }
};

// @desc    Get active service sections (for frontend)
// @route   GET /api/service-section/active
// @access  Public
export const getActiveServiceSections = async (req, res) => {
  try {
    const sections = await ServiceSection.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sections.length,
      data: sections
    });

  } catch (error) {
    console.error('Get active service sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active service sections'
    });
  }
};