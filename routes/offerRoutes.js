import express from 'express';
const router = express.Router();
import * as offerController from '../controllers/offerController.js';
import upload from '../middleware/upload.js';

// Get all offers
router.get('/', offerController.getAllOffers);

// Get single offer
router.get('/:id', offerController.getOfferById);

// Create offer
router.post('/', upload.single('image'), offerController.createOffer);

// Update offer
router.put('/:id', upload.single('image'), offerController.updateOffer);

// Delete offer
router.delete('/:id', offerController.deleteOffer);

export default router;
