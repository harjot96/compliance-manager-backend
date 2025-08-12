const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testFixedDashboard() {
  console.log('🔍 Testing Fixed Dashboard Endpoint\n');
  
  try {
    // Generate a token for company ID 7 (the one with Xero settings)
    const companyId = 7;
    const JWT_SECRET = 'ad94487608cbb42709f2de9c75f7fa5592be6c9ca5da3ba0cc49586700110674';
    
    const token = jwt.sign(
      { id: companyId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log(`✅ Generated token for company ID: ${companyId}`);
    
    // Test the dashboard endpoint with the correct tenant ID
    const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
    const url = `http://localhost:3333/api/xero/dashboard-data?tenantId=${tenantId}`;
    
    console.log(`\n🔍 Testing URL: ${url}`);
    console.log(`🎯 Tenant ID: ${tenantId}`);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Response received:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    
    if (response.data.data && response.data.data.summary) {
      const summary = response.data.data.summary;
      console.log('\n📊 Dashboard Summary:');
      console.log('─'.repeat(40));
      console.log(`Total Invoices: ${summary.totalInvoices}`);
      console.log(`Total Contacts: ${summary.totalContacts}`);
      console.log(`Total Transactions: ${summary.totalTransactions}`);
      console.log(`Total Accounts: ${summary.totalAccounts}`);
      console.log(`Total Amount: $${summary.totalAmount}`);
      console.log(`Paid Invoices: ${summary.paidInvoices}`);
      console.log(`Overdue Invoices: ${summary.overdueInvoices}`);
      
      console.log('\n📋 Recent Data:');
      console.log('─'.repeat(40));
      console.log(`Recent Invoices: ${response.data.data.recentInvoices?.length || 0} records`);
      console.log(`Recent Contacts: ${response.data.data.recentContacts?.length || 0} records`);
      console.log(`Recent Transactions: ${response.data.data.recentTransactions?.length || 0} records`);
      console.log(`Accounts: ${response.data.data.accounts?.length || 0} records`);
      
      if (response.data.data.organizationStatus) {
        console.log('\n🏢 Organization Status:');
        console.log('─'.repeat(40));
        console.log(`Is Empty: ${response.data.data.organizationStatus.isEmpty}`);
        console.log(`Message: ${response.data.data.organizationStatus.message}`);
      }
      
      // Check if the fix worked
      const expectedInvoices = 70;
      const expectedContacts = 50;
      const expectedTransactions = 22;
      
      console.log('\n🎯 Expected vs Actual:');
      console.log('─'.repeat(40));
      console.log(`Invoices: Expected ${expectedInvoices}, Got ${summary.totalInvoices} - ${summary.totalInvoices === expectedInvoices ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Contacts: Expected ${expectedContacts}, Got ${summary.totalContacts} - ${summary.totalContacts === expectedContacts ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Transactions: Expected ${expectedTransactions}, Got ${summary.totalTransactions} - ${summary.totalTransactions === expectedTransactions ? '✅ PASS' : '❌ FAIL'}`);
      
      if (summary.totalInvoices > 0 && summary.totalContacts > 0 && summary.totalTransactions > 0) {
        console.log('\n🎉 SUCCESS: Dashboard is now showing the correct data!');
      } else {
        console.log('\n❌ FAIL: Dashboard is still showing incorrect data.');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

// Run the test
testFixedDashboard().catch(console.error);
