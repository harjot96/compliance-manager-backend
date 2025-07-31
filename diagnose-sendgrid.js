#!/usr/bin/env node

/**
 * SendGrid Diagnostic Script
 * Helps troubleshoot SendGrid configuration issues
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://compliance-manager-backend.onrender.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your_admin_token_here';

console.log('🔍 SendGrid Diagnostic Script');
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

async function checkCurrentSettings() {
  console.log('📊 Step 1: Checking Current Settings');
  console.log('=' .repeat(50));

  try {
    const statusResponse = await makeRequest(
      `${API_BASE_URL}/api/companies/test/status`,
      { method: 'GET' }
    );
    
    console.log('Status Code:', statusResponse.status);
    console.log('Response:', JSON.stringify(statusResponse.data, null, 2));
    
    if (statusResponse.data.success) {
      const settings = statusResponse.data.data;
      console.log('\n📋 Current Configuration:');
      console.log('- SendGrid Configured:', settings.sendgrid?.configured || false);
      console.log('- From Email:', settings.sendgrid?.fromEmail || 'Not set');
      console.log('- From Name:', settings.sendgrid?.fromName || 'Not set');
      console.log('- API Key Status:', settings.sendgrid?.apiKeyConfigured ? '✅ Configured' : '❌ Not configured');
    }
  } catch (error) {
    console.log('❌ Error checking settings:', error.message);
  }
}

async function testSendGridConfiguration() {
  console.log('\n🔧 Step 2: Testing SendGrid Configuration');
  console.log('=' .repeat(50));

  // Test with your actual SendGrid credentials
  const sendGridConfig = {
    type: 'sendgrid',
    config: {
      apiKey: 'YOUR_SENDGRID_API_KEY_HERE',
      fromEmail: 'aicomplyhub@gmail.com',
      fromName: 'aicomplyhub'
    }
  };

  try {
    const response = await makeRequest(
      `${API_BASE_URL}/api/companies/test/notification-settings`,
      { method: 'POST' },
      sendGridConfig
    );
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201) {
      console.log('✅ SendGrid configuration saved successfully');
    } else {
      console.log('❌ SendGrid configuration failed');
    }
  } catch (error) {
    console.log('❌ Error configuring SendGrid:', error.message);
  }
}

async function testEmailSending() {
  console.log('\n📧 Step 3: Testing Email Sending');
  console.log('=' .repeat(50));

  const emailData = {
    companyId: 1,
    templateId: 7,
    testData: {
      companyName: 'Test Company',
      complianceType: 'BAS',
      daysLeft: 7
    }
  };

  try {
    const response = await makeRequest(
      `${API_BASE_URL}/api/companies/test/email`,
      { method: 'POST' },
      emailData
    );
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Email sent successfully');
    } else {
      console.log('❌ Email sending failed');
      console.log('Error:', response.data.error);
      
      // Provide troubleshooting tips based on the error
      if (response.data.error === 'Forbidden') {
        console.log('\n🔧 Troubleshooting Tips for "Forbidden" Error:');
        console.log('1. Check if your SendGrid API key is valid');
        console.log('2. Verify the API key has "Mail Send" permissions');
        console.log('3. Ensure the "from" email is verified in SendGrid');
        console.log('4. Check if your SendGrid account is active');
        console.log('5. Verify the API key format starts with "SG."');
      }
    }
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
  }
}

async function testTemplateEmail() {
  console.log('\n📧 Step 4: Testing Template Email (Your Original Request)');
  console.log('=' .repeat(50));

  const templateData = {
    companyId: 1,
    channel: 'email',
    testData: {}
  };

  try {
    const response = await makeRequest(
      `${API_BASE_URL}/api/companies/templates/7/test`,
      { method: 'POST' },
      templateData
    );
    
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Template email sent successfully');
    } else {
      console.log('❌ Template email sending failed');
      console.log('Error:', response.data.error);
    }
  } catch (error) {
    console.log('❌ Error testing template email:', error.message);
  }
}

async function provideSolutions() {
  console.log('\n💡 Step 5: Solutions for SendGrid Issues');
  console.log('=' .repeat(50));

  console.log('\n🔧 Common Solutions:');
  console.log('1. **API Key Issues**:');
  console.log('   - Generate a new API key in SendGrid dashboard');
  console.log('   - Ensure it has "Mail Send" permissions');
  console.log('   - Copy the full key (starts with "SG.")');
  
  console.log('\n2. **Email Verification**:');
  console.log('   - Verify "aicomplyhub@gmail.com" in SendGrid');
  console.log('   - Go to Settings > Sender Authentication');
  console.log('   - Complete domain authentication if needed');
  
  console.log('\n3. **Account Status**:');
  console.log('   - Check if your SendGrid account is active');
  console.log('   - Verify billing status');
  console.log('   - Check sending limits');
  
  console.log('\n4. **Configuration Steps**:');
  console.log('   - Use the test script to configure SendGrid');
  console.log('   - Replace placeholder credentials with real ones');
  console.log('   - Test with a simple email first');
  
  console.log('\n5. **Alternative Testing**:');
  console.log('   - Try sending to a different email address');
  console.log('   - Use a different template ID');
  console.log('   - Test with minimal testData');
}

async function runDiagnostics() {
  try {
    await checkCurrentSettings();
    await testSendGridConfiguration();
    await testEmailSending();
    await testTemplateEmail();
    await provideSolutions();
    
    console.log('\n🎯 Diagnostic Complete!');
    console.log('Check the output above for specific issues and solutions.');
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

// Run diagnostics if this file is executed directly
if (require.main === module) {
  runDiagnostics();
}

module.exports = {
  makeRequest,
  checkCurrentSettings,
  testSendGridConfiguration,
  testEmailSending,
  testTemplateEmail,
  provideSolutions,
  runDiagnostics
}; 