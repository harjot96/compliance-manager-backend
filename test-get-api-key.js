#!/usr/bin/env node

/**
 * Test script for the new API key retrieval endpoint
 * WARNING: This endpoint returns the full API key - use with caution
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🔑 Testing OpenAI API Key Retrieval (SECURE ENDPOINT)\n');

async function testGetApiKey() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-get-api-key.js YOUR_JWT_TOKEN');
      console.log('');
      console.log('⚠️  SECURITY WARNING:');
      console.log('   This endpoint returns the FULL API key.');
      console.log('   Only use this for admin purposes.');
      console.log('   Never store the key in frontend code.');
      return;
    }

    console.log('1️⃣ Testing GET /api/openai-admin/api-key...');
    console.log('⚠️  This will return the FULL API key - use with caution!');
    
    try {
      const response = await axios.get(`${API_URL}/openai-admin/api-key`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API key retrieved successfully!');
      console.log('📊 Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      console.log('\n🔒 SECURITY REMINDERS:');
      console.log('- Use this key immediately and discard it');
      console.log('- Do NOT store it in localStorage or sessionStorage');
      console.log('- Do NOT log it to console or send it in requests');
      console.log('- Consider using server-side API calls instead');
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 403) {
        console.log('❌ Authorization failed (403) - need superadmin role');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 404) {
        console.log('❌ No settings found (404)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testGetApiKey().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If successful, you now have the full API key');
  console.log('⚠️  Use it immediately and do not store it');
  console.log('🔒 Consider using server-side API calls for better security');
}).catch(console.error);
