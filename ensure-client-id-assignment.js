#!/usr/bin/env node

// Comprehensive script to ensure ALL companies have the correct Xero client ID
const db = require('./src/config/database');

const CORRECT_CLIENT_ID = 'BE4B464D-1234-5678-9ABC-DEF012345678';
const CORRECT_CLIENT_SECRET = '0IWqAYwVTbWVg4cQj_Kyu9UA-vnGn4qvWd09Qrbim_Qg2uWQ';
const CORRECT_REDIRECT_URI = 'https://compliance-manager-frontend.onrender.com/redirecturl';

async function ensureAllCompaniesHaveCorrectClientId() {
  try {
    console.log('🔍 Checking and updating Xero settings for ALL companies...\n');
    
    // Get all companies
    const companiesResult = await db.query(`
      SELECT c.id, c.company_name, c.is_active
      FROM companies c
      WHERE c.is_active = true
      ORDER BY c.id
    `);
    
    const companies = companiesResult.rows;
    console.log(`📊 Found ${companies.length} active companies:\n`);
    
    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;
    const errors = [];
    
    for (const company of companies) {
      try {
        console.log(`🔧 Processing: ${company.company_name} (ID: ${company.id})`);
        
        // Check if Xero settings exist
        const existingResult = await db.query(
          'SELECT id, client_id FROM xero_settings WHERE company_id = $1',
          [company.id]
        );
        
        if (existingResult.rows.length > 0) {
          const existing = existingResult.rows[0];
          
          // Check if both client ID and secret are correct
          if (existing.client_id === CORRECT_CLIENT_ID && existing.client_secret === CORRECT_CLIENT_SECRET) {
            console.log(`   ✅ Already has correct client ID and secret - skipping`);
            skippedCount++;
          } else {
            // Update with correct client ID
            await db.query(
              `UPDATE xero_settings 
               SET client_id = $1, client_secret = $2, redirect_uri = $3, updated_at = CURRENT_TIMESTAMP 
               WHERE company_id = $4`,
              [CORRECT_CLIENT_ID, CORRECT_CLIENT_SECRET, CORRECT_REDIRECT_URI, company.id]
            );
            const oldId = existing.client_id ? existing.client_id.substring(0, 8) + '...' : 'NULL';
            const oldSecret = existing.client_secret ? existing.client_secret.substring(0, 8) + '...' : 'NULL';
            console.log(`   🔄 Updated client ID from ${oldId} to ${CORRECT_CLIENT_ID.substring(0, 8)}...`);
            console.log(`   🔄 Updated client secret from ${oldSecret} to ${CORRECT_CLIENT_SECRET.substring(0, 8)}...`);
            updatedCount++;
          }
        } else {
          // Create new Xero settings
          await db.query(
            `INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [company.id, CORRECT_CLIENT_ID, CORRECT_CLIENT_SECRET, CORRECT_REDIRECT_URI]
          );
          console.log(`   ➕ Created new Xero settings with correct client ID`);
          createdCount++;
        }
        
      } catch (error) {
        console.error(`   ❌ Error processing company ${company.id}: ${error.message}`);
        errors.push({
          companyId: company.id,
          companyName: company.company_name,
          error: error.message
        });
      }
    }
    
    console.log('\n📈 SUMMARY:');
    console.log(`   Total companies processed: ${companies.length}`);
    console.log(`   ✅ Skipped (already correct): ${skippedCount}`);
    console.log(`   🔄 Updated: ${updatedCount}`);
    console.log(`   ➕ Created new: ${createdCount}`);
    console.log(`   ❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS:');
      errors.forEach(error => {
        console.log(`   - ${error.companyName} (ID: ${error.companyId}): ${error.error}`);
      });
    }
    
    // Verify final state
    console.log('\n🔍 VERIFICATION:');
    const verifyResult = await db.query(`
      SELECT 
        c.company_name,
        xs.client_id,
        xs.redirect_uri,
        xs.updated_at
      FROM companies c
      LEFT JOIN xero_settings xs ON c.id = xs.company_id
      WHERE c.is_active = true
      ORDER BY c.id
    `);
    
    const correctClientIdCount = verifyResult.rows.filter(row => row.client_id === CORRECT_CLIENT_ID).length;
    const withoutSettingsCount = verifyResult.rows.filter(row => !row.client_id).length;
    
    console.log(`   Companies with correct client ID: ${correctClientIdCount}/${companies.length}`);
    console.log(`   Companies without Xero settings: ${withoutSettingsCount}`);
    
    if (correctClientIdCount === companies.length) {
      console.log('\n🎉 SUCCESS: All companies now have the correct Xero client ID!');
    } else {
      console.log('\n⚠️  WARNING: Some companies still need attention.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    process.exit(0);
  }
}

// Auto-assignment function for new companies (called from company registration)
async function autoAssignClientIdToNewCompany(companyId) {
  try {
    console.log(`🔄 Auto-assigning Xero client ID to new company ${companyId}...`);
    
    // Check if settings already exist
    const existingResult = await db.query(
      'SELECT id FROM xero_settings WHERE company_id = $1',
      [companyId]
    );
    
    if (existingResult.rows.length > 0) {
      console.log(`   ✅ Company ${companyId} already has Xero settings`);
      return { success: true, message: 'Settings already exist' };
    }
    
    // Create new settings with correct client ID
    await db.query(
      `INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [companyId, CORRECT_CLIENT_ID, CORRECT_CLIENT_SECRET, CORRECT_REDIRECT_URI]
    );
    
    console.log(`   ✅ Auto-assigned Xero client ID to company ${companyId}`);
    return { success: true, message: 'Client ID auto-assigned successfully' };
    
  } catch (error) {
    console.error(`   ❌ Failed to auto-assign client ID to company ${companyId}: ${error.message}`);
    return { success: false, message: error.message };
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  ensureAllCompaniesHaveCorrectClientId();
} else if (args[0] === 'auto-assign' && args[1]) {
  autoAssignClientIdToNewCompany(parseInt(args[1]));
} else {
  console.log('Usage:');
  console.log('  node ensure-client-id-assignment.js                    # Update all companies');
  console.log('  node ensure-client-id-assignment.js auto-assign <ID>   # Auto-assign to specific company');
}
