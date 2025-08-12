const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testTenantId() {
  console.log('🔍 Testing Tenant ID Usage\n');
  
  // Create a working token
  const JWT_SECRET = 'ad94487608cbb42709f2de9c75f7fa5592be6c9ca5da3ba0cc49586700110674';
  const companyId = 7;
  const token = jwt.sign({ id: companyId }, JWT_SECRET, { expiresIn: '7d' });
  
  const correctTenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
  const wrongTenantId = '1d867592-896e-440e-b638-479b574dcdee'; // test organization
  
  console.log(`🔑 Using token for company ID: ${companyId}`);
  console.log(`✅ Correct tenant ID: ${correctTenantId} (Demo Company Global)`);
  console.log(`❌ Wrong tenant ID: ${wrongTenantId} (test organization)`);
  
  // Test with correct tenant ID
  console.log('\n🔍 Testing with CORRECT tenant ID:');
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(`http://localhost:3333/api/xero/all-invoices?tenantId=${correctTenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Success: ${response.data.success}`);
    console.log(`✅ Message: ${response.data.message}`);
    
    if (response.data.data && response.data.data.Invoices) {
      console.log(`✅ Invoices found: ${response.data.data.Invoices.length}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
  }
  
  // Test with wrong tenant ID
  console.log('\n🔍 Testing with WRONG tenant ID:');
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(`http://localhost:3333/api/xero/all-invoices?tenantId=${wrongTenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Success: ${response.data.success}`);
    console.log(`✅ Message: ${response.data.message}`);
    
    if (response.data.data && response.data.data.Invoices) {
      console.log(`✅ Invoices found: ${response.data.data.Invoices.length}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
  }
  
  // Test dashboard with correct tenant ID
  console.log('\n🔍 Testing Dashboard with CORRECT tenant ID:');
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(`http://localhost:3333/api/xero/dashboard-data?tenantId=${correctTenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Success: ${response.data.success}`);
    console.log(`✅ Message: ${response.data.message}`);
    
    if (response.data.data && response.data.data.summary) {
      const summary = response.data.data.summary;
      console.log(`📊 Summary:`, {
        totalInvoices: summary.totalInvoices,
        totalContacts: summary.totalContacts,
        totalTransactions: summary.totalTransactions,
        totalAccounts: summary.totalAccounts
      });
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
  }
}

testTenantId().catch(console.error);

