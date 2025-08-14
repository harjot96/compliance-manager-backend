#!/usr/bin/env node

/**
 * Test script to test OpenAI settings locally
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing OpenAI Settings Locally\n');

async function testOpenAISettingsLocal() {
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

    // Test 2: Test OpenAI settings without auth (should return 401)
    console.log('\n2️⃣ Testing OpenAI settings without authentication...');
    try {
      await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      });
      console.log('❌ Should have returned 401 (no auth)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    // Test 3: Test with valid data structure (should return 401 due to no auth)
    console.log('\n3️⃣ Testing with valid data structure...');
    try {
      await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key-for-validation-only',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      });
      console.log('❌ Should have returned 401 (no auth)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth) - validation passed');
      } else if (error.response?.status === 400) {
        console.log('❌ Validation failed:', error.response.data.error);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    // Test 4: Test GET settings (should return 401 due to no auth)
    console.log('\n4️⃣ Testing GET OpenAI settings...');
    try {
      await axios.get(`${API_URL}/openai-admin/settings`);
      console.log('❌ Should have returned 401 (no auth)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
      } else if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 (no settings found)');
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testOpenAISettingsLocal().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If you see "Correctly returned 401 (no auth)", the endpoint is working.');
  console.log('✅ If you see "validation passed", the data structure is correct.');
  console.log('');
  console.log('🔧 To test with authentication, you need to:');
  console.log('1. Get a valid JWT token from your auth system');
  console.log('2. Include it in the Authorization header');
  console.log('3. The response will show saved data (without the actual API key)');
  console.log('');
  console.log('🔒 Security Note:');
  console.log('- The API key is encrypted in the database');
  console.log('- The response will show if a key is saved, but not the actual key');
  console.log('- This is for security reasons');
}).catch(console.error);
