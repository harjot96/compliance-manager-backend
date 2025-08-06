const axios = require('axios');

const BASE_URL = 'http://localhost:3333';

async function getTestToken() {
  console.log('🔑 Getting Test JWT Token\n');

  // Test credentials - you'll need to update these
  const testCredentials = {
    email: 'test@example.com', // Update with actual email
    password: 'password123'     // Update with actual password
  };

  console.log('📋 Using test credentials:');
  console.log(`Email: ${testCredentials.email}`);
  console.log(`Password: ${testCredentials.password}\n`);

  try {
    console.log('🔄 Attempting login...');
    const response = await axios.post(`${BASE_URL}/api/companies/login`, testCredentials);
    
    if (response.data.success) {
      console.log('✅ Login successful!');
      console.log('📋 Token details:');
      console.log(`Token: ${response.data.token}`);
      console.log(`Company ID: ${response.data.company.id}`);
      console.log(`Role: ${response.data.company.role}`);
      
      console.log('\n🔧 Test the Xero connections endpoint:');
      console.log(`curl -X GET ${BASE_URL}/api/xero/connections \\`);
      console.log(`  -H "Authorization: Bearer ${response.data.token}" \\`);
      console.log(`  -H "Content-Type: application/json"`);
      
      console.log('\n🔧 Or use this in your frontend:');
      console.log(`fetch('${BASE_URL}/api/xero/connections', {`);
      console.log(`  headers: {`);
      console.log(`    'Authorization': 'Bearer ${response.data.token}',`);
      console.log(`    'Content-Type': 'application/json'`);
      console.log(`  }`);
      console.log(`})`);
      
    } else {
      console.log('❌ Login failed:', response.data.message);
    }
    
  } catch (error) {
    console.log('❌ Login request failed:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
    } else {
      console.log(`Error: ${error.message}`);
    }
    
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure the server is running on port 3333');
    console.log('2. Update the test credentials in this script');
    console.log('3. Check if the company exists in the database');
    console.log('4. Verify the password is correct');
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Update the test credentials below');
console.log('2. Make sure your server is running');
console.log('3. Run: node get-test-token.js\n');

getTestToken(); 