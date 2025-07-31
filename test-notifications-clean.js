#!/usr/bin/env node

/**
 * Clean Notification Testing Script
 * Tests SendGrid and Twilio functionality without sensitive data
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://compliance-manager-backend.onrender.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your_admin_token_here';

console.log('🧪 Clean Notification Testing Script');
console.log('=' .repeat(50));
console.log(`API Base URL: ${API_BASE_URL}`);
console.log(`Admin Token: ${ADMIN_TOKEN.substring(0, 10)}...`);
console.log('');

// Helper function to make HTTP requests
function makeRequest(url, options = {}, data = null) {
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

    if (data) {
      const postData = JSON.stringify(data);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(requestOptions, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData
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

async function testNotificationSettings() {
  console.log('🔧 Testing Notification Settings Configuration');
  console.log('=' .repeat(50));

  // Test 1: Configure Twilio
  console.log('\n1. Testing Twilio Configuration...');
  try {
    const twilioConfig = {
      type: 'twilio',
      config: {
        accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        authToken: 'your_twilio_auth_token_here',
        fromNumber: '+1234567890'
      }
    };
    
    const twilioResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      twilioConfig
    );
    console.log('✅ Twilio Configuration Test:', twilioResponse.status === 201 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(twilioResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Twilio Configuration Error:', error.message);
  }

  // Test 2: Configure SendGrid with "sendgrid" type
  console.log('\n2. Testing SendGrid Configuration (type: "sendgrid")...');
  try {
    const sendGridConfig = {
      type: 'sendgrid',
      config: {
        apiKey: 'SG.your_sendgrid_api_key_here',
        fromEmail: 'your-verified-email@domain.com',
        fromName: 'Your Company Name'
      }
    };
    
    const sendGridResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      sendGridConfig
    );
    console.log('✅ SendGrid Configuration Test (sendgrid):', sendGridResponse.status === 201 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(sendGridResponse.data, null, 2));
  } catch (error) {
    console.log('❌ SendGrid Configuration Error:', error.message);
  }

  // Test 3: Configure SendGrid with "smtp" type
  console.log('\n3. Testing SendGrid Configuration (type: "smtp")...');
  try {
    const sendGridConfig = {
      type: 'smtp',
      config: {
        apiKey: 'SG.your_sendgrid_api_key_here',
        fromEmail: 'your-verified-email@domain.com',
        fromName: 'Your Company Name'
      }
    };
    
    const sendGridResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      sendGridConfig
    );
    console.log('✅ SendGrid Configuration Test (smtp):', sendGridResponse.status === 201 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(sendGridResponse.data, null, 2));
  } catch (error) {
    console.log('❌ SendGrid Configuration Error:', error.message);
  }
}

async function testNotificationSending() {
  console.log('\n📧 Testing Notification Sending');
  console.log('=' .repeat(50));

  // Test SMS
  console.log('\n1. Testing SMS Sending...');
  try {
    const smsData = {
      companyId: 1,
      templateId: 1,
      testData: {
        companyName: 'Test Company',
        complianceType: 'BAS',
        daysLeft: 7
      }
    };
    
    const smsResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/sms`,
      { method: 'POST' },
      smsData
    );
    console.log('✅ SMS Test:', smsResponse.status === 200 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(smsResponse.data, null, 2));
  } catch (error) {
    console.log('❌ SMS Test Error:', error.message);
  }

  // Test Email
  console.log('\n2. Testing Email Sending...');
  try {
    const emailData = {
      companyId: 1,
      templateId: 2,
      testData: {
        companyName: 'Test Company',
        complianceType: 'BAS',
        daysLeft: 7
      }
    };
    
    const emailResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/email`,
      { method: 'POST' },
      emailData
    );
    console.log('✅ Email Test:', emailResponse.status === 200 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(emailResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Email Test Error:', error.message);
  }
}

async function testStatus() {
  console.log('\n📊 Testing Status Endpoint');
  console.log('=' .repeat(50));

  try {
    const statusResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/status`,
      { method: 'GET' }
    );
    console.log('✅ Status Test:', statusResponse.status === 200 ? 'SUCCESS' : 'FAILED');
    console.log('Response:', JSON.stringify(statusResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Status Test Error:', error.message);
  }
}

async function runTests() {
  try {
    await testNotificationSettings();
    await testNotificationSending();
    await testStatus();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Notes:');
    console.log('- Replace placeholder credentials with real ones');
    console.log('- Both "sendgrid" and "smtp" types work for SendGrid');
    console.log('- Check the response messages for detailed information');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  makeRequest,
  testNotificationSettings,
  testNotificationSending,
  testStatus,
  runTests
}; 