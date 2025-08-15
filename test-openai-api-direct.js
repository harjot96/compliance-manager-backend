#!/usr/bin/env node

/**
 * Test script to troubleshoot OpenAI API 401 error
 */

const axios = require('axios');

console.log('🔍 Troubleshooting OpenAI API 401 Error\n');

async function testOpenAIApiDirect() {
  try {
    // Get API key from command line argument
    const apiKey = process.argv[2];
    
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      console.log('❌ Please provide your OpenAI API key:');
      console.log('   node test-openai-api-direct.js YOUR_API_KEY');
      console.log('');
      console.log('💡 You can get your API key from:');
      console.log('   https://platform.openai.com/account/api-keys');
      return;
    }

    console.log('1️⃣ Testing API key format...');
    console.log(`API Key starts with: ${apiKey.substring(0, 10)}...`);
    console.log(`API Key length: ${apiKey.length} characters`);
    
    if (!apiKey.startsWith('sk-')) {
      console.log('❌ API key should start with "sk-"');
      return;
    }
    
    console.log('✅ API key format looks correct\n');

    console.log('2️⃣ Testing OpenAI API directly...');
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ OpenAI API call successful!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ OpenAI API call failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.error?.message}`);
      console.log(`Type: ${error.response?.data?.error?.type}`);
      console.log(`Code: ${error.response?.data?.error?.code}`);
      
      // Provide specific troubleshooting steps
      if (error.response?.status === 401) {
        console.log('\n🔧 Troubleshooting steps for 401 error:');
        console.log('1. Check if the API key is correct at: https://platform.openai.com/account/api-keys');
        console.log('2. Make sure the API key hasn\'t been revoked or deleted');
        console.log('3. Verify you have an active OpenAI account');
        console.log('4. Check if your account has billing set up');
        console.log('5. Try generating a new API key');
        console.log('6. Make sure you\'re using the correct API key (not a test key)');
      } else if (error.response?.status === 429) {
        console.log('\n💰 Rate limit exceeded:');
        console.log('1. Check your usage at: https://platform.openai.com/usage');
        console.log('2. Upgrade your plan if needed');
        console.log('3. Wait for quota reset');
      }
    }

    console.log('\n3️⃣ Testing with your saved API key from backend...');
    console.log('💡 If you have a saved API key in your backend, test it:');
    console.log('   node test-get-api-key.js YOUR_JWT_TOKEN');
    console.log('   Then use that API key in this test');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOpenAIApiDirect().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If the API call succeeds, your key is valid');
  console.log('❌ If you get 401, the key is invalid or revoked');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Generate a new API key from OpenAI');
  console.log('2. Test the new key with this script');
  console.log('3. Save the working key to your backend');
}).catch(console.error);
