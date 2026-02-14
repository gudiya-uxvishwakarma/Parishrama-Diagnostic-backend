import nodemailer from 'nodemailer';
import path from 'path';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send report email with PDF attachment
export const sendReportEmail = async (appointment, pdfPath) => {
  try {
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
      to: appointment.email,
      subject: `Medical Report - ${appointment.name} - Parishrama Diagnostics`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Parishrama Diagnostics</h1>
              <p>Your Medical Report is Ready</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${appointment.name}</strong>,</p>
              
              <p>We hope this email finds you well. Your medical report is now ready and attached to this email.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">📋 Appointment Details</h3>
                <div class="info-row">
                  <span class="label">Patient Name:</span> ${appointment.name}
                </div>
                <div class="info-row">
                  <span class="label">Date:</span> ${new Date(appointment.date).toLocaleDateString('en-IN')}
                </div>
                <div class="info-row">
                  <span class="label">Time:</span> ${appointment.time}
                </div>
                <div class="info-row">
                  <span class="label">Service:</span> ${appointment.service}
                </div>
                ${appointment.category ? `
                <div class="info-row">
                  <span class="label">Category:</span> ${appointment.category}
                </div>
                ` : ''}
              </div>
              
              <p><strong>📎 Your medical report is attached as a PDF file.</strong></p>
              
              <p>Please review the report carefully. If you have any questions or concerns about your results, please don't hesitate to contact us.</p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>⚠️ Important:</strong> Keep this report confidential and secure. Do not share it with unauthorized persons.
              </div>
              
              <div class="footer">
                <h3 style="color: #667eea;">Contact Us</h3>
                <p>
                  📞 Phone: +91 9591035131<br>
                  📧 Email: Parishramadiagnostics.123@gmail.com<br>
                  🌐 Visit us for more information
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                  This is an automated email. Please do not reply to this message.<br>
                  © ${new Date().getFullYear()} Parishrama Diagnostics. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `${appointment.name.replace(/\s+/g, '_')}_Report.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
