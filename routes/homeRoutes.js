import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  getHomeItems,
  getHomeItem,
  createHomeItem,
  updateHomeItem,
  deleteHomeItem,
  getActiveHomeItems,
  getHomeStats,
  searchHomeItems
} from '../controllers/homeController.js';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/home/";
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
router.get('/active', getActiveHomeItems);
router.get('/stats', getHomeStats);
router.get('/search/:query', searchHomeItems);
router.get('/', getHomeItems);
router.get('/:id', getHomeItem);
router.post('/', upload.single('image'), createHomeItem);
router.put('/:id', upload.single('image'), updateHomeItem);
router.delete('/:id', deleteHomeItem);

export default router;