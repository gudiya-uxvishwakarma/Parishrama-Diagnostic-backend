import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads/reports directory if it doesn't exist
const reportsDir = "uploads/reports";
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Storage configuration for PDF reports
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, reportsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "report-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter: ONLY PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const pdfUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB PDF limit
  },
});

export default pdfUpload;
