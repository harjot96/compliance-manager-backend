#!/usr/bin/env node

// Script to ensure all companies have Xero settings
const db = require('./src/config/database');

async function ensureAllCompaniesHaveXeroSettings() {
  try {
    console.log('🔍 Ensuring all companies have Xero settings...');
    
    // Get super admin settings to copy from
    const superAdminResult = await db.query(`
      SELECT client_id, client_secret, redirect_uri 
      FROM xero_settings 
      WHERE company_id IN (6, 29) 
      AND client_id IS NOT NULL 
      AND client_secret IS NOT NULL
      LIMIT 1
    `);
    
    if (superAdminResult.rows.length === 0) {
      console.log('❌ No super admin with valid Xero settings found');
      console.log('   Please configure Xero settings for company ID 6 or 29 first');
      return;
    }
    
    const superAdminSettings = superAdminResult.rows[0];
    console.log(`✅ Found super admin settings to copy from:`);
    console.log(`   Client ID: ${superAdminSettings.client_id.substring(0, 8)}...`);
    console.log(`   Redirect URI: ${superAdminSettings.redirect_uri}`);
    
    // Find companies without Xero settings
    const companiesWithoutSettings = await db.query(`
      SELECT id, email 
      FROM companies 
      WHERE id NOT IN (
        SELECT company_id 
        FROM xero_settings 
        WHERE company_id IS NOT NULL 
        AND client_id IS NOT NULL
      )
      ORDER BY id
    `);
    
    console.log(`\n📊 Found ${companiesWithoutSettings.rows.length} companies without Xero settings`);
    
    if (companiesWithoutSettings.rows.length === 0) {
      console.log('✅ All companies already have Xero settings!');
      return;
    }
    
    console.log('\n🔧 Assigning Xero settings to companies without them...');
    
    for (const company of companiesWithoutSettings.rows) {
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
          superAdminSettings.client_id,
          superAdminSettings.client_secret,
          superAdminSettings.redirect_uri
        ]);
        
        console.log(`  ✅ Assigned settings to Company ${company.id}: ${company.email}`);
      } catch (error) {
        console.error(`  ❌ Failed to assign to Company ${company.id}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Completed! All companies now have Xero settings.`);
    console.log(`   You should no longer see "Xero settings not found" errors.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
ensureAllCompaniesHaveXeroSettings();
