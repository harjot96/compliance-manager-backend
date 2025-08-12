#!/usr/bin/env node

/**
 * Script to update server URL from localhost to production server URL
 * Run this script to replace localhost URLs with your actual server URL
 */

require('dotenv').config();
const db = require('./src/config/database');

// CONFIGURATION - UPDATE THIS WITH YOUR ACTUAL SERVER URL
const PRODUCTION_SERVER_URL = process.env.PRODUCTION_SERVER_URL || 'https://your-production-server-url.com';

console.log('🔧 Updating Server URL Configuration\n');

console.log('📋 Configuration:');
console.log(`   Current Production Server URL: ${PRODUCTION_SERVER_URL}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (PRODUCTION_SERVER_URL === 'https://your-production-server-url.com') {
  console.log('\n❌ ERROR: Please set your actual production server URL!');
  console.log('\n💡 How to fix:');
  console.log('   1. Set PRODUCTION_SERVER_URL environment variable:');
  console.log('      export PRODUCTION_SERVER_URL=https://your-actual-server.com');
  console.log('   2. Or update this script with your server URL');
  console.log('   3. Then run this script again');
  process.exit(1);
}

async function updateServerUrl() {
  try {
    console.log('\n🔍 Checking current database configuration...');
    
    // Get all Xero settings
    const result = await db.query(`
      SELECT 
        xs.*,
        c.company_name,
        c.email
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.created_at DESC
    `);
    
    const settings = result.rows;
    console.log(`📊 Found ${settings.length} Xero settings\n`);
    
    if (settings.length === 0) {
      console.log('✅ No Xero settings found. Nothing to update.');
      return;
    }
    
    // Check which settings need updating
    const needsUpdate = settings.filter(s => s.redirect_uri.includes('localhost'));
    const upToDate = settings.filter(s => !s.redirect_uri.includes('localhost'));
    
    console.log('📋 Analysis:');
    console.log(`   ✅ Up to date: ${upToDate.length}`);
    console.log(`   🔄 Needs update: ${needsUpdate.length}`);
    
    if (needsUpdate.length > 0) {
      console.log('\n🔄 Settings that need updating:');
      needsUpdate.forEach(s => {
        console.log(`   - Company: ${s.company_name} (${s.email})`);
        console.log(`     Current: ${s.redirect_uri}`);
        console.log(`     New:     ${PRODUCTION_SERVER_URL}/redirecturl`);
        console.log('');
      });
      
      // Update the settings
      console.log('🔄 Updating redirect URIs...');
      let updatedCount = 0;
      
      for (const setting of needsUpdate) {
        try {
          const newRedirectUri = `${PRODUCTION_SERVER_URL}/redirecturl`;
          await db.query(`
            UPDATE xero_settings 
            SET redirect_uri = $1, updated_at = CURRENT_TIMESTAMP
            WHERE company_id = $2
          `, [newRedirectUri, setting.company_id]);
          
          console.log(`   ✅ Updated: ${setting.company_name}`);
          updatedCount++;
        } catch (error) {
          console.error(`   ❌ Failed to update ${setting.company_name}:`, error.message);
        }
      }
      
      console.log(`\n✅ Successfully updated ${updatedCount} redirect URIs`);
      
    } else {
      console.log('\n✅ All redirect URIs are already up to date!');
    }
    
    // Final validation
    console.log('\n🔍 Final validation...');
    const finalResult = await db.query(`
      SELECT redirect_uri, COUNT(*) as count
      FROM xero_settings 
      GROUP BY redirect_uri
    `);
    
    console.log('📊 Current redirect URI distribution:');
    finalResult.rows.forEach(row => {
      console.log(`   ${row.redirect_uri}: ${row.count} companies`);
    });
    
    console.log('\n✅ Server URL update completed successfully!');
    
    // Additional instructions
    console.log('\n📝 Next Steps:');
    console.log('   1. Update your Xero Developer Portal:');
    console.log(`      - Remove: http://localhost:3001/redirecturl`);
    console.log(`      - Add: ${PRODUCTION_SERVER_URL}/redirecturl`);
    console.log('   2. Set NODE_ENV=production on your server');
    console.log('   3. Test the OAuth flow in production');
    
  } catch (error) {
    console.error('❌ Error updating server URL:', error.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

// Run the script
updateServerUrl().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
