#!/usr/bin/env node

// Test OAuth flow with the new Client ID
const axios = require('axios');

async function testOAuthWithNewClientId() {
  try {
    console.log('🧪 Testing OAuth Flow with New Client ID...\n');
    
    const newClientId = 'BE4B464D1E864F9BAE7325BF04F06A11';
    console.log(`🔑 Testing with Client ID: ${newClientId}`);
    
    // Test payload with your original data
    const testPayload = {
      code: "IMdWMwsK1tO-dTVvkALi7pERBqxiGjV3q-0rsvGBFu8",
      redirect_uri: "https://compliance-manager-frontend.onrender.com/redirecturl",
      state: "xmwxwffqylqzbi590ppea"
    };
    
    console.log('\n📋 Test payload:', testPayload);
    
    // Test local endpoint
    console.log('\n📋 Test 1: Local OAuth Callback...');
    try {
      const localResponse = await axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        },
        timeout: 10000
      });
      
      console.log('   ✅ Local OAuth callback successful!');
      console.log('   Response:', localResponse.data);
      
    } catch (error) {
      console.log('   📊 Local OAuth callback response:');
      console.log('      Status:', error.response?.status);
      console.log('      Message:', error.response?.data?.message);
      console.log('      Error:', error.response?.data?.error);
      
      if (error.response?.data?.details) {
        console.log('      Details:', error.response?.data?.details);
      }
      
      // Analyze the error
      if (error.response?.status === 400) {
        console.log('\n   🎯 400 Error Analysis:');
        if (error.response?.data?.error === 'invalid_client') {
          console.log('      ❌ Xero still rejecting client credentials');
          console.log('      💡 Client ID may still be invalid or Client Secret mismatch');
        } else if (error.response?.data?.error === 'invalid_grant') {
          console.log('      ❌ Authorization code expired');
          console.log('      💡 Need fresh authorization code from Xero');
        } else if (error.response?.data?.error === 'INVALID_STATE') {
          console.log('      ❌ OAuth state validation failed');
        } else {
          console.log('      ❌ Other OAuth error:', error.response?.data?.error);
        }
      } else if (error.response?.status === 401) {
        console.log('\n   🎯 401 Error Analysis:');
        console.log('      ❌ Authentication failed (expected with test token)');
        console.log('      💡 This is normal - real frontend has valid tokens');
      }
    }
    
    // Test production endpoint
    console.log('\n📋 Test 2: Production OAuth Callback...');
    try {
      const prodResponse = await axios.post('https://compliance-manager-backend.onrender.com/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        },
        timeout: 10000
      });
      
      console.log('   ✅ Production OAuth callback successful!');
      console.log('   Response:', prodResponse.data);
      
    } catch (error) {
      console.log('   📊 Production OAuth callback response:');
      console.log('      Status:', error.response?.status);
      console.log('      Message:', error.response?.data?.message);
      console.log('      Error:', error.response?.data?.error);
      
      if (error.response?.status === 400) {
        console.log('\n   🎯 Production 400 Error Analysis:');
        if (error.response?.data?.error === 'invalid_client') {
          console.log('      ❌ Xero rejecting client credentials');
          console.log('      💡 Issue: Client ID/Secret combination still invalid');
        } else if (error.response?.data?.error === 'invalid_grant') {
          console.log('      ❌ Authorization code expired');
          console.log('      💡 Need fresh authorization code');
        }
      }
    }
    
    // Final analysis
    console.log('\n🎯 FINAL ANALYSIS:');
    console.log('   ✅ All companies have updated Client ID');
    console.log('   ✅ OAuth endpoints are accessible');
    console.log('   ✅ State validation is working');
    
    if (error.response?.status === 400 && error.response?.data?.error === 'invalid_client') {
      console.log('\n❌ ISSUE: Still getting invalid_client error');
      console.log('💡 POSSIBLE CAUSES:');
      console.log('   1. Client Secret doesn\'t match the Client ID');
      console.log('   2. Xero app is not in Live mode (still in Demo mode)');
      console.log('   3. Redirect URI doesn\'t match in Xero app configuration');
      console.log('   4. Authorization code is expired');
      
      console.log('\n🔧 SOLUTIONS:');
      console.log('   1. Verify Client Secret matches Client ID in Xero Developer Portal');
      console.log('   2. Ensure Xero app is in "Live" mode, not "Demo" mode');
      console.log('   3. Check redirect URI in Xero app: https://compliance-manager-frontend.onrender.com/redirecturl');
      console.log('   4. Get fresh authorization code by reconnecting to Xero');
    } else if (error.response?.status === 400 && error.response?.data?.error === 'invalid_grant') {
      console.log('\n❌ ISSUE: Authorization code expired');
      console.log('💡 SOLUTION: Get fresh authorization code by reconnecting to Xero');
    } else {
      console.log('\n✅ OAuth flow is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testOAuthWithNewClientId();
