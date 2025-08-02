#!/usr/bin/env node

/**
 * Update SendGrid Configuration Script
 * 
 * This script helps update SendGrid settings with new credentials.
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.API_BASE_URL || 'https://compliance-manager-backend.onrender.com';
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
 * Update SendGrid configuration
 */
async function updateSendGridConfig() {
  try {
    console.log('🔧 Updating SendGrid Configuration...\n');

    // Get new configuration from environment variables
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    const fromName = process.env.SENDGRID_FROM_NAME;

    if (!apiKey || !fromEmail || !fromName) {
      console.log('❌ SendGrid environment variables not found.');
      console.log('\n📋 Please set the following environment variables:');
      console.log('   SENDGRID_API_KEY=your_new_sendgrid_api_key');
      console.log('   SENDGRID_FROM_EMAIL=your_verified_sender_email');
      console.log('   SENDGRID_FROM_NAME=Your Company Name');
      console.log('\n💡 Make sure to:');
      console.log('   1. Use a valid SendGrid API key that starts with "SG."');
      console.log('   2. Use a verified sender email address');
      console.log('   3. Verify the sender email in SendGrid dashboard');
      console.log('\n🚀 After setting the environment variables, run this script again.');
      return;
    }

    console.log('✅ New SendGrid configuration found:');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`   From Email: ${fromEmail}`);
    console.log(`   From Name: ${fromName}`);

    // Update SendGrid settings via API
    const response = await makeRequest(
      `${BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      {
        type: 'smtp',
        config: {
          apiKey: apiKey,
          fromEmail: fromEmail,
          fromName: fromName
        }
      }
    );

    if (response.status === 201) {
      console.log('\n✅ SendGrid settings updated successfully!');
      console.log('📧 You can now test email notifications.');
      
      // Test the new configuration
      console.log('\n🧪 Testing new configuration...');
      await testNewConfiguration();
    } else {
      console.error('\n❌ Failed to update SendGrid settings:');
      console.error(response.data);
    }

    return response;
  } catch (error) {
    console.error('❌ SendGrid update error:', error.message);
    throw error;
  }
}

/**
 * Test the new configuration
 */
async function testNewConfiguration() {
  try {
    // Test with email template
    const testResponse = await makeRequest(
      `${BASE_URL}/api/companies/templates/1/test`,
      { method: 'POST' },
      {
        companyId: 1,
        channel: 'email',
        testData: {
          companyName: 'Test Company',
          complianceType: 'BAS',
          daysLeft: '2'
        }
      }
    );

    if (testResponse.status === 200) {
      console.log('✅ Email test successful!');
      console.log('📧 Email sent successfully with new configuration.');
    } else {
      console.error('❌ Email test failed:');
      console.error(testResponse.data);
      
      if (testResponse.data.error === 'Forbidden') {
        console.log('\n🔧 Still getting "Forbidden" error. Please check:');
        console.log('   1. API key is valid and has "Mail Send" permissions');
        console.log('   2. Sender email is verified in SendGrid');
        console.log('   3. SendGrid account is active and not restricted');
      }
    }

    return testResponse;
  } catch (error) {
    console.error('❌ Test error:', error.message);
    throw error;
  }
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log(`
📋 SendGrid Configuration Update Script

Usage:
  node update-sendgrid-config.js [command]

Commands:
  update  - Update SendGrid configuration (default)
  test    - Test current configuration
  help    - Show this help message

Environment Variables Required:
  SENDGRID_API_KEY     - Your new SendGrid API Key
  SENDGRID_FROM_EMAIL  - Your verified sender email
  SENDGRID_FROM_NAME   - Your sender name
  ADMIN_TOKEN          - Admin authentication token
  API_BASE_URL         - API base URL (optional)

Example:
  SENDGRID_API_KEY=SG.xxx SENDGRID_FROM_EMAIL=test@example.com SENDGRID_FROM_NAME="Test Company" node update-sendgrid-config.js
  `);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'update';
  
  switch (command) {
    case 'update':
      updateSendGridConfig();
      break;
    case 'test':
      testNewConfiguration();
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