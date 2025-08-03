const axios = require('axios');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

async function testOpenAIAdminRoutes() {
  console.log('🧪 Testing OpenAI Admin Routes...\n');

  try {
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data.message);
    console.log('');

    // Test OpenAI admin settings endpoint
    console.log('2. Testing OpenAI admin settings endpoint...');
    try {
      const settingsResponse = await axios.get(`${BASE_URL}/api/openai-admin/settings`);
      console.log('✅ OpenAI admin settings endpoint working:', settingsResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ OpenAI admin settings endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ OpenAI admin settings endpoint error:', error.message);
      }
    }
    console.log('');

    // Test OpenAI admin test-api-key endpoint
    console.log('3. Testing OpenAI admin test-api-key endpoint...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/api/openai-admin/test-api-key`, {
        apiKey: 'sk-test1234567890abcdefghijklmnopqrstuvwxyz'
      });
      console.log('✅ OpenAI admin test-api-key endpoint working:', testResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ OpenAI admin test-api-key endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ OpenAI admin test-api-key endpoint error:', error.message);
      }
    }
    console.log('');

    // Test main OpenAI routes
    console.log('4. Testing main OpenAI routes...');
    try {
      const openaiResponse = await axios.get(`${BASE_URL}/api/openai/settings`);
      console.log('✅ Main OpenAI settings endpoint working:', openaiResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ Main OpenAI settings endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ Main OpenAI settings endpoint error:', error.message);
      }
    }

    console.log('\n🎉 Route testing completed!');

  } catch (error) {
    console.error('❌ Error testing routes:', error.message);
  }
}

testOpenAIAdminRoutes(); 