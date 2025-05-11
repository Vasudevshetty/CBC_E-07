const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");

/**
 * Get user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Update user profile
 * @route PATCH /api/v1/users/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "email"];
    const updateData = {};

    // Filter request body to only include allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Handle profile image if uploaded
    if (req.file) {
      // If user already has a profile image that's not the default, delete it
      const user = await User.findById(req.user.id);
      if (user.profileImage !== "default-profile.jpg") {
        const oldImagePath = path.join(
          __dirname,
          "../../../uploads/profile-images/",
          user.profileImage
        );

        // Only delete if file exists
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update with new profile image
      updateData.profileImage = req.file.filename;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, // Return updated user
      runValidators: true, // Run model validators
    });

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Delete user account (soft delete)
 * @route DELETE /api/v1/users/profile
 * @access Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/v1/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.getLernerType = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use the learner type from the request state
    const { learnerType } = req.body;
    if (!learnerType) {
      return res.status(400).json({
        success: false,
        message: "Learner type is required",
      });
    }

    // Update learner type in the database
    user.learnerType = learnerType;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        learnerType,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating learner type",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
