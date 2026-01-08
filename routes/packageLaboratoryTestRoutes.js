import express from 'express';
import {
  getAllPackageTests,
  getPackageTestById,
  createPackageTest,
  updatePackageTest,
  deletePackageTest,
  permanentDeletePackageTest
} from '../controllers/packageLaboratoryTestController.js';

const router = express.Router();

// Public routes (for frontend display)
router.get('/', getAllPackageTests);
router.get('/:id', getPackageTestById);

// Admin routes (for admin panel management)
router.post('/', createPackageTest);
router.put('/:id', updatePackageTest);
router.delete('/:id', deletePackageTest);
router.delete('/permanent/:id', permanentDeletePackageTest);

export default router;