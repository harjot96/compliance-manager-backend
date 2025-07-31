#!/usr/bin/env node

/**
 * Notification Testing Setup Script
 * 
 * This script uses the actual Twilio credentials from the UI
 * and provides guidance for SendGrid configuration.
 */

console.log('🔧 Notification Testing Setup\n');

// Actual Twilio credentials from the UI
const twilioCredentials = {
  accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  fromNumber: '+12316748806',
  authToken: 'YOUR_TWILIO_AUTH_TOKEN' // You'll need to get this from Twilio dashboard
};

// SendGrid configuration template
const sendGridCredentials = {
  apiKey: 'YOUR_SENDGRID_API_KEY',
  fromEmail: 'your-verified-email@yourdomain.com',
  fromName: 'Your Company Name'
};

console.log('📱 Twilio Settings (From UI):');
console.log('=' .repeat(50));
console.log(`Account SID: ${twilioCredentials.accountSid}`);
console.log(`From Number: ${twilioCredentials.fromNumber}`);
console.log(`Auth Token: ${twilioCredentials.authToken}`);
console.log('\n⚠️  Note: You need to get the actual Auth Token from your Twilio dashboard');
console.log('   (The UI shows it as masked dots for security)');

console.log('\n📧 SendGrid Settings (Need Configuration):');
console.log('=' .repeat(50));
console.log(`API Key: ${sendGridCredentials.apiKey}`);
console.log(`From Email: ${sendGridCredentials.fromEmail}`);
console.log(`From Name: ${sendGridCredentials.fromName}`);
console.log('\n⚠️  Note: These need to be configured with actual SendGrid credentials');

console.log('\n🔧 Setup Instructions:');
console.log('=' .repeat(50));

console.log('\n1. Get Twilio Auth Token:');
console.log('   - Log into your Twilio Console');
console.log('   - Go to Account > API Keys & Tokens');
console.log('   - Copy your Auth Token');

console.log('\n2. Get SendGrid API Key:');
console.log('   - Log into your SendGrid account');
console.log('   - Go to Settings > API Keys');
console.log('   - Create a new API Key with "Mail Send" permissions');
console.log('   - Copy the API Key');

console.log('\n3. Verify SendGrid Sender:');
console.log('   - In SendGrid, go to Settings > Sender Authentication');
console.log('   - Verify your sender email address');
console.log('   - Use this verified email as your "From Email"');

console.log('\n4. Set Environment Variables:');
console.log('=' .repeat(50));
console.log('Add these to your .env file:');
console.log('');
console.log('# Twilio (from UI)');
console.log(`TWILIO_ACCOUNT_SID=${twilioCredentials.accountSid}`);
console.log('TWILIO_AUTH_TOKEN=your_actual_auth_token_here');
console.log(`TWILIO_PHONE_NUMBER=${twilioCredentials.fromNumber}`);
console.log('');
console.log('# SendGrid (need to configure)');
console.log('SENDGRID_API_KEY=your_sendgrid_api_key_here');
console.log('SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com');
console.log('SENDGRID_FROM_NAME=Your Company Name');

console.log('\n5. Test Commands:');
console.log('=' .repeat(50));
console.log('# Test Twilio SMS (once auth token is set)');
console.log('node test-notifications.js sms');
console.log('');
console.log('# Test SendGrid Email (once API key is set)');
console.log('node test-notifications.js email');
console.log('');
console.log('# Test both services');
console.log('node test-notifications.js all');

console.log('\n6. API Testing Examples:');
console.log('=' .repeat(50));
console.log('# Test SMS via Twilio');
console.log(`curl -X POST http://localhost:3333/api/companies/templates/1/test \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -d \'{"companyId": 1, "channel": "sms", "testData": {"companyName": "Test"}}\'');
console.log('');
console.log('# Test Email via SendGrid');
console.log(`curl -X POST http://localhost:3333/api/companies/templates/1/test \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -d \'{"companyId": 1, "channel": "email", "testData": {"companyName": "Test"}}\'');

console.log('\n7. Configuration via API:');
console.log('=' .repeat(50));
console.log('# Configure Twilio Settings');
console.log(`curl -X POST http://localhost:3333/api/companies/notification-settings \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log(`  -d '{"type": "twilio", "config": {"accountSid": "${twilioCredentials.accountSid}", "authToken": "your_auth_token", "fromNumber": "${twilioCredentials.fromNumber}"}}'`);
console.log('');
console.log('# Configure SendGrid Settings');
console.log(`curl -X POST http://localhost:3333/api/companies/notification-settings \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -d \'{"type": "smtp", "config": {"apiKey": "your_api_key", "fromEmail": "your_email", "fromName": "your_name"}}\'');

console.log('\n🎯 Next Steps:');
console.log('=' .repeat(50));
console.log('1. Get your Twilio Auth Token from the dashboard');
console.log('2. Set up SendGrid account and get API key');
console.log('3. Verify your sender email in SendGrid');
console.log('4. Update the .env file with actual credentials');
console.log('5. Run the tests: node test-notifications.js all');

console.log('\n📚 For more information, see NOTIFICATION_TESTING.md'); 