#!/usr/bin/env node

// Check specific company settings
const db = require('./src/config/database');

async function checkCompanySettings() {
  try {
    console.log('🔍 Checking company settings...\n');
    
    const result = await db.query(`
      SELECT * FROM xero_settings WHERE company_id = 7
    `);
    
    if (result.rows.length > 0) {
      const settings = result.rows[0];
      console.log('Company 7 (Sam233) settings:');
      Object.keys(settings).forEach(key => {
        const value = settings[key];
        if (key === 'client_secret' || key === 'access_token' || key === 'refresh_token') {
          console.log(`   ${key}: ${value ? 'SET' : 'NOT SET'}`);
        } else {
          console.log(`   ${key}: ${value || 'NULL'}`);
        }
      });
    } else {
      console.log('No settings found for company 7');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkCompanySettings();
