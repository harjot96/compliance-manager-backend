#!/usr/bin/env node

/**
 * Test script to verify OpenAI length validation has been removed
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing OpenAI Length Validation Removal\n');

async function testOpenAILengthValidation() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-openai-length-validation.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Testing OpenAI chat with high maxTokens (8000)...');
    
    try {
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: 'Generate a comprehensive analysis of artificial intelligence in modern business applications. Include detailed explanations of machine learning, deep learning, and their practical implementations.',
        maxTokens: 8000,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ High maxTokens request successful!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response length:', response.data.data.response.length);
      console.log('📊 Usage tokens:', response.data.data.usage);
      
    } catch (error) {
      console.log('❌ High maxTokens request failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
    }

    console.log('\n2️⃣ Testing OpenAI settings with high maxTokens...');
    
    try {
      const response = await axios.post(`${API_URL}/openai-admin/settings`, {
        apiKey: 'sk-your-openai-api-key-here',
        maxTokens: 8000,
        model: 'gpt-4',
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ High maxTokens settings saved successfully!');
      console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ High maxTokens settings failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.data?.error?.includes('max')) {
        console.log('🔧 This indicates length validation is still active');
      }
    }

    console.log('\n3️⃣ Testing large prompt (50KB+)...');
    
    try {
      // Create a large prompt
      const largePrompt = 'Generate a detailed analysis of the following topic: ' + 
        'Artificial Intelligence and Machine Learning in Modern Business Applications. '.repeat(1000) +
        'Please provide comprehensive insights including technical details, practical implementations, ' +
        'case studies, and future trends. Include specific examples, code snippets, and detailed explanations.';
      
      console.log(`📏 Large prompt size: ${largePrompt.length} characters`);
      
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
      
      console.log('✅ Large prompt request successful!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response received');
      
    } catch (error) {
      console.log('❌ Large prompt request failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.status === 413) {
        console.log('🔧 This indicates body size limit is still active');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOpenAILengthValidation().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If all tests pass, length validation has been successfully removed');
  console.log('✅ maxTokens can now exceed 4000');
  console.log('✅ Large prompts are accepted');
  console.log('✅ Body size limit increased to 50MB');
  console.log('');
  console.log('🔧 If tests fail:');
  console.log('- Check if server is running');
  console.log('- Verify JWT token is valid');
  console.log('- Check server logs for errors');
}).catch(console.error);
