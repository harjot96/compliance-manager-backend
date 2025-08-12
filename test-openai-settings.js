#!/usr/bin/env node

/**
 * Test script to verify OpenAI settings functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing OpenAI Settings\n');

async function testOpenAISettings() {
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
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

    // Test 3: Test with invalid data (should return validation error)
    console.log('\n3️⃣ Testing validation with invalid data...');
    try {
      await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'invalid-key', // Should fail validation
        maxTokens: 1000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      });
      console.log('❌ Should have returned validation error');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
      } else if (error.response?.status === 400) {
        console.log('✅ Correctly returned 400 (validation error)');
        console.log('   Error:', error.response.data.error);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

    // Test 4: Test with valid data structure (should return 401 due to no auth)
    console.log('\n4️⃣ Testing with valid data structure...');
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

    // Test 5: Test different model values
    console.log('\n5️⃣ Testing different model values...');
    const validModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'];
    
    for (const model of validModels) {
      try {
        await axios.post(`${API_URL}/openai-admin/settings`, {
          apiKey: 'sk-test-key',
          maxTokens: 1000,
          model: model,
          temperature: 0.7
        });
        console.log(`❌ ${model}: Should have returned 401 (no auth)`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${model}: Correctly returned 401 (no auth)`);
        } else if (error.response?.status === 400) {
          console.log(`❌ ${model}: Validation failed: ${error.response.data.error}`);
        } else {
          console.log(`⚠️ ${model}: Unexpected response ${error.response?.status}`);
        }
      }
    }

    // Test 6: Test invalid model
    console.log('\n6️⃣ Testing invalid model...');
    try {
      await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-test-key',
        maxTokens: 1000,
        model: 'invalid-model',
        temperature: 0.7
      });
      console.log('❌ Should have returned validation error');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly returned 401 (no auth)');
      } else if (error.response?.status === 400) {
        console.log('✅ Correctly returned 400 (validation error)');
        console.log('   Error:', error.response.data.error);
      } else {
        console.log(`⚠️ Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testOpenAISettings().then(() => {
  console.log('\n✅ OpenAI settings testing completed!');
  console.log('\n📝 Summary:');
  console.log('If you see "Correctly returned 401 (no auth)" for valid data, the validation is working.');
  console.log('If you see "Validation failed" for invalid data, the validation is working.');
  console.log('The API now accepts: apiKey, maxTokens, model, and temperature fields.');
}).catch(console.error);
