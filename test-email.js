import dotenv from 'dotenv';
import { testEmailConfig } from './services/emailService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Email Configuration...\n');

console.log('Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✓ Set (hidden)' : '✗ Not set');
console.log('');

// Test email configuration
const result = await testEmailConfig();

if (result.success) {
  console.log('✅ Email configuration is valid!');
  console.log('✅ Ready to send emails with PDF attachments');
  console.log('\nYou can now:');
  console.log('1. Upload PDF reports in Admin Panel');
  console.log('2. Click the purple Send button');
  console.log('3. Email will be sent automatically with PDF attached');
} else {
  console.log('❌ Email configuration error:', result.error);
  console.log('\nPlease check:');
  console.log('1. EMAIL_USER is set correctly in .env');
  console.log('2. EMAIL_APP_PASSWORD is set (use Gmail App Password, not regular password)');
  console.log('3. 2-Step Verification is enabled on Gmail');
  console.log('\nSee EMAIL_SETUP_GUIDE.md for detailed instructions');
}
