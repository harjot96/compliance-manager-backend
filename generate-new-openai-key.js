#!/usr/bin/env node

/**
 * Script to help generate and test a new OpenAI API key
 */

const OpenAISetting = require('./src/models/OpenAISetting');

console.log('🔑 OpenAI API Key Generation Guide\n');

console.log('📋 Steps to generate a new API key:');
console.log('');
console.log('1️⃣ Go to OpenAI Platform:');
console.log('   https://platform.openai.com/account/api-keys');
console.log('');
console.log('2️⃣ Click "Create new secret key"');
console.log('');
console.log('3️⃣ Give it a name (e.g., "Compliance Manager")');
console.log('');
console.log('4️⃣ Copy the generated key (it starts with "sk-")');
console.log('');
console.log('5️⃣ Test the key below');
console.log('');

// Function to test a new API key
async function testNewApiKey(apiKey) {
  if (!apiKey || apiKey === 'YOUR_NEW_API_KEY_HERE') {
    console.log('❌ Please replace "YOUR_NEW_API_KEY_HERE" with your actual API key');
    return;
  }

  console.log('🧪 Testing your new API key...');
  
  try {
    const result = await OpenAISetting.testApiKey(apiKey);
    
    if (result.success) {
      console.log('✅ API key is valid!');
      console.log(`Response: ${result.message}`);
      console.log(`Model response: ${result.model}`);
      
      console.log('\n🎉 Your API key is working! You can now use it in your application.');
      console.log('\n📝 Next steps:');
      console.log('1. Update your frontend with the new API key');
      console.log('2. Test the OpenAI settings endpoint');
      console.log('3. Verify the integration works');
      
    } else {
      console.log('❌ API key test failed');
      console.log(`Error: ${result.message}`);
      console.log(`Details: ${result.error}`);
      
      if (result.errorType === 'quota_exceeded') {
        console.log('\n💰 You need to set up billing:');
        console.log('1. Go to: https://platform.openai.com/account/billing');
        console.log('2. Add a payment method');
        console.log('3. Choose a plan (Pay-as-you-go is fine for testing)');
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if API key was provided as argument
const providedKey = process.argv[2];
if (providedKey) {
  testNewApiKey(providedKey);
} else {
  console.log('💡 To test your new API key, run:');
  console.log('   node generate-new-openai-key.js YOUR_NEW_API_KEY_HERE');
  console.log('');
  console.log('🔒 Security Note:');
  console.log('- Never commit API keys to git');
  console.log('- Use environment variables in production');
  console.log('- Rotate keys regularly');
  console.log('');
  console.log('📚 Documentation:');
  console.log('- OpenAI API Keys: https://platform.openai.com/docs/api-keys');
  console.log('- Billing Setup: https://platform.openai.com/docs/guides/rate-limits');
}
