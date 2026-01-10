import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const uploadDirs = [
    'uploads',
    'uploads/home',
    'uploads/laboratory',
    'uploads/doctors',
    'uploads/sampleCollection',
    'uploads/precision',
    'uploads/appointment',
    'uploads/packageTests'
  ];

  uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

// Create upload directories
createUploadDirs();

// Middlewares
app.use(cors());


// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== STATIC FILES (Uploads) ====================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Subfolders ke liye specific routes
app.use("/uploads/home", express.static(path.join(__dirname, "uploads/home")));
app.use("/uploads/laboratory", express.static(path.join(__dirname, "uploads/laboratory")));
app.use("/uploads/doctors", express.static(path.join(__dirname, "uploads/doctors")));
app.use("/uploads/sampleCollection", express.static(path.join(__dirname, "uploads/sampleCollection")));
app.use("/uploads/precision", express.static(path.join(__dirname, "uploads/precision")));
app.use("/uploads/appointment", express.static(path.join(__dirname, "uploads/appointment")));
app.use("/uploads/packageTests", express.static(path.join(__dirname, "uploads/packageTests")));

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
    message: "Parishrama Backend API is running! "
  });
});

// ==================== API HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==================== MongoDB Connection ====================
connectDB();

// ==================== Server Start ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
});