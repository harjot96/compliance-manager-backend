const axios = require('axios');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

async function testActualCallback() {
  console.log('🧪 Testing Actual Xero Callback...\n');

  try {
    // Test with the actual callback URL parameters
    console.log('1️⃣ Testing callback with actual parameters...');
    
    const callbackUrl = `${BASE_URL}/api/xero/callback?code=rR9LAC8l5GZR8bqGP9VmqVy6dfcARlZOJLbHv7UXpkQ&state=fbb94ff215e55edabd020f706e93ee08`;
    
    console.log('   URL:', callbackUrl);
    
    const response = await axios.get(callbackUrl, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });

    console.log('✅ Callback successful');
    console.log('   Status:', response.status);
    console.log('   Headers:', response.headers);
    
    if (response.status === 302) {
      console.log('✅ Redirect detected');
      console.log('   Location:', response.headers.location);
    }

  } catch (error) {
    if (error.response?.status === 302) {
      console.log('✅ Redirect detected in error handler');
      console.log('   Location:', error.response.headers.location);
      
      const redirectUrl = new URL(error.response.headers.location);
      console.log('   Redirect URL:', redirectUrl.toString());
      console.log('   Success parameter:', redirectUrl.searchParams.get('success'));
      console.log('   Error parameter:', redirectUrl.searchParams.get('error'));
    } else {
      console.log('❌ Error:', error.response?.status, error.response?.data);
    }
  }

  console.log('\n✅ Actual callback test completed!');
}

testActualCallback().catch(console.error); 