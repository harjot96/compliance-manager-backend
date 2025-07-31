#!/usr/bin/env node

/**
 * Simple Notification Testing Script
 * 
 * This script demonstrates how to test both Twilio SMS and SendGrid email functionality
 * using Node.js built-in modules (no external dependencies required).
 */

const https = require('https');
const http = require('http');

// Configuration - Update these values
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-admin-token-here';

// Test data - Update these with actual values
const TEST_COMPANY_ID = 1; // Replace with actual company ID
const TEST_TEMPLATE_ID = 1; // Replace with actual template ID

/**
 * Make HTTP request
 */
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(body)
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Test Twilio SMS Functionality
 */
async function testTwilioSMS() {
  try {
    console.log('🧪 Testing Twilio SMS functionality...');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/templates/${TEST_TEMPLATE_ID}/test`,
      { method: 'POST' },
      {
        companyId: TEST_COMPANY_ID,
        channel: 'sms',
        testData: {
          companyName: 'Test Company',
          complianceType: 'BAS'
        }
      }
    );

    if (response.status === 200) {
      console.log('✅ Twilio SMS Test Result:', response.data);
    } else {
      console.error('❌ Twilio SMS Test Failed:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Twilio SMS Test Error:', error.message);
    throw error;
  }
}

/**
 * Test SendGrid Email Functionality
 */
async function testSendGridEmail() {
  try {
    console.log('🧪 Testing SendGrid Email functionality...');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/templates/${TEST_TEMPLATE_ID}/test`,
      { method: 'POST' },
      {
        companyId: TEST_COMPANY_ID,
        channel: 'email',
        testData: {
          companyName: 'Test Company',
          complianceType: 'BAS'
        }
      }
    );

    if (response.status === 200) {
      console.log('✅ SendGrid Email Test Result:', response.data);
    } else {
      console.error('❌ SendGrid Email Test Failed:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ SendGrid Email Test Error:', error.message);
    throw error;
  }
}

/**
 * Test Template Creation for SMS
 */
async function createSMSTemplate() {
  try {
    console.log('📝 Creating SMS template...');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/templates`,
      { method: 'POST' },
      {
        type: 'sms',
        name: 'Test SMS Template',
        subject: '', // Not required for SMS
        body: 'Hello {companyName}, your {complianceType} is due in {daysLeft} days.',
        notificationTypes: ['BAS', 'FBT'],
        smsDays: [1, 7, 14], // Send SMS 1, 7, and 14 days before deadline
        emailDays: [] // Not applicable for SMS
      }
    );

    if (response.status === 201) {
      console.log('✅ SMS Template Created:', response.data);
    } else {
      console.error('❌ SMS Template Creation Failed:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ SMS Template Creation Error:', error.message);
    throw error;
  }
}

/**
 * Test Template Creation for Email
 */
async function createEmailTemplate() {
  try {
    console.log('📝 Creating Email template...');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/templates`,
      { method: 'POST' },
      {
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
      }
    );

    if (response.status === 201) {
      console.log('✅ Email Template Created:', response.data);
    } else {
      console.error('❌ Email Template Creation Failed:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Email Template Creation Error:', error.message);
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
    const twilioResponse = await makeRequest(
      `${BASE_URL}/api/companies/notification-settings`,
      { method: 'POST' },
      {
        type: 'twilio',
        config: {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          fromNumber: process.env.TWILIO_PHONE_NUMBER
        }
      }
    );

    if (twilioResponse.status === 201) {
      console.log('✅ Twilio Settings Configured:', twilioResponse.data);
    } else {
      console.error('❌ Twilio Settings Configuration Failed:', twilioResponse.data);
    }

    // Configure SendGrid settings
    const sendGridResponse = await makeRequest(
      `${BASE_URL}/api/companies/notification-settings`,
      { method: 'POST' },
      {
        type: 'smtp',
        config: {
          apiKey: process.env.SENDGRID_API_KEY,
          fromEmail: process.env.SENDGRID_FROM_EMAIL,
          fromName: process.env.SENDGRID_FROM_NAME
        }
      }
    );

    if (sendGridResponse.status === 201) {
      console.log('✅ SendGrid Settings Configured:', sendGridResponse.data);
    } else {
      console.error('❌ SendGrid Settings Configuration Failed:', sendGridResponse.data);
    }
    
    return {
      twilio: twilioResponse,
      sendGrid: sendGridResponse
    };
  } catch (error) {
    console.error('❌ Notification Settings Configuration Error:', error.message);
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
    await createSMSTemplate();
    await createEmailTemplate();
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
 * Show usage instructions
 */
function showUsage() {
  console.log(`
📋 Notification Testing Script

Usage:
  node test-notifications.js [command]

Commands:
  sms          - Test Twilio SMS functionality only
  email        - Test SendGrid Email functionality only
  templates    - Create test templates only
  settings     - Configure notification settings only
  all          - Run all tests (default)

Environment Variables:
  API_BASE_URL     - API base URL (default: http://localhost:3000)
  ADMIN_TOKEN      - Admin authentication token
  TWILIO_ACCOUNT_SID - Twilio Account SID
  TWILIO_AUTH_TOKEN  - Twilio Auth Token
  TWILIO_PHONE_NUMBER - Twilio Phone Number
  SENDGRID_API_KEY    - SendGrid API Key
  SENDGRID_FROM_EMAIL - SendGrid From Email
  SENDGRID_FROM_NAME  - SendGrid From Name

Example:
  ADMIN_TOKEN=your-token node test-notifications.js sms
  `);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'all';
  
  switch (command) {
    case 'sms':
      testTwilioSMS();
      break;
    case 'email':
      testSendGridEmail();
      break;
    case 'templates':
      createSMSTemplate().then(() => createEmailTemplate());
      break;
    case 'settings':
      configureNotificationSettings();
      break;
    case 'all':
      runAllTests();
      break;
    case 'help':
    case '--help':
    case '-h':
      showUsage();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      showUsage();
  }
} 