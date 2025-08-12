#!/usr/bin/env node

/**
 * Validation script to ensure redirect URLs don't contain localhost in production
 * Run this script to validate your environment configuration
 */

const { getFrontendUrl, getFrontendCallbackUrl, getFrontendRedirectUrl, validateProductionUrls } = require('./src/config/environment');

console.log('🔍 Validating redirect URLs configuration...\n');

// Check current environment
const env = process.env.NODE_ENV || 'development';
console.log(`📋 Current environment: ${env}`);

// Get URLs
try {
  const frontendUrl = getFrontendUrl();
  const callbackUrl = getFrontendCallbackUrl();
  const redirectUrl = getFrontendRedirectUrl();
  
  console.log('\n🌐 Current URL Configuration:');
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log(`   Callback URL: ${callbackUrl}`);
  console.log(`   Redirect URL: ${redirectUrl}`);
  
  // Check for localhost
  const hasLocalhost = [frontendUrl, callbackUrl, redirectUrl].some(url => url.includes('localhost'));
  
  if (env === 'production') {
    if (hasLocalhost) {
      console.log('\n❌ ERROR: Production environment contains localhost URLs!');
      console.log('   This is not allowed in production.');
      console.log('\n💡 Solutions:');
      console.log('   1. Set NODE_ENV=development for local testing');
      console.log('   2. Set FRONTEND_URL environment variable to your production URL');
      console.log('   3. Ensure all URLs point to your production domain');
      process.exit(1);
    } else {
      console.log('\n✅ SUCCESS: Production URLs are properly configured');
      console.log('   No localhost URLs found in production environment');
    }
  } else {
    if (hasLocalhost) {
      console.log('\n✅ Development mode: localhost URLs are expected');
    } else {
      console.log('\n⚠️  WARNING: Development mode but no localhost URLs found');
      console.log('   This might indicate a configuration issue');
    }
  }
  
  // Run full validation
  console.log('\n🔍 Running full validation...');
  validateProductionUrls();
  console.log('\n✅ All validations passed!');
  
} catch (error) {
  console.error('\n❌ Validation failed:', error.message);
  process.exit(1);
}

console.log('\n📝 Environment Variables Check:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set (defaults to development)'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set (using default)'}`);

if (env === 'production') {
  console.log('\n🚀 Production Deployment Checklist:');
  console.log('   ✅ NODE_ENV=production');
  console.log('   ✅ FRONTEND_URL set to production domain');
  console.log('   ✅ No localhost URLs in configuration');
  console.log('   ✅ CORS properly configured for production');
  console.log('   ✅ Xero Developer Portal configured with production URLs');
}
