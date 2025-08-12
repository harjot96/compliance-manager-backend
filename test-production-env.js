#!/usr/bin/env node

/**
 * Test script to verify production environment configuration
 */

console.log('🔍 Testing Production Environment Configuration\n');

// Check current environment
console.log('📋 Current Environment:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set (defaults to development)'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set (using default)'}`);

// Test environment configuration
console.log('\n🌐 URL Configuration:');
try {
  const { getFrontendUrl, getFrontendCallbackUrl, getFrontendRedirectUrl } = require('./src/config/environment');
  
  const frontendUrl = getFrontendUrl();
  const callbackUrl = getFrontendCallbackUrl();
  const redirectUrl = getFrontendRedirectUrl();
  
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log(`   Callback URL: ${callbackUrl}`);
  console.log(`   Redirect URL: ${redirectUrl}`);
  
  // Check for localhost
  const hasLocalhost = [frontendUrl, callbackUrl, redirectUrl].some(url => url.includes('localhost'));
  
  if (hasLocalhost) {
    console.log('\n❌ ISSUE: Localhost URLs detected!');
    console.log('   This means NODE_ENV is not set to production.');
    console.log('\n💡 Solutions:');
    console.log('   1. Set NODE_ENV=production on your server');
    console.log('   2. Check your deployment platform environment variables');
    console.log('   3. Verify your start script includes NODE_ENV=production');
  } else {
    console.log('\n✅ SUCCESS: Production URLs detected!');
    console.log('   Environment is correctly configured for production.');
  }
  
} catch (error) {
  console.error('\n❌ Error testing environment:', error.message);
}

console.log('\n📝 Environment Variable Check:');
console.log('   To fix this issue, ensure your production server has:');
console.log('   NODE_ENV=production');
console.log('   FRONTEND_URL=https://compliance-manager-frontend.onrender.com (optional)');
