#!/usr/bin/env node

// Debug connection status after OAuth
const db = require('./src/config/database');

async function debugConnectionStatus() {
  try {
    console.log('🔍 Debugging Xero connection status...\n');
    
    // Check all companies with Xero settings
    const result = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.access_token,
        xs.refresh_token,
        xs.tenant_id,
        xs.tenant_data,
        xs.organization_name,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.updated_at DESC
      LIMIT 10
    `);
    
    console.log(`Found ${result.rows.length} companies with Xero settings:\n`);
    
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.company_name}:`);
      console.log(`   Company ID: ${row.company_id}`);
      console.log(`   Client ID: ${row.client_id ? row.client_id.substring(0, 8) + '...' : 'NOT SET'}`);
      console.log(`   Client Secret: ${row.client_secret ? 'SET' : 'NOT SET'}`);
      console.log(`   Access Token: ${row.access_token ? 'SET' : 'NOT SET'}`);
      console.log(`   Refresh Token: ${row.refresh_token ? 'SET' : 'NOT SET'}`);
      console.log(`   Tenant ID: ${row.tenant_id || 'NOT SET'}`);
      console.log(`   Organization Name: ${row.organization_name || 'NOT SET'}`);
      console.log(`   Tenant Data: ${row.tenant_data ? 'SET' : 'NOT SET'}`);
      console.log(`   Updated: ${row.updated_at}`);
      
      // Check if this company has valid tokens (indicating connection)
      const hasValidTokens = row.access_token && row.refresh_token && row.tenant_id;
      console.log(`   Status: ${hasValidTokens ? 'CONNECTED ✅' : 'NOT CONNECTED ❌'}`);
      console.log('');
    });
    
    // Check if any companies have tokens but no tenant data
    const connectedCompanies = result.rows.filter(row => 
      row.access_token && row.refresh_token
    );
    
    console.log(`📊 Summary:`);
    console.log(`   Total companies: ${result.rows.length}`);
    console.log(`   Companies with tokens: ${connectedCompanies.length}`);
    console.log(`   Companies with tenant data: ${connectedCompanies.filter(r => r.tenant_id).length}`);
    
    if (connectedCompanies.length > 0) {
      console.log('\n🔗 Companies that should be connected:');
      connectedCompanies.forEach(row => {
        const hasTenantData = row.tenant_id && row.organization_name;
        console.log(`   - ${row.company_name}: ${hasTenantData ? 'FULLY CONNECTED' : 'TOKENS ONLY'}`);
      });
    }
    
    // Check recent OAuth activity
    console.log('\n🔍 Checking recent OAuth activity...');
    const recentActivity = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.updated_at > NOW() - INTERVAL '2 hours'
      ORDER BY xs.updated_at DESC
    `);
    
    if (recentActivity.rows.length > 0) {
      console.log(`Found ${recentActivity.rows.length} companies with recent activity:`);
      recentActivity.rows.forEach(row => {
        console.log(`   - ${row.company_name}: Updated ${row.updated_at}`);
      });
    } else {
      console.log('No recent OAuth activity found in the last 2 hours');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugConnectionStatus();
