import WorkingHours from '../models/WorkingHours.js';

// Get all working hours
export const getAllWorkingHours = async (req, res) => {
  try {
    const workingHours = await WorkingHours.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: workingHours
    });
  } catch (error) {
    console.error('Error fetching working hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching working hours',
      error: error.message
    });
  }
};

// Get single working hour by ID
export const getWorkingHourById = async (req, res) => {
  try {
    const workingHour = await WorkingHours.findById(req.params.id);
    if (!workingHour) {
      return res.status(404).json({
        success: false,
        message: 'Working hour not found'
      });
    }
    res.status(200).json({
      success: true,
      data: workingHour
    });
  } catch (error) {
    console.error('Error fetching working hour:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching working hour',
      error: error.message
    });
  }
};

// Create new working hour
export const createWorkingHour = async (req, res) => {
  try {
    const { day, hours, order } = req.body;

    if (!day || !hours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide day and hours'
      });
    }

    const workingHour = new WorkingHours({
      day,
      hours,
      order: order || 0
    });

    await workingHour.save();

    res.status(201).json({
      success: true,
      message: 'Working hour created successfully',
      data: workingHour
    });
  } catch (error) {
    console.error('Error creating working hour:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating working hour',
      error: error.message
    });
  }
};

// Update working hour
export const updateWorkingHour = async (req, res) => {
  try {
    const { day, hours, order } = req.body;

    const workingHour = await WorkingHours.findByIdAndUpdate(
      req.params.id,
      { day, hours, order },
      { new: true, runValidators: true }
    );

    if (!workingHour) {
      return res.status(404).json({
        success: false,
        message: 'Working hour not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Working hour updated successfully',
      data: workingHour
    });
  } catch (error) {
    console.error('Error updating working hour:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating working hour',
      error: error.message
    });
  }
};

// Delete working hour
export const deleteWorkingHour = async (req, res) => {
  try {
    const workingHour = await WorkingHours.findByIdAndDelete(req.params.id);

    if (!workingHour) {
      return res.status(404).json({
        success: false,
        message: 'Working hour not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Working hour deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting working hour:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting working hour',
      error: error.message
    });
  }
};
