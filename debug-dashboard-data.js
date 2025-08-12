const axios = require('axios');
const jwt = require('jsonwebtoken');

async function debugDashboardData() {
  console.log('🔍 Debugging Dashboard Data\n');
  
  // Create a working token
  const JWT_SECRET = 'ad94487608cbb42709f2de9c75f7fa5592be6c9ca5da3ba0cc49586700110674';
  const companyId = 7;
  const token = jwt.sign({ id: companyId }, JWT_SECRET, { expiresIn: '7d' });
  
  const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
  
  console.log(`🔑 Using token for company ID: ${companyId}`);
  console.log(`🎯 Testing tenant ID: ${tenantId}`);
  
  // Test individual endpoints first
  console.log('\n🔍 Testing Individual Endpoints:');
  console.log('─'.repeat(60));
  
  const endpoints = [
    { name: 'Invoices (paginated)', url: `/api/xero/all-invoices?tenantId=${tenantId}` },
    { name: 'Contacts', url: `/api/xero/all-contacts?tenantId=${tenantId}` },
    { name: 'Bank Transactions', url: `/api/xero/all-bank-transactions?tenantId=${tenantId}` },
    { name: 'Accounts', url: `/api/xero/all-accounts?tenantId=${tenantId}` }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:3333${endpoint.url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      
      if (response.data.data) {
        if (response.data.data.Invoices) {
          console.log(`   Invoices: ${response.data.data.Invoices.length}`);
        }
        if (response.data.data.Contacts) {
          console.log(`   Contacts: ${response.data.data.Contacts.length}`);
        }
        if (response.data.data.BankTransactions) {
          console.log(`   Bank Transactions: ${response.data.data.BankTransactions.length}`);
        }
        if (response.data.data.Accounts) {
          console.log(`   Accounts: ${response.data.data.Accounts.length}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.response?.data?.message || error.message}`);
    }
  }
  
  // Test dashboard
  console.log('\n🔍 Testing Dashboard:');
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(`http://localhost:3333/api/xero/dashboard-data?tenantId=${tenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Dashboard: ${response.status}`);
    console.log(`✅ Success: ${response.data.success}`);
    console.log(`✅ Message: ${response.data.message}`);
    
    if (response.data.data && response.data.data.summary) {
      const summary = response.data.data.summary;
      console.log(`📊 Summary:`, {
        totalInvoices: summary.totalInvoices,
        totalContacts: summary.totalContacts,
        totalTransactions: summary.totalTransactions,
        totalAccounts: summary.totalAccounts,
        totalAmount: summary.totalAmount
      });
    }
    
    if (response.data.data) {
      console.log(`📋 Recent Data:`, {
        recentInvoices: response.data.data.recentInvoices?.length || 0,
        recentContacts: response.data.data.recentContacts?.length || 0,
        recentTransactions: response.data.data.recentTransactions?.length || 0,
        accounts: response.data.data.accounts?.length || 0
      });
    }
    
  } catch (error) {
    console.log(`❌ Dashboard: ${error.response?.data?.message || error.message}`);
  }
}

debugDashboardData().catch(console.error);

