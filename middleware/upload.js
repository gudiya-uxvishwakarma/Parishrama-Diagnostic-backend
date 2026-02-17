import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on route
    let folder = "uploads/";
    
    if (req.baseUrl.includes('/home')) {
      folder = "uploads/home/";
    } else if (req.baseUrl.includes('/laboratory') && !req.baseUrl.includes('/aboutLaboratory') && !req.baseUrl.includes('/laboratoryImages')) {
      folder = "uploads/laboratory/";
    } else if (req.baseUrl.includes('/doctor')) {
      folder = "uploads/doctors/";
    } else if (req.baseUrl.includes('/healthCheckup')) {
      folder = "uploads/healthCheckup/";
    } else if (req.baseUrl.includes('/precision')) {
      folder = "uploads/precision/";
    } else if (req.baseUrl.includes('/aboutLaboratory')) {
      folder = "uploads/aboutLaboratory/";
    } else if (req.baseUrl.includes('/laboratoryImages')) {
      folder = "uploads/laboratoryImages/";
    } else if (req.baseUrl.includes('/offers')) {
      folder = "uploads/offers/";
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// ✅ File filter: ONLY IMAGES
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // ✅ 5MB image limit
  },
});

export default upload;
