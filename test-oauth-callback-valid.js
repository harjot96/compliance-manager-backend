#!/usr/bin/env node

// Test OAuth callback with valid token
const axios = require('axios');

async function testOAuthCallbackValid() {
  try {
    console.log('🧪 Testing OAuth Callback with Valid Token...\n');
    
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOjYyLCJlbWFpbCI6InZjdkBnbWlhbC5jb20iLCJyb2xlIjoiY29tcGFueSIsImlhdCI6MTc1OTE0MDY5MiwiZXhwIjoxNzU5MTQ0MjkyfQ.v-Wu4wt4InKoyzkRQ2O3LH43Q25GGc-nwgxAYMxRyM4';
    
    const testPayload = {
      code: "IMdWMwsK1tO-dTVvkALi7pERBqxiGjV3q-0rsvGBFu8",
      redirect_uri: "https://compliance-manager-frontend.onrender.com/redirecturl",
      state: "xmwxwffqylqzbi590ppea"
    };
    
    console.log('📋 Test payload:', testPayload);
    console.log('🔑 Using valid token for Company 62\n');
    
    try {
      const response = await axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validToken}`
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
      
      // If it's still 400, let's check what specific error
      if (error.response?.status === 400) {
        console.log('\n🔍 400 Error Analysis:');
        console.log('   - This means the request reached the controller');
        console.log('   - Authentication passed (no 401)');
        console.log('   - Error is in the OAuth logic itself');
        
        if (error.response?.data?.error === 'INVALID_STATE') {
          console.log('   - State validation failed');
        } else if (error.response?.data?.error === 'invalid_client') {
          console.log('   - Xero rejected the client credentials');
        } else if (error.response?.data?.error === 'invalid_grant') {
          console.log('   - Authorization code expired or invalid');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testOAuthCallbackValid();
