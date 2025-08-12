const axios = require('axios');
const db = require('./src/config/database');

async function debugXeroApiResponses() {
  console.log('🔍 Debugging Xero API Responses\n');
  
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
    
    // Test with the first organization
    const connection = connectionsResponse.data[0];
    console.log(`\nTesting with organization: ${connection.tenantName}`);
    console.log(`Tenant ID: ${connection.tenantId}`);
    
    // Test different endpoints with detailed logging
    const endpoints = [
      { name: 'Invoices', url: 'Invoices' },
      { name: 'Contacts', url: 'Contacts' },
      { name: 'Bank Transactions', url: 'BankTransactions' },
      { name: 'Accounts', url: 'Accounts' },
      { name: 'Organizations', url: 'Organisations' },
      { name: 'Items', url: 'Items' },
      { name: 'Tax Rates', url: 'TaxRates' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`Testing: ${endpoint.name}`);
      console.log(`${'='.repeat(50)}`);
      
      try {
        const url = `https://api.xero.com/api.xro/2.0/${endpoint.url}`;
        console.log(`URL: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': connection.tenantId,
            'Accept': 'application/json'
          }
        });
        
        console.log(`Status: ${response.status}`);
        console.log(`Response Headers:`, JSON.stringify(response.headers, null, 2));
        
        const data = response.data;
        console.log(`Response Data Keys:`, Object.keys(data));
        
        // Check for different possible data structures
        const possibleKeys = [
          endpoint.url.toLowerCase(),
          endpoint.url.toLowerCase() + 's',
          'Elements',
          'Items',
          'Invoices',
          'Contacts',
          'BankTransactions',
          'Accounts',
          'Organisations',
          'Items',
          'TaxRates'
        ];
        
        let foundData = false;
        for (const key of possibleKeys) {
          if (data[key]) {
            console.log(`✅ Found data in key: "${key}"`);
            if (Array.isArray(data[key])) {
              console.log(`   Array length: ${data[key].length}`);
              if (data[key].length > 0) {
                console.log(`   First item keys:`, Object.keys(data[key][0]));
                console.log(`   Sample data:`, JSON.stringify(data[key][0], null, 2));
              }
            } else {
              console.log(`   Data type: ${typeof data[key]}`);
              console.log(`   Data:`, JSON.stringify(data[key], null, 2));
            }
            foundData = true;
            break;
          }
        }
        
        if (!foundData) {
          console.log(`❌ No data found in any expected keys`);
          console.log(`Full response:`, JSON.stringify(data, null, 2));
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log(`Error Data:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }
    
    // Test with different query parameters
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing with different query parameters`);
    console.log(`${'='.repeat(50)}`);
    
    const testParams = [
      { name: 'No parameters', params: {} },
      { name: 'Page 1, Size 10', params: { page: 1, pageSize: 10 } },
      { name: 'Page 1, Size 100', params: { page: 1, pageSize: 100 } },
      { name: 'Where clause', params: { where: 'Status=="AUTHORISED"' } },
      { name: 'Order by', params: { order: 'Date DESC' } }
    ];
    
    for (const test of testParams) {
      console.log(`\nTesting Invoices with: ${test.name}`);
      
      try {
        let url = `https://api.xero.com/api.xro/2.0/Invoices`;
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
            'Xero-tenant-id': connection.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const data = response.data;
        const invoiceCount = data.invoices ? data.invoices.length : 0;
        console.log(`Result: ${invoiceCount} invoices found`);
        
        if (invoiceCount > 0) {
          console.log(`First invoice:`, JSON.stringify(data.invoices[0], null, 2));
        }
        
      } catch (error) {
        console.log(`Error: ${error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the debug
debugXeroApiResponses().catch(console.error);

