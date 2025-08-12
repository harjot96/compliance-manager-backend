const jwt = require('jsonwebtoken');

function createWorkingToken() {
  console.log('🔑 Creating Working JWT Token\n');
  
  // Use the JWT secret from the .env file
  const JWT_SECRET = 'ad94487608cbb42709f2de9c75f7fa5592be6c9ca5da3ba0cc49586700110674';
  
  // Create token for company ID 7 (the one with Xero settings)
  const companyId = 7;
  
  const token = jwt.sign(
    { id: companyId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  console.log('✅ Token created successfully!');
  console.log(`📋 Company ID: ${companyId}`);
  console.log(`🔑 Token: ${token}`);
  console.log(`⏰ Expires: 7 days from now`);
  
  console.log('\n📝 Test Command:');
  console.log('─'.repeat(50));
  console.log(`curl -X GET "http://localhost:3333/api/xero/dashboard-data?tenantId=7a513ee2-adb4-44be-b7ae-0f3ee60e7efc" \\`);
  console.log(`  -H "Authorization: Bearer ${token}" \\`);
  console.log(`  -H "Content-Type: application/json"`);
  
  console.log('\n🎯 Expected Result:');
  console.log('✅ Should return dashboard data with 70 invoices, 50 contacts, 22 transactions');
}

createWorkingToken();

