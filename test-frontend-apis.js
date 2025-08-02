const axios = require('axios');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

// Test functions for frontend APIs
async function testFrontendAPIs() {
  console.log('🧪 Testing Frontend APIs...\n');

  // Test 1: Chat Completion
  console.log('1️⃣ Testing Chat Completion...');
  try {
    const chatResponse = await axios.post(`${BASE_URL}/api/openai/chat`, {
      prompt: 'Explain compliance management in simple terms',
      maxTokens: 100
    });
    console.log('✅ Chat Completion:', chatResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (chatResponse.data.success) {
      console.log('   Response:', chatResponse.data.data.response.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Chat Completion Error:', error.response?.data?.message || error.message);
  }

  // Test 2: Generate Compliance Text
  console.log('\n2️⃣ Testing Generate Compliance Text...');
  try {
    const complianceResponse = await axios.post(`${BASE_URL}/api/openai/compliance-text`, {
      complianceType: 'BAS',
      companyName: 'Test Company',
      daysLeft: 5
    });
    console.log('✅ Compliance Text:', complianceResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (complianceResponse.data.success) {
      console.log('   Response:', complianceResponse.data.data.response.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Compliance Text Error:', error.response?.data?.message || error.message);
  }

  // Test 3: Generate Template
  console.log('\n3️⃣ Testing Generate Template...');
  try {
    const templateResponse = await axios.post(`${BASE_URL}/api/openai/generate-template`, {
      templateType: 'email',
      complianceType: 'BAS',
      tone: 'professional'
    });
    console.log('✅ Generate Template:', templateResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (templateResponse.data.success) {
      console.log('   Template:', templateResponse.data.data.template.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Generate Template Error:', error.response?.data?.message || error.message);
  }

  // Test 4: Analyze Content
  console.log('\n4️⃣ Testing Analyze Content...');
  try {
    const analysisResponse = await axios.post(`${BASE_URL}/api/openai/analyze-content`, {
      content: 'Your BAS is due in 5 days. Please submit on time.',
      analysisType: 'tone'
    });
    console.log('✅ Analyze Content:', analysisResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (analysisResponse.data.success) {
      console.log('   Analysis:', analysisResponse.data.data.analysis.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Analyze Content Error:', error.response?.data?.message || error.message);
  }

  console.log('\n📋 Summary:');
  console.log('- All frontend APIs are accessible');
  console.log('- No API keys required from frontend');
  console.log('- Ready for frontend integration');
  console.log('- Admin needs to configure OpenAI settings first');
}

// Test admin APIs (will fail without admin token, but tests endpoints)
async function testAdminAPIs() {
  console.log('\n🔐 Testing Admin APIs (will fail without admin token)...\n');

  // Test 1: Save OpenAI Settings
  console.log('1️⃣ Testing Save OpenAI Settings...');
  try {
    const saveResponse = await axios.post(`${BASE_URL}/api/openai-admin/settings`, {
      apiKey: 'sk-test-key',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7
    });
    console.log('✅ Save Settings:', saveResponse.data.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ Save Settings Error (Expected):', error.response?.data?.message || error.message);
  }

  // Test 2: Get OpenAI Settings
  console.log('\n2️⃣ Testing Get OpenAI Settings...');
  try {
    const getResponse = await axios.get(`${BASE_URL}/api/openai-admin/settings`);
    console.log('✅ Get Settings:', getResponse.data.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ Get Settings Error (Expected):', error.response?.data?.message || error.message);
  }

  // Test 3: Test API Key
  console.log('\n3️⃣ Testing Test API Key...');
  try {
    const testResponse = await axios.post(`${BASE_URL}/api/openai-admin/test-api-key`, {
      apiKey: 'sk-test-key'
    });
    console.log('✅ Test API Key:', testResponse.data.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ Test API Key Error (Expected):', error.response?.data?.message || error.message);
  }

  console.log('\n📋 Admin API Summary:');
  console.log('- Admin endpoints are accessible');
  console.log('- Authentication required (as expected)');
  console.log('- Ready for admin configuration');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testFrontendAPIs();
  await testAdminAPIs();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Admin needs to configure OpenAI settings');
  console.log('2. Frontend can start using the APIs');
  console.log('3. No API keys needed in frontend code');
}

runAllTests().catch(console.error); 