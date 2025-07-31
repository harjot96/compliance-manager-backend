/**
 * Notification Testing Examples
 * 
 * This file demonstrates how to test both Twilio SMS and SendGrid email functionality
 * using the existing API endpoints in the compliance management system.
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; // You'll need to get this from login

// Test data
const testCompany = {
  id: 1, // Replace with actual company ID
  email: 'test@example.com',
  mobileNumber: '+61412345678'
};

const testTemplate = {
  id: 1, // Replace with actual template ID
  type: 'email', // or 'sms'
  subject: 'Test Email Subject',
  body: 'Hello {companyName}, this is a test message for {complianceType}.'
};

/**
 * Test Twilio SMS Functionality
 */
async function testTwilioSMS() {
  try {
    console.log('🧪 Testing Twilio SMS functionality...');
    
    const response = await axios.post(`${BASE_URL}/api/companies/templates/${testTemplate.id}/test`, {
      companyId: testCompany.id,
      channel: 'sms',
      testData: {
        companyName: 'Test Company',
        complianceType: 'BAS'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Twilio SMS Test Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Twilio SMS Test Failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test SendGrid Email Functionality
 */
async function testSendGridEmail() {
  try {
    console.log('🧪 Testing SendGrid Email functionality...');
    
    const response = await axios.post(`${BASE_URL}/api/companies/templates/${testTemplate.id}/test`, {
      companyId: testCompany.id,
      channel: 'email',
      testData: {
        companyName: 'Test Company',
        complianceType: 'BAS'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SendGrid Email Test Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ SendGrid Email Test Failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test Template Creation for SMS
 */
async function createSMSTemplate() {
  try {
    console.log('📝 Creating SMS template...');
    
    const response = await axios.post(`${BASE_URL}/api/companies/templates`, {
      type: 'sms',
      name: 'Test SMS Template',
      subject: '', // Not required for SMS
      body: 'Hello {companyName}, your {complianceType} is due in {daysLeft} days.',
      notificationTypes: ['BAS', 'FBT'],
      smsDays: [1, 7, 14], // Send SMS 1, 7, and 14 days before deadline
      emailDays: [] // Not applicable for SMS
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SMS Template Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ SMS Template Creation Failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test Template Creation for Email
 */
async function createEmailTemplate() {
  try {
    console.log('📝 Creating Email template...');
    
    const response = await axios.post(`${BASE_URL}/api/companies/templates`, {
      type: 'email',
      name: 'Test Email Template',
      subject: 'Compliance Reminder: {complianceType}',
      body: `Dear {companyName},

This is a reminder that your {complianceType} is due in {daysLeft} days.

Please ensure all required documentation is prepared and submitted on time.

Best regards,
Compliance Management Team`,
      notificationTypes: ['BAS', 'FBT', 'IAS'],
      smsDays: [], // Not applicable for email
      emailDays: [1, 3, 7, 14] // Send emails 1, 3, 7, and 14 days before deadline
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email Template Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Email Template Creation Failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test Notification Settings Configuration
 */
async function configureNotificationSettings() {
  try {
    console.log('⚙️ Configuring notification settings...');
    
    // Configure Twilio settings
    const twilioResponse = await axios.post(`${BASE_URL}/api/companies/notification-settings`, {
      type: 'twilio',
      config: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_PHONE_NUMBER
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Twilio Settings Configured:', twilioResponse.data);

    // Configure SendGrid settings
    const sendGridResponse = await axios.post(`${BASE_URL}/api/companies/notification-settings`, {
      type: 'smtp',
      config: {
        apiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        fromName: process.env.SENDGRID_FROM_NAME
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SendGrid Settings Configured:', sendGridResponse.data);
    
    return {
      twilio: twilioResponse.data,
      sendGrid: sendGridResponse.data
    };
  } catch (error) {
    console.error('❌ Notification Settings Configuration Failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  try {
    console.log('🚀 Starting notification testing...\n');

    // Step 1: Configure notification settings
    await configureNotificationSettings();
    console.log('\n');

    // Step 2: Create templates
    const smsTemplate = await createSMSTemplate();
    const emailTemplate = await createEmailTemplate();
    console.log('\n');

    // Step 3: Test SMS functionality
    await testTwilioSMS();
    console.log('\n');

    // Step 4: Test Email functionality
    await testSendGridEmail();
    console.log('\n');

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

/**
 * Individual test functions for manual testing
 */
async function testSMSOnly() {
  await testTwilioSMS();
}

async function testEmailOnly() {
  await testSendGridEmail();
}

async function testTemplateCreation() {
  await createSMSTemplate();
  await createEmailTemplate();
}

// Export functions for use in other test files
module.exports = {
  testTwilioSMS,
  testSendGridEmail,
  createSMSTemplate,
  createEmailTemplate,
  configureNotificationSettings,
  runAllTests,
  testSMSOnly,
  testEmailOnly,
  testTemplateCreation
};

// Run tests if this file is executed directly
if (require.main === module) {
  const testType = process.argv[2];
  
  switch (testType) {
    case 'sms':
      testSMSOnly();
      break;
    case 'email':
      testEmailOnly();
      break;
    case 'templates':
      testTemplateCreation();
      break;
    case 'settings':
      configureNotificationSettings();
      break;
    default:
      runAllTests();
  }
} 