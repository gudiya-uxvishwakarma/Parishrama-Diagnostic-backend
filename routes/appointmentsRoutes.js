import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);

router.get('/', getAppointments);


router.put('/:id', updateAppointment);


router.delete('/:id', deleteAppointment);

router.get('/:id', getAppointment);

export default router;