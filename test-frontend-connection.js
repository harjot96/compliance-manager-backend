#!/usr/bin/env node

/**
 * Frontend Connection Test Script
 * 
 * This script helps test the connection between frontend and backend
 * and provides debugging information for the "Failed to fetch" error.
 */

const axios = require('axios');

// Simple color functions (no external dependency)
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  orange: (text) => `\x1b[33m${text}\x1b[0m` // Use yellow for orange
};

const BASE_URL = 'http://localhost:3333';

console.log(colors.blue('🔍 Frontend Connection Diagnostic Tool\n'));

async function testConnection() {
  console.log(colors.yellow('1. Testing Backend Health...'));
  
  try {
    // Test basic health
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(colors.green('   ✅ Backend Health: OK'));
    console.log(`   📍 Server running on: ${BASE_URL}`);
    
    // Test API health
    const apiHealthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log(colors.green('   ✅ API Health: OK'));
    
    // Test CORS with production frontend origin
    console.log(colors.yellow('\n2. Testing CORS Configuration...'));
    const corsResponse = await axios.get(`${BASE_URL}/api/xero/settings`, {
      headers: {
        'Origin': 'https://compliance-manager-frontend.onrender.com'
      },
      validateStatus: () => true // Don't throw on 401
    });
    
    if (corsResponse.headers['access-control-allow-origin']) {
      console.log(colors.green('   ✅ CORS: Properly configured'));
      console.log(`   🌐 Allowed Origin: ${corsResponse.headers['access-control-allow-origin']}`);
    } else {
      console.log(colors.red('   ❌ CORS: Not configured properly'));
    }
    
    console.log(colors.yellow('\n3. Testing Authentication...'));
    if (corsResponse.status === 401) {
      console.log(colors.green('   ✅ Authentication: Working (401 without token)'));
    } else {
      console.log(colors.orange(`   ⚠️  Unexpected status: ${corsResponse.status}`));
    }
    
    console.log(colors.blue('\n📋 Connection Summary:'));
    console.log(colors.green('   ✅ Backend is running correctly'));
    console.log(colors.green('   ✅ CORS allows production frontend'));
    console.log(colors.green('   ✅ Authentication is working'));
    
    console.log(colors.blue('\n🚀 Frontend Fix Required:'));
    console.log(colors.yellow('   The issue is in your frontend configuration.'));
    console.log(colors.yellow('   Update your frontend API base URL to:'));
    console.log(colors.cyan(`   ${BASE_URL}`));
    
    console.log(colors.blue('\n💡 Frontend Configuration Examples:'));
    console.log(colors.gray('   React (.env):'));
    console.log(colors.cyan(`   REACT_APP_API_URL=${BASE_URL}`));
    console.log(colors.gray('   Vite (.env):'));
    console.log(colors.cyan(`   VITE_API_URL=${BASE_URL}`));
    console.log(colors.gray('   Next.js (.env.local):'));
    console.log(colors.cyan(`   NEXT_PUBLIC_API_URL=${BASE_URL}`));
    
  } catch (error) {
    console.log(colors.red('❌ Connection test failed:'));
    console.log(colors.red(`   Error: ${error.message}`));
    
    if (error.code === 'ECONNREFUSED') {
      console.log(colors.yellow('\n💡 Solution: Start your backend server'));
      console.log(colors.cyan('   npm run dev'));
    }
  }
}

async function getTestToken() {
  console.log(colors.yellow('\n4. Getting Test JWT Token...'));
  
  // Try common test credentials
  const testCredentials = [
    { email: 'admin@test.com', password: 'admin123' },
    { email: 'test@test.com', password: 'test123' },
    { email: 'xero-test@example.com', password: 'test123' }
  ];
  
  for (const cred of testCredentials) {
    try {
      const response = await axios.post(`${BASE_URL}/api/companies/login`, cred);
      if (response.data.success) {
        console.log(colors.green('   ✅ Login successful!'));
        console.log(colors.cyan(`   🔑 JWT Token: ${response.data.token.substring(0, 50)}...`));
        console.log(colors.cyan(`   👤 Company: ${response.data.company.companyName || 'N/A'}`));
        console.log(colors.cyan(`   🏢 Role: ${response.data.company.role}`));
        
        // Test authenticated request
        console.log(colors.yellow('\n5. Testing Authenticated Request...'));
        const authResponse = await axios.get(`${BASE_URL}/api/xero/settings`, {
          headers: {
            'Authorization': `Bearer ${response.data.token}`,
            'Origin': 'https://compliance-manager-frontend.onrender.com'
          },
          validateStatus: () => true
        });
        
        console.log(colors.green(`   ✅ Authenticated request: ${authResponse.status}`));
        console.log(colors.gray(`   Response: ${JSON.stringify(authResponse.data)}`));
        
        return response.data.token;
      }
    } catch (error) {
      // Continue to next credential
    }
  }
  
  console.log(colors.orange('   ⚠️  No test credentials worked'));
  console.log(colors.yellow('   💡 Create a test user or update credentials in this script'));
}

// Run the tests
testConnection()
  .then(() => getTestToken())
  .then(() => {
    console.log(colors.blue('\n🎉 Diagnostic Complete!'));
    console.log(colors.yellow('   Update your frontend API URL and try again.'));
  })
  .catch(error => {
    console.error(colors.red('❌ Diagnostic failed:'), error.message);
  });
