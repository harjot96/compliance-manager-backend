#!/usr/bin/env node

/**
 * Script to identify current server URL and help configure the correct one
 */

require('dotenv').config();

console.log('🔍 Server URL Configuration Analysis\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set (defaults to development)'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set (using default)'}`);
console.log(`   PRODUCTION_SERVER_URL: ${process.env.PRODUCTION_SERVER_URL || 'not set'}`);

// Check database connection to get server info
console.log('\n🌐 Database Connection Info:');
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
console.log(`   DB_HOST: ${dbHost}`);
console.log(`   DB_PORT: ${dbPort}`);

// Try to determine server URL from database host
if (dbHost.includes('render.com')) {
  console.log('\n💡 Detected Render.com hosting');
  console.log('   Your server URL is likely: https://your-app-name.onrender.com');
} else if (dbHost.includes('heroku.com')) {
  console.log('\n💡 Detected Heroku hosting');
  console.log('   Your server URL is likely: https://your-app-name.herokuapp.com');
} else if (dbHost.includes('railway.app')) {
  console.log('\n💡 Detected Railway hosting');
  console.log('   Your server URL is likely: https://your-app-name.railway.app');
} else {
  console.log('\n💡 Custom hosting detected');
  console.log('   Please provide your server URL manually');
}

// Test environment configuration
console.log('\n🔧 Current Environment Configuration:');
try {
  const { getFrontendUrl, getFrontendCallbackUrl, getFrontendRedirectUrl } = require('./src/config/environment');
  
  const frontendUrl = getFrontendUrl();
  const callbackUrl = getFrontendCallbackUrl();
  const redirectUrl = getFrontendRedirectUrl();
  
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log(`   Callback URL: ${callbackUrl}`);
  console.log(`   Redirect URL: ${redirectUrl}`);
  
  if (redirectUrl.includes('localhost')) {
    console.log('\n❌ ISSUE: Redirect URL contains localhost!');
    console.log('   This needs to be updated to your production server URL.');
  } else {
    console.log('\n✅ SUCCESS: Redirect URL is production-ready!');
  }
  
} catch (error) {
  console.error('\n❌ Error testing environment:', error.message);
}

console.log('\n📝 To fix the localhost issue:');
console.log('   1. Identify your production server URL');
console.log('   2. Set PRODUCTION_SERVER_URL environment variable:');
console.log('      export PRODUCTION_SERVER_URL=https://your-server-url.com');
console.log('   3. Run: node update-server-url.js');
console.log('   4. Update Xero Developer Portal with the new URL');
console.log('   5. Set NODE_ENV=production on your server');
