const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

// Import routes (to be created)
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const loginRoutes = require("./src/routes/login.routes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all requests
app.use(limiter);

// Apply security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"], // Adjust to your client's URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Morgan for logging HTTP requests
app.use(morgan("dev"));

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Serve profile images statically
app.use(
  "/uploads/profile-images",
  express.static(path.join(__dirname, "uploads/profile-images"))
);

// Set up API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/login", loginRoutes);

// Add learner type route
app.use("/api/v1/users/learner-type", userRoutes);

// Health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "Server is running!" });
});

// 404 catch-all route - must be placed after all other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/studysyncsv3";

// Only start server if this file is run directly
if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    });
}

// Export app for testing purposes
module.exports = app;
