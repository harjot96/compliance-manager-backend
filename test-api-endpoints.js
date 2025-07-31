#!/usr/bin/env node

/**
 * API Endpoints Test Script
 * 
 * This script demonstrates the new notification testing API endpoints
 * that can be consumed from your frontend.
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3333';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-admin-token-here';

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
 * Test API Endpoints
 */
async function testAPIEndpoints() {
  console.log('🧪 Testing Notification API Endpoints\n');

  // Test 1: Get Test Status
  console.log('1. Testing GET /api/companies/test/status');
  console.log('=' .repeat(60));
  try {
    const statusResponse = await makeRequest(`${BASE_URL}/api/companies/test/status`, { method: 'GET' });
    console.log('Status Code:', statusResponse.status);
    console.log('Response:', JSON.stringify(statusResponse.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n');

  // Test 2: Configure Twilio Settings
  console.log('2. Testing POST /api/companies/test/notification-settings (Twilio)');
  console.log('=' .repeat(60));
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
      `${BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      twilioConfig
    );
    console.log('Status Code:', twilioResponse.status);
    console.log('Response:', JSON.stringify(twilioResponse.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n');

  // Test 3: Configure SendGrid Settings
  console.log('3. Testing POST /api/companies/test/notification-settings (SendGrid)');
  console.log('=' .repeat(60));
  try {
    const sendGridConfig = {
      type: 'smtp',
      config: {
        apiKey: 'your_sendgrid_api_key_here',
        fromEmail: 'your-verified-email@yourdomain.com',
        fromName: 'Your Company Name'
      }
    };
    
    const sendGridResponse = await makeRequest(
      `${BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      sendGridConfig
    );
    console.log('Status Code:', sendGridResponse.status);
    console.log('Response:', JSON.stringify(sendGridResponse.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n');

  // Test 4: Test SMS
  console.log('4. Testing POST /api/companies/test/sms');
  console.log('=' .repeat(60));
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
      `${BASE_URL}/api/companies/test/sms`,
      { method: 'POST' },
      smsData
    );
    console.log('Status Code:', smsResponse.status);
    console.log('Response:', JSON.stringify(smsResponse.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n');

  // Test 5: Test Email
  console.log('5. Testing POST /api/companies/test/email');
  console.log('=' .repeat(60));
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
      `${BASE_URL}/api/companies/test/email`,
      { method: 'POST' },
      emailData
    );
    console.log('Status Code:', emailResponse.status);
    console.log('Response:', JSON.stringify(emailResponse.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n');
}

/**
 * Show API Documentation
 */
function showAPIDocumentation() {
  console.log('📚 API Endpoints Documentation');
  console.log('=' .repeat(60));
  
  console.log('\n🔗 Available Endpoints:');
  console.log('1. GET  /api/companies/test/status');
  console.log('2. POST /api/companies/test/notification-settings');
  console.log('3. POST /api/companies/test/sms');
  console.log('4. POST /api/companies/test/email');
  
  console.log('\n📋 Request Examples:');
  
  console.log('\n1. Get Test Status:');
  console.log('GET /api/companies/test/status');
  console.log('Headers: Authorization: Bearer <token>');
  
  console.log('\n2. Configure Twilio:');
  console.log('POST /api/companies/test/notification-settings');
  console.log('Body:');
  console.log(JSON.stringify({
    type: 'twilio',
    config: {
      accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      authToken: 'your_auth_token',
      fromNumber: '+1234567890'
    }
  }, null, 2));
  
  console.log('\n3. Configure SendGrid:');
  console.log('POST /api/companies/test/notification-settings');
  console.log('Body:');
  console.log(JSON.stringify({
    type: 'smtp',
    config: {
      apiKey: 'your_api_key',
      fromEmail: 'your_email@domain.com',
      fromName: 'Your Company'
    }
  }, null, 2));
  
  console.log('\n4. Test SMS:');
  console.log('POST /api/companies/test/sms');
  console.log('Body:');
  console.log(JSON.stringify({
    companyId: 1,
    templateId: 1,
    testData: {
      companyName: 'Test Company',
      complianceType: 'BAS',
      daysLeft: 7
    }
  }, null, 2));
  
  console.log('\n5. Test Email:');
  console.log('POST /api/companies/test/email');
  console.log('Body:');
  console.log(JSON.stringify({
    companyId: 1,
    templateId: 2,
    testData: {
      companyName: 'Test Company',
      complianceType: 'BAS',
      daysLeft: 7
    }
  }, null, 2));
  
  console.log('\n🎯 Frontend Integration:');
  console.log('These endpoints can be consumed from your React/Vue/Angular frontend');
  console.log('using fetch() or axios for HTTP requests.');
  console.log('See NOTIFICATION_API.md for complete documentation.');
}

// Run tests
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'docs') {
    showAPIDocumentation();
  } else {
    testAPIEndpoints();
  }
} 