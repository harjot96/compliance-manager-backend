const axios = require('axios');
const db = require('./src/config/database');

async function testDashboardBug() {
  console.log('🔍 Testing Dashboard Bug\n');
  
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
    console.log(`Testing for company: ${setting.company_name} (ID: ${setting.company_id})`);
    
    // Get connections
    const connectionsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${setting.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Find Demo Company Global
    const demoCompany = connectionsResponse.data.find(org => 
      org.tenantName === 'Demo Company (Global)'
    );
    
    if (!demoCompany) {
      console.log('❌ Demo Company (Global) not found');
      return;
    }
    
    console.log(`\n🎯 Using organization: ${demoCompany.tenantName}`);
    console.log(`Tenant ID: ${demoCompany.tenantId}`);
    
    // Test the exact same calls that the dashboard makes
    console.log('\n📊 Testing Dashboard Data Fetching:');
    console.log('─'.repeat(60));
    
    const dashboardCalls = [
      { name: 'Invoices (pageSize: 10)', url: 'Invoices', params: { page: 1, pageSize: 10 } },
      { name: 'Contacts (pageSize: 10)', url: 'Contacts', params: { page: 1, pageSize: 10 } },
      { name: 'Bank Transactions (pageSize: 10)', url: 'BankTransactions', params: { page: 1, pageSize: 10 } },
      { name: 'Accounts (pageSize: 50)', url: 'Accounts', params: { page: 1, pageSize: 50 } },
      { name: 'Organizations', url: 'Organisations', params: {} }
    ];
    
    for (const call of dashboardCalls) {
      try {
        let url = `https://api.xero.com/api.xro/2.0/${call.url}`;
        
        // Add query parameters
        if (Object.keys(call.params).length > 0) {
          const queryParams = new URLSearchParams();
          Object.entries(call.params).forEach(([key, value]) => {
            queryParams.append(key, value);
          });
          url += `?${queryParams.toString()}`;
        }
        
        console.log(`\n🔍 ${call.name}:`);
        console.log(`URL: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': demoCompany.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const data = response.data;
        const records = data[call.url] || [];
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`✅ Records returned: ${records.length}`);
        
        if (records.length > 0) {
          console.log(`   First record ID: ${records[0].InvoiceID || records[0].ContactID || records[0].BankTransactionID || records[0].AccountID || 'N/A'}`);
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message}`);
      }
    }
    
    // Now test without pageSize to see total available records
    console.log('\n📊 Testing Total Available Records:');
    console.log('─'.repeat(60));
    
    const totalCalls = [
      { name: 'Invoices (Total)', url: 'Invoices', params: {} },
      { name: 'Contacts (Total)', url: 'Contacts', params: {} },
      { name: 'Bank Transactions (Total)', url: 'BankTransactions', params: {} },
      { name: 'Accounts (Total)', url: 'Accounts', params: {} }
    ];
    
    for (const call of totalCalls) {
      try {
        let url = `https://api.xero.com/api.xro/2.0/${call.url}`;
        
        // Add query parameters
        if (Object.keys(call.params).length > 0) {
          const queryParams = new URLSearchParams();
          Object.entries(call.params).forEach(([key, value]) => {
            queryParams.append(key, value);
          });
          url += `?${queryParams.toString()}`;
        }
        
        console.log(`\n🔍 ${call.name}:`);
        console.log(`URL: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': demoCompany.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const data = response.data;
        const records = data[call.url] || [];
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`✅ Total records available: ${records.length}`);
        
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message}`);
      }
    }
    
    console.log('\n🎯 Bug Analysis:');
    console.log('─'.repeat(60));
    console.log('The dashboard is using pageSize: 10, which limits results to 10 records.');
    console.log('But the summary calculation should show the TOTAL count, not just the 10 records.');
    console.log('This is why you see 0 in the frontend - the API is only looking at 10 records instead of all.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testDashboardBug().catch(console.error);

