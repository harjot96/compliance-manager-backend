#!/usr/bin/env node

// Script to test OAuth callback endpoint
const axios = require('axios');

async function testOAuthCallback() {
  try {
    console.log('🔍 Testing OAuth callback endpoint...\n');
    
    const testData = {
      code: 'test_code_123',
      state: 'test_state_456',
      redirect_uri: 'https://compliance-manager-frontend.onrender.com/redirecturl'
    };
    
    console.log('📋 Test data:', testData);
    
    const response = await axios.post(
      'https://compliance-manager-backend.onrender.com/api/xero-plug-play/oauth-callback',
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        }
      }
    );
    
    console.log('✅ Response:', response.data);
    
  } catch (error) {
    console.log('❌ Error response:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Headers:', error.response?.headers);
  }
}

testOAuthCallback();
