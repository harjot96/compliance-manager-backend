#!/usr/bin/env node

// Script to update Xero credentials in database
const db = require('./src/config/database');

async function updateXeroCredentials() {
  try {
    console.log('🔧 Xero Credentials Update Tool\n');
    
    // Get credentials from user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
    
    console.log('📝 Please provide your real Xero credentials:');
    console.log('   (Get these from: https://developer.xero.com/)\n');
    
    const clientId = await question('Client ID (32 characters, no dashes): ');
    const clientSecret = await question('Client Secret: ');
    
    if (!clientId || !clientSecret) {
      console.log('❌ Both Client ID and Client Secret are required');
      rl.close();
      return;
    }
    
    if (clientId.length !== 32) {
      console.log('⚠️ Warning: Client ID should be 32 characters long');
    }
    
    if (clientId.includes('-')) {
      console.log('⚠️ Warning: Client ID should not contain dashes');
    }
    
    console.log('\n🔧 Updating Xero credentials for all companies...');
    
    // Update all companies with new credentials
    const result = await db.query(`
      UPDATE xero_settings 
      SET 
        client_id = $1,
        client_secret = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE client_id = 'BE4B464D-1234-5678-9ABC-DEF012345678'
    `, [clientId, clientSecret]);
    
    console.log(`✅ Updated ${result.rowCount} companies with new credentials`);
    
    // Verify the update
    const verifyResult = await db.query(`
      SELECT COUNT(*) as count, client_id 
      FROM xero_settings 
      GROUP BY client_id
    `);
    
    console.log('\n📊 Current Client IDs in database:');
    verifyResult.rows.forEach(row => {
      console.log(`   ${row.client_id}: ${row.count} companies`);
    });
    
    console.log('\n🎉 Xero credentials updated successfully!');
    console.log('💡 The OAuth flow should now work properly.');
    
  } catch (error) {
    console.error('❌ Error updating credentials:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

updateXeroCredentials();
