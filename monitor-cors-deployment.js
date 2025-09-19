#!/usr/bin/env node

/**
 * CORS Deployment Monitor
 * 
 * This script monitors the production deployment to verify
 * the CORS fix has been deployed and is working.
 */

const axios = require('axios');

const PRODUCTION_URL = 'https://compliance-manager-backend.onrender.com';
const FRONTEND_URL = 'https://compliance-manager-frontend.onrender.com';

console.log('🔍 Monitoring CORS Fix Deployment...\n');

async function testCORSPreflight() {
  try {
    console.log('Testing CORS preflight request...');
    
    // Test preflight OPTIONS request
    const response = await axios({
      method: 'OPTIONS',
      url: `${PRODUCTION_URL}/api/xero/settings`,
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type'
      },
      timeout: 10000
    });
    
    console.log('✅ Preflight request successful!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin']}`);
    console.log(`   Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods']}`);
    console.log(`   Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers']}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Preflight request failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
    
    return false;
  }
}

async function testActualRequest() {
  try {
    console.log('\nTesting actual API request...');
    
    const response = await axios.get(`${PRODUCTION_URL}/api/xero/settings`, {
      headers: {
        'Origin': FRONTEND_URL
      },
      validateStatus: () => true, // Don't throw on 401
      timeout: 10000
    });
    
    if (response.status === 401) {
      console.log('✅ API request successful (401 expected without auth)');
      console.log(`   CORS Origin: ${response.headers['access-control-allow-origin']}`);
      return true;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    console.log('❌ API request failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function monitorDeployment() {
  const maxAttempts = 20;
  const delay = 15000; // 15 seconds between attempts
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n🔄 Attempt ${attempt}/${maxAttempts}:`);
    
    const preflightSuccess = await testCORSPreflight();
    const requestSuccess = await testActualRequest();
    
    if (preflightSuccess && requestSuccess) {
      console.log('\n🎉 CORS Fix Successfully Deployed!');
      console.log('\n💡 Try your frontend now:');
      console.log(`   ${FRONTEND_URL}`);
      console.log('\n🧪 The "Failed to fetch" error should be resolved!');
      return;
    }
    
    if (attempt < maxAttempts) {
      console.log(`\n⏳ Waiting ${delay/1000} seconds for next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('\n❌ Deployment monitoring timed out');
  console.log('💡 The deployment might still be in progress');
  console.log('   Check your Render dashboard for deployment status');
}

// Start monitoring
monitorDeployment()
  .catch(error => {
    console.error('❌ Monitoring failed:', error.message);
  });
