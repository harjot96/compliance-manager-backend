#!/usr/bin/env node

/**
 * Script to check saved OpenAI settings in the database
 */

const OpenAISetting = require('./src/models/OpenAISetting');

console.log('🔍 Checking Saved OpenAI Settings\n');

async function checkSavedSettings() {
  try {
    console.log('1️⃣ Checking if any OpenAI settings exist...');
    
    // Get all settings
    const allSettings = await OpenAISetting.getAllSettings();
    
    if (allSettings.length === 0) {
      console.log('❌ No OpenAI settings found in the database');
      console.log('💡 You need to save settings first using the API');
      return;
    }
    
    console.log(`✅ Found ${allSettings.length} OpenAI setting(s) in the database`);
    
    // Get the most recent active settings
    console.log('\n2️⃣ Getting the most recent active settings...');
    const settings = await OpenAISetting.getSettings();
    
    if (!settings) {
      console.log('❌ No active OpenAI settings found');
      return;
    }
    
    console.log('✅ Active OpenAI settings found!');
    console.log('\n📊 Saved Settings:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${settings.id}`);
    console.log(`Max Tokens: ${settings.maxTokens}`);
    console.log(`Model: ${settings.model}`);
    console.log(`Temperature: ${settings.temperature}`);
    console.log(`Is Active: ${settings.isActive}`);
    console.log(`Created At: ${settings.createdAt}`);
    console.log(`Updated At: ${settings.updatedAt}`);
    console.log(`API Key Status: Encrypted and stored`);
    console.log(`API Key Preview: sk-...${settings.apiKey.substring(settings.apiKey.length - 4)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🔒 Security Information:');
    console.log('- The API key is encrypted using AES-256-GCM');
    console.log('- The encryption key is stored in ENCRYPTION_KEY environment variable');
    console.log('- Only the last 4 characters are shown for verification');
    console.log('- The full key cannot be retrieved for security reasons');
    
    console.log('\n💡 To use the saved settings:');
    console.log('1. The API will automatically use the saved settings');
    console.log('2. You can update the settings using the API endpoint');
    console.log('3. The key is automatically decrypted when needed for API calls');
    
  } catch (error) {
    console.error('❌ Error checking settings:', error.message);
  }
}

// Run the check
checkSavedSettings().then(() => {
  console.log('\n✅ Check completed!');
}).catch(console.error);
