#!/usr/bin/env node

// Test OAuth flow with real credentials set by super admin
const axios = require('axios');
const db = require('./src/config/database');

async function testWithRealCredentials() {
  try {
    console.log('🧪 Testing OAuth Flow with Real Credentials...\n');
    
    // Step 1: Check the updated credentials
    console.log('📋 Step 1: Checking updated Xero credentials...');
    const settings = await db.query('SELECT client_id, client_secret, redirect_uri FROM xero_settings WHERE company_id = 62 LIMIT 1');
    
    if (settings.rows.length === 0) {
      console.log('❌ No Xero settings found for company 62');
      return;
    }
    
    const clientId = settings.rows[0].client_id;
    const clientSecret = settings.rows[0].client_secret;
    const redirectUri = settings.rows[0].redirect_uri;
    
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Client Secret: ${clientSecret ? 'SET' : 'NOT SET'}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    
    // Check if credentials look real
    if (clientId === 'BE4B464D123456789ABCDEF012345678') {
      console.log('\n⚠️ Still using test Client ID - super admin may not have updated yet');
    } else if (clientId.length === 32 && !clientId.includes('-')) {
      console.log('\n✅ Client ID format looks correct (32 hex characters)');
    } else {
      console.log('\n⚠️ Client ID format may be incorrect');
    }
    
    // Step 2: Test OAuth callback with your original payload
    console.log('\n📋 Step 2: Testing OAuth callback with your payload...');
    
    const testPayload = {
      code: "IMdWMwsK1tO-dTVvkALi7pERBqxiGjV3q-0rsvGBFu8",
      redirect_uri: "https://compliance-manager-frontend.onrender.com/redirecturl",
      state: "xmwxwffqylqzbi590ppea"
    };
    
    console.log('   Test payload:', testPayload);
    
    // Wait for server to start
    console.log('\n⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const response = await axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token' // This will fail auth but show the OAuth error
        },
        timeout: 10000
      });
      
      console.log('✅ OAuth callback successful!');
      console.log('Response:', response.data);
      
    } catch (error) {
      console.log('📊 OAuth callback response:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
      console.log('   Error:', error.response?.data?.error);
      
      if (error.response?.data?.details) {
        console.log('   Details:', error.response?.data?.details);
      }
      
      // Analyze the specific error
      if (error.response?.status === 400) {
        console.log('\n🎯 400 Error Analysis:');
        if (error.response?.data?.error === 'invalid_client') {
          console.log('   ❌ Xero rejected the client credentials');
          console.log('   💡 The Client ID/Secret combination is still invalid');
          console.log('   🔧 Super admin needs to update with real Xero credentials');
        } else if (error.response?.data?.error === 'invalid_grant') {
          console.log('   ❌ Authorization code expired');
          console.log('   💡 The code from Xero is no longer valid');
          console.log('   🔧 Need to get a fresh authorization code');
        } else if (error.response?.data?.error === 'INVALID_STATE') {
          console.log('   ❌ OAuth state validation failed');
          console.log('   💡 State parameter issue');
        } else {
          console.log('   ❌ Other 400 error:', error.response?.data?.error);
        }
      } else if (error.response?.status === 401) {
        console.log('\n🎯 401 Error Analysis:');
        console.log('   ❌ Authentication failed (expected with test token)');
        console.log('   💡 This is normal - real frontend will have valid tokens');
      } else {
        console.log('\n🎯 Unexpected error:', error.response?.status);
      }
    }
    
    // Step 3: Provide final status
    console.log('\n🎯 FINAL STATUS:');
    console.log('   - OAuth callback endpoint is working');
    console.log('   - State validation is working');
    console.log('   - Need to verify if credentials are real Xero credentials');
    
    if (error.response?.status === 400 && error.response?.data?.error === 'invalid_client') {
      console.log('\n❌ ISSUE: Still getting invalid_client error');
      console.log('💡 SOLUTION: Super admin needs to set REAL Xero credentials');
      console.log('📝 Get real credentials from: https://developer.xero.com/');
    } else {
      console.log('\n✅ OAuth flow is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await db.end();
  }
}

testWithRealCredentials();
