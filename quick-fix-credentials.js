#!/usr/bin/env node

// Quick fix script to replace fake credentials with valid format
const db = require('./src/config/database');

async function quickFixCredentials() {
  try {
    console.log('🔧 Quick Fix: Replacing fake credentials with valid format\n');
    
    // Create a valid format Client ID (32 hex characters)
    const validClientId = 'BE4B464D123456789ABCDEF012345678';
    const validClientSecret = 'ValidClientSecret123456789012345678901234567890';
    
    console.log('📝 Using test credentials:');
    console.log(`   Client ID: ${validClientId}`);
    console.log(`   Client Secret: ${validClientSecret.substring(0, 8)}...`);
    
    console.log('\n🔧 Updating all companies...');
    
    const result = await db.query(`
      UPDATE xero_settings 
      SET 
        client_id = $1,
        client_secret = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE client_id = 'BE4B464D-1234-5678-9ABC-DEF012345678'
    `, [validClientId, validClientSecret]);
    
    console.log(`✅ Updated ${result.rowCount} companies`);
    
    console.log('\n⚠️ IMPORTANT: These are test credentials!');
    console.log('💡 You still need to replace them with real Xero credentials for production use.');
    console.log('📝 Get real credentials from: https://developer.xero.com/');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

quickFixCredentials();
