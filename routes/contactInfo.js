import express from 'express';
import { getContactInfo, upsertContactInfo } from '../controllers/contactInfoController.js';

const router = express.Router();

router.get('/', getContactInfo);
router.post('/', upsertContactInfo);
router.put('/', upsertContactInfo);

export default router;
