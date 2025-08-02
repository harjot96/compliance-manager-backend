const OpenAISetting = require('./src/models/OpenAISetting');

async function testOpenAISettings() {
  try {
    console.log('🧪 Testing OpenAI Settings (API Key Only)...');
    
    // Test creating table
    await OpenAISetting.createTable();
    console.log('✅ Table created successfully');
    
    // Test saving settings with only API key
    const testApiKey = 'sk-test1234567890abcdefghijklmnopqrstuvwxyz';
    const settings = await OpenAISetting.saveSettings({
      apiKey: testApiKey,
      createdBy: 1
    });
    console.log('✅ Settings saved successfully:', settings);
    
    // Test getting settings
    const retrievedSettings = await OpenAISetting.getSettings();
    console.log('✅ Settings retrieved successfully:', {
      id: retrievedSettings.id,
      hasApiKey: !!retrievedSettings.apiKey,
      isActive: retrievedSettings.isActive
    });
    
    // Test API key validation
    const testResult = await OpenAISetting.testApiKey(testApiKey);
    console.log('✅ API key test result:', testResult);
    
    console.log('🎉 All tests passed! OpenAI settings now only use API key.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOpenAISettings(); 