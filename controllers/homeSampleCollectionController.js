import HomeSampleCollection from '../models/HomeSampleCollection.js';

// Get all home sample collection services
export const getAllServices = async (req, res) => {
  try {
    const services = await HomeSampleCollection.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching home sample collection services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await HomeSampleCollection.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, price, and description'
      });
    }

    const service = new HomeSampleCollection({
      title,
      price,
      description
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    const service = await HomeSampleCollection.findByIdAndUpdate(
      req.params.id,
      { title, price, description },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const service = await HomeSampleCollection.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};
