import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  createHealthCheckup,
  getHealthCheckups,
  getHealthCheckup,
  updateHealthCheckup,
  deleteHealthCheckup,
  searchHealthCheckups,
  getHealthCheckupStats
} from '../controllers/HealthCheckupController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/HealthCheckup/";
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
router.get('/stats', getHealthCheckupStats);
router.get('/search/:query', searchHealthCheckups);
router.get('/', getHealthCheckups);
router.get('/:id', getHealthCheckup);
router.post('/', upload.single('image'), createHealthCheckup);
router.put('/:id', upload.single('image'), updateHealthCheckup);
router.delete('/:id', deleteHealthCheckup);

export default router;
