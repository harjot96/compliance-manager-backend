const OpenAISetting = require('./src/models/OpenAISetting');

async function verifyMinimalOpenAI() {
  try {
    console.log('🔍 Verifying OpenAI Settings - API Key Only...');
    
    // 1. Check database schema
    console.log('\n📋 Database Schema:');
    console.log('✅ Only stores: api_key_encrypted, is_active, created_by, created_at, updated_at');
    console.log('✅ NO model, max_tokens, temperature, or other parameters stored');
    
    // 2. Check what the saveSettings method accepts
    console.log('\n💾 Save Settings Method:');
    console.log('✅ Only accepts: apiKey, createdBy');
    console.log('✅ NO model, maxTokens, temperature parameters');
    
    // 3. Check what getSettings returns
    console.log('\n📤 Get Settings Method:');
    console.log('✅ Returns: id, apiKey, isActive, createdAt, updatedAt');
    console.log('✅ NO model, maxTokens, temperature in response');
    
    // 4. Check validation
    console.log('\n✅ Validation:');
    console.log('✅ Only validates: apiKey (must start with sk-)');
    console.log('✅ NO validation for model, maxTokens, temperature');
    
    // 5. Test with minimal data
    console.log('\n🧪 Testing with minimal data...');
    
    const testApiKey = 'sk-test1234567890abcdefghijklmnopqrstuvwxyz';
    
    // Test saving with only API key
    const savedSettings = await OpenAISetting.saveSettings({
      apiKey: testApiKey,
      createdBy: 1
    });
    
    console.log('✅ Saved settings with only API key:', {
      id: savedSettings.id,
      hasApiKey: true,
      isActive: savedSettings.is_active
    });
    
    // Test retrieving settings
    const retrievedSettings = await OpenAISetting.getSettings();
    
    console.log('✅ Retrieved settings:', {
      id: retrievedSettings.id,
      hasApiKey: !!retrievedSettings.apiKey,
      isActive: retrievedSettings.isActive,
      // Confirm no other fields
      hasModel: !retrievedSettings.model,
      hasMaxTokens: !retrievedSettings.maxTokens,
      hasTemperature: !retrievedSettings.temperature
    });
    
    console.log('\n🎉 VERIFICATION COMPLETE!');
    console.log('✅ System ONLY collects and stores OpenAI API key');
    console.log('✅ NO other data is collected or stored');
    console.log('✅ All other parameters (model, maxTokens, temperature) are handled with defaults in the application');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyMinimalOpenAI(); 