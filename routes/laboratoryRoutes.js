import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  createLaboratoryTest,
  getLaboratoryTests,
  getLaboratoryTest,
  updateLaboratoryTest,
  deleteLaboratoryTest,
  searchLaboratoryTests,
  getLaboratoryStats
} from '../controllers/laboratoryController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/laboratory/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/stats', getLaboratoryStats);
router.get('/search/:query', searchLaboratoryTests);
router.get('/', getLaboratoryTests);
router.get('/:id', getLaboratoryTest);
router.post('/', upload.single('image'), createLaboratoryTest);
router.put('/:id', upload.single('image'), updateLaboratoryTest);
router.delete('/:id', deleteLaboratoryTest);

export default router;