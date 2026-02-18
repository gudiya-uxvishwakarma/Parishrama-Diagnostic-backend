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

    // Create transporter with App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME || 'parishramadiagnostics.123@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'uqkculduqfldpmku'
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');
    } catch (verifyError) {
      console.error('❌ Email transporter verification failed:', verifyError.message);
      throw new Error('Email service configuration error');
    }

    // Email content with enhanced design
    const mailOptions = {
      from: process.env.EMAIL_USERNAME || 'parishramadiagnostics.123@gmail.com',
      to: process.env.EMAIL_USERNAME || 'parishramadiagnostics.123@gmail.com',
      subject: `🔬 New Test Booking Inquiry - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Logo and Brand -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #07661B 0%, #0a8a24 100%); padding: 40px 30px; text-align: center;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <h2 style="color: white; margin: 0; font-size: 26px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                              🔬 New Test Booking Inquiry
                            </h2>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Customer Details Section -->
                  <tr>
                    <td style="padding: 40px 30px; background-color: #fafafa;">
                      <h3 style="color: #07661B; margin: 0 0 25px 0; font-size: 22px; font-weight: 700; border-bottom: 3px solid #07661B; padding-bottom: 12px; display: inline-block;">
                        👤 Customer Details
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <tr>
                          <td style="padding: 16px 20px; background-color: #ffffff; border-bottom: 1px solid #e8e8e8; font-weight: 700; color: #333; width: 35%; font-size: 15px;">
                            📝 Name:
                          </td>
                          <td style="padding: 16px 20px; background-color: #ffffff; border-bottom: 1px solid #e8e8e8; color: #555; font-size: 15px;">
                            ${name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 20px; background-color: #f9f9f9; border-bottom: 1px solid #e8e8e8; font-weight: 700; color: #333; font-size: 15px;">
                            📧 Email:
                          </td>
                          <td style="padding: 16px 20px; background-color: #f9f9f9; border-bottom: 1px solid #e8e8e8; font-size: 15px;">
                            <a href="mailto:${email}" style="color: #07661B; text-decoration: none; font-weight: 600; transition: color 0.3s;">
                              ${email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 20px; background-color: #ffffff; border-bottom: 1px solid #e8e8e8; font-weight: 700; color: #333; font-size: 15px;">
                            📱 Mobile:
                          </td>
                          <td style="padding: 16px 20px; background-color: #ffffff; border-bottom: 1px solid #e8e8e8; font-size: 15px;">
                            <a href="tel:${mobile}" style="color: #07661B; text-decoration: none; font-weight: 600; font-size: 16px;">
                              ${mobile}
                            </a>
                          </td>
                        </tr>
                        ${reason ? `
                        <tr>
                          <td style="padding: 16px 20px; background-color: #f9f9f9; border-bottom: 1px solid #e8e8e8; font-weight: 700; color: #333; font-size: 15px; vertical-align: top;">
                            💬 Reason:
                          </td>
                          <td style="padding: 16px 20px; background-color: #f9f9f9; border-bottom: 1px solid #e8e8e8; color: #555; font-size: 15px; line-height: 1.6;">
                            ${reason}
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding: 16px 20px; background-color: #ffffff; font-weight: 700; color: #333; font-size: 15px;">
                            🕐 Inquiry Time:
                          </td>
                          <td style="padding: 16px 20px; background-color: #ffffff; color: #555; font-size: 15px;">
                            ${new Date().toLocaleString('en-IN', { 
                              timeZone: 'Asia/Kolkata',
                              dateStyle: 'full',
                              timeStyle: 'long'
                            })}
                          </td>
                        </tr>
                      </table>

                      <!-- Action Required Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                        <tr>
                          <td style="background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%); padding: 20px; border-left: 5px solid #ffc107; border-radius: 8px; box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);">
                            <p style="margin: 0; color: #856404; font-size: 15px; line-height: 1.6;">
                              <strong style="font-size: 16px;">⚠️ Action Required:</strong><br>
                              Please contact this customer as soon as possible to assist with their test booking inquiry. Prompt response ensures excellent customer service.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Quick Action Buttons -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                        <tr>
                          <td align="center">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 0 10px;">
                                  <a href="tel:${mobile}" style="display: inline-block; background: linear-gradient(135deg, #07661B 0%, #0a8a24 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(7, 102, 27, 0.3);">
                                    📞 Call Customer
                                  </a>
                                </td>
                                <td style="padding: 0 10px;">
                                  <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #4472C4 0%, #2e5cb8 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(68, 114, 196, 0.3);">
                                    ✉️ Email Customer
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #07661B 0%, #0a8a24 100%); padding: 30px; text-align: center;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 10px 0; color: white; font-size: 14px; font-weight: 600;">
                              Parishrama Diagnostic Laboratory
                            </p>
                            <p style="margin: 0 0 15px 0; color: rgba(255,255,255,0.9); font-size: 13px; line-height: 1.6;">
                              #77, 1st Cross, MS Palya Circle, Vidyaranyapura Main Road<br>
                              Bengaluru - 560 097
                            </p>
                            <p style="margin: 0 0 5px 0; color: rgba(255,255,255,0.9); font-size: 13px;">
                              📞 <a href="tel:+919591035131" style="color: white; text-decoration: none; font-weight: 600;">+91 9591035131</a>
                            </p>
                            <p style="margin: 0 0 20px 0; color: rgba(255,255,255,0.9); font-size: 13px;">
                              📧 <a href="mailto:parishramadiagnostics.123@gmail.com" style="color: white; text-decoration: none;">parishramadiagnostics.123@gmail.com</a>
                            </p>
                            <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 15px; margin-top: 15px;">
                              <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">
                                🤖 This email was sent automatically from the website popup form
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
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
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to send inquiry. Please try again or call us directly.',
      error: error.message
    });
  }
});

export default router;
