const axios = require('axios');
const db = require('./src/config/database');

async function testFetchXeroDataDirect() {
  console.log('🔍 Testing fetchXeroData Function Directly\n');
  
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
    const companyId = setting.company_id;
    const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
    
    console.log(`Testing for company: ${setting.company_name} (ID: ${companyId})`);
    console.log(`Tenant ID: ${tenantId}`);
    
    // Test the fetchXeroData function directly
    const fetchXeroData = async (accessToken, tenantId, resourceType, params = {}, companyId = null) => {
      const baseUrl = 'https://api.xero.com/api.xro/2.0';
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
        'Accept': 'application/json'
      };

      let url = `${baseUrl}/${resourceType}`;
      
      // Add query parameters
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
        url += `?${queryParams.toString()}`;
      }

      console.log(`🔍 Fetching Xero data: ${url}`);

      try {
        const response = await axios.get(url, { headers });
        console.log(`✅ Xero data fetched successfully: ${resourceType}`);
        return response.data;
      } catch (error) {
        console.error(`❌ Error fetching Xero data (${resourceType}):`, error.response?.data || error.message);
        throw error;
      }
    };
    
    // Test with the exact same parameters as the API
    console.log('\n🔍 Testing with API parameters:');
    console.log('─'.repeat(60));
    
    const tests = [
      { name: 'Invoices (API params)', resourceType: 'Invoices', params: { page: 1, pageSize: 50 } },
      { name: 'Contacts (API params)', resourceType: 'Contacts', params: { page: 1, pageSize: 50 } },
      { name: 'Bank Transactions (API params)', resourceType: 'BankTransactions', params: { page: 1, pageSize: 50 } },
      { name: 'Accounts (API params)', resourceType: 'Accounts', params: { page: 1, pageSize: 50 } }
    ];
    
    for (const test of tests) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(60)}`);
      
      try {
        const data = await fetchXeroData(setting.access_token, tenantId, test.resourceType, test.params, companyId);
        
        const records = data[test.resourceType] || [];
        console.log(`✅ Records found: ${records.length}`);
        
        if (records.length > 0) {
          console.log(`   First record:`, {
            id: records[0].InvoiceID || records[0].ContactID || records[0].BankTransactionID || records[0].AccountID || 'N/A',
            name: records[0].ContactNumber || records[0].Name || records[0].Description || 'N/A'
          });
        }
        
      } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
      }
    }
    
    // Test without pagination to see if that's the issue
    console.log('\n🔍 Testing without pagination:');
    console.log('─'.repeat(60));
    
    const testsNoPagination = [
      { name: 'Invoices (no pagination)', resourceType: 'Invoices', params: {} },
      { name: 'Contacts (no pagination)', resourceType: 'Contacts', params: {} },
      { name: 'Bank Transactions (no pagination)', resourceType: 'BankTransactions', params: {} },
      { name: 'Accounts (no pagination)', resourceType: 'Accounts', params: {} }
    ];
    
    for (const test of testsNoPagination) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(60)}`);
      
      try {
        const data = await fetchXeroData(setting.access_token, tenantId, test.resourceType, test.params, companyId);
        
        const records = data[test.resourceType] || [];
        console.log(`✅ Records found: ${records.length}`);
        
        if (records.length > 0) {
          console.log(`   First record:`, {
            id: records[0].InvoiceID || records[0].ContactID || records[0].BankTransactionID || records[0].AccountID || 'N/A',
            name: records[0].ContactNumber || records[0].Name || records[0].Description || 'N/A'
          });
        }
        
      } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testFetchXeroDataDirect().catch(console.error);

