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
        xs.tenant_name,
        xs.is_connected,
        xs.connection_status,
        xs.last_connected,
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
      console.log(`   Tenant Name: ${row.tenant_name || 'NOT SET'}`);
      console.log(`   Is Connected: ${row.is_connected}`);
      console.log(`   Connection Status: ${row.connection_status || 'NOT SET'}`);
      console.log(`   Last Connected: ${row.last_connected || 'NEVER'}`);
      console.log(`   Updated: ${row.updated_at}`);
      console.log('');
    });
    
    // Check if any companies have tokens but are marked as not connected
    const disconnectedWithTokens = result.rows.filter(row => 
      row.access_token && !row.is_connected
    );
    
    if (disconnectedWithTokens.length > 0) {
      console.log('⚠️ Found companies with tokens but marked as disconnected:');
      disconnectedWithTokens.forEach(row => {
        console.log(`   - ${row.company_name} (ID: ${row.company_id})`);
      });
      console.log('');
    }
    
    // Check recent OAuth activity
    console.log('🔍 Checking recent OAuth activity...');
    const recentActivity = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.updated_at,
        xs.last_connected
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.updated_at > NOW() - INTERVAL '1 hour'
      ORDER BY xs.updated_at DESC
    `);
    
    if (recentActivity.rows.length > 0) {
      console.log(`Found ${recentActivity.rows.length} companies with recent activity:`);
      recentActivity.rows.forEach(row => {
        console.log(`   - ${row.company_name}: Updated ${row.updated_at}, Last Connected ${row.last_connected}`);
      });
    } else {
      console.log('No recent OAuth activity found in the last hour');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugConnectionStatus();
