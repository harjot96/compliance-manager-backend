#!/usr/bin/env node

// Simple script to verify both client ID and client secret are correct
const db = require('./src/config/database');

const CORRECT_CLIENT_ID = 'BE4B464D-1234-5678-9ABC-DEF012345678';
const CORRECT_CLIENT_SECRET = '0IWqAYwVTbWVg4cQj_Kyu9UA-vnGn4qvWd09Qrbim_Qg2uWQ';

async function verifyCredentials() {
  try {
    console.log('🔍 Verifying Xero Client ID and Secret...\n');
    
    // Get total companies
    const totalResult = await db.query(`
      SELECT COUNT(*) as total
      FROM companies 
      WHERE is_active = true
    `);
    const totalCompanies = totalResult.rows[0].total;
    
    // Get companies with correct client ID
    const correctIdResult = await db.query(`
      SELECT COUNT(*) as count
      FROM xero_settings 
      WHERE client_id = $1
    `, [CORRECT_CLIENT_ID]);
    const correctIdCount = correctIdResult.rows[0].count;
    
    // Get companies with correct client secret
    const correctSecretResult = await db.query(`
      SELECT COUNT(*) as count
      FROM xero_settings 
      WHERE client_secret = $1
    `, [CORRECT_CLIENT_SECRET]);
    const correctSecretCount = correctSecretResult.rows[0].count;
    
    // Get companies with both correct
    const bothCorrectResult = await db.query(`
      SELECT COUNT(*) as count
      FROM xero_settings 
      WHERE client_id = $1 AND client_secret = $2
    `, [CORRECT_CLIENT_ID, CORRECT_CLIENT_SECRET]);
    const bothCorrectCount = bothCorrectResult.rows[0].count;
    
    console.log('📊 CREDENTIAL VERIFICATION RESULTS:');
    console.log(`   🏢 Total active companies: ${totalCompanies}`);
    console.log(`   ✅ Companies with correct client ID: ${correctIdCount}/${totalCompanies} (${Math.round(correctIdCount/totalCompanies*100)}%)`);
    console.log(`   ✅ Companies with correct client secret: ${correctSecretCount}/${totalCompanies} (${Math.round(correctSecretCount/totalCompanies*100)}%)`);
    console.log(`   🎯 Companies with both correct: ${bothCorrectCount}/${totalCompanies} (${Math.round(bothCorrectCount/totalCompanies*100)}%)`);
    
    console.log('\n🔧 CREDENTIALS:');
    console.log(`   Client ID: ${CORRECT_CLIENT_ID}`);
    console.log(`   Client Secret: ${CORRECT_CLIENT_SECRET.substring(0, 8)}...`);
    
    if (bothCorrectCount === totalCompanies) {
      console.log('\n🎉 SUCCESS: All companies have both correct client ID and client secret!');
      console.log('✅ The Xero Client Secret field should now be properly filled in the UI.');
    } else {
      console.log('\n⚠️  Some companies still need attention.');
      console.log(`   Missing client ID: ${totalCompanies - correctIdCount} companies`);
      console.log(`   Missing client secret: ${totalCompanies - correctSecretCount} companies`);
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  } finally {
    process.exit(0);
  }
}

verifyCredentials();
