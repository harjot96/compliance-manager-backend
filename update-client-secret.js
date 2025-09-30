#!/usr/bin/env node

// Update Client Secret for all companies
const db = require('./src/config/database');

async function updateClientSecret() {
  try {
    console.log('🔧 Updating Client Secret for all companies...\n');
    
    const newClientSecret = '1A7bSInZDYlkv8y99JkcQmpEMrlHNwnOm4wQIYZNSUyreXPo';
    
    // Update all companies with the new client secret
    const result = await db.query(`
      UPDATE xero_settings 
      SET client_secret = $1, updated_at = NOW()
      WHERE client_secret IS NOT NULL
    `, [newClientSecret]);
    
    console.log(`✅ Updated ${result.rowCount} companies with new Client Secret`);
    
    // Verify the update
    const verifyResult = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.client_secret = $1
      ORDER BY xs.updated_at DESC
    `, [newClientSecret]);
    
    console.log(`\n🔍 Verification: ${verifyResult.rows.length} companies now have the new Client Secret:\n`);
    
    verifyResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.company_name}:`);
      console.log(`   Client ID: ${row.client_id}`);
      console.log(`   Client Secret: ${row.client_secret.substring(0, 8)}...${row.client_secret.substring(row.client_secret.length - 8)} ✅`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log('');
    });
    
    console.log('🎉 SUCCESS: All companies now have the updated Client Secret!');
    console.log('💡 The OAuth flow should now work with real Xero credentials!');
    
  } catch (error) {
    console.error('❌ Error updating Client Secret:', error.message);
  } finally {
    process.exit(0);
  }
}

updateClientSecret();
