#!/usr/bin/env node

/**
 * SendGrid UI Configuration Script
 * 
 * This script helps configure SendGrid settings from the UI
 * using the API endpoints we created.
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
 * Configure SendGrid Settings
 */
async function configureSendGrid(apiKey, fromEmail, fromName) {
  try {
    console.log('⚙️ Configuring SendGrid Settings...');
    console.log('=' .repeat(50));
    
    const sendGridConfig = {
      type: 'smtp',
      config: {
        apiKey: apiKey,
        fromEmail: fromEmail,
        fromName: fromName
      }
    };
    
    console.log('📧 SendGrid Configuration:');
    console.log(`API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`From Email: ${fromEmail || '❌ Missing'}`);
    console.log(`From Name: ${fromName || '❌ Missing'}`);
    console.log('');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      sendGridConfig
    );
    
    if (response.status === 201) {
      console.log('✅ SendGrid Settings Configured Successfully!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Failed to configure SendGrid settings');
      console.log('Error:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error configuring SendGrid:', error.message);
    throw error;
  }
}

/**
 * Test SendGrid Email
 */
async function testSendGridEmail(companyId = 1, templateId = 2) {
  try {
    console.log('📧 Testing SendGrid Email...');
    console.log('=' .repeat(50));
    
    const emailData = {
      companyId: companyId,
      templateId: templateId,
      testData: {
        companyName: 'Test Company',
        complianceType: 'BAS',
        daysLeft: 7
      }
    };
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/test/email`,
      { method: 'POST' },
      emailData
    );
    
    if (response.status === 200) {
      console.log('✅ Email Test Successful!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Email Test Failed');
      console.log('Error:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
    throw error;
  }
}

/**
 * Check SendGrid Status
 */
async function checkSendGridStatus() {
  try {
    console.log('📊 Checking SendGrid Status...');
    console.log('=' .repeat(50));
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/test/status`,
      { method: 'GET' }
    );
    
    if (response.status === 200) {
      const sendGridStatus = response.data.data?.sendGrid;
      console.log('SendGrid Configuration Status:');
      console.log(`Configured: ${sendGridStatus?.configured ? '✅ Yes' : '❌ No'}`);
      console.log(`From Email: ${sendGridStatus?.fromEmail || 'Not set'}`);
      console.log(`From Name: ${sendGridStatus?.fromName || 'Not set'}`);
      console.log(`API Key: ${sendGridStatus?.apiKeyConfigured ? '✅ Set' : '❌ Not set'}`);
    } else {
      console.log('❌ Failed to get status');
      console.log('Error:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    throw error;
  }
}

/**
 * Show UI Configuration Guide
 */
function showUIConfigurationGuide() {
  console.log('🎨 SendGrid UI Configuration Guide');
  console.log('=' .repeat(50));
  
  console.log('\n📋 Steps to Configure SendGrid from UI:');
  console.log('');
  console.log('1. Get SendGrid API Key:');
  console.log('   - Log into your SendGrid account');
  console.log('   - Go to Settings > API Keys');
  console.log('   - Create new API Key with "Mail Send" permissions');
  console.log('   - Copy the API Key');
  console.log('');
  console.log('2. Verify Sender Email:');
  console.log('   - In SendGrid, go to Settings > Sender Authentication');
  console.log('   - Verify your sender email address');
  console.log('   - Use this verified email as your "From Email"');
  console.log('');
  console.log('3. Fill in the UI Fields:');
  console.log('   - API Key: Paste your SendGrid API key');
  console.log('   - From Email: Enter your verified sender email');
  console.log('   - From Name: Enter your company name');
  console.log('');
  console.log('4. Test the Configuration:');
  console.log('   - Use the test endpoints to verify everything works');
  console.log('');
  console.log('🔧 API Configuration Commands:');
  console.log('');
  console.log('# Configure SendGrid via API');
  console.log('node configure-sendgrid-ui.js config <api_key> <from_email> <from_name>');
  console.log('');
  console.log('# Test SendGrid Email');
  console.log('node configure-sendgrid-ui.js test');
  console.log('');
  console.log('# Check SendGrid Status');
  console.log('node configure-sendgrid-ui.js status');
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'config':
      const apiKey = process.argv[3];
      const fromEmail = process.argv[4];
      const fromName = process.argv[5];
      
      if (!apiKey || !fromEmail || !fromName) {
        console.log('❌ Missing parameters');
        console.log('Usage: node configure-sendgrid-ui.js config <api_key> <from_email> <from_name>');
        process.exit(1);
      }
      
      configureSendGrid(apiKey, fromEmail, fromName);
      break;
      
    case 'test':
      testSendGridEmail();
      break;
      
    case 'status':
      checkSendGridStatus();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showUIConfigurationGuide();
      break;
      
    default:
      console.log('SendGrid UI Configuration Tool');
      console.log('=' .repeat(50));
      console.log('');
      console.log('Commands:');
      console.log('  config <api_key> <from_email> <from_name>  - Configure SendGrid settings');
      console.log('  test                                        - Test SendGrid email');
      console.log('  status                                      - Check SendGrid status');
      console.log('  help                                        - Show configuration guide');
      console.log('');
      console.log('Example:');
      console.log('  node configure-sendgrid-ui.js config SG.your_api_key your@email.com "Your Company"');
      break;
  }
} 