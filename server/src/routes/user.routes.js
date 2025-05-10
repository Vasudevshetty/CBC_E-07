const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth.middleware");

// All routes below this middleware require authentication
router.use(verifyToken);

// Example protected route
router.get("/profile", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile accessed successfully",
    userId: req.user.id,
  });
});

// Example admin-only route
router.get("/admin", authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});

module.exports = router;
