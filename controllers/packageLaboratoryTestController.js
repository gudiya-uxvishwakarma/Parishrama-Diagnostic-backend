import PackageLaboratoryTest from '../models/PackageLaboratoryTest.js';
import path from "path";
import fs from "fs";

// Get all package laboratory tests
export const getAllPackageTests = async (req, res) => {
  try {
    const tests = await PackageLaboratoryTest.find({ isActive: true })
      .sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Package laboratory tests retrieved successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package laboratory tests',
      error: error.message
    });
  }
};

// Get single package laboratory test by ID
export const getPackageTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await PackageLaboratoryTest.findById(id);
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Package laboratory test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Package laboratory test retrieved successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package laboratory test',
      error: error.message
    });
  }
};

// Create new package laboratory test
export const createPackageTest = async (req, res) => {
  try {
    let { title, text, description, features, price, image } = req.body;
    
    // Handle file upload if present
    if (req.file) {
      image = `/uploads/packageTests/${req.file.filename}`;
    }
    
    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features]; // If it's not valid JSON, treat as single feature
      }
    }
    
    // Validate required fields
    if (!title || !text || !description || !features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, text, description, and at least one feature are required'
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
    
    // Create new package test
    const newTest = new PackageLaboratoryTest({
      title: title.trim(),
      text: text.trim(),
      description: description.trim(),
      features: cleanFeatures,
      price: price ? parseFloat(price) : null,
      image: image || null
    });
    
    const savedTest = await newTest.save();
    
    res.status(201).json({
      success: true,
      message: 'Package laboratory test created successfully',
      data: savedTest
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create package laboratory test',
      error: error.message
    });
  }
};

// Update package laboratory test
export const updatePackageTest = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, text, description, features, price, image } = req.body;
    
    // Check if test exists
    const existingTest = await PackageLaboratoryTest.findById(id);
    if (!existingTest) {
      return res.status(404).json({
        success: false,
        message: 'Package laboratory test not found'
      });
    }
    
    // Handle file upload if present
    if (req.file) {
      image = `/uploads/packageTests/${req.file.filename}`;
      
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
    
    // Parse features if it's a JSON string
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        features = [features]; // If it's not valid JSON, treat as single feature
      }
    }
    
    // Validate required fields
    if (!title || !text || !description || !features || !Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, text, description, and at least one feature are required'
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
    
    // Update the test
    const updatedTest = await PackageLaboratoryTest.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        text: text.trim(),
        description: description.trim(),
        features: cleanFeatures,
        price: price ? parseFloat(price) : null,
        image: image || null
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Package laboratory test updated successfully',
      data: updatedTest
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update package laboratory test',
      error: error.message
    });
  }
};

// Delete package laboratory test (soft delete)
export const deletePackageTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if test exists
    const existingTest = await PackageLaboratoryTest.findById(id);
    if (!existingTest) {
      return res.status(404).json({
        success: false,
        message: 'Package laboratory test not found'
      });
    }
    
    // Soft delete by setting isActive to false
    await PackageLaboratoryTest.findByIdAndUpdate(id, { isActive: false });
    
    res.status(200).json({
      success: true,
      message: 'Package laboratory test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete package laboratory test',
      error: error.message
    });
  }
};

// Hard delete package laboratory test (permanent deletion)
export const permanentDeletePackageTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTest = await PackageLaboratoryTest.findByIdAndDelete(id);
    
    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        message: 'Package laboratory test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Package laboratory test permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete package laboratory test',
      error: error.message
    });
  }
};