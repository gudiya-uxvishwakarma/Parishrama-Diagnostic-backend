import Branch from '../models/Branch.js';

// Get all branches
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching branches',
      error: error.message
    });
  }
};

// Get single branch by ID
export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching branch',
      error: error.message
    });
  }
};

// Create new branch
export const createBranch = async (req, res) => {
  try {
    const { name, address, phone, hours } = req.body;

    if (!name || !address || !phone || !hours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const branch = new Branch({
      name,
      address,
      phone,
      hours
    });

    await branch.save();

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating branch',
      error: error.message
    });
  }
};

// Update branch
export const updateBranch = async (req, res) => {
  try {
    const { name, address, phone, hours } = req.body;

    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { name, address, phone, hours },
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating branch',
      error: error.message
    });
  }
};

// Delete branch
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting branch',
      error: error.message
    });
  }
};
