#!/usr/bin/env node

// Check if super admin has updated credentials
const db = require('./src/config/database');

async function checkSuperAdminCredentials() {
  try {
    console.log('🔍 Checking Super Admin Credentials Update...\n');
    
    // Check all companies to see current credentials
    const result = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.redirect_uri,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.updated_at DESC
      LIMIT 10
    `);
    
    console.log(`📊 Found ${result.rows.length} companies with Xero settings:\n`);
    
    result.rows.forEach((setting, index) => {
      console.log(`📋 Company ${index + 1}: ${setting.company_name} (ID: ${setting.company_id})`);
      console.log(`   Client ID: ${setting.client_id}`);
      console.log(`   Client Secret: ${setting.client_secret ? 'SET' : 'NOT SET'}`);
      console.log(`   Redirect URI: ${setting.redirect_uri}`);
      console.log(`   Last Updated: ${setting.updated_at}`);
      console.log('');
    });
    
    // Check if any companies have real-looking credentials
    const realCredentials = result.rows.filter(row => 
      row.client_id !== 'BE4B464D123456789ABCDEF012345678' &&
      row.client_id !== 'BE4B464D-1234-5678-9ABC-DEF012345678' &&
      row.client_id && row.client_id.trim() !== ''
    );
    
    if (realCredentials.length > 0) {
      console.log('✅ Found companies with updated credentials:');
      realCredentials.forEach(company => {
        console.log(`   - ${company.company_name}: ${company.client_id}`);
      });
    } else {
      console.log('❌ No companies have real Xero credentials yet');
      console.log('\n💡 Super Admin needs to:');
      console.log('   1. Go to: https://compliance-manager-frontend.onrender.com/admin/xero-manager');
      console.log('   2. Login as Super Admin');
      console.log('   3. Enter REAL Xero Client ID and Client Secret');
      console.log('   4. Save settings for all companies');
      console.log('\n📝 Get real credentials from: https://developer.xero.com/');
    }
    
    // Check SuperAdmin company specifically
    const superAdminResult = await db.query(`
      SELECT xs.client_id, xs.updated_at, c.company_name
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE c.role = 'super_admin' OR c.company_name ILIKE '%admin%'
      ORDER BY xs.updated_at DESC
      LIMIT 1
    `);
    
    if (superAdminResult.rows.length > 0) {
      const superAdmin = superAdminResult.rows[0];
      console.log(`\n👑 Super Admin Company: ${superAdmin.company_name}`);
      console.log(`   Client ID: ${superAdmin.client_id}`);
      console.log(`   Last Updated: ${superAdmin.updated_at}`);
      
      if (superAdmin.client_id === 'BE4B464D123456789ABCDEF012345678') {
        console.log('   ❌ Still using test Client ID');
      } else {
        console.log('   ✅ Has updated Client ID');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkSuperAdminCredentials();
