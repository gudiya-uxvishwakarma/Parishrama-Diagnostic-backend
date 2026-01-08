import express from 'express';
import {
  createPrecision,
  getPrecisions,
  getPrecision,
  updatePrecision,
  deletePrecision,
  getPrecisionStats,
  testModelRequirements
} from '../controllers/precisionController.js';

const router = express.Router();

// @route   GET /api/precision/test/model
// @desc    Test model requirements
// @access  Public
router.get('/test/model', testModelRequirements);

// @route   GET /api/precision/stats/overview
// @desc    Get precision statistics
// @access  Private (Admin)
router.get('/stats/overview', getPrecisionStats);

// @route   POST /api/precision
// @desc    Create new precision
// @access  Private (Admin)
router.post('/', createPrecision);

// @route   GET /api/precision
// @desc    Get all precisions
// @access  Public
router.get('/', getPrecisions);

// @route   GET /api/precision/:id
// @desc    Get single precision
// @access  Public
router.get('/:id', getPrecision);

// @route   PUT /api/precision/:id
// @desc    Update precision
// @access  Private (Admin)
router.put('/:id', updatePrecision);

// @route   DELETE /api/precision/:id
// @desc    Delete precision
// @access  Private (Admin)
router.delete('/:id', deletePrecision);

export default router;