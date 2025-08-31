const https = require('https');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

async function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: JSON.parse(body)
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testProductionEncryption() {
  try {
    console.log('🔍 Testing Production Encryption Key Setup...\n');
    console.log(`🌐 Testing API: ${BASE_URL}`);

    // Test 1: Check if OpenAI settings exist
    console.log('\n📋 Test 1: Checking OpenAI settings...');
    
    try {
      const settingsResponse = await makeRequest(
        `${BASE_URL}/api/openai-settings/settings`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Status: ${settingsResponse.status}`);
      
      if (settingsResponse.status === 200) {
        console.log('✅ OpenAI settings found');
        console.log('   This means there are encrypted settings in the database');
      } else if (settingsResponse.status === 404) {
        console.log('ℹ️ No OpenAI settings found');
        console.log('   This means no settings are configured yet');
      } else {
        console.log('⚠️ Unexpected response');
        console.log('Response:', settingsResponse.data);
      }
    } catch (error) {
      console.log('❌ Error checking settings:', error.message);
    }

    // Test 2: Try to access OpenAI settings (this will trigger decryption)
    console.log('\n🔐 Test 2: Testing decryption (this will show the real error)...');
    
    try {
      const testResponse = await makeRequest(
        `${BASE_URL}/api/openai/compliance-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          complianceType: 'BAS',
          companyName: 'Test Company',
          daysLeft: 5
        }
      );

      console.log(`Status: ${testResponse.status}`);
      console.log('Response:', testResponse.data);
      
      if (testResponse.status === 500 && testResponse.data.error === 'Failed to decrypt API key') {
        console.log('\n🚨 ISSUE CONFIRMED:');
        console.log('   The ENCRYPTION_KEY environment variable is not set in production');
        console.log('   OR the encryption key is different from what was used to encrypt the data');
      } else if (testResponse.status === 500 && testResponse.data.error && testResponse.data.error.includes('Encryption key mismatch')) {
        console.log('\n🚨 ISSUE CONFIRMED:');
        console.log('   Encryption key mismatch detected');
        console.log('   The API key was encrypted with a different key');
      } else if (testResponse.status === 401) {
        console.log('\nℹ️ Authentication required');
        console.log('   This is expected - you need to provide a valid JWT token');
      } else if (testResponse.status === 500 && testResponse.data.message === 'OpenAI settings not configured') {
        console.log('\nℹ️ No OpenAI settings configured');
        console.log('   This is expected if no settings have been saved yet');
      } else {
        console.log('\n✅ Decryption test completed');
        console.log('   The response indicates the encryption is working or a different issue');
      }
      
    } catch (error) {
      console.log('❌ Error testing decryption:', error.message);
    }

    // Test 3: Check environment variable status
    console.log('\n🔧 Test 3: Environment Variable Status');
    console.log('\n📋 To fix the encryption key issue:');
    console.log('   1. Go to your Render dashboard');
    console.log('   2. Navigate to your service (compliance-manager-backend)');
    console.log('   3. Click on "Environment" tab');
    console.log('   4. Add environment variable:');
    console.log('      Key: ENCRYPTION_KEY');
    console.log('      Value: 5RFblAWTAga76NrsNG5YNZpxE7nbcVb');
    console.log('   5. Save and wait for redeployment');
    console.log('\n💡 The encryption key must be exactly 32 characters long');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testProductionEncryption();
