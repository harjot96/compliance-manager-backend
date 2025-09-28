#!/usr/bin/env node

// Debug script to check and fix Xero client ID issues
const db = require('./src/config/database');

async function debugClientId() {
  try {
    console.log('🔍 Checking Xero settings in database...\n');
    
    // Get all Xero settings
    const result = await db.query(`
      SELECT 
        xs.id,
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.redirect_uri,
        xs.created_at,
        xs.updated_at
      FROM xero_settings xs
      LEFT JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.company_id
    `);
    
    console.log(`📊 Found ${result.rows.length} Xero settings entries:\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. Company: ${row.company_name} (ID: ${row.company_id})`);
      console.log(`   Client ID: ${row.client_id ? `${row.client_id.substring(0, 8)}...` : 'NOT SET'}`);
      console.log(`   Redirect URI: ${row.redirect_uri || 'NOT SET'}`);
      console.log(`   Created: ${row.created_at}`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log('');
    });
    
    // Check for the problematic client ID
    const problematicClientId = '8113118D16A84C8199677E98E3D8A446';
    const problematicEntries = result.rows.filter(row => row.client_id === problematicClientId);
    
    if (problematicEntries.length > 0) {
      console.log(`⚠️  Found ${problematicEntries.length} entries with the problematic client ID: ${problematicClientId}`);
      problematicEntries.forEach(entry => {
        console.log(`   - Company: ${entry.company_name} (ID: ${entry.company_id})`);
      });
      console.log('\n❓ Do you want to update these entries with the correct client ID?');
      console.log('   Run: node debug-client-id.js update "YOUR_CORRECT_CLIENT_ID"');
    } else {
      console.log('✅ No entries found with the problematic client ID.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

async function updateClientId(newClientId) {
  try {
    console.log(`🔄 Updating client ID to: ${newClientId.substring(0, 8)}...`);
    
    // Update all entries with the problematic client ID
    const updateResult = await db.query(
      'UPDATE xero_settings SET client_id = $1, updated_at = CURRENT_TIMESTAMP WHERE client_id = $2',
      [newClientId, '8113118D16A84C8199677E98E3D8A446']
    );
    
    console.log(`✅ Updated ${updateResult.rowCount} entries successfully.`);
    
    // Verify the update
    const verifyResult = await db.query(
      'SELECT company_id, client_id FROM xero_settings WHERE client_id = $1',
      [newClientId]
    );
    
    console.log(`🔍 Verification: Found ${verifyResult.rowCount} entries with new client ID.`);
    
  } catch (error) {
    console.error('❌ Error updating client ID:', error.message);
  } finally {
    process.exit(0);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  debugClientId();
} else if (args[0] === 'update' && args[1]) {
  updateClientId(args[1]);
} else {
  console.log('Usage:');
  console.log('  node debug-client-id.js                    # Check current client IDs');
  console.log('  node debug-client-id.js update "NEW_ID"    # Update problematic client ID');
}
