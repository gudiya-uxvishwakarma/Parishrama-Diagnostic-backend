import express from "express";
import nodemailer from "nodemailer";
import ContactInquiry from "../models/ContactInquiry.js";

const router = express.Router();

// POST - Send Inquiry
router.post("/send-inquiry", async (req, res) => {
  try {
    const { name, email, mobile, reason } = req.body;

    console.log("📧 Received inquiry:", { name, email, mobile, reason });

    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Save to database
    const inquiry = new ContactInquiry({
      name,
      email,
      mobile,
      reason: reason || "",
    });

    await inquiry.save();
    console.log("✅ Inquiry saved to database");

    // Send email (await so we see errors)
    await sendEmail(inquiry);

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("❌ Error processing inquiry:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
      error: error.message,
    });
  }
});

// Email Function
async function sendEmail(inquiry) {
  try {
    console.log("📤 Connecting to SMTP...");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // REQUIRED for 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `🔬 New Test Booking - ${inquiry.name}`,
      replyTo: inquiry.email,
      html: `
        <h2>New Test Booking Inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Mobile:</strong> ${inquiry.mobile}</p>
        <p><strong>Reason:</strong> ${inquiry.reason || "N/A"}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);

    inquiry.emailSent = true;
    inquiry.emailSentAt = new Date();
    await inquiry.save();
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
}

export default router;
