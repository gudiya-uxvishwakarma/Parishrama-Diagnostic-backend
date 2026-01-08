import express from 'express';
import {
  createSampleCollection,
  getSampleCollections,
  getSampleCollection,
  updateSampleCollection,
  deleteSampleCollection,
  searchSampleCollections,
  getSampleCollectionStats
} from '../controllers/sampleCollectionController.js';

const router = express.Router();

/*
==================== SAMPLE COLLECTION API ROUTES ====================

Base URL: http://localhost:5000/api/sampleCollection

1. GET /sampleCollection - Get all sample collection services (with pagination)
2. GET /sampleCollection/stats - Get sample collection statistics (Admin)
3. GET /sampleCollection/search/:query - Search sample collection services
4. GET /sampleCollection/:id - Get single sample collection service
5. POST /sampleCollection - Create new sample collection service (Admin)
6. PUT /sampleCollection/:id - Update sample collection service (Admin)
7. DELETE /sampleCollection/:id - Delete sample collection service (Admin)

Sample JSON for Create/Update:
{
  "text": "CENTERS",
  "title": "Collection Centers",
  "image": "/uploads/samplecollection/centers.jpg",
  "features": ["Walk-in appointments", "No waiting time", "Hygienic environment"],
  "price": 50
}

Query Parameters for GET /sampleCollection:
- page: Page number (default: 1)
- limit: Items per page (default: 10)

Response Format:
{
  "success": true,
  "count": 3,
  "total": 3,
  "data": [
    {
      "_id": "service_id",
      "text": "CENTERS",
      "title": "Collection Centers",
      "image": "/uploads/samplecollection/centers.jpg",
      "features": ["Walk-in appointments", "No waiting time"],
      "price": 50,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 3,
    "limit": 10
  }
}
*/

// @route   GET /api/sampleCollection/stats
// @desc    Get sample collection statistics
// @access  Private (Admin)
router.get('/stats', getSampleCollectionStats);

// @route   GET /api/sampleCollection/search/:query
// @desc    Search sample collection services
// @access  Public
router.get('/search/:query', searchSampleCollections);

// @route   GET /api/sampleCollection
// @desc    Get all sample collection services
// @access  Public
router.get('/', getSampleCollections);

// @route   GET /api/sampleCollection/:id
// @desc    Get single sample collection service
// @access  Public
router.get('/:id', getSampleCollection);

// @route   POST /api/sampleCollection
// @desc    Create new sample collection service
// @access  Private (Admin)
router.post('/', createSampleCollection);

// @route   PUT /api/sampleCollection/:id
// @desc    Update sample collection service
// @access  Private (Admin)
router.put('/:id', updateSampleCollection);

// @route   DELETE /api/sampleCollection/:id
// @desc    Delete sample collection service
// @access  Private (Admin)
router.delete('/:id', deleteSampleCollection);

export default router;