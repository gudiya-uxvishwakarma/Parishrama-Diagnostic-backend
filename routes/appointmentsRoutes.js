import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  uploadPdfReport,
  downloadPdfReport,
  sendReportViaEmail
} from '../controllers/appointmentController.js';
import pdfUpload from '../middleware/pdfUpload.js';

const router = express.Router();

router.post('/', createAppointment);

router.get('/', getAppointments);

router.put('/:id', updateAppointment);

router.delete('/:id', deleteAppointment);

router.get('/:id', getAppointment);

// PDF upload and download routes
router.post('/:id/upload-report', pdfUpload.single('pdfReport'), uploadPdfReport);
router.get('/:id/download-report', downloadPdfReport);

// Email sending route
router.post('/:id/send-email', sendReportViaEmail);

export default router;