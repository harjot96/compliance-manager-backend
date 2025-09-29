#!/usr/bin/env node

// Script to check Xero settings in the database
const db = require('./src/config/database');

async function checkXeroSettings() {
  try {
    console.log('🔍 Checking Xero settings in database...\n');
    
    // Check all Xero settings
    const result = await db.query(`
      SELECT 
        xs.id,
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.redirect_uri,
        xs.access_token,
        xs.refresh_token,
        xs.token_expires_at,
        xs.tenant_id,
        xs.created_at,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.company_id
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No Xero settings found in database');
      console.log('💡 You need to configure Xero client credentials first');
      console.log('📝 Go to: /admin/xero-manager (Super Admin only)');
      return;
    }
    
    console.log(`✅ Found ${result.rows.length} Xero settings:\n`);
    
    result.rows.forEach((setting, index) => {
      console.log(`📋 Company ${index + 1}: ${setting.company_name} (ID: ${setting.company_id})`);
      console.log(`   Client ID: ${setting.client_id ? `${setting.client_id.substring(0, 8)}...` : 'NOT SET'}`);
      console.log(`   Client Secret: ${setting.client_secret ? 'SET' : 'NOT SET'}`);
      console.log(`   Redirect URI: ${setting.redirect_uri || 'NOT SET'}`);
      console.log(`   Access Token: ${setting.access_token ? 'SET' : 'NOT SET'}`);
      console.log(`   Refresh Token: ${setting.refresh_token ? 'SET' : 'NOT SET'}`);
      console.log(`   Tenant ID: ${setting.tenant_id || 'NOT SET'}`);
      console.log(`   Token Expires: ${setting.token_expires_at || 'NOT SET'}`);
      console.log(`   Created: ${setting.created_at}`);
      console.log(`   Updated: ${setting.updated_at}`);
      console.log('');
    });
    
    // Check for common issues
    console.log('🔍 Checking for common issues:\n');
    
    const issues = [];
    
    result.rows.forEach((setting) => {
      if (!setting.client_id || setting.client_id.trim() === '') {
        issues.push(`❌ Company ${setting.company_name}: Client ID is missing`);
      }
      if (!setting.client_secret || setting.client_secret.trim() === '') {
        issues.push(`❌ Company ${setting.company_name}: Client Secret is missing`);
      }
      if (!setting.redirect_uri || setting.redirect_uri.trim() === '') {
        issues.push(`❌ Company ${setting.company_name}: Redirect URI is missing`);
      }
      if (setting.redirect_uri && !setting.redirect_uri.includes('onrender.com')) {
        issues.push(`⚠️ Company ${setting.company_name}: Redirect URI doesn't use production domain`);
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ No issues found with Xero settings');
    } else {
      console.log('Issues found:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log('\n💡 To fix issues:');
    console.log('   1. Go to: /admin/xero-manager (Super Admin only)');
    console.log('   2. Configure Client ID and Client Secret');
    console.log('   3. Set Redirect URI to: https://compliance-manager-frontend.onrender.com/redirecturl');
    console.log('   4. Save settings for all companies');
    
  } catch (error) {
    console.error('❌ Error checking Xero settings:', error);
  } finally {
    await db.end();
  }
}

checkXeroSettings();
