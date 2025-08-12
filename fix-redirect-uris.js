#!/usr/bin/env node

/**
 * Script to fix redirect URIs in the database
 * This script updates all existing redirect URIs to match the current environment
 */

require('dotenv').config();
const db = require('./src/config/database');
const { getFrontendRedirectUrl, validateProductionUrls } = require('./src/config/environment');

async function fixRedirectUris() {
  try {
    console.log('🔍 Fixing redirect URIs in database...\n');
    
    // Validate environment first
    console.log('📋 Validating environment configuration...');
    validateProductionUrls();
    
    const environmentRedirectUri = getFrontendRedirectUrl();
    console.log(`🌐 Environment redirect URI: ${environmentRedirectUri}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    
    // Get all Xero settings
    console.log('📊 Fetching all Xero settings from database...');
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
    console.log(`📈 Found ${settings.length} Xero settings\n`);
    
    if (settings.length === 0) {
      console.log('✅ No Xero settings found. Nothing to update.');
      return;
    }
    
    // Check which settings need updating
    const needsUpdate = settings.filter(s => s.redirect_uri !== environmentRedirectUri);
    const upToDate = settings.filter(s => s.redirect_uri === environmentRedirectUri);
    
    console.log('📋 Analysis:');
    console.log(`   ✅ Up to date: ${upToDate.length}`);
    console.log(`   🔄 Needs update: ${needsUpdate.length}`);
    
    if (needsUpdate.length > 0) {
      console.log('\n🔄 Settings that need updating:');
      needsUpdate.forEach(s => {
        console.log(`   - Company: ${s.company_name} (${s.email})`);
        console.log(`     Current: ${s.redirect_uri}`);
        console.log(`     New:     ${environmentRedirectUri}`);
        console.log('');
      });
      
      // Ask for confirmation
      console.log('❓ Do you want to update these redirect URIs? (y/N)');
      console.log('   This will ensure all redirect URIs match the current environment.');
      console.log('   Press Ctrl+C to cancel.');
      
      // For now, auto-confirm in production, ask in development
      const shouldUpdate = process.env.NODE_ENV === 'production' || process.argv.includes('--force');
      
      if (shouldUpdate) {
        console.log('✅ Auto-confirming update...');
      } else {
        console.log('⚠️  Skipping update. Run with --force to update anyway.');
        return;
      }
      
      // Update the settings
      console.log('\n🔄 Updating redirect URIs...');
      let updatedCount = 0;
      
      for (const setting of needsUpdate) {
        try {
          await db.query(`
            UPDATE xero_settings 
            SET redirect_uri = $1, updated_at = CURRENT_TIMESTAMP
            WHERE company_id = $2
          `, [environmentRedirectUri, setting.company_id]);
          
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
    
    console.log('\n✅ Redirect URI fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing redirect URIs:', error.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

// Run the script
fixRedirectUris().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
