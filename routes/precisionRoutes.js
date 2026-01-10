import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  createPrecision,
  getPrecisions,
  getPrecision,
  updatePrecision,
  deletePrecision,
  getPrecisionStats,
  testModelRequirements
} from '../controllers/precisionController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/precision/";
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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes
router.get('/test/model', testModelRequirements);
router.get('/stats/overview', getPrecisionStats);
router.get('/', getPrecisions);
router.get('/:id', getPrecision);
router.post('/', upload.single('image'), createPrecision);
router.put('/:id', upload.single('image'), updatePrecision);
router.delete('/:id', deletePrecision);

export default router;