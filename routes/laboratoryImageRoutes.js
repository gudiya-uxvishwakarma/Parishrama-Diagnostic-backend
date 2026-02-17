import express from 'express';
const router = express.Router();
import * as laboratoryImageController from '../controllers/laboratoryImageController.js';
import upload from '../middleware/upload.js';

// Get all laboratory images
router.get('/', laboratoryImageController.getAllLaboratoryImages);

// Get single laboratory image
router.get('/:id', laboratoryImageController.getLaboratoryImageById);

// Create laboratory image
router.post('/', upload.single('image'), laboratoryImageController.createLaboratoryImage);

// Update laboratory image
router.put('/:id', upload.single('image'), laboratoryImageController.updateLaboratoryImage);

// Delete laboratory image
router.delete('/:id', laboratoryImageController.deleteLaboratoryImage);

export default router;
