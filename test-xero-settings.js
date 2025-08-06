const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

// Test data - replace with real tokens
const testData = {
  companyToken: 'your-company-jwt-token-here',
  adminToken: 'your-admin-jwt-token-here'
};

async function testXeroSettings() {
  console.log('🧪 Testing Xero Settings Management\n');

  const tests = [
    {
      name: 'Create Xero Settings',
      method: 'POST',
      url: `${BASE_URL}/api/xero/settings`,
      token: testData.companyToken,
      data: {
        clientId: 'YOUR_XERO_CLIENT_ID',
        clientSecret: 'YOUR_XERO_CLIENT_SECRET',
        redirectUri: 'https://your-app.com/api/xero/callback'
      },
      expectedStatus: 201
    },
    {
      name: 'Get Xero Settings',
      method: 'GET',
      url: `${BASE_URL}/api/xero/settings`,
      token: testData.companyToken,
      expectedStatus: 200
    },
    {
      name: 'Get All Xero Settings (Admin)',
      method: 'GET',
      url: `${BASE_URL}/api/xero/settings/all`,
      token: testData.adminToken,
      expectedStatus: 200
    },
    {
      name: 'Build Auth URL (After Settings)',
      method: 'GET',
      url: `${BASE_URL}/api/xero/login`,
      token: testData.companyToken,
      expectedStatus: 200
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        headers: {
          'Authorization': `Bearer ${test.token}`,
          'Content-Type': 'application/json'
        }
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);

      if (response.status === test.expectedStatus) {
        console.log(`✅ PASS: Status ${response.status} (expected ${test.expectedStatus})`);
        
        if (response.data && response.data.data) {
          if (test.name.includes('Create') || test.name.includes('Get')) {
            console.log(`📊 Settings:`, {
              id: response.data.data.id,
              companyId: response.data.data.companyId,
              clientId: response.data.data.clientId ? '***' : undefined,
              redirectUri: response.data.data.redirectUri
            });
          } else if (test.name.includes('Auth URL')) {
            console.log(`🔗 Auth URL:`, response.data.data.authUrl ? 'Generated' : 'Not generated');
          }
        }
      } else {
        console.log(`❌ FAIL: Status ${response.status} (expected ${test.expectedStatus})`);
      }

    } catch (error) {
      const status = error.response?.status || 'Network Error';
      if (status === test.expectedStatus) {
        console.log(`✅ PASS: Status ${status} (expected ${test.expectedStatus})`);
        if (error.response?.data?.message) {
          console.log(`📝 Message: ${error.response.data.message}`);
        }
      } else {
        console.log(`❌ FAIL: Status ${status} (expected ${test.expectedStatus})`);
        if (error.response?.data?.message) {
          console.log(`📝 Message: ${error.response.data.message}`);
        }
      }
    }
  }

  console.log('\n🎯 Test Summary:');
  console.log('- Companies can create/update their Xero settings');
  console.log('- Companies can view their own Xero settings');
  console.log('- Admins can view all Xero settings');
  console.log('- Auth URL generation requires configured settings');
}

// Instructions for manual testing
console.log('📋 Manual Testing Instructions:');
console.log('1. Replace the JWT tokens in testData with real tokens');
console.log('2. Update the Xero credentials in the test data');
console.log('3. Run: node test-xero-settings.js');
console.log('4. Check that Xero settings management works correctly\n');

// Uncomment to run tests
// testXeroSettings();

module.exports = { testXeroSettings }; 