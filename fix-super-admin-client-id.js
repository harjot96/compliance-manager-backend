#!/usr/bin/env node

// Fix SuperAdmin companies with new Client ID
const db = require('./src/config/database');

async function fixSuperAdminClientId() {
  try {
    console.log('🔧 Fixing SuperAdmin Client ID...\n');
    
    const newClientId = 'BE4B464D1E864F9BAE7325BF04F06A11';
    
    // Update all SuperAdmin companies with the new Client ID
    console.log('📋 Updating SuperAdmin companies...');
    
    const result = await db.query(`
      UPDATE xero_settings 
      SET 
        client_id = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE company_id IN (
        SELECT c.id 
        FROM companies c 
        WHERE c.role = 'superadmin' OR c.role = 'super_admin'
      )
      RETURNING company_id, client_id, updated_at
    `, [newClientId]);
    
    console.log(`✅ Updated ${result.rows.length} SuperAdmin companies:`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. Company ${row.company_id}: ${row.client_id} (${row.updated_at})`);
    });
    
    // Verify the update
    console.log('\n📋 Verification - Checking all companies now...');
    const verifyResult = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        c.role,
        xs.client_id,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE c.role = 'superadmin' OR c.role = 'super_admin' OR c.company_name ILIKE '%admin%'
      ORDER BY xs.updated_at DESC
    `);
    
    console.log(`Found ${verifyResult.rows.length} SuperAdmin companies:`);
    verifyResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.company_name} (${row.role}): ${row.client_id}`);
      console.log(`      Updated: ${row.updated_at}`);
    });
    
    // Check if any companies still have the old Client ID
    const oldClientId = 'BE4B464D123456789ABCDEF012345678';
    const stillOld = verifyResult.rows.filter(row => row.client_id === oldClientId);
    
    if (stillOld.length > 0) {
      console.log(`\n❌ ${stillOld.length} companies still have old Client ID:`);
      stillOld.forEach(row => {
        console.log(`   - ${row.company_name} (${row.role})`);
      });
    } else {
      console.log('\n✅ All SuperAdmin companies now have the new Client ID!');
    }
    
    // Final summary
    console.log('\n🎯 SUMMARY:');
    console.log(`   - New Client ID: ${newClientId}`);
    console.log(`   - All regular companies: ✅ Updated`);
    console.log(`   - SuperAdmin companies: ${stillOld.length === 0 ? '✅ Updated' : '❌ Still need update'}`);
    
    if (stillOld.length === 0) {
      console.log('\n🎉 SUCCESS: All companies now have the correct Client ID!');
      console.log('💡 The OAuth flow should now work properly!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixSuperAdminClientId();
