import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// POST /api/appointments - Create new appointment
router.post('/', createAppointment);

// GET /api/appointments - Get all appointments
router.get('/', getAppointments);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', deleteAppointment);

// GET /api/appointments/:id - Get single appointment (MUST BE LAST)
router.get('/:id', getAppointment);

export default router;