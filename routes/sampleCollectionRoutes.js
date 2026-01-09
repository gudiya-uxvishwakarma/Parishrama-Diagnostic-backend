import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  createSampleCollection,
  getSampleCollections,
  getSampleCollection,
  updateSampleCollection,
  deleteSampleCollection,
  searchSampleCollections,
  getSampleCollectionStats
} from '../controllers/sampleCollectionController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/sampleCollection/";
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
router.get('/stats', getSampleCollectionStats);
router.get('/search/:query', searchSampleCollections);
router.get('/', getSampleCollections);
router.get('/:id', getSampleCollection);
router.post('/', upload.single('image'), createSampleCollection);
router.put('/:id', upload.single('image'), updateSampleCollection);
router.delete('/:id', deleteSampleCollection);

export default router;