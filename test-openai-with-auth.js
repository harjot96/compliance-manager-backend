#!/usr/bin/env node

/**
 * Test script to test OpenAI settings with authentication
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

// You'll need to replace this with your actual JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('🔐 Testing OpenAI Settings with Authentication\n');

// Function to generate a test token
function generateTestToken(companyId = 1, role = 'superadmin') {
  const payload = {
    id: companyId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

async function testOpenAISettingsWithAuth() {
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      console.log('💡 Make sure your server is running on localhost:3333');
      return;
    }

    // Test 2: Generate test token
    console.log('\n2️⃣ Generating test authentication token...');
    const testToken = generateTestToken(1, 'superadmin');
    console.log('✅ Test token generated');
    console.log(`   Token: ${testToken.substring(0, 20)}...`);

    // Test 3: Test GET settings with auth
    console.log('\n3️⃣ Testing GET OpenAI settings with authentication...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/settings`, {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET request successful!');
      console.log('📊 Response data:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ No settings found (404) - this is expected if no settings are saved yet');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 401) {
        console.log('❌ Authentication failed (401)');
        console.log('   Message:', error.response.data.message);
        console.log('   💡 Check your JWT_SECRET environment variable');
      } else if (error.response?.status === 403) {
        console.log('❌ Authorization failed (403) - need superadmin role');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    // Test 4: Test POST settings with auth
    console.log('\n4️⃣ Testing POST OpenAI settings with authentication...');
    try {
      const response = await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key-for-validation-only',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${testToken}`,
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
        console.log('   💡 Check your JWT_SECRET environment variable');
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

    // Test 5: Test GET settings again to see what was saved
    console.log('\n5️⃣ Testing GET OpenAI settings again (to see saved data)...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/settings`, {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ GET request successful!');
      console.log('📊 Saved settings:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ No settings found (404)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testOpenAISettingsWithAuth().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If you see "POST request successful!", the settings were saved.');
  console.log('✅ If you see "GET request successful!", you can retrieve the settings.');
  console.log('✅ The response will show saved data including API key preview.');
  console.log('');
  console.log('🔒 Security Features:');
  console.log('- API key is encrypted in the database');
  console.log('- Response shows only last 4 characters of the key');
  console.log('- Full key is never returned in responses');
  console.log('');
  console.log('💡 If authentication fails:');
  console.log('1. Check your JWT_SECRET environment variable');
  console.log('2. Make sure the token is valid');
  console.log('3. Ensure the company has superadmin role');
}).catch(console.error);
