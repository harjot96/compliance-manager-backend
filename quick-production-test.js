const https = require('https');

async function testProduction() {
  console.log('🔍 Quick Production Test\n');
  
  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request('https://compliance-manager-backend.onrender.com/api/openai-admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(body)
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: body
            });
          }
        });
      });
      
      req.on('error', reject);
      req.write(JSON.stringify({ apiKey: 'sk-test' }));
      req.end();
    });

    console.log(`Status: ${response.status}`);
    console.log('Error:', response.data.error || 'No error');
    
    if (response.data.error === 'crypto.createCipher is not a function') {
      console.log('\n🚨 CRYPTO FIX NOT DEPLOYED');
      console.log('   Wait for deployment to complete');
    } else if (response.data.error === 'Failed to decrypt API key') {
      console.log('\n✅ CRYPTO FIX DEPLOYED');
      console.log('   Set ENCRYPTION_KEY environment variable');
    } else if (response.status === 401) {
      console.log('\n✅ CRYPTO FIX DEPLOYED');
      console.log('   Endpoint requires authentication');
    } else {
      console.log('\n⚠️ UNKNOWN STATE');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testProduction();

