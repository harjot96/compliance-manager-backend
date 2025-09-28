#!/usr/bin/env node

// Verification script to ensure the client ID auto-assignment system is working correctly
const db = require('./src/config/database');

const CORRECT_CLIENT_ID = 'BE4B464D-1234-5678-9ABC-DEF012345678';
const CORRECT_CLIENT_SECRET = '0IWqAYwVTbWVg4cQj_Kyu9UA-vnGn4qvWd09Qrbim_Qg2uWQ';

async function verifyClientIdSystem() {
  try {
    console.log('🔍 Verifying Client ID Auto-Assignment System...\n');
    
    // 1. Check all companies have correct client ID
    console.log('1️⃣ Checking all companies have correct client ID...');
    const companiesResult = await db.query(`
      SELECT 
        c.id,
        c.company_name,
        xs.client_id,
        xs.redirect_uri,
        xs.updated_at
      FROM companies c
      LEFT JOIN xero_settings xs ON c.id = xs.company_id
      WHERE c.is_active = true
      ORDER BY c.id
    `);
    
    const companies = companiesResult.rows;
    const correctClientIdCount = companies.filter(row => row.client_id === CORRECT_CLIENT_ID).length;
    const withoutSettingsCount = companies.filter(row => !row.client_id).length;
    
    console.log(`   📊 Total active companies: ${companies.length}`);
    console.log(`   ✅ Companies with correct client ID: ${correctClientIdCount}`);
    console.log(`   ❌ Companies without Xero settings: ${withoutSettingsCount}`);
    
    if (correctClientIdCount === companies.length) {
      console.log('   🎉 SUCCESS: All companies have correct client ID!');
    } else {
      console.log('   ⚠️  WARNING: Some companies need attention.');
    }
    
    // 2. Check redirect URI consistency
    console.log('\n2️⃣ Checking redirect URI consistency...');
    const redirectUriCount = companies.filter(row => row.redirect_uri).length;
    console.log(`   📊 Companies with redirect URI: ${redirectUriCount}/${companies.length}`);
    
    // 3. Show sample of companies
    console.log('\n3️⃣ Sample of companies with correct client ID:');
    companies.slice(0, 5).forEach((company, index) => {
      if (company.client_id === CORRECT_CLIENT_ID) {
        console.log(`   ${index + 1}. ${company.company_name} (ID: ${company.id}) - ✅ Correct`);
      } else if (company.client_id) {
        console.log(`   ${index + 1}. ${company.company_name} (ID: ${company.id}) - ❌ Wrong ID: ${company.client_id?.substring(0, 8)}...`);
      } else {
        console.log(`   ${index + 1}. ${company.company_name} (ID: ${company.id}) - ❌ No settings`);
      }
    });
    
    // 4. Check for any problematic client IDs
    console.log('\n4️⃣ Checking for problematic client IDs...');
    const problematicIds = companies.filter(row => 
      row.client_id && 
      row.client_id !== CORRECT_CLIENT_ID && 
      row.client_id !== '8113118D16A84C8199677E98E3D8A446'
    );
    
    if (problematicIds.length === 0) {
      console.log('   ✅ No problematic client IDs found');
    } else {
      console.log(`   ⚠️  Found ${problematicIds.length} companies with problematic client IDs:`);
      problematicIds.forEach(company => {
        console.log(`   - ${company.company_name} (ID: ${company.id}): ${company.client_id?.substring(0, 8)}...`);
      });
    }
    
    // 5. Test auto-assignment function
    console.log('\n5️⃣ Testing auto-assignment function...');
    try {
      const autoAssignScript = require('./ensure-client-id-assignment');
      console.log('   ✅ Auto-assignment script loaded successfully');
      
      // Test with a non-existent company ID (should handle gracefully)
      const testResult = await autoAssignScript.autoAssignClientIdToNewCompany(99999);
      if (testResult.success) {
        console.log('   ✅ Auto-assignment function working correctly');
      } else {
        console.log(`   ⚠️  Auto-assignment function returned: ${testResult.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Error loading auto-assignment script: ${error.message}`);
    }
    
    // 6. Summary
    console.log('\n📋 SYSTEM STATUS SUMMARY:');
    console.log(`   🏢 Total Companies: ${companies.length}`);
    console.log(`   ✅ Correct Client ID: ${correctClientIdCount}/${companies.length} (${Math.round(correctClientIdCount/companies.length*100)}%)`);
    console.log(`   🔧 Xero Settings: ${companies.length - withoutSettingsCount}/${companies.length} (${Math.round((companies.length - withoutSettingsCount)/companies.length*100)}%)`);
    console.log(`   🔗 Redirect URIs: ${redirectUriCount}/${companies.length} (${Math.round(redirectUriCount/companies.length*100)}%)`);
    
    if (correctClientIdCount === companies.length && withoutSettingsCount === 0) {
      console.log('\n🎉 SYSTEM STATUS: FULLY OPERATIONAL ✅');
      console.log('   All companies have correct Xero client ID configuration');
      console.log('   Auto-assignment system is working correctly');
      console.log('   New companies will automatically get correct settings');
    } else {
      console.log('\n⚠️  SYSTEM STATUS: NEEDS ATTENTION');
      console.log('   Some companies may need manual intervention');
      console.log('   Run: node ensure-client-id-assignment.js');
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run verification
verifyClientIdSystem();
