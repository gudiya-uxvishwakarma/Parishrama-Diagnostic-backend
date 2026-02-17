import express from 'express';
const router = express.Router();
import * as aboutLaboratoryController from '../controllers/aboutLaboratoryController.js';
import upload from '../middleware/upload.js';

// Get about laboratory
router.get('/', aboutLaboratoryController.getAboutLaboratory);

// Create or update about laboratory
router.post('/', upload.single('photo'), aboutLaboratoryController.createOrUpdateAboutLaboratory);

// Delete about laboratory
router.delete('/:id', aboutLaboratoryController.deleteAboutLaboratory);

export default router;
