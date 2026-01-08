import express from 'express';
import {
  getServiceSections,
  getServiceSection,
  createServiceSection,
  updateServiceSection,
  deleteServiceSection,
  getActiveServiceSections
} from '../controllers/serviceSectionController.js';

const router = express.Router();

/*
==================== SERVICE SECTION API ROUTES ====================

Base URL: http://localhost:5000/api/service-section

1. GET /service-section - Get all service sections (with pagination)
2. GET /service-section/active - Get only active service sections
3. GET /service-section/:id - Get single service section
4. POST /service-section - Create new service section (Admin)
5. PUT /service-section/:id - Update service section (Admin)
6. DELETE /service-section/:id - Delete service section (Admin)

Sample JSON for Create/Update:
{
  "title": "Comprehensive Healthcare",
  "subtitle": "Solutions",
  "description": "From routine health checkups to specialized diagnostic testing, we provide complete healthcare solutions with precision, care, and professional excellence.",
  "services": [
    {
      "image": "/src/assets/p1.jpg",
      "title": "Laboratory Testing",
      "description": "Advanced diagnostic testing with state-of-the-art equipment and rapid results",
      "features": ["Blood Analysis", "Urine Testing", "Pathology", "Biochemistry", "Microbiology"],
      "href": "/laboratory",
      "color": "from-blue-500 to-blue-600"
    },
    {
      "image": "/src/assets/p2.jpg",
      "title": "Sample Collection",
      "description": "Comprehensive sample collection services for all diagnostic needs with trained professionals",
      "features": ["Blood Sample Collection", "Urine Sample Collection", "Stool Sample Collection", "Sputum Sample Collection", "Tissue Sample Collection"],
      "href": "/sample-collection",
      "color": "from-green-500 to-green-600"
    },
    {
      "image": "/src/assets/p3.jpg",
      "title": "Consultant Doctor",
      "description": "Expert medical consultation from experienced specialists and general practitioners",
      "features": ["General Medicine", "Specialist Consultation", "Health Checkups", "Medical Advice", "Follow-up Care"],
      "href": "/doctors",
      "color": "from-purple-500 to-purple-600"
    }
  ],
  "isActive": true
}

Response Format:
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "section_id",
      "title": "Comprehensive Healthcare",
      "subtitle": "Solutions",
      "description": "...",
      "services": [...],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
*/

// @route   GET /api/service-section/active
// @desc    Get active service sections (for frontend)
// @access  Public
router.get('/active', getActiveServiceSections);

// @route   GET /api/service-section
// @desc    Get all service sections
// @access  Public
router.get('/', getServiceSections);

// @route   GET /api/service-section/:id
// @desc    Get single service section
// @access  Public
router.get('/:id', getServiceSection);

// @route   POST /api/service-section
// @desc    Create new service section
// @access  Private (Admin)
router.post('/', createServiceSection);

// @route   PUT /api/service-section/:id
// @desc    Update service section
// @access  Private (Admin)
router.put('/:id', updateServiceSection);

// @route   DELETE /api/service-section/:id
// @desc    Delete service section
// @access  Private (Admin)
router.delete('/:id', deleteServiceSection);

export default router;