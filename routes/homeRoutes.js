import express from 'express';
import {
  getHomeItems,
  getHomeItem,
  createHomeItem,
  updateHomeItem,
  deleteHomeItem,
  getActiveHomeItems,
  getHomeStats,
  searchHomeItems
} from '../controllers/homeController.js';

const router = express.Router();

/*
==================== HOME API ROUTES ====================

Base URL: http://localhost:5000/api/home

1. GET /home - Get all home items (with pagination)
2. GET /home/active - Get only active home items
3. GET /home/stats - Get home statistics (Admin)
4. GET /home/search/:query - Search home items
5. GET /home/:id - Get single home item
6. POST /home - Create new home item (Admin)
7. PUT /home/:id - Update home item (Admin)
8. DELETE /home/:id - Delete home item (Admin)

Sample JSON for Create/Update:
{
  "title": "Welcome to Parishrama Diagnostic",
  "text": "Your trusted healthcare partner",
  "description": "We provide comprehensive diagnostic services with state-of-the-art equipment and experienced professionals to ensure accurate results and quality care.",
  "buttonText": "Learn More",
  "image": "/uploads/home/image1.jpg",
  "isActive": true
}

Query Parameters for GET /home:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- isActive: Filter by active status (true/false)

Response Format:
{
  "success": true,
  "count": 5,
  "total": 15,
  "data": [
    {
      "_id": "item_id",
      "title": "Welcome Title",
      "text": "Welcome text",
      "description": "Detailed description",
      "buttonText": "Click Here",
      "image": "/uploads/home/image1.jpg",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 2,
    "total": 15,
    "limit": 10
  }
}
*/

// @route   GET /api/home/active
// @desc    Get active home items (for frontend)
// @access  Public
router.get('/active', getActiveHomeItems);

// @route   GET /api/home/stats
// @desc    Get home statistics
// @access  Private (Admin)
router.get('/stats', getHomeStats);

// @route   GET /api/home/search/:query
// @desc    Search home items
// @access  Public
router.get('/search/:query', searchHomeItems);

// @route   GET /api/home
// @desc    Get all home items
// @access  Public
router.get('/', getHomeItems);

// @route   GET /api/home/:id
// @desc    Get single home item
// @access  Public
router.get('/:id', getHomeItem);

// @route   POST /api/home
// @desc    Create new home item
// @access  Private (Admin)
router.post('/', createHomeItem);

// @route   PUT /api/home/:id
// @desc    Update home item
// @access  Private (Admin)
router.put('/:id', updateHomeItem);

// @route   DELETE /api/home/:id
// @desc    Delete home item
// @access  Private (Admin)
router.delete('/:id', deleteHomeItem);

export default router;