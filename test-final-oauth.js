#!/usr/bin/env node

// Final OAuth callback test with proper token
const axios = require('axios');

async function testFinalOAuth() {
  try {
    console.log('🧪 Final OAuth Callback Test...\n');
    
    const properToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImlhdCI6MTc1OTE0MDc1NSwiZXhwIjoxNzU5MTQ0MzU1fQ.SOn0jxFj-z3dI_c70a1YsnPpd7hmXDHQ3TBx8rN0Tmw';
    
    const testPayload = {
      code: "IMdWMwsK1tO-dTVvkALi7pERBqxiGjV3q-0rsvGBFu8",
      redirect_uri: "https://compliance-manager-frontend.onrender.com/redirecturl",
      state: "xmwxwffqylqzbi590ppea"
    };
    
    console.log('📋 Test payload:', testPayload);
    console.log('🔑 Using proper token for Company 62\n');
    
    try {
      const response = await axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${properToken}`
        }
      });
      
      console.log('✅ OAuth callback successful!');
      console.log('📊 Response:', response.data);
      
    } catch (error) {
      console.log('❌ OAuth callback failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
      console.log('   Error:', error.response?.data?.error);
      
      if (error.response?.data?.details) {
        console.log('   Details:', error.response?.data?.details);
      }
      
      console.log('\n🔍 Full error response:');
      console.log(JSON.stringify(error.response?.data, null, 2));
      
      // Analyze the specific error
      if (error.response?.status === 400) {
        console.log('\n🎯 400 Error Analysis:');
        if (error.response?.data?.error === 'invalid_client') {
          console.log('   ❌ Xero rejected the client credentials');
          console.log('   💡 Solution: Update with real Xero Client ID and Secret');
        } else if (error.response?.data?.error === 'invalid_grant') {
          console.log('   ❌ Authorization code expired or invalid');
          console.log('   💡 Solution: Get a fresh authorization code');
        } else if (error.response?.data?.error === 'INVALID_STATE') {
          console.log('   ❌ OAuth state validation failed');
          console.log('   💡 Solution: Check state storage and validation logic');
        } else {
          console.log('   ❌ Unknown 400 error');
          console.log('   💡 Solution: Check backend logs for more details');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testFinalOAuth();
