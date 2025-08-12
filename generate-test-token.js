const jwt = require('jsonwebtoken');

function generateTestToken() {
  console.log('🔑 Generating Test JWT Token\n');
  
  // Company ID 7 (Sam) - the one with Xero settings
  const companyId = 7;
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  const token = jwt.sign(
    { id: companyId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  console.log('✅ Token generated successfully!');
  console.log(`📋 Company ID: ${companyId}`);
  console.log(`🔑 Token: ${token}`);
  console.log(`⏰ Expires: 7 days from now`);
  
  console.log('\n📝 Test Commands:');
  console.log('─'.repeat(50));
  
  const baseUrl = 'http://localhost:3333';
  const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
  
  const endpoints = [
    `/api/xero/dashboard-data?tenantId=${tenantId}`,
    `/api/xero/all-invoices?tenantId=${tenantId}`,
    `/api/xero/all-contacts?tenantId=${tenantId}`,
    `/api/xero/all-bank-transactions?tenantId=${tenantId}`,
    `/api/xero/all-accounts?tenantId=${tenantId}`
  ];
  
  endpoints.forEach(endpoint => {
    console.log(`curl -X GET "${baseUrl}${endpoint}" \\`);
    console.log(`  -H "Authorization: Bearer ${token}" \\`);
    console.log(`  -H "Content-Type: application/json"`);
    console.log('');
  });
  
  console.log('🎯 Expected Results:');
  console.log('✅ Dashboard: Should show 70 invoices, 50 contacts, 22 transactions');
  console.log('✅ Invoices: Should show 70 records with real invoice data');
  console.log('✅ Contacts: Should show 50 records including "Luna Cafe"');
  console.log('✅ Bank Transactions: Should show 22 records with real transaction data');
  console.log('✅ Accounts: Should show 58 records including "Business Bank Account"');
}

generateTestToken();

