import express from "express";
import multer from 'multer';
import fs from 'fs';
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus
} from "../controllers/doctorController.js";

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/doctors/";
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
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", upload.single('image'), createDoctor);
router.put("/:id", upload.single('image'), updateDoctor);
router.patch("/:id/toggle-status", toggleDoctorStatus);
router.delete("/:id", deleteDoctor);

export default router;