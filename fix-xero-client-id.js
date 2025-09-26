#!/usr/bin/env node

/**
 * Fix Xero Client ID Script
 * This script helps debug and fix Xero client ID issues
 */

const db = require('./src/config/database');

async function checkXeroSettings() {
  try {
    console.log('🔍 Checking Xero settings in database...\n');
    
    const query = `
      SELECT 
        xs.id,
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.redirect_uri,
        xs.created_at,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.updated_at DESC
    `;
    
    const result = await db.query(query);
    
    if (result.rows.length === 0) {
      console.log('❌ No Xero settings found in database');
      console.log('💡 You need to configure Xero settings first');
      return;
    }
    
    console.log(`📊 Found ${result.rows.length} Xero settings:\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. Company: ${row.company_name} (ID: ${row.company_id})`);
      console.log(`   Client ID: ${row.client_id}`);
      console.log(`   Redirect URI: ${row.redirect_uri || 'Not set'}`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log('');
    });
    
    // Check if all companies have the same client ID
    const uniqueClientIds = [...new Set(result.rows.map(row => row.client_id))];
    
    if (uniqueClientIds.length === 1) {
      console.log(`✅ All companies use the same client ID: ${uniqueClientIds[0]}`);
    } else {
      console.log(`⚠️  Found ${uniqueClientIds.length} different client IDs:`);
      uniqueClientIds.forEach((clientId, index) => {
        const count = result.rows.filter(row => row.client_id === clientId).length;
        console.log(`   ${index + 1}. ${clientId} (used by ${count} companies)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking Xero settings:', error);
  }
}

async function updateClientId(newClientId, newRedirectUri = null) {
  try {
    console.log(`🔧 Updating client ID to: ${newClientId}`);
    
    if (!newClientId) {
      console.log('❌ Please provide a valid client ID');
      return;
    }
    
    const updateQuery = `
      UPDATE xero_settings 
      SET 
        client_id = $1,
        redirect_uri = COALESCE($2, redirect_uri),
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        id,
        company_id,
        (SELECT company_name FROM companies WHERE id = xero_settings.company_id) as company_name
    `;
    
    const result = await db.query(updateQuery, [newClientId, newRedirectUri]);
    
    console.log(`✅ Updated client ID for ${result.rows.length} companies:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.company_name} (ID: ${row.company_id})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating client ID:', error);
  }
}

async function addXeroSettingsForCompany(companyId, clientId, clientSecret, redirectUri) {
  try {
    console.log(`🔧 Adding Xero settings for company ID: ${companyId}`);
    
    const insertQuery = `
      INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (company_id) 
      DO UPDATE SET 
        client_id = EXCLUDED.client_id,
        client_secret = EXCLUDED.client_secret,
        redirect_uri = EXCLUDED.redirect_uri,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    const result = await db.query(insertQuery, [companyId, clientId, clientSecret, redirectUri]);
    
    console.log(`✅ Xero settings added/updated for company ID: ${companyId}`);
    console.log(`   Client ID: ${result.rows[0].client_id}`);
    console.log(`   Redirect URI: ${result.rows[0].redirect_uri}`);
    
  } catch (error) {
    console.error('❌ Error adding Xero settings:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🔧 Xero Client ID Fix Script\n');
  
  switch (command) {
    case 'check':
      await checkXeroSettings();
      break;
      
    case 'update':
      const newClientId = args[1];
      const newRedirectUri = args[2];
      if (!newClientId) {
        console.log('❌ Usage: node fix-xero-client-id.js update <new_client_id> [new_redirect_uri]');
        process.exit(1);
      }
      await updateClientId(newClientId, newRedirectUri);
      break;
      
    case 'add':
      const companyId = args[1];
      const clientId = args[2];
      const clientSecret = args[3];
      const redirectUri = args[4];
      if (!companyId || !clientId || !clientSecret) {
        console.log('❌ Usage: node fix-xero-client-id.js add <company_id> <client_id> <client_secret> [redirect_uri]');
        process.exit(1);
      }
      await addXeroSettingsForCompany(companyId, clientId, clientSecret, redirectUri);
      break;
      
    default:
      console.log('📋 Available commands:');
      console.log('  check                                    - Check current Xero settings');
      console.log('  update <client_id> [redirect_uri]        - Update client ID for all companies');
      console.log('  add <company_id> <client_id> <client_secret> [redirect_uri] - Add settings for specific company');
      console.log('');
      console.log('📝 Examples:');
      console.log('  node fix-xero-client-id.js check');
      console.log('  node fix-xero-client-id.js update "YOUR_CORRECT_CLIENT_ID"');
      console.log('  node fix-xero-client-id.js update "YOUR_CLIENT_ID" "https://yourdomain.com/callback"');
      console.log('  node fix-xero-client-id.js add 1 "YOUR_CLIENT_ID" "YOUR_CLIENT_SECRET"');
      break;
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});