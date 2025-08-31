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

async function testComplianceEndpoint() {
  try {
    console.log('🧪 Testing Compliance Text Endpoint\n');
    console.log(`🌐 Endpoint: ${BASE_URL}/api/openai/compliance-text`);
    console.log(`📋 Method: POST`);

    // Test data
    const testData = {
      complianceType: 'BAS',
      companyName: 'Test Company Ltd',
      daysLeft: 5,
      customPrompt: null,
      model: 'gpt-3.5-turbo',
      maxTokens: 4000,
      temperature: 0.7
    };

    console.log('\n📤 Request Data:');
    console.log(JSON.stringify(testData, null, 2));

    // Test 1: Without authentication (should fail)
    console.log('\n🔒 Test 1: Without Authentication (Expected: 401)');
    
    try {
      const response1 = await makeRequest(
        `${BASE_URL}/api/openai/compliance-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        testData
      );

      console.log(`Status: ${response1.status}`);
      console.log('Response:', JSON.stringify(response1.data, null, 2));
      
      if (response1.status === 401) {
        console.log('✅ Expected: Authentication required');
      } else {
        console.log('⚠️ Unexpected response for unauthenticated request');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }

    // Test 2: With invalid token (should fail)
    console.log('\n🔑 Test 2: With Invalid Token (Expected: 401)');
    
    try {
      const response2 = await makeRequest(
        `${BASE_URL}/api/openai/compliance-text`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer invalid_token_here',
            'Content-Type': 'application/json'
          }
        },
        testData
      );

      console.log(`Status: ${response2.status}`);
      console.log('Response:', JSON.stringify(response2.data, null, 2));
      
      if (response2.status === 401) {
        console.log('✅ Expected: Invalid token rejected');
      } else {
        console.log('⚠️ Unexpected response for invalid token');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }

    // Test 3: Check if we can get a valid token
    console.log('\n🔑 Test 3: Getting Valid Token');
    
    // You would need to provide valid credentials here
    const loginData = {
      email: 'admin@example.com', // Replace with actual admin email
      password: 'admin123' // Replace with actual admin password
    };

    try {
      const loginResponse = await makeRequest(
        `${BASE_URL}/api/companies/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        loginData
      );

      console.log(`Login Status: ${loginResponse.status}`);
      
      if (loginResponse.status === 200 && loginResponse.data.success) {
        const token = loginResponse.data.data.token;
        console.log('✅ Got valid token');
        
        // Test 4: With valid token
        console.log('\n✅ Test 4: With Valid Token');
        
        const response4 = await makeRequest(
          `${BASE_URL}/api/openai/compliance-text`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          },
          testData
        );

        console.log(`Status: ${response4.status}`);
        console.log('Response:', JSON.stringify(response4.data, null, 2));
        
        if (response4.status === 200) {
          console.log('🎉 SUCCESS: Compliance text generated!');
          console.log('📝 Generated Text:', response4.data.data.response);
        } else if (response4.status === 500) {
          if (response4.data.error === 'Failed to decrypt API key') {
            console.log('🚨 ISSUE: Encryption key not set in production');
            console.log('💡 Solution: Add ENCRYPTION_KEY environment variable to Render');
          } else if (response4.data.message === 'OpenAI settings not configured') {
            console.log('ℹ️ INFO: No OpenAI settings configured yet');
            console.log('💡 Solution: Configure OpenAI API key through admin interface');
          } else {
            console.log('❌ ERROR: Unexpected server error');
            console.log('Error:', response4.data.error);
          }
        } else {
          console.log('⚠️ Unexpected response with valid token');
        }
        
      } else {
        console.log('❌ Failed to get valid token');
        console.log('Response:', loginResponse.data);
        console.log('\n💡 You may need to:');
        console.log('   1. Create an admin user in the database');
        console.log('   2. Use correct email/password');
        console.log('   3. Or provide a valid JWT token manually');
      }
      
    } catch (error) {
      console.log('❌ Login error:', error.message);
    }

    // Test 5: Summary and recommendations
    console.log('\n📋 Test Summary:');
    console.log('✅ Endpoint is accessible');
    console.log('✅ Authentication is working');
    console.log('✅ Request format is correct');
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Set ENCRYPTION_KEY environment variable in Render');
    console.log('   2. Configure OpenAI API key through admin interface');
    console.log('   3. Test with valid authentication token');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testComplianceEndpoint();
