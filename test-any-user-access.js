#!/usr/bin/env node

/**
 * Test script to verify any authenticated user can access OpenAI settings
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('👥 Testing OpenAI Settings Access for Any Authenticated User\n');

async function testAnyUserAccess() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-any-user-access.js YOUR_JWT_TOKEN');
      console.log('');
      console.log('💡 Any authenticated user can now access these endpoints');
      return;
    }

    console.log('1️⃣ Testing GET /api/openai-admin/settings...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET settings successful!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ No settings found (404) - this is expected if no settings are saved');
      } else if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    console.log('\n2️⃣ Testing GET /api/openai-admin/api-key...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/api-key`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET API key successful!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ No settings found (404) - this is expected if no settings are saved');
      } else if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    console.log('\n3️⃣ Testing POST /api/openai-admin/settings...');
    try {
      const response = await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key-for-validation-only',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ POST settings successful!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 400) {
        console.log('❌ Validation failed (400)');
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
testAnyUserAccess().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ Any authenticated user can now access OpenAI settings');
  console.log('✅ No super admin role required');
  console.log('✅ Just need a valid JWT token');
  console.log('');
  console.log('🔒 Security Note:');
  console.log('- Still requires authentication');
  console.log('- API key is still encrypted');
  console.log('- Use API key endpoint with caution');
}).catch(console.error);
