const express = require("express");
const userController = require("../controllers/user.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  uploadProfileImage,
  handleUploadError,
} = require("../middleware/upload.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get("/profile", userController.getProfile);

// Update profile with optional profile image upload
router.patch(
  "/profile",
  uploadProfileImage,
  handleUploadError,
  userController.updateProfile
);

// Delete user account
router.delete("/profile", userController.deleteAccount);

// Admin-only routes
router.use(restrictTo("admin"));

// Get all users (admin only)
router.get("/", userController.getAllUsers);

module.exports = router;
