# Email Setup Guide for Popup Form

The popup form now sends emails directly through your backend server using Nodemailer.

## Current Setup

The system is configured to send emails to: `parishramadiagnostics.123@gmail.com`

## To Enable Email Sending:

### Option 1: Use Gmail App Password (Recommended)

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Parishrama Website"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

3. **Update .env file**:
   Open `Parishrama-Diagnostic-backend/.env` and update:
   ```
   EMAIL_USERNAME=parishramadiagnostics.123@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password_here
   ```

4. **Restart the backend server**:
   ```bash
   cd Parishrama-Diagnostic-backend
   npm run dev
   ```

### Option 2: Use Current Email Configuration

The system will use the existing email configuration in your .env file:
- EMAIL_USERNAME: madhusewingm@gmail.com
- EMAIL_PASSWORD: (already configured)

Emails will be sent FROM this address TO parishramadiagnostics.123@gmail.com

## Testing

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd Parishrama-Diagnostic-backend
   npm run dev

   # Terminal 2 - Frontend
   cd Parishrama-Diagnostic
   npm run dev
   ```

2. Open the website and wait for the popup
3. Fill in the form and submit
4. Check `parishramadiagnostics.123@gmail.com` inbox

## Email Format

When someone submits the popup form, you'll receive an email with:
- **Subject**: New Test Booking Inquiry - [Customer Name]
- **Content**: 
  - Customer Name
  - Customer Email (clickable)
  - Customer Mobile (clickable)
  - Inquiry Time (IST)
  - Action reminder

## Troubleshooting

### "Error sending inquiry" message?
1. Check if backend server is running on port 5000
2. Verify EMAIL_PASSWORD is set in .env file
3. Check backend console for error details

### Email not received?
1. Check spam/junk folder
2. Verify EMAIL_USERNAME in .env is correct
3. Make sure App Password is generated correctly
4. Check backend logs for errors

### "Authentication failed" error?
- Generate a new App Password
- Make sure 2-Step Verification is enabled
- Remove any spaces from the App Password

## Security Notes

- Never commit .env file to Git
- Use App Passwords, not your actual Gmail password
- Keep EMAIL_PASSWORD secure

## Support

If you need help, check the backend console logs for detailed error messages.
