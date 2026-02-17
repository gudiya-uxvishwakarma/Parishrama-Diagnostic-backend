import express from 'express';
const router = express.Router();
import * as homeSampleBookingController from '../controllers/homeSampleBookingController.js';
import pdfUpload from '../middleware/pdfUpload.js';

// Get all bookings
router.get('/', homeSampleBookingController.getAllBookings);

// Get single booking by ID
router.get('/:id', homeSampleBookingController.getBookingById);

// Create new booking
router.post('/', homeSampleBookingController.createBooking);

// Update booking
router.put('/:id', homeSampleBookingController.updateBooking);

// Delete booking
router.delete('/:id', homeSampleBookingController.deleteBooking);

// Upload PDF report
router.post('/:id/upload-report', pdfUpload.single('pdfReport'), homeSampleBookingController.uploadPdfReport);

// Download PDF report
router.get('/:id/download-report', homeSampleBookingController.downloadPdfReport);

// Send report via email
router.post('/:id/send-email', homeSampleBookingController.sendReportViaEmail);

export default router;
