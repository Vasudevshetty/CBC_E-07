const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Create a nodemailer transport configuration
 * For production, configure with your actual SMTP settings
 * For development, use ethereal.email for testing
 */
const createTransporter = async () => {
  if (process.env.NODE_ENV === "production") {
    // Create a production transporter with real email service
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // App-specific password recommended for Gmail
      },
    });
  } else {
    // Create a test account for development
    const testAccount = await nodemailer.createTestAccount();

    // Return a test transporter
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

module.exports = { createTransporter };
