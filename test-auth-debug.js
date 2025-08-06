const axios = require('axios');

const BASE_URL = 'http://localhost:3333'; // Your server URL

async function testAuthentication() {
  console.log('🔍 Testing Authentication for Xero Connections\n');

  // Test 1: No token
  console.log('1️⃣ Testing without token...');
  try {
    const response = await axios.get(`${BASE_URL}/api/xero/connections`);
    console.log('❌ Should have failed but got:', response.status);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected - No token provided');
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }

  // Test 2: Invalid token
  console.log('\n2️⃣ Testing with invalid token...');
  try {
    const response = await axios.get(`${BASE_URL}/api/xero/connections`, {
      headers: {
        'Authorization': 'Bearer invalid-token-here'
      }
    });
    console.log('❌ Should have failed but got:', response.status);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected - Invalid token');
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }

  // Test 3: Test login to get a valid token
  console.log('\n3️⃣ Testing login to get valid token...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/companies/login`, {
      email: 'test@example.com', // Replace with actual test credentials
      password: 'testpassword'
    });
    
    if (loginResponse.data.success) {
      const token = loginResponse.data.token;
      console.log('✅ Login successful, got token');
      
      // Test 4: Use valid token
      console.log('\n4️⃣ Testing with valid token...');
      try {
        const xeroResponse = await axios.get(`${BASE_URL}/api/xero/connections`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Xero connections successful:', xeroResponse.data);
      } catch (error) {
        console.log('❌ Xero connections failed:', error.response?.data || error.message);
      }
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.response?.data || error.message);
  }

  // Test 5: Check if server is running
  console.log('\n5️⃣ Testing server health...');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running:', healthResponse.data);
  } catch (error) {
    console.log('❌ Server not responding:', error.message);
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Make sure your server is running on port 3333');
console.log('2. Update the test credentials in the script');
console.log('3. Run: node test-auth-debug.js\n');

testAuthentication(); 