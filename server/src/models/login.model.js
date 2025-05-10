const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

// Compound index to prevent duplicate entries per user per day
loginSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Login", loginSchema);
