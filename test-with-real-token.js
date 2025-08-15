#!/usr/bin/env node

/**
 * Test script to check OpenAI settings with a real token
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

// You can replace this with your actual token
const YOUR_TOKEN = process.argv[2] || 'YOUR_JWT_TOKEN_HERE';

console.log('🔐 Testing OpenAI Settings with Real Token\n');

async function testWithRealToken() {
  try {
    if (YOUR_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
      console.log('❌ Please provide your JWT token as an argument:');
      console.log('   node test-with-real-token.js YOUR_JWT_TOKEN');
      console.log('');
      console.log('💡 To get a token:');
      console.log('1. Login to your application');
      console.log('2. Get the JWT token from your browser/localStorage');
      console.log('3. Use it in this script');
      return;
    }

    console.log('1️⃣ Testing GET /api/openai-admin/settings with your token...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/settings`, {
        headers: {
          'Authorization': `Bearer ${YOUR_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET request successful!');
      console.log('📊 Response data:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ No settings found (404) - no settings have been saved yet');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
        console.log('   💡 Check if your token is valid and not expired');
      } else if (error.response?.status === 403) {
        console.log('❌ Authorization failed (403) - need superadmin role');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    console.log('\n2️⃣ Testing POST /api/openai-admin/settings with your token...');
    console.log('💡 This will save new settings if successful');
    
    try {
      const response = await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-your-openai-api-key-here',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${YOUR_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ POST request successful!');
      console.log('📊 Response data:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 403) {
        console.log('❌ Authorization failed (403) - need superadmin role');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 400) {
        console.log('❌ Validation failed (400)');
        console.log('   Message:', error.response.data.message);
        console.log('   Error:', error.response.data.error);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWithRealToken().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If you see "GET request successful!", you can retrieve saved settings.');
  console.log('✅ If you see "POST request successful!", you can save new settings.');
  console.log('✅ The response will show saved data including API key preview.');
  console.log('');
  console.log('🔒 Security Note:');
  console.log('- The full API key is never returned in responses');
  console.log('- Only the last 4 characters are shown for verification');
  console.log('- The key is encrypted in the database');
}).catch(console.error);
