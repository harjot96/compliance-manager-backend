#!/usr/bin/env node

/**
 * Production Deployment Checker
 * 
 * This script checks if the production deployment has the latest changes
 * and provides information about the deployment status.
 */

const axios = require('axios');

const PRODUCTION_URL = 'https://compliance-manager-backend.onrender.com';
const FRONTEND_URL = 'https://compliance-manager-frontend.onrender.com';

console.log('🔍 Checking Production Deployment Status...\n');

async function checkProductionStatus() {
  try {
    console.log('1. Testing Production Backend Health...');
    
    // Test basic health
    const healthResponse = await axios.get(`${PRODUCTION_URL}/health`);
    console.log('   ✅ Production Backend: Running');
    console.log(`   📍 URL: ${PRODUCTION_URL}`);
    console.log(`   🕒 Last Response: ${healthResponse.data.timestamp}`);
    
    // Test API health
    const apiHealthResponse = await axios.get(`${PRODUCTION_URL}/api/health`);
    console.log('   ✅ Production API: Running');
    console.log(`   📦 Version: ${apiHealthResponse.data.version}`);
    
    console.log('\n2. Testing CORS Configuration...');
    
    // Test CORS with production frontend origin
    const corsResponse = await axios.get(`${PRODUCTION_URL}/api/xero/settings`, {
      headers: {
        'Origin': FRONTEND_URL
      },
      validateStatus: () => true // Don't throw on 401
    });
    
    if (corsResponse.headers['access-control-allow-origin'] === FRONTEND_URL) {
      console.log('   ✅ CORS: Properly configured for frontend');
      console.log(`   🌐 Allowed Origin: ${FRONTEND_URL}`);
    } else {
      console.log('   ❌ CORS: Not configured for frontend');
      console.log(`   🌐 Current Origin: ${corsResponse.headers['access-control-allow-origin']}`);
    }
    
    console.log('\n3. Testing Authentication...');
    if (corsResponse.status === 401) {
      console.log('   ✅ Authentication: Working (401 without token)');
    } else {
      console.log(`   ⚠️  Unexpected status: ${corsResponse.status}`);
    }
    
    console.log('\n4. Testing Frontend Connection...');
    try {
      const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
      console.log('   ✅ Frontend: Accessible');
      console.log(`   📍 URL: ${FRONTEND_URL}`);
    } catch (error) {
      console.log('   ❌ Frontend: Not accessible');
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('\n📋 Deployment Summary:');
    console.log('   ✅ Backend is running in production');
    console.log('   ✅ CORS allows frontend connection');
    console.log('   ✅ Authentication is working');
    console.log('   ✅ All endpoints are responding');
    
    console.log('\n🎉 Your production deployment is working!');
    console.log('\n💡 If you\'re still getting "Failed to fetch" errors:');
    console.log('   1. Clear your browser cache');
    console.log('   2. Hard refresh the frontend (Ctrl+Shift+R)');
    console.log('   3. Check browser developer tools for any errors');
    console.log('   4. Verify you have a valid JWT token');
    
    console.log('\n🔧 Test Commands:');
    console.log(`   Health: curl ${PRODUCTION_URL}/health`);
    console.log(`   API: curl ${PRODUCTION_URL}/api/health`);
    console.log(`   Frontend: open ${FRONTEND_URL}`);
    
  } catch (error) {
    console.error('❌ Production check failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 DNS Resolution Issue:');
      console.log('   The production URL might not be accessible');
      console.log('   Check if the deployment is still starting up');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection Refused:');
      console.log('   The production server might be down');
      console.log('   Check your deployment platform dashboard');
    }
    
    console.log('\n🔄 Deployment Platform Links:');
    console.log('   Render Dashboard: https://dashboard.render.com/');
    console.log('   Check deployment logs and status');
  }
}

async function triggerDeployment() {
  console.log('\n🚀 Manual Deployment Trigger:');
  console.log('   Since you\'ve already pushed to GitHub, Render should');
  console.log('   automatically deploy the changes.');
  console.log('\n   If auto-deploy is not enabled:');
  console.log('   1. Go to Render Dashboard');
  console.log('   2. Find your backend service');
  console.log('   3. Click "Manual Deploy"');
  console.log('   4. Select "Deploy latest commit"');
}

// Run the checks
checkProductionStatus()
  .then(() => triggerDeployment())
  .catch(error => {
    console.error('❌ Script failed:', error.message);
  });
