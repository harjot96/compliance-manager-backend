#!/usr/bin/env node

/**
 * SendGrid Diagnostic Script
 * 
 * This script helps diagnose SendGrid configuration issues.
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
 * Test SendGrid configuration step by step
 */
async function diagnoseSendGrid() {
  try {
    console.log('🔍 Diagnosing SendGrid Configuration...\n');

    // Step 1: Get current configuration
    console.log('📋 Step 1: Checking current configuration...');
    const statusResponse = await makeRequest(
      `${BASE_URL}/api/companies/test/status`,
      { method: 'GET' }
    );

    if (statusResponse.status === 200) {
      const data = statusResponse.data.data;
      console.log('✅ Configuration Status:');
      console.log(`   SendGrid Configured: ${data.sendGrid.configured ? '✅' : '❌'}`);
      console.log(`   From Email: ${data.sendGrid.fromEmail}`);
      console.log(`   From Name: ${data.sendGrid.fromName}`);
      console.log(`   API Key: ${data.sendGrid.apiKeyConfigured ? '✅' : '❌'}`);
    } else {
      console.error('❌ Failed to get configuration status');
      return;
    }

    // Step 2: Test with a simple email template
    console.log('\n📧 Step 2: Testing email template...');
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

    console.log('📊 Test Response:');
    console.log(JSON.stringify(testResponse.data, null, 2));

    // Step 3: Provide troubleshooting steps
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('\n1. **Check SendGrid API Key**:');
    console.log('   - Go to https://app.sendgrid.com/settings/api_keys');
    console.log('   - Verify the API key is active and has "Mail Send" permissions');
    console.log('   - Make sure the key starts with "SG."');

    console.log('\n2. **Verify Sender Email**:');
    console.log('   - Go to https://app.sendgrid.com/settings/sender_auth');
    console.log('   - Verify that aicomplyhub@gmail.com is verified as a sender');
    console.log('   - Or set up domain authentication for better deliverability');

    console.log('\n3. **Check SendGrid Account Status**:');
    console.log('   - Ensure your SendGrid account is active');
    console.log('   - Check if you have any sending limits or restrictions');

    console.log('\n4. **Test with Different Email**:');
    console.log('   - Try using a different verified sender email');
    console.log('   - Or use a domain-authenticated email address');

    console.log('\n5. **Check SendGrid Logs**:');
    console.log('   - Go to https://app.sendgrid.com/activity');
    console.log('   - Look for any failed delivery attempts');
    console.log('   - Check for any authentication errors');

    // Step 4: Suggest alternative configuration
    console.log('\n💡 **Alternative Configuration**:');
    console.log('If the current configuration continues to fail, you can:');
    console.log('1. Create a new SendGrid API key with full access');
    console.log('2. Verify a new sender email address');
    console.log('3. Set up domain authentication for better deliverability');
    console.log('4. Use a different email service provider (like Mailgun or AWS SES)');

    return {
      status: statusResponse,
      test: testResponse
    };
  } catch (error) {
    console.error('❌ Diagnostic error:', error.message);
    throw error;
  }
}

/**
 * Test with different sender email
 */
async function testWithDifferentSender() {
  try {
    console.log('\n🧪 Testing with different sender configuration...');
    
    // This would require updating the SendGrid settings
    console.log('To test with a different sender, you would need to:');
    console.log('1. Update the SendGrid configuration with a new verified sender');
    console.log('2. Re-run the test');
    
    return;
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
📋 SendGrid Diagnostic Script

Usage:
  node diagnose-sendgrid.js [command]

Commands:
  diagnose  - Run full diagnosis (default)
  test      - Test with different sender
  help      - Show this help message

Environment Variables:
  ADMIN_TOKEN      - Admin authentication token
  API_BASE_URL     - API base URL (optional)

Example:
  ADMIN_TOKEN=your-token node diagnose-sendgrid.js
  `);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'diagnose';
  
  switch (command) {
    case 'diagnose':
      diagnoseSendGrid();
      break;
    case 'test':
      testWithDifferentSender();
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