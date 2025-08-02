#!/usr/bin/env node

/**
 * SendGrid Configuration Script
 * 
 * This script helps configure SendGrid settings for the notification system.
 * It will either use environment variables or prompt for manual configuration.
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
 * Configure SendGrid settings
 */
async function configureSendGrid() {
  try {
    console.log('🔧 Configuring SendGrid settings...\n');

    // Check if environment variables are available
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    const fromName = process.env.SENDGRID_FROM_NAME;

    if (!apiKey || !fromEmail || !fromName) {
      console.log('❌ SendGrid environment variables not found.');
      console.log('\n📋 Please set the following environment variables:');
      console.log('   SENDGRID_API_KEY=your_sendgrid_api_key');
      console.log('   SENDGRID_FROM_EMAIL=your_verified_sender_email');
      console.log('   SENDGRID_FROM_NAME=Your Company Name');
      console.log('\n💡 You can get these from your SendGrid dashboard:');
      console.log('   1. API Key: https://app.sendgrid.com/settings/api_keys');
      console.log('   2. Sender Verification: https://app.sendgrid.com/settings/sender_auth');
      console.log('\n🚀 After setting the environment variables, run this script again.');
      return;
    }

    console.log('✅ SendGrid environment variables found:');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`   From Email: ${fromEmail}`);
    console.log(`   From Name: ${fromName}`);

    // Configure SendGrid settings via API
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
      console.log('\n✅ SendGrid settings configured successfully!');
      console.log('📧 You can now test email notifications.');
    } else {
      console.error('\n❌ Failed to configure SendGrid settings:');
      console.error(response.data);
    }

    return response;
  } catch (error) {
    console.error('❌ SendGrid configuration error:', error.message);
    throw error;
  }
}

/**
 * Test SendGrid configuration
 */
async function testSendGrid() {
  try {
    console.log('\n🧪 Testing SendGrid configuration...');

    // Get test status
    const statusResponse = await makeRequest(
      `${BASE_URL}/api/companies/test/status`,
      { method: 'GET' }
    );

    if (statusResponse.status === 200) {
      console.log('\n📊 Response Data:');
      console.log(JSON.stringify(statusResponse.data, null, 2));
      
      const data = statusResponse.data.data || statusResponse.data;
      console.log('\n📊 Current Configuration Status:');
      
      if (data.sendGrid) {
        console.log(`   SendGrid Configured: ${data.sendGrid.configured ? '✅' : '❌'}`);
        console.log(`   From Email: ${data.sendGrid.fromEmail || 'Not set'}`);
        console.log(`   From Name: ${data.sendGrid.fromName || 'Not set'}`);
        console.log(`   API Key: ${data.sendGrid.apiKeyConfigured ? '✅' : '❌'}`);
      } else {
        console.log('   SendGrid: Not configured');
      }

      if (data.companies && data.companies.length > 0) {
        console.log('\n🏢 Available Companies for Testing:');
        data.companies.forEach(company => {
          console.log(`   ID: ${company.id}, Name: ${company.companyName}`);
          console.log(`   Email: ${company.email || 'Not set'}`);
          console.log(`   Phone: ${company.mobileNumber || 'Not set'}`);
          console.log('');
        });
      }

      if (data.templates && data.templates.length > 0) {
        console.log('\n📝 Available Templates for Testing:');
        data.templates.forEach(template => {
          console.log(`   ID: ${template.id}, Name: ${template.name}, Type: ${template.type}`);
        });
      }
    } else {
      console.error('❌ Failed to get test status:', statusResponse.data);
    }

    return statusResponse;
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
📋 SendGrid Configuration Script

Usage:
  node configure-sendgrid.js [command]

Commands:
  configure  - Configure SendGrid settings (default)
  test       - Test current SendGrid configuration
  status     - Show current configuration status
  help       - Show this help message

Environment Variables Required:
  SENDGRID_API_KEY     - Your SendGrid API Key
  SENDGRID_FROM_EMAIL  - Your verified sender email
  SENDGRID_FROM_NAME   - Your sender name
  ADMIN_TOKEN          - Admin authentication token
  API_BASE_URL         - API base URL (optional)

Example:
  SENDGRID_API_KEY=SG.xxx SENDGRID_FROM_EMAIL=test@example.com SENDGRID_FROM_NAME="Test Company" node configure-sendgrid.js
  `);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'configure';
  
  switch (command) {
    case 'configure':
      configureSendGrid();
      break;
    case 'test':
      testSendGrid();
      break;
    case 'status':
      testSendGrid();
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