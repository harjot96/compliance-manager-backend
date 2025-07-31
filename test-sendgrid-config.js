#!/usr/bin/env node

/**
 * Test SendGrid Configuration
 * 
 * This script configures SendGrid with the correct payload structure.
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
 * Configure SendGrid with correct payload
 */
async function configureSendGrid() {
  try {
    console.log('⚙️ Configuring SendGrid Settings...');
    console.log('=' .repeat(50));
    
    // Correct payload structure
    const sendGridConfig = {
      type: 'smtp',  // Changed from 'sendgrid' to 'smtp'
      config: {
        apiKey: 'SG.your_sendgrid_api_key_here',
        fromEmail: 'aicomplyhub@gmail.com',
        fromName: 'aicomplyhub'
      }
    };
    
    console.log('📧 SendGrid Configuration:');
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
      console.log('✅ SendGrid Settings Configured Successfully!');
    } else {
      console.log('❌ Failed to configure SendGrid settings');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error configuring SendGrid:', error.message);
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
    case 'config':
      configureSendGrid();
      break;
      
    case 'check':
      checkSettings();
      break;
      
    default:
      console.log('SendGrid Configuration Test');
      console.log('=' .repeat(50));
      console.log('');
      console.log('Commands:');
      console.log('  config  - Configure SendGrid with correct payload');
      console.log('  check   - Check current settings');
      console.log('');
      console.log('Example:');
      console.log('  node test-sendgrid-config.js config');
      break;
  }
} 