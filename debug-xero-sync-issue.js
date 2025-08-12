const axios = require('axios');
const db = require('./src/config/database');

async function debugXeroSyncIssue() {
  console.log('🔍 Debugging Xero Data Sync Issue\n');
  
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
    
    // Find Demo Company Global
    const demoCompany = connectionsResponse.data.find(org => 
      org.tenantName === 'Demo Company (Global)'
    );
    
    if (!demoCompany) {
      console.log('❌ Demo Company (Global) not found');
      return;
    }
    
    console.log(`\n🎯 Testing with: ${demoCompany.tenantName}`);
    console.log(`Tenant ID: ${demoCompany.tenantId}`);
    
    // Test different API endpoints with various parameters
    const tests = [
      {
        name: 'Invoices - All',
        url: 'Invoices',
        params: {}
      },
      {
        name: 'Invoices - Draft',
        url: 'Invoices',
        params: { where: 'Status=="DRAFT"' }
      },
      {
        name: 'Invoices - Awaiting Payment',
        url: 'Invoices',
        params: { where: 'Status=="AUTHORISED"' }
      },
      {
        name: 'Invoices - Overdue',
        url: 'Invoices',
        params: { where: 'Status=="AUTHORISED" AND DueDate<DateTime.Now' }
      },
      {
        name: 'Contacts - All',
        url: 'Contacts',
        params: {}
      },
      {
        name: 'Bank Transactions - All',
        url: 'BankTransactions',
        params: {}
      },
      {
        name: 'Bank Transactions - Recent',
        url: 'BankTransactions',
        params: { where: 'Date>=DateTime.Now.AddDays(-30)' }
      },
      {
        name: 'Accounts - All',
        url: 'Accounts',
        params: {}
      },
      {
        name: 'Accounts - Active',
        url: 'Accounts',
        params: { where: 'Status=="ACTIVE"' }
      }
    ];
    
    for (const test of tests) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(60)}`);
      
      try {
        let url = `https://api.xero.com/api.xro/2.0/${test.url}`;
        
        // Add query parameters
        if (Object.keys(test.params).length > 0) {
          const queryParams = new URLSearchParams();
          Object.entries(test.params).forEach(([key, value]) => {
            queryParams.append(key, value);
          });
          url += `?${queryParams.toString()}`;
        }
        
        console.log(`URL: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': demoCompany.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const data = response.data;
        const records = data[test.url] || [];
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`✅ Records found: ${records.length}`);
        
        if (records.length > 0) {
          console.log(`\n📋 Sample records:`);
          records.slice(0, 3).forEach((record, index) => {
            console.log(`\n   Record ${index + 1}:`);
            
            if (test.url === 'Invoices') {
              console.log(`     ID: ${record.InvoiceID}`);
              console.log(`     Number: ${record.InvoiceNumber}`);
              console.log(`     Status: ${record.Status}`);
              console.log(`     Total: ${record.Total}`);
              console.log(`     Date: ${record.Date}`);
            } else if (test.url === 'Contacts') {
              console.log(`     ID: ${record.ContactID}`);
              console.log(`     Name: ${record.Name}`);
              console.log(`     ContactNumber: ${record.ContactNumber}`);
              console.log(`     Status: ${record.ContactStatus}`);
            } else if (test.url === 'BankTransactions') {
              console.log(`     ID: ${record.BankTransactionID}`);
              console.log(`     Description: ${record.Description}`);
              console.log(`     Total: ${record.Total}`);
              console.log(`     Date: ${record.Date}`);
            } else if (test.url === 'Accounts') {
              console.log(`     ID: ${record.AccountID}`);
              console.log(`     Code: ${record.Code}`);
              console.log(`     Name: ${record.Name}`);
              console.log(`     Type: ${record.Type}`);
              console.log(`     Status: ${record.Status}`);
            }
          });
        } else {
          console.log(`❌ No records found for ${test.name}`);
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message}`);
        if (error.response?.data) {
          console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }
    
    // Test our own API endpoints
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing Our API Endpoints`);
    console.log(`${'='.repeat(60)}`);
    
    const ourEndpoints = [
      '/api/xero/all-invoices',
      '/api/xero/all-contacts', 
      '/api/xero/all-bank-transactions',
      '/api/xero/all-accounts',
      '/api/xero/dashboard-data'
    ];
    
    for (const endpoint of ourEndpoints) {
      console.log(`\n📊 Testing: ${endpoint}`);
      
      try {
        const response = await axios.get(`http://localhost:3333${endpoint}?tenantId=${demoCompany.tenantId}`, {
          headers: {
            'Authorization': 'Bearer test-token', // You'll need a real token
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`✅ Success: ${response.data.success}`);
        console.log(`✅ Message: ${response.data.message}`);
        
        if (response.data.data) {
          const data = response.data.data;
          if (data.summary) {
            console.log(`📊 Summary:`, data.summary);
          }
          if (data.invoices) {
            console.log(`📄 Invoices: ${data.invoices.length} records`);
          }
          if (data.contacts) {
            console.log(`👥 Contacts: ${data.contacts.length} records`);
          }
          if (data.bankTransactions) {
            console.log(`🏦 Bank Transactions: ${data.bankTransactions.length} records`);
          }
          if (data.accounts) {
            console.log(`📊 Accounts: ${data.accounts.length} records`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the debug
debugXeroSyncIssue().catch(console.error);

