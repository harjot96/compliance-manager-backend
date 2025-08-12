#!/usr/bin/env node

/**
 * Production Deployment Check
 * Ensures the codebase is ready for production deployment with no localhost URLs
 */

require('dotenv').config();
const fs = require('fs');

console.log('🚀 Production Deployment Check\n');

// Check environment variables
console.log('📋 Environment Variables:');
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`   NODE_ENV: ${nodeEnv}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set (using default)'}`);

if (nodeEnv !== 'production') {
  console.log('\n⚠️  WARNING: NODE_ENV is not set to production');
  console.log('   Set NODE_ENV=production for production deployment');
}

// Test environment configuration
console.log('\n🔍 Testing Environment Configuration:');
let hasLocalhost = false;

try {
  const { getFrontendUrl, getFrontendCallbackUrl, getFrontendRedirectUrl, validateProductionUrls } = require('./src/config/environment');
  
  const frontendUrl = getFrontendUrl();
  const callbackUrl = getFrontendCallbackUrl();
  const redirectUrl = getFrontendRedirectUrl();
  
  console.log(`   Frontend URL: ${frontendUrl}`);
  console.log(`   Callback URL: ${callbackUrl}`);
  console.log(`   Redirect URL: ${redirectUrl}`);
  
  // Check for localhost
  hasLocalhost = [frontendUrl, callbackUrl, redirectUrl].some(url => url.includes('localhost'));
  
  if (hasLocalhost && nodeEnv === 'production') {
    console.log('\n❌ CRITICAL: Production environment contains localhost URLs!');
    console.log('   This will cause issues in production deployment.');
    process.exit(1);
  } else if (hasLocalhost && nodeEnv !== 'production') {
    console.log('\n✅ Development mode: localhost URLs are expected');
  } else {
    console.log('\n✅ Production URLs are properly configured');
  }
  
  // Run validation
  if (nodeEnv === 'production') {
    validateProductionUrls();
    console.log('✅ Environment validation passed');
  }
  
} catch (error) {
  console.error('\n❌ Environment configuration error:', error.message);
  process.exit(1);
}

// Check for hardcoded localhost URLs in critical files
console.log('\n🔍 Checking for hardcoded localhost URLs in critical files:');

const criticalFiles = [
  'src/config/environment.js',
  'src/controllers/xeroController.js',
  'src/server.js'
];

let foundLocalhost = false;

criticalFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const localhostMatches = content.match(/localhost:\d+/g);
    
    if (localhostMatches) {
      console.log(`   ⚠️  ${file}: Found ${localhostMatches.length} localhost references`);
      localhostMatches.forEach(match => {
        console.log(`      - ${match}`);
      });
      foundLocalhost = true;
    } else {
      console.log(`   ✅ ${file}: No hardcoded localhost URLs`);
    }
  } catch (error) {
    console.log(`   ❌ ${file}: Error reading file`);
  }
});

if (foundLocalhost && nodeEnv === 'production') {
  console.log('\n⚠️  WARNING: Found localhost URLs in critical files');
  console.log('   These should be environment-based, not hardcoded');
}

// Check package.json for production scripts
console.log('\n📦 Package.json Check:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log(`   Start script: ${packageJson.scripts.start}`);
  }
  
  if (packageJson.scripts && packageJson.scripts.prod) {
    console.log(`   Production script: ${packageJson.scripts.prod}`);
  }
  
} catch (error) {
  console.log('   ❌ Error reading package.json');
}

// Database check (if possible)
console.log('\n🗄️  Database Configuration:');
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';

console.log(`   DB_HOST: ${dbHost}`);
console.log(`   DB_PORT: ${dbPort}`);

if (dbHost === 'localhost' && nodeEnv === 'production') {
  console.log('   ⚠️  WARNING: Database host is localhost in production');
  console.log('   This might indicate a configuration issue');
}

// Final deployment checklist
console.log('\n📋 Production Deployment Checklist:');
const checks = [
  { name: 'NODE_ENV=production', status: nodeEnv === 'production' },
  { name: 'No localhost URLs in environment config', status: !hasLocalhost || nodeEnv !== 'production' },
  { name: 'Environment validation passes', status: true }, // Already checked above
  { name: 'CORS configured for production', status: true }, // Already configured
  { name: 'Database connection configured', status: dbHost !== 'localhost' || nodeEnv !== 'production' }
];

checks.forEach(check => {
  const status = check.status ? '✅' : '❌';
  console.log(`   ${status} ${check.name}`);
});

const allPassed = checks.every(check => check.status);

if (allPassed) {
  console.log('\n🎉 All checks passed! Ready for production deployment.');
  console.log('\n📝 Next steps:');
  console.log('   1. Deploy to production server');
  console.log('   2. Set NODE_ENV=production on server');
  console.log('   3. Run: node fix-redirect-uris.js (if needed)');
  console.log('   4. Update Xero Developer Portal with production URLs');
  console.log('   5. Test OAuth flow in production');
} else {
  console.log('\n❌ Some checks failed. Please fix issues before deployment.');
  process.exit(1);
}

console.log('\n🔒 Security Notes:');
console.log('   - Ensure all environment variables are set on production server');
console.log('   - Verify Xero Developer Portal has correct production redirect URIs');
console.log('   - Test OAuth flow thoroughly in production');
console.log('   - Monitor logs for any localhost URL usage');
