import express from 'express';
const router = express.Router();
import * as homeSampleCollectionController from '../controllers/homeSampleCollectionController.js';

// Get all services
router.get('/', homeSampleCollectionController.getAllServices);

// Get single service by ID
router.get('/:id', homeSampleCollectionController.getServiceById);

// Create new service
router.post('/', homeSampleCollectionController.createService);

// Update service
router.put('/:id', homeSampleCollectionController.updateService);

// Delete service
router.delete('/:id', homeSampleCollectionController.deleteService);

export default router;
