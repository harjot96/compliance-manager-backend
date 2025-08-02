const axios = require('axios');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

async function testRoutes() {
  console.log('🧪 Testing OpenAI Routes...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint working:', healthResponse.data.message);
    console.log('');

    // Test OpenAI test-api-key endpoint
    console.log('2. Testing OpenAI test-api-key endpoint...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/api/openai/test-api-key`, {
        apiKey: 'sk-test1234567890abcdefghijklmnopqrstuvwxyz'
      });
      console.log('✅ Test API key endpoint working:', testResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ Test API key endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ Test API key endpoint error:', error.message);
      }
    }
    console.log('');

    // Test OpenAI settings endpoint
    console.log('3. Testing OpenAI settings endpoint...');
    try {
      const settingsResponse = await axios.get(`${BASE_URL}/api/openai/settings`);
      console.log('✅ Settings endpoint working:', settingsResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ Settings endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ Settings endpoint error:', error.message);
      }
    }
    console.log('');

    // Test OpenAI chat endpoint
    console.log('4. Testing OpenAI chat endpoint...');
    try {
      const chatResponse = await axios.post(`${BASE_URL}/api/openai/chat`, {
        prompt: 'Hello'
      });
      console.log('✅ Chat endpoint working:', chatResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.log('✅ Chat endpoint responding (expected error):', error.response.data.message);
      } else {
        console.log('❌ Chat endpoint error:', error.message);
      }
    }

    console.log('\n🎉 Route testing completed!');

  } catch (error) {
    console.error('❌ Error testing routes:', error.message);
  }
}

testRoutes(); 