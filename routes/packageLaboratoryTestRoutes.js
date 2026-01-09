import express from 'express';
import { setUploadFolder, uploadSingle } from '../middleware/Upload.js';
import {
  getAllPackageTests,
  getPackageTestById,
  createPackageTest,
  updatePackageTest,
  deletePackageTest,
  permanentDeletePackageTest
} from '../controllers/packageLaboratoryTestController.js';

const router = express.Router();

// Get all package tests
router.get('/', getAllPackageTests);

// Get single package test
router.get('/:id', getPackageTestById);

// Create package test with image upload
router.post('/', setUploadFolder('packageTests'), uploadSingle('image'), createPackageTest);

// Update package test with image upload
router.put('/:id', setUploadFolder('packageTests'), uploadSingle('image'), updatePackageTest);

// Delete package test
router.delete('/:id', deletePackageTest);

// Permanent delete package test
router.delete('/permanent/:id', permanentDeletePackageTest);

export default router;