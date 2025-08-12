const axios = require('axios');
const db = require('./src/config/database');

async function testXeroWithData() {
  console.log('🔍 Testing Xero API with Organization that has Data\n');
  
  try {
    // Get Xero settings
    const result = await db.query(`
      SELECT 
        xs.*,
        c.company_name,
        c.email
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.access_token IS NOT NULL
      ORDER BY xs.created_at DESC
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No Xero settings found');
      return;
    }
    
    const setting = result.rows[0];
    console.log(`Testing for company: ${setting.company_name}`);
    
    // Get connections
    const connectionsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${setting.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Found ${connectionsResponse.data.length} organizations`);
    
    // Find the organization with data (Demo Company Global)
    const organizationWithData = connectionsResponse.data.find(org => 
      org.tenantName === 'Demo Company (Global)'
    );
    
    if (!organizationWithData) {
      console.log('❌ Demo Company (Global) not found');
      return;
    }
    
    console.log(`\n🎯 Using organization: ${organizationWithData.tenantName}`);
    console.log(`Tenant ID: ${organizationWithData.tenantId}`);
    
    // Test API endpoints
    const endpoints = [
      { name: 'Invoices', endpoint: 'Invoices' },
      { name: 'Contacts', endpoint: 'Contacts' },
      { name: 'Bank Transactions', endpoint: 'BankTransactions' },
      { name: 'Accounts', endpoint: 'Accounts' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n📊 Testing ${endpoint.name}...`);
      
      try {
        const response = await axios.get(`https://api.xero.com/api.xro/2.0/${endpoint.endpoint}?page=1&pageSize=10`, {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': organizationWithData.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const data = response.data;
        const records = data[endpoint.endpoint] || [];
        
        console.log(`✅ ${endpoint.name}: ${records.length} records found`);
        
        if (records.length > 0) {
          const firstRecord = records[0];
          console.log(`   First record:`, {
            id: firstRecord.InvoiceID || firstRecord.ContactID || firstRecord.BankTransactionID || firstRecord.AccountID || 'N/A',
            name: firstRecord.ContactNumber || firstRecord.Name || firstRecord.Description || 'N/A',
            status: firstRecord.Status || 'N/A'
          });
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message}`);
      }
    }
    
    // Test the dashboard endpoint
    console.log(`\n📊 Testing Dashboard Endpoint...`);
    try {
      const dashboardResponse = await axios.get(`http://localhost:3333/api/xero/dashboard-data?tenantId=${organizationWithData.tenantId}`, {
        headers: {
          'Authorization': `Bearer test-token`, // You'll need a real token here
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Dashboard endpoint response:');
      console.log('Status:', dashboardResponse.status);
      console.log('Success:', dashboardResponse.data.success);
      console.log('Message:', dashboardResponse.data.message);
      
      if (dashboardResponse.data.data) {
        const data = dashboardResponse.data.data;
        console.log('\n📊 Dashboard Summary:');
        console.log('Total Invoices:', data.summary?.totalInvoices || 0);
        console.log('Total Contacts:', data.summary?.totalContacts || 0);
        console.log('Total Transactions:', data.summary?.totalTransactions || 0);
        console.log('Total Accounts:', data.summary?.totalAccounts || 0);
        console.log('Is Empty:', data.organizationStatus?.isEmpty || false);
      }
      
    } catch (error) {
      console.log(`❌ Dashboard endpoint: ${error.response?.data?.message || error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testXeroWithData().catch(console.error);

