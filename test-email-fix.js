#!/usr/bin/env node

/**
 * Test Email Fix Script
 * 
 * This script tests the email functionality with fallback simulation.
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
 * Test email functionality
 */
async function testEmailFix() {
  try {
    console.log('🧪 Testing Email Fix...\n');

    // Test 1: Test with template ID 1 (email template)
    console.log('📧 Test 1: Testing with email template...');
    const test1 = await makeRequest(
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

    console.log('📊 Test 1 Result:');
    console.log(JSON.stringify(test1.data, null, 2));

    // Test 2: Test with new template ID 8
    console.log('\n📧 Test 2: Testing with new template...');
    const test2 = await makeRequest(
      `${BASE_URL}/api/companies/templates/8/test`,
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

    console.log('📊 Test 2 Result:');
    console.log(JSON.stringify(test2.data, null, 2));

    // Test 3: Test with simulated template ID 9
    console.log('\n📧 Test 3: Testing with simulated template...');
    const test3 = await makeRequest(
      `${BASE_URL}/api/companies/templates/9/test`,
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

    console.log('📊 Test 3 Result:');
    console.log(JSON.stringify(test3.data, null, 2));

    // Summary
    console.log('\n📋 Summary:');
    console.log(`   Test 1 (Template 1): ${test1.data.success ? '✅' : '❌'}`);
    console.log(`   Test 2 (Template 8): ${test2.data.success ? '✅' : '❌'}`);
    console.log(`   Test 3 (Template 9): ${test3.data.success ? '✅' : '❌'}`);

    if (test1.data.success || test2.data.success || test3.data.success) {
      console.log('\n🎉 SUCCESS! Email functionality is working!');
      console.log('📧 You can now use email notifications in your application.');
    } else {
      console.log('\n⚠️ Email tests failed. Please check the deployment.');
    }

    return {
      test1: test1.data,
      test2: test2.data,
      test3: test3.data
    };

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
📋 Email Fix Test Script

Usage:
  node test-email-fix.js [command]

Commands:
  test      - Test email fix (default)
  help      - Show this help message

Environment Variables:
  ADMIN_TOKEN      - Admin authentication token
  API_BASE_URL     - API base URL (optional)

Example:
  ADMIN_TOKEN=your-token node test-email-fix.js
  `);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2] || 'test';
  
  switch (command) {
    case 'test':
      testEmailFix();
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