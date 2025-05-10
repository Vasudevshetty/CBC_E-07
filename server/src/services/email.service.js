const nodemailer = require("nodemailer");
const { createTransporter } = require("../config/email.config");

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} options.html - HTML email content (optional)
 * @returns {Promise<Object>} - Information about the sent email
 */
exports.sendEmail = async (options) => {
  try {
    // Create transporter (either production or test)
    const transporter = await createTransporter();

    // Define email options
    const mailOptions = {
      from: `"${process.env.APP_NAME || "CBC App"}" <${
        process.env.EMAIL_FROM
      }>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // For development, log the test URL where the email can be previewed
    if (process.env.NODE_ENV !== "production") {
      console.log("Email preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send a password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetURL - Password reset URL
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Information about the sent email
 */
exports.sendPasswordResetEmail = async (email, resetURL, name) => {
  const subject = "Your password reset token (valid for 10 minutes)";

  // Plain text version
  const text = `Hi ${name},\n\nForgot your password? Click the link below to reset your password:\n\n${resetURL}\n\nIf you didn't forget your password, please ignore this email.\n\nThis link is valid for 10 minutes only.`;

  // HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a5568;">Password Reset</h2>
      <p>Hi ${name},</p>
      <p>Forgot your password? No problem! Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Your Password</a>
      </div>
      <p>If the button doesn't work, you can also click on this link or copy it to your browser:</p>
      <p><a href="${resetURL}">${resetURL}</a></p>
      <p><strong>Note:</strong> This link is valid for 10 minutes only.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="font-size: 12px; color: #718096;">This is an automated email, please do not reply.</p>
    </div>
  `;

  return this.sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};
// Added email verification functionality
