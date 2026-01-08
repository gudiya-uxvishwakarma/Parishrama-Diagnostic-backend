import express from 'express';
import {
  createLaboratoryTest,
  getLaboratoryTests,
  getLaboratoryTest,
  updateLaboratoryTest,
  deleteLaboratoryTest,
  searchLaboratoryTests,
  getLaboratoryStats
} from '../controllers/laboratoryController.js';

const router = express.Router();

// @route   POST /api/laboratory
// @desc    Create new laboratory test
// @access  Private (Admin)
router.post('/', createLaboratoryTest);

// @route   GET /api/laboratory/stats
// @desc    Get laboratory statistics
// @access  Private (Admin)
router.get('/stats', getLaboratoryStats);

// @route   GET /api/laboratory/search/:query
// @desc    Search laboratory tests
// @access  Public
router.get('/search/:query', searchLaboratoryTests);

// @route   GET /api/laboratory
// @desc    Get all laboratory tests
// @access  Public
router.get('/', getLaboratoryTests);

// @route   GET /api/laboratory/:id
// @desc    Get single laboratory test
// @access  Public
router.get('/:id', getLaboratoryTest);

// @route   PUT /api/laboratory/:id
// @desc    Update laboratory test
// @access  Private (Admin)
router.put('/:id', updateLaboratoryTest);

// @route   DELETE /api/laboratory/:id
// @desc    Delete laboratory test
// @access  Private (Admin)
router.delete('/:id', deleteLaboratoryTest);

export default router;