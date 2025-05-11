const express = require("express");
const router = express.Router();

// POST /video_questions
router.post("/video_questions", async (req, res) => {
  try {
    const { video_url, user_id } = req.body;

    if (!video_url || !user_id) {
      return res.status(400).json({ error: "Missing video_url or user_id" });
    }

    // Simulate processing the video URL and user ID
    const response = {
      message: "Video question processed successfully",
      video_url,
      user_id,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in /video_questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
