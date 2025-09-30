#!/usr/bin/env node

// Test connection status for companies
const db = require('./src/config/database');

async function testConnectionStatus() {
  try {
    console.log('🔍 Testing connection status for companies...\n');
    
    // Test with Sam233 company (ID: 7) which has tokens
    const result = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.access_token,
        xs.refresh_token,
        xs.tenant_id,
        xs.organization_name,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.company_id = 7
    `);
    
    if (result.rows.length > 0) {
      const settings = result.rows[0];
      console.log(`Testing with company: ${settings.company_name}`);
      
      const hasCredentials = !!(settings.client_id && settings.redirect_uri);
      const hasValidTokens = !!(settings.access_token && settings.refresh_token);
      
      // Check if tokens are expired
      let tokensValid = false;
      if (settings.access_token && settings.token_expires_at) {
        tokensValid = new Date() < new Date(settings.token_expires_at);
      }
      
      const connected = hasCredentials && hasValidTokens && tokensValid;
      
      console.log(`   Has Credentials: ${hasCredentials}`);
      console.log(`   Has Valid Tokens: ${hasValidTokens}`);
      console.log(`   Tokens Valid: ${tokensValid}`);
      console.log(`   Connected: ${connected}`);
      
      // Parse tenant data if available
      let tenants = [];
      if (settings.tenant_id) {
        tenants = [{
          id: settings.tenant_id,
          name: settings.organization_name || 'Organization',
          organizationName: settings.organization_name || 'Organization'
        }];
      }
      
      console.log(`   Tenants: ${JSON.stringify(tenants)}`);
      
      const connectionStatus = {
        connected,
        hasCredentials,
        hasValidTokens: tokensValid,
        needsOAuth: hasCredentials && (!hasValidTokens || !tokensValid),
        connectionStatus: connected ? 'connected' : (hasCredentials ? 'disconnected' : 'not_configured'),
        message: connected ? 'Xero connected successfully' : 
                 hasCredentials ? 'Not connected to Xero' : 'Xero integration not configured',
        tenants,
        lastConnected: settings.updated_at,
        tokenExpiresAt: settings.token_expires_at
      };
      
      console.log('\n📊 Connection Status Object:');
      console.log(JSON.stringify(connectionStatus, null, 2));
      
    } else {
      console.log('❌ No company found with ID 7');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testConnectionStatus();
