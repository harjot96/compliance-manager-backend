const axios = require('axios');
const db = require('./src/config/database');

async function debugFetchXeroData() {
  console.log('🔍 Debugging fetchXeroData Function\n');
  
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
    
    const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Demo Company Global
    const companyId = setting.company_id;
    
    console.log(`\n🎯 Using tenant ID: ${tenantId}`);
    console.log(`🎯 Company ID: ${companyId}`);
    
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
    
    // Test different calls
    const tests = [
      { name: 'Invoices (Total)', resourceType: 'Invoices', params: {} },
      { name: 'Contacts (Total)', resourceType: 'Contacts', params: {} },
      { name: 'Bank Transactions (Total)', resourceType: 'BankTransactions', params: {} },
      { name: 'Accounts (Total)', resourceType: 'Accounts', params: {} }
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
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the debug
debugFetchXeroData().catch(console.error);

