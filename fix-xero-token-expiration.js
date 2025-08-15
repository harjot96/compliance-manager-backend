#!/usr/bin/env node

/**
 * Comprehensive Xero Token Expiration Fix
 * Diagnoses and fixes token expiration issues
 */

const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'compliance_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
});

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🔧 Xero Token Expiration Fix Tool\n');

async function fixXeroTokenExpiration() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node fix-xero-token-expiration.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Diagnosing Xero connection status...');
    
    try {
      const response = await axios.get(`${API_URL}/xero/connection-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Connection status retrieved');
      console.log('📊 Status:', response.data.data.connectionStatus);
      console.log('📊 Has valid tokens:', response.data.data.hasValidTokens);
      console.log('📊 Tenants:', response.data.data.tenants?.length || 0);
      
      if (response.data.data.connectionStatus === 'connected') {
        console.log('✅ Xero connection is working properly');
        return;
      }
      
    } catch (error) {
      console.log('❌ Connection status check failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n2️⃣ Checking database for Xero settings...');
    
    try {
      // Get company ID from token
      const companyResponse = await axios.get(`${API_URL}/companies/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const companyId = companyResponse.data.data.id;
      console.log('📊 Company ID:', companyId);
      
      // Check Xero settings in database
      const result = await pool.query(
        'SELECT * FROM xero_settings WHERE company_id = $1',
        [companyId]
      );
      
      if (result.rows.length === 0) {
        console.log('❌ No Xero settings found in database');
        console.log('💡 Solution: Complete the Xero OAuth flow');
        return;
      }
      
      const settings = result.rows[0];
      console.log('📊 Xero settings found:');
      console.log(`   - Access token: ${settings.access_token ? 'Present' : 'Missing'}`);
      console.log(`   - Refresh token: ${settings.refresh_token ? 'Present' : 'Missing'}`);
      console.log(`   - Client ID: ${settings.client_id ? 'Present' : 'Missing'}`);
      console.log(`   - Client Secret: ${settings.client_secret ? 'Present' : 'Missing'}`);
      console.log(`   - Token expires at: ${settings.token_expires_at || 'Not set'}`);
      
      // Check if tokens are expired
      if (settings.token_expires_at) {
        const expiresAt = new Date(settings.token_expires_at);
        const now = new Date();
        const isExpired = expiresAt < now;
        console.log(`   - Token expired: ${isExpired ? 'Yes' : 'No'}`);
        console.log(`   - Expires in: ${Math.floor((expiresAt - now) / 1000 / 60)} minutes`);
      }
      
    } catch (error) {
      console.log('❌ Database check failed:', error.message);
    }

    console.log('\n3️⃣ Attempting manual token refresh...');
    
    try {
      const refreshResponse = await axios.post(`${API_URL}/xero/refresh-token`, {
        refreshToken: 'your-refresh-token-here', // This will be replaced
        companyId: companyId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Manual token refresh successful');
      console.log('📊 New tokens received');
      
    } catch (error) {
      console.log('❌ Manual token refresh failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n4️⃣ Testing Xero OAuth flow...');
    
    try {
      const loginResponse = await axios.get(`${API_URL}/xero/login`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ OAuth login URL generated');
      console.log('📊 Auth URL:', loginResponse.data.data.authUrl);
      console.log('📊 State:', loginResponse.data.data.state);
      
      console.log('\n💡 Next Steps:');
      console.log('1. Visit the auth URL above');
      console.log('2. Complete the Xero authorization');
      console.log('3. You will be redirected back to your app');
      console.log('4. The tokens will be automatically updated');
      
    } catch (error) {
      console.log('❌ OAuth login failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n5️⃣ Checking for common issues...');
    
    // Check environment variables
    console.log('📊 Environment check:');
    console.log(`   - XERO_CLIENT_ID: ${process.env.XERO_CLIENT_ID ? 'Set' : 'Missing'}`);
    console.log(`   - XERO_CLIENT_SECRET: ${process.env.XERO_CLIENT_SECRET ? 'Set' : 'Missing'}`);
    console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
    
    if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET) {
      console.log('⚠️ Missing Xero environment variables');
      console.log('💡 Solution: Set XERO_CLIENT_ID and XERO_CLIENT_SECRET in your environment');
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixXeroTokenExpiration().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If connection status shows "connected", tokens are working');
  console.log('❌ If you see "reconnect_required", follow the OAuth steps above');
  console.log('💡 Most common solution: Complete the Xero OAuth flow again');
  console.log('');
  console.log('🔧 Common causes of token expiration:');
  console.log('- Inactive account (not using integration for 30+ days)');
  console.log('- Xero security policy changes');
  console.log('- Multiple logins from different devices');
  console.log('- Network issues during token refresh');
}).catch(console.error);
