const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../services/email.service");

// Helper function to create and send JWT token via cookie
const createSendToken = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cannot be accessed by client-side JS
    secure: process.env.NODE_ENV === "production", // only sent on HTTPS in production
  };

  // Remove password from output
  user.password = undefined;

  // Send token as cookie and in JSON response
  res.status(statusCode).cookie("jwt", token, cookieOptions).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

/**
 * Register new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create user with default profile image
    const user = await User.create({
      name,
      email,
      password,
      // Default profile image will be used from the User model
    });

    // Send JWT token
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Send JWT token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Logout user
 * @route GET /api/v1/auth/logout
 * @access Public
 */
exports.logout = (req, res) => {
  res
    .status(200)
    .cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

/**
 * Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
exports.getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

/**
 * Update password
 * @route PATCH /api/v1/auth/update-password
 * @access Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Your current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send new token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Forgot password - send reset token
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res) => {
  let user;
  try {
    // Get user by email
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "There is no user with that email address",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      // Send email with reset URL
      await emailService.sendPasswordResetEmail(
        user.email,
        resetURL,
        user.name
      );

      res.status(200).json({
        success: true,
        message: "Password reset token sent to your email",
      });
    } catch (emailError) {
      // If email sending fails, reset the token fields and handle the error
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Error sending password reset email. Please try again later.",
        error:
          process.env.NODE_ENV === "development"
            ? emailError.message
            : undefined,
      });
    }
  } catch (err) {
    // If error occurs before email sending
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      success: false,
      message: "Error processing password reset",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Reset password using token
 * @route PATCH /api/v1/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = async (req, res) => {
  try {
    // Get token from URL param and hash it
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with token and check if token is still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    // Set new password
    user.password = req.body.password;

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save user
    await user.save();

    // Send JWT token to log user in
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
