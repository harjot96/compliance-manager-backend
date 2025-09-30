#!/usr/bin/env node

// Debug why Client ID update isn't working
const db = require('./src/config/database');

async function debugClientIdUpdate() {
  try {
    console.log('🔍 Debugging Client ID Update Issue...\n');
    
    // Check current Client IDs in database
    console.log('📋 Step 1: Checking current Client IDs...');
    const currentResult = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.updated_at DESC
      LIMIT 10
    `);
    
    console.log(`Found ${currentResult.rows.length} companies:`);
    currentResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.company_name}: ${row.client_id} (Updated: ${row.updated_at})`);
    });
    
    // Check if any companies have the new Client ID
    const newClientId = 'BE4B464D1E864F9BAE7325BF04F06A11';
    const hasNewClientId = currentResult.rows.some(row => row.client_id === newClientId);
    
    if (hasNewClientId) {
      console.log('\n✅ Found companies with the new Client ID!');
    } else {
      console.log('\n❌ No companies have the new Client ID yet');
    }
    
    // Check SuperAdmin company specifically
    console.log('\n📋 Step 2: Checking SuperAdmin company...');
    const superAdminResult = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        c.role,
        xs.client_id,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE c.role = 'super_admin' OR c.company_name ILIKE '%admin%'
      ORDER BY xs.updated_at DESC
      LIMIT 5
    `);
    
    if (superAdminResult.rows.length > 0) {
      superAdminResult.rows.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.company_name} (${admin.role}): ${admin.client_id}`);
        console.log(`      Updated: ${admin.updated_at}`);
      });
    } else {
      console.log('   ❌ No SuperAdmin companies found');
    }
    
    // Check if the update is happening but not propagating
    console.log('\n📋 Step 3: Checking for recent updates...');
    const recentUpdates = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.updated_at > NOW() - INTERVAL '1 hour'
      ORDER BY xs.updated_at DESC
    `);
    
    if (recentUpdates.rows.length > 0) {
      console.log(`   Found ${recentUpdates.rows.length} recent updates:`);
      recentUpdates.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.company_name}: ${row.client_id} (${row.updated_at})`);
      });
    } else {
      console.log('   ❌ No recent updates found');
    }
    
    // Check if there are multiple Xero settings for the same company
    console.log('\n📋 Step 4: Checking for duplicate settings...');
    const duplicates = await db.query(`
      SELECT 
        company_id,
        COUNT(*) as count,
        array_agg(client_id) as client_ids,
        array_agg(updated_at) as update_times
      FROM xero_settings
      GROUP BY company_id
      HAVING COUNT(*) > 1
    `);
    
    if (duplicates.rows.length > 0) {
      console.log('   ❌ Found duplicate Xero settings:');
      duplicates.rows.forEach((dup, index) => {
        console.log(`   ${index + 1}. Company ${dup.company_id}: ${dup.count} entries`);
        console.log(`      Client IDs: ${dup.client_ids.join(', ')}`);
      });
    } else {
      console.log('   ✅ No duplicate settings found');
    }
    
    // Try to manually update a test company with the new Client ID
    console.log('\n📋 Step 5: Testing manual update...');
    try {
      const testUpdate = await db.query(`
        UPDATE xero_settings 
        SET 
          client_id = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE company_id = 62
        RETURNING client_id, updated_at
      `, [newClientId]);
      
      if (testUpdate.rows.length > 0) {
        console.log('   ✅ Manual update successful!');
        console.log(`   New Client ID: ${testUpdate.rows[0].client_id}`);
        console.log(`   Updated: ${testUpdate.rows[0].updated_at}`);
      } else {
        console.log('   ❌ Manual update failed - no rows updated');
      }
    } catch (error) {
      console.log('   ❌ Manual update error:', error.message);
    }
    
    // Final check
    console.log('\n📋 Step 6: Final verification...');
    const finalCheck = await db.query(`
      SELECT client_id, updated_at 
      FROM xero_settings 
      WHERE company_id = 62
    `);
    
    if (finalCheck.rows.length > 0) {
      const final = finalCheck.rows[0];
      console.log(`   Company 62 Client ID: ${final.client_id}`);
      console.log(`   Last Updated: ${final.updated_at}`);
      
      if (final.client_id === newClientId) {
        console.log('   ✅ Client ID successfully updated!');
      } else {
        console.log('   ❌ Client ID still not updated');
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugClientIdUpdate();
