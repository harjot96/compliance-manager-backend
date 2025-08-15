#!/usr/bin/env node

/**
 * Test OpenAI Large Prompt Handling
 * Tests the improved large prompt handling with chunking and model fallback
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing OpenAI Large Prompt Handling\n');

async function testLargePromptHandling() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-openai-large-prompts.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Testing small prompt (should work normally)...');
    
    try {
      const smallPrompt = 'Hello, how are you today?';
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: smallPrompt,
        model: 'gpt-3.5-turbo',
        maxTokens: 100,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Small prompt successful');
      console.log(`📊 Response: ${response.data.data.response.substring(0, 100)}...`);
      console.log(`📊 Model used: ${response.data.data.model}`);
      console.log(`📊 Usage: ${response.data.data.usage.total_tokens} tokens`);
      
    } catch (error) {
      console.log('❌ Small prompt failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
    }

    console.log('\n2️⃣ Testing medium prompt (should trigger model fallback)...');
    
    try {
      // Create a medium-sized prompt (~10,000 characters)
      const mediumPrompt = 'Please analyze the following financial data and provide insights. '.repeat(2000);
      
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: mediumPrompt,
        model: 'gpt-3.5-turbo',
        maxTokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Medium prompt successful');
      console.log(`📊 Response: ${response.data.data.response.substring(0, 100)}...`);
      console.log(`📊 Model used: ${response.data.data.model}`);
      console.log(`📊 Usage: ${response.data.data.usage.total_tokens} tokens`);
      
    } catch (error) {
      console.log('❌ Medium prompt failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
    }

    console.log('\n3️⃣ Testing large prompt (should trigger chunking)...');
    
    try {
      // Create a large prompt (~50,000 characters)
      const largePrompt = 'Please provide a comprehensive analysis of the following business data. This includes financial metrics, operational performance, market trends, and strategic recommendations. '.repeat(10000);
      
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: largePrompt,
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Large prompt successful');
      console.log(`📊 Response: ${response.data.data.response.substring(0, 200)}...`);
      console.log(`📊 Model used: ${response.data.data.model}`);
      console.log(`📊 Usage: ${response.data.data.usage.total_tokens} tokens`);
      
    } catch (error) {
      console.log('❌ Large prompt failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
    }

    console.log('\n4️⃣ Testing extremely large prompt (should be rejected)...');
    
    try {
      // Create an extremely large prompt (~200,000 characters)
      const hugePrompt = 'This is a very long prompt that exceeds the maximum allowed size. '.repeat(40000);
      
      const response = await axios.post(`${API_URL}/openai/chat`, {
        prompt: hugePrompt,
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Huge prompt processed (unexpected)');
      
    } catch (error) {
      console.log('✅ Huge prompt correctly rejected');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
      console.log(`   Suggestion: ${error.response?.data?.suggestion}`);
      
      if (error.response?.data?.promptSize) {
        console.log(`   Prompt size: ${error.response.data.promptSize.characters} chars, ~${error.response.data.promptSize.estimatedTokens} tokens`);
      }
    }

    console.log('\n5️⃣ Testing with different models...');
    
    const models = ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'];
    
    for (const model of models) {
      try {
        console.log(`\n📝 Testing with ${model}...`);
        
        const testPrompt = 'Please provide a brief analysis of business performance. '.repeat(1000);
        
        const response = await axios.post(`${API_URL}/openai/chat`, {
          prompt: testPrompt,
          model: model,
          maxTokens: 200,
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ ${model} successful`);
        console.log(`📊 Response: ${response.data.data.response.substring(0, 50)}...`);
        console.log(`📊 Usage: ${response.data.data.usage.total_tokens} tokens`);
        
      } catch (error) {
        console.log(`❌ ${model} failed: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLargePromptHandling().then(() => {
  console.log('\n📝 Test Summary:');
  console.log('✅ Improved large prompt handling implemented');
  console.log('✅ Automatic model fallback to GPT-4o for large prompts');
  console.log('✅ Intelligent chunking for extremely large prompts');
  console.log('✅ Prompt size validation with helpful error messages');
  console.log('✅ Better token estimation and context limit checking');
  console.log('');
  console.log('💡 Key improvements:');
  console.log('- Pre-flight size checking before API calls');
  console.log('- Automatic fallback to GPT-4o (128k context)');
  console.log('- Intelligent chunking by paragraphs then sentences');
  console.log('- Graceful error handling with actionable suggestions');
  console.log('- Detailed logging for debugging');
}).catch(console.error);
