import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Send contact form email
router.post('/send-inquiry', async (req, res) => {
  try {
    const { name, email, mobile, reason } = req.body;

    console.log('📧 Received inquiry:', { name, email, mobile, reason });

    // Validate required fields
    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create transporter with Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parishramadiagnostics.123@gmail.com',
        pass: 'uqkculduqfldpmku'
      }
    });

    // Email content
    const mailOptions = {
      from: 'parishramadiagnostics.123@gmail.com',
      to: 'parishramadiagnostics.123@gmail.com',
      subject: `🔬 New Test Booking Inquiry - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #07661B 0%, #0a8a24 100%); padding: 30px; text-align: center;">
                      <h2 style="color: white; margin: 0; font-size: 24px;">
                        🔬 New Test Booking Inquiry
                      </h2>
                    </td>
                  </tr>

                  <!-- Customer Details -->
                  <tr>
                    <td style="padding: 30px;">
                      <h3 style="color: #07661B; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #07661B; padding-bottom: 10px;">
                        👤 Customer Details
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                        <tr>
                          <td style="padding: 12px; background-color: #f9f9f9; font-weight: bold; color: #333; width: 30%;">
                            📝 Name:
                          </td>
                          <td style="padding: 12px; background-color: #f9f9f9; color: #555;">
                            ${name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px; background-color: #ffffff; font-weight: bold; color: #333;">
                            📧 Email:
                          </td>
                          <td style="padding: 12px; background-color: #ffffff;">
                            <a href="mailto:${email}" style="color: #07661B; text-decoration: none;">
                              ${email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px; background-color: #f9f9f9; font-weight: bold; color: #333;">
                            📱 Mobile:
                          </td>
                          <td style="padding: 12px; background-color: #f9f9f9;">
                            <a href="tel:${mobile}" style="color: #07661B; text-decoration: none; font-weight: 600;">
                              ${mobile}
                            </a>
                          </td>
                        </tr>
                        ${reason ? `
                        <tr>
                          <td style="padding: 12px; background-color: #ffffff; font-weight: bold; color: #333; vertical-align: top;">
                            💬 Reason:
                          </td>
                          <td style="padding: 12px; background-color: #ffffff; color: #555;">
                            ${reason}
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 12px; background-color: #f9f9f9; font-weight: bold; color: #333;">
                            🕐 Time:
                          </td>
                          <td style="padding: 12px; background-color: #f9f9f9; color: #555;">
                            ${new Date().toLocaleString('en-IN', { 
                              timeZone: 'Asia/Kolkata',
                              dateStyle: 'full',
                              timeStyle: 'long'
                            })}
                          </td>
                        </tr>
                      </table>

                      <!-- Action Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                          <td style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 5px;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                              <strong>⚠️ Action Required:</strong><br>
                              Please contact this customer as soon as possible to assist with their test booking inquiry.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Action Buttons -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                          <td align="center">
                            <a href="tel:${mobile}" style="display: inline-block; background: #07661B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 5px;">
                              📞 Call Customer
                            </a>
                            <a href="mailto:${email}" style="display: inline-block; background: #4472C4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 5px;">
                              ✉️ Email Customer
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #07661B; padding: 20px; text-align: center;">
                      <p style="margin: 0 0 10px 0; color: white; font-size: 14px; font-weight: 600;">
                        Parishrama Diagnostic Laboratory
                      </p>
                      <p style="margin: 0 0 10px 0; color: rgba(255,255,255,0.9); font-size: 12px;">
                        #77, 1st Cross, MS Palya Circle, Vidyaranyapura Main Road<br>
                        Bengaluru - 560 097
                      </p>
                      <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 12px;">
                        📞 +91 9591035131 | 📧 parishramadiagnostics.123@gmail.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: email
    };

    // Send email
    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Inquiry sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send inquiry. Please try again or call us directly.',
      error: error.message
    });
  }
});

export default router;
