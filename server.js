import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Database connection
import connectDB from "./config/db.js";

// Route imports
import homeRoutes from "./routes/homeRoutes.js";
import laboratoryRoutes from "./routes/laboratoryRoutes.js";
import packageLaboratoryTestRoutes from "./routes/packageLaboratoryTestRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import sampleCollectionRoutes from "./routes/sampleCollectionRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import precisionRoutes from "./routes/precisionRoutes.js";


// Load environment variables
dotenv.config();

const app = express();

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Image upload ke liye limit badhao
app.use(express.urlencoded({ extended: true })); // Form data ke liye useful

// ==================== STATIC FILES (Uploads) ====================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Subfolders ke liye specific routes
app.use("/uploads/home", express.static(path.join(__dirname, "uploads/home")));
app.use("/uploads/laboratory", express.static(path.join(__dirname, "uploads/laboratory")));
app.use("/uploads/doctors", express.static(path.join(__dirname, "uploads/doctors")));
app.use("/uploads/samplecollection", express.static(path.join(__dirname, "uploads/samplecollection")));
app.use("/uploads/appointment", express.static(path.join(__dirname, "uploads/appointment")));

// ==================== API ROUTES ====================
app.use("/api/home", homeRoutes);
app.use("/api/laboratory", laboratoryRoutes);
app.use("/api/package-laboratory-test", packageLaboratoryTestRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/sampleCollection", sampleCollectionRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/precision", precisionRoutes);


// ==================== ROOT ROUTE (Health Check) ====================
app.get("/", (req, res) => {
  res.json({
    message: "Parishrama Backend API is running! 🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// ==================== MongoDB Connection ====================
connectDB();

// ==================== Server Start ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});