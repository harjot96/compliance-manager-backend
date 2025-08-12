const axios = require('axios');
const jwt = require('jsonwebtoken');

async function debugApiEndpoints() {
  console.log('🔍 Debugging API Endpoints\n');
  
  // Create a working token
  const JWT_SECRET = 'ad94487608cbb42709f2de9c75f7fa5592be6c9ca5da3ba0cc49586700110674';
  const companyId = 7;
  const token = jwt.sign({ id: companyId }, JWT_SECRET, { expiresIn: '7d' });
  
  const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
  const baseUrl = 'http://localhost:3333';
  
  console.log(`🔑 Using token for company ID: ${companyId}`);
  console.log(`🎯 Testing tenant ID: ${tenantId}`);
  
  // Test different endpoints
  const endpoints = [
    { name: 'Dashboard Data', url: `/api/xero/dashboard-data?tenantId=${tenantId}` },
    { name: 'All Invoices', url: `/api/xero/all-invoices?tenantId=${tenantId}` },
    { name: 'All Contacts', url: `/api/xero/all-contacts?tenantId=${tenantId}` },
    { name: 'All Bank Transactions', url: `/api/xero/all-bank-transactions?tenantId=${tenantId}` },
    { name: 'All Accounts', url: `/api/xero/all-accounts?tenantId=${tenantId}` }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${endpoint.name}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
      const response = await axios.get(`${baseUrl}${endpoint.url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`✅ Success: ${response.data.success}`);
      console.log(`✅ Message: ${response.data.message}`);
      
      if (response.data.data) {
        if (response.data.data.summary) {
          const summary = response.data.data.summary;
          console.log(`📊 Summary:`, {
            totalInvoices: summary.totalInvoices,
            totalContacts: summary.totalContacts,
            totalTransactions: summary.totalTransactions,
            totalAccounts: summary.totalAccounts
          });
        }
        
        if (response.data.data.Invoices) {
          console.log(`📄 Invoices: ${response.data.data.Invoices.length} records`);
        }
        
        if (response.data.data.Contacts) {
          console.log(`👥 Contacts: ${response.data.data.Contacts.length} records`);
        }
        
        if (response.data.data.BankTransactions) {
          console.log(`💰 Bank Transactions: ${response.data.data.BankTransactions.length} records`);
        }
        
        if (response.data.data.Accounts) {
          console.log(`🏦 Accounts: ${response.data.data.Accounts.length} records`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
      if (error.response?.data) {
        console.log(`   Details:`, error.response.data);
      }
    }
  }
}

debugApiEndpoints().catch(console.error);

