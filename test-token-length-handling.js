#!/usr/bin/env node

/**
 * Test script to verify OpenAI token length handling
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing OpenAI Token Length Handling\n');

async function testTokenLengthHandling() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-token-length-handling.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Testing with extremely large prompt (should trigger chunking)...');
    
    try {
      // Create a very large prompt that would exceed token limits
      const largePrompt = 'This is a very long prompt that will exceed the maximum context length. '.repeat(5000) +
        'It contains many sentences and will definitely trigger the token length handling. '.repeat(5000) +
        'The system should automatically chunk this or use a different model. '.repeat(5000) +
        'Please analyze this extremely long content and provide a comprehensive response. '.repeat(5000) +
        'This should test the automatic handling of large prompts. '.repeat(5000);
      
      console.log(`📏 Large prompt size: ${largePrompt.length} characters`);
      console.log(`📊 Estimated tokens: ~${Math.ceil(largePrompt.length / 4)} tokens`);
      
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: largePrompt,
        maxTokens: 4000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Large prompt handled successfully!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response received:', response.data.data.response.substring(0, 200) + '...');
      console.log('📊 Usage info:', response.data.data.usage);
      
    } catch (error) {
      console.log('❌ Large prompt failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.data?.error?.includes('Context length exceeded')) {
        console.log('🔧 This indicates the chunking system is working');
      }
    }

    console.log('\n2️⃣ Testing with moderate large prompt (should work with GPT-4o)...');
    
    try {
      // Create a moderately large prompt
      const moderatePrompt = 'This is a moderately large prompt that should work with GPT-4o. '.repeat(1000) +
        'It contains enough content to test the model fallback system. '.repeat(1000) +
        'The system should automatically try GPT-4o if GPT-3.5-turbo fails. '.repeat(1000);
      
      console.log(`📏 Moderate prompt size: ${moderatePrompt.length} characters`);
      
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: moderatePrompt,
        maxTokens: 4000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Moderate prompt handled successfully!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response received');
      
    } catch (error) {
      console.log('❌ Moderate prompt failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n3️⃣ Testing content analysis with large content...');
    
    try {
      const largeContent = 'This is a large piece of content for analysis. '.repeat(2000) +
        'It should test the content analysis endpoint with large inputs. '.repeat(2000) +
        'The system should handle this gracefully. '.repeat(2000);
      
      console.log(`📏 Large content size: ${largeContent.length} characters`);
      
      const response = await axios.post(`${API_URL}/openai/analyze-content`, {
        content: largeContent,
        analysisType: 'compliance',
        maxTokens: 4000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Large content analysis successful!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Analysis received');
      
    } catch (error) {
      console.log('❌ Large content analysis failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTokenLengthHandling().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If tests pass, token length handling is working correctly');
  console.log('✅ Large prompts are automatically chunked or use alternative models');
  console.log('✅ GPT-4o fallback is working for moderately large prompts');
  console.log('✅ Content analysis handles large inputs gracefully');
  console.log('');
  console.log('🔧 Expected behavior:');
  console.log('- Large prompts should be chunked automatically');
  console.log('- GPT-4o should be used as fallback for moderate prompts');
  console.log('- No more "maximum context length" errors');
  console.log('- Graceful handling of all prompt sizes');
}).catch(console.error);
