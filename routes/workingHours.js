import express from 'express';
import {
  getAllWorkingHours,
  getWorkingHourById,
  createWorkingHour,
  updateWorkingHour,
  deleteWorkingHour
} from '../controllers/workingHoursController.js';

const router = express.Router();

router.get('/', getAllWorkingHours);
router.get('/:id', getWorkingHourById);
router.post('/', createWorkingHour);
router.put('/:id', updateWorkingHour);
router.delete('/:id', deleteWorkingHour);

export default router;
