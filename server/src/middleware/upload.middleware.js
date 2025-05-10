const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const profileImageDir = path.join(__dirname, "../../uploads/profile-images");
if (!fs.existsSync(profileImageDir)) {
  fs.mkdirSync(profileImageDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImageDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with user id (if available) and timestamp
    const userId = req.user ? req.user.id : "guest";
    const uniqueSuffix = `${userId}-${Date.now()}`;
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${uniqueSuffix}${fileExt}`);
  },
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;

  // Check mime type
  const mimeTypeOk = allowedTypes.test(file.mimetype);

  // Check extension
  const extNameOk = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeTypeOk && extNameOk) {
    cb(null, true);
  } else {
    cb(
      new Error("File type not supported. Only JPG, PNG, and GIF allowed."),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB file size limit
  },
  fileFilter: fileFilter,
});

// Middleware for profile image upload
exports.uploadProfileImage = upload.single("profileImage");

// Error handler for multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred during file upload
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 2MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    // Some other error occurred
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};
