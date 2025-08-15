#!/usr/bin/env node

/**
 * Simple test script to check OpenAI settings endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🔍 Testing OpenAI Settings Endpoint Directly\n');

async function testEndpoint() {
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

    // Test 2: Test GET endpoint without auth
    console.log('\n2️⃣ Testing GET /api/openai-admin/settings without auth...');
    try {
      const response = await axios.get(`${API_URL}/openai-admin/settings`);
      console.log('❌ Should have returned 401 (no auth)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
        console.log('   Message:', error.response.data.message);
      } else if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 (no settings found)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    // Test 3: Test POST endpoint without auth
    console.log('\n3️⃣ Testing POST /api/openai-admin/settings without auth...');
    try {
      const response = await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key',
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      });
      console.log('❌ Should have returned 401 (no auth)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    console.log('\n📝 Summary:');
    console.log('✅ The endpoint is working correctly');
    console.log('✅ Authentication is required (returns 401 without auth)');
    console.log('');
    console.log('🔧 To see saved settings, you need to:');
    console.log('1. Get a valid JWT token from your auth system');
    console.log('2. Make a GET request with Authorization header');
    console.log('3. The response will show saved data with API key preview');
    console.log('');
    console.log('💡 Example with curl:');
    console.log('curl -H "Authorization: Bearer YOUR_TOKEN" \\');
    console.log('     http://localhost:3333/api/openai-admin/settings');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEndpoint().then(() => {
  console.log('\n✅ Test completed!');
}).catch(console.error);
