import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus
} from "../controllers/doctorController.js";

const router = express.Router();

// Create Doctor
router.post("/", createDoctor);

// Get All Doctors
router.get("/", getAllDoctors);

// Get Single Doctor
router.get("/:id", getDoctorById);

// Update Doctor
router.put("/:id", updateDoctor);

// Delete Doctor
router.delete("/:id", deleteDoctor);

// Toggle Active / Inactive


export default router;
