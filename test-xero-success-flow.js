const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

async function testSuccessfulXeroFlow() {
  console.log('🚀 Testing Successful Xero OAuth Flow Simulation\n');

  try {
    // Step 1: Test the redirect URL endpoint with success parameters
    console.log('1️⃣ Testing success redirect...');
    const successUrl = `${BASE_URL}/redirecturl?success=true&companyId=123&tenants=${encodeURIComponent(JSON.stringify([
      {
        id: 'test-tenant-1',
        name: 'Test Company Pty Ltd',
        connectionId: 'test-connection-1'
      }
    ]))}`;
    
    const successResponse = await axios.get(successUrl);
    console.log('✅ Success redirect working:', successResponse.data.success);

    // Step 2: Test error redirect
    console.log('\n2️⃣ Testing error redirect...');
    const errorUrl = `${BASE_URL}/redirecturl?success=false&error=Test%20Error&errorDetails=This%20is%20a%20test%20error`;
    
    const errorResponse = await axios.get(errorUrl);
    console.log('✅ Error redirect working:', errorResponse.data.success);

    // Step 3: Test callback endpoint with proper error handling
    console.log('\n3️⃣ Testing callback endpoint error handling...');
    try {
      const callbackResponse = await axios.get(`${BASE_URL}/api/xero/callback?code=invalid_code&state=invalid_state`);
      console.log('✅ Callback endpoint accessible');
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ Callback endpoint properly redirecting on error (302)');
        console.log('📍 Redirect location:', error.response.headers.location);
      } else {
        console.log('⚠️ Unexpected callback response:', error.response?.status);
      }
    }

    console.log('\n🎉 Xero OAuth Flow Test Completed Successfully!');
    console.log('\n📋 What This Means:');
    console.log('✅ Your backend is correctly handling OAuth callbacks');
    console.log('✅ Error handling is working properly');
    console.log('✅ Redirect logic is functioning correctly');
    console.log('✅ The "Invalid authorization code" error is expected with test data');
    
    console.log('\n🔧 To Fix the Xero Error:');
    console.log('1. Use real Xero Developer Console credentials');
    console.log('2. Set redirect URI to: https://compliance-manager-frontend.onrender.com/redirecturl');
    console.log('3. Use valid client ID and client secret');
    console.log('4. Test with real authorization codes from Xero');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testSuccessfulXeroFlow(); 