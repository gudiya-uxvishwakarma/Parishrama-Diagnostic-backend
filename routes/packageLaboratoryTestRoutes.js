import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  getAllPackageTests,
  getPackageTestById,
  createPackageTest,
  updatePackageTest,
  deletePackageTest,
  permanentDeletePackageTest
} from '../controllers/packageLaboratoryTestController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/packageTests/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Middleware to handle both JSON and multipart data
const handleOptionalUpload = (req, res, next) => {
  const contentType = req.get('Content-Type');
  
  if (contentType && contentType.includes('multipart/form-data')) {
    // Use multer for multipart data
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      }
      next();
    });
  } else {
    // Skip multer for JSON data
    next();
  }
};

// Get all package tests
router.get('/', getAllPackageTests);

// Get single package test
router.get('/:id', getPackageTestById);

// Create package test (handles both JSON and multipart)
router.post('/', handleOptionalUpload, createPackageTest);

// Update package test (handles both JSON and multipart)
router.put('/:id', handleOptionalUpload, updatePackageTest);

// Delete package test
router.delete('/:id', deletePackageTest);

// Permanent delete package test
router.delete('/permanent/:id', permanentDeletePackageTest);

export default router;