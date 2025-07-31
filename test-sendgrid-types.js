#!/usr/bin/env node

/**
 * Test SendGrid Types
 * 
 * This script tests that both 'sendgrid' and 'smtp' types are handled correctly.
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';
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
 * Test SendGrid with 'sendgrid' type
 */
async function testSendGridType() {
  try {
    console.log('🧪 Testing SendGrid with type: "sendgrid"');
    console.log('=' .repeat(50));
    
    const sendGridConfig = {
      type: 'sendgrid',  // Using 'sendgrid' type
      config: {
        apiKey: 'SG.your_sendgrid_api_key_here',
        fromEmail: 'aicomplyhub@gmail.com',
        fromName: 'aicomplyhub'
      }
    };
    
    console.log('📧 SendGrid Configuration (type: sendgrid):');
    console.log(`Type: ${sendGridConfig.type}`);
    console.log(`API Key: ${sendGridConfig.config.apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`From Email: ${sendGridConfig.config.fromEmail}`);
    console.log(`From Name: ${sendGridConfig.config.fromName}`);
    console.log('');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/settings`,
      { method: 'POST' },
      sendGridConfig
    );
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201 || response.status === 200) {
      console.log('✅ SendGrid with "sendgrid" type configured successfully!');
    } else {
      console.log('❌ Failed to configure SendGrid with "sendgrid" type');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error testing SendGrid with "sendgrid" type:', error.message);
    throw error;
  }
}

/**
 * Test SendGrid with 'smtp' type
 */
async function testSmtpType() {
  try {
    console.log('🧪 Testing SendGrid with type: "smtp"');
    console.log('=' .repeat(50));
    
    const sendGridConfig = {
      type: 'smtp',  // Using 'smtp' type
      config: {
        apiKey: 'SG.your_sendgrid_api_key_here',
        fromEmail: 'aicomplyhub@gmail.com',
        fromName: 'aicomplyhub'
      }
    };
    
    console.log('📧 SendGrid Configuration (type: smtp):');
    console.log(`Type: ${sendGridConfig.type}`);
    console.log(`API Key: ${sendGridConfig.config.apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`From Email: ${sendGridConfig.config.fromEmail}`);
    console.log(`From Name: ${sendGridConfig.config.fromName}`);
    console.log('');
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/settings`,
      { method: 'POST' },
      sendGridConfig
    );
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201 || response.status === 200) {
      console.log('✅ SendGrid with "smtp" type configured successfully!');
    } else {
      console.log('❌ Failed to configure SendGrid with "smtp" type');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error testing SendGrid with "smtp" type:', error.message);
    throw error;
  }
}

/**
 * Check current settings
 */
async function checkSettings() {
  try {
    console.log('📊 Checking Current Settings...');
    console.log('=' .repeat(50));
    
    const response = await makeRequest(
      `${BASE_URL}/api/companies/settings`,
      { method: 'GET' }
    );
    
    console.log('Status Code:', response.status);
    console.log('Current Settings:', JSON.stringify(response.data, null, 2));
    
    return response;
  } catch (error) {
    console.error('❌ Error checking settings:', error.message);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'sendgrid':
      testSendGridType();
      break;
      
    case 'smtp':
      testSmtpType();
      break;
      
    case 'check':
      checkSettings();
      break;
      
    case 'both':
      console.log('🧪 Testing Both SendGrid Types...\n');
      testSendGridType().then(() => {
        console.log('\n');
        return testSmtpType();
      });
      break;
      
    default:
      console.log('SendGrid Types Test');
      console.log('=' .repeat(50));
      console.log('');
      console.log('Commands:');
      console.log('  sendgrid  - Test with type: "sendgrid"');
      console.log('  smtp      - Test with type: "smtp"');
      console.log('  both      - Test both types');
      console.log('  check     - Check current settings');
      console.log('');
      console.log('Example:');
      console.log('  node test-sendgrid-types.js sendgrid');
      break;
  }
} 