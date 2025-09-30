#!/usr/bin/env node

// Script to check and fix Xero settings for a company
const db = require('./src/config/database');

async function checkAndFixXeroSettings() {
  try {
    console.log('🔍 Checking Xero settings in database...');
    
    // Check all companies and their Xero settings
    const companiesResult = await db.query(`
      SELECT 
        c.id as company_id,
        c.email as company_email,
        xs.client_id,
        xs.client_secret,
        xs.redirect_uri,
        xs.created_at as settings_created,
        xs.updated_at as settings_updated
      FROM companies c
      LEFT JOIN xero_settings xs ON c.id = xs.company_id
      ORDER BY c.id
    `);
    
    console.log('\n📊 Current Xero Settings Status:');
    console.log('='.repeat(80));
    
    let companiesWithSettings = 0;
    let companiesWithoutSettings = 0;
    let superAdminCompany = null;
    
    for (const row of companiesResult.rows) {
      const hasSettings = !!row.client_id;
      const status = hasSettings ? '✅ HAS SETTINGS' : '❌ NO SETTINGS';
      
      console.log(`Company ${row.company_id}: ${row.company_email || 'Unknown'} - ${status}`);
      
      if (hasSettings) {
        console.log(`  └─ Client ID: ${row.client_id ? row.client_id.substring(0, 8) + '...' : 'None'}`);
        console.log(`  └─ Redirect URI: ${row.redirect_uri || 'None'}`);
        console.log(`  └─ Settings Updated: ${row.settings_updated || 'Never'}`);
        companiesWithSettings++;
        
        // Check if this is a super admin company (usually has admin privileges)
        if (row.company_email && row.company_email.includes('admin')) {
          superAdminCompany = row;
        }
      } else {
        companiesWithoutSettings++;
      }
      console.log('');
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`- Companies with Xero settings: ${companiesWithSettings}`);
    console.log(`- Companies without Xero settings: ${companiesWithoutSettings}`);
    
    // Check if we have a super admin company with settings
    if (superAdminCompany && superAdminCompany.client_id) {
      console.log(`\n🎯 Super Admin Company Found: Company ${superAdminCompany.company_id}`);
      console.log(`   Client ID: ${superAdminCompany.client_id.substring(0, 8)}...`);
      
      // Offer to auto-assign settings to companies without them
      if (companiesWithoutSettings > 0) {
        console.log(`\n🔧 Auto-assigning Xero settings to ${companiesWithoutSettings} companies without settings...`);
        
        const companiesWithoutSettingsResult = await db.query(`
          SELECT id, email FROM companies 
          WHERE id NOT IN (SELECT company_id FROM xero_settings WHERE company_id IS NOT NULL)
          ORDER BY id
        `);
        
        for (const company of companiesWithoutSettingsResult.rows) {
          try {
            await db.query(`
              INSERT INTO xero_settings (
                company_id, 
                client_id, 
                client_secret, 
                redirect_uri, 
                created_at, 
                updated_at
              ) VALUES ($1, $2, $3, $4, NOW(), NOW())
            `, [
              company.id,
              superAdminCompany.client_id,
              superAdminCompany.client_secret,
              superAdminCompany.redirect_uri
            ]);
            
            console.log(`  ✅ Auto-assigned settings to Company ${company.id}: ${company.email}`);
          } catch (error) {
            console.error(`  ❌ Failed to auto-assign to Company ${company.id}: ${error.message}`);
          }
        }
        
        console.log(`\n🎉 Auto-assignment completed!`);
      } else {
        console.log(`\n✅ All companies already have Xero settings!`);
      }
    } else {
      console.log(`\n⚠️  No super admin company with Xero settings found.`);
      console.log(`   Please configure Xero settings for an admin company first.`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Don't call db.end() as it's a pool
    process.exit(0);
  }
}

// Run the script
checkAndFixXeroSettings();
