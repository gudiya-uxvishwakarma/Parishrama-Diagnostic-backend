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

// Get all package tests
router.get('/', getAllPackageTests);

// Get single package test
router.get('/:id', getPackageTestById);

// Create package test with image upload
router.post('/', upload.single('image'), createPackageTest);

// Update package test with image upload
router.put('/:id', upload.single('image'), updatePackageTest);

// Delete package test
router.delete('/:id', deletePackageTest);

// Permanent delete package test
router.delete('/permanent/:id', permanentDeletePackageTest);

export default router;