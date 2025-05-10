const Login = require("../models/login.model");

exports.recordLogin = async (req, res) => {
  const userId = req.params.userId;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const existing = await Login.findOne({ userId, date: today });
    if (existing) {
      existing.count += 1;
      await existing.save();
      return res.json({ message: "Login count incremented", data: existing });
    } else {
      const newLogin = new Login({ userId, date: today, count: 1 });
      await newLogin.save();
      return res.json({ message: "Login recorded", data: newLogin });
    }
  } catch (error) {
    res.status(500).json({ message: "Error recording login", error });
  }
};

exports.getLogins = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const logins = await Login.find({ userId });

    const data = logins.map((entry) => ({
      userId: entry.userId,
      date: entry.date,
      count: entry.count,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching login data", error });
  }
};
