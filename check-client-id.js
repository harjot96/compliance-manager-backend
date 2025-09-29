#!/usr/bin/env node

// Script to check the actual Client ID value
const db = require('./src/config/database');

async function checkClientId() {
  try {
    console.log('🔍 Checking actual Client ID value...\n');
    
    // Get the first company's settings to see the actual Client ID
    const result = await db.query(`
      SELECT 
        xs.client_id,
        xs.client_secret,
        xs.redirect_uri,
        c.company_name
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.company_id = 6
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No Xero settings found for SuperAdmin company');
      return;
    }
    
    const setting = result.rows[0];
    
    console.log('📋 SuperAdmin Company Xero Settings:');
    console.log(`   Company: ${setting.company_name}`);
    console.log(`   Client ID: ${setting.client_id}`);
    console.log(`   Client Secret: ${setting.client_secret ? 'SET' : 'NOT SET'}`);
    console.log(`   Redirect URI: ${setting.redirect_uri}`);
    
    console.log('\n🔍 Client ID Analysis:');
    console.log(`   Length: ${setting.client_id ? setting.client_id.length : 0} characters`);
    console.log(`   Format: ${setting.client_id ? (setting.client_id.match(/^[A-F0-9]+$/i) ? 'Valid hex format' : 'Invalid format') : 'Empty'}`);
    
    if (setting.client_id && setting.client_id.length !== 32) {
      console.log('⚠️ WARNING: Client ID should be 32 characters long');
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Verify this Client ID exists in Xero Developer Portal');
    console.log('   2. Check that the Client Secret matches this Client ID');
    console.log('   3. Ensure redirect URI matches: https://compliance-manager-frontend.onrender.com/redirecturl');
    console.log('   4. Make sure the Xero app is in "Live" mode (not Demo mode)');
    
  } catch (error) {
    console.error('❌ Error checking Client ID:', error);
  } finally {
    process.exit(0);
  }
}

checkClientId();
