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

async function testEndpointStatus() {
  try {
    console.log('🔍 Testing Endpoint Status\n');
    console.log(`🌐 URL: ${BASE_URL}/api/openai/compliance-text`);

    // Test the endpoint directly
    const testData = {
      complianceType: 'BAS',
      companyName: 'Test Company',
      daysLeft: 5
    };

    console.log('\n📤 Sending test request...');
    
    const response = await makeRequest(
      `${BASE_URL}/api/openai/compliance-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      testData
    );

    console.log(`\n📊 Response Status: ${response.status}`);
    console.log('📋 Response Body:');
    console.log(JSON.stringify(response.data, null, 2));

    // Analyze the response
    console.log('\n🔍 Analysis:');
    
    if (response.status === 500 && response.data.error === 'Failed to decrypt API key') {
      console.log('🚨 ISSUE IDENTIFIED:');
      console.log('   The ENCRYPTION_KEY environment variable is not set in production');
      console.log('   OR there is an existing encrypted API key that cannot be decrypted');
      
      console.log('\n💡 IMMEDIATE SOLUTION:');
      console.log('   1. Go to your Render dashboard');
      console.log('   2. Navigate to your service: compliance-manager-backend');
      console.log('   3. Click on "Environment" tab');
      console.log('   4. Add environment variable:');
      console.log('      Key: ENCRYPTION_KEY');
      console.log('      Value: 5RFblAWTAga76NrsNG5YNZpxE7nbcVb');
      console.log('   5. Save and wait for redeployment (2-3 minutes)');
      
      console.log('\n🔄 After redeployment:');
      console.log('   - The error should change to "OpenAI settings not configured"');
      console.log('   - You can then configure your OpenAI API key');
      
    } else if (response.status === 401) {
      console.log('✅ AUTHENTICATION WORKING:');
      console.log('   The endpoint requires authentication (as expected)');
      console.log('   You need to provide a valid JWT token');
      
    } else if (response.status === 500 && response.data.message === 'OpenAI settings not configured') {
      console.log('✅ ENCRYPTION WORKING:');
      console.log('   The encryption key is set correctly');
      console.log('   No OpenAI settings are configured yet');
      console.log('   You can now configure your OpenAI API key');
      
    } else if (response.status === 200) {
      console.log('🎉 SUCCESS:');
      console.log('   The endpoint is working correctly!');
      console.log('   Compliance text was generated successfully');
      
    } else {
      console.log('⚠️ UNEXPECTED RESPONSE:');
      console.log('   The endpoint returned an unexpected status or error');
      console.log('   This may indicate a different issue');
    }

    console.log('\n📋 Current Status Summary:');
    console.log(`   - Endpoint: ${response.status === 200 ? '✅ Working' : '❌ Error'}`);
    console.log(`   - Authentication: ${response.status === 401 ? '✅ Required' : '⚠️ Bypassed'}`);
    console.log(`   - Encryption: ${response.data.error === 'Failed to decrypt API key' ? '❌ Not Set' : '✅ Working'}`);
    console.log(`   - OpenAI Config: ${response.data.message === 'OpenAI settings not configured' ? '❌ Not Set' : '✅ Configured'}`);

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testEndpointStatus();
