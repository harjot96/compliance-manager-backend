const axios = require('axios');
const db = require('./src/config/database');

async function testDashboardFetch() {
  console.log('🔍 Testing Dashboard fetchXeroData Function\n');
  
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
    
    // Test the fetchXeroData function directly (same as dashboard)
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
    
    // Test the exact same calls that the dashboard makes
    console.log('\n🔍 Testing Dashboard Data Fetching:');
    console.log('─'.repeat(60));
    
    const dashboardCalls = [
      { name: 'Invoices (pageSize: 10)', resourceType: 'Invoices', params: { page: 1, pageSize: 10 } },
      { name: 'Contacts (pageSize: 10)', resourceType: 'Contacts', params: { page: 1, pageSize: 10 } },
      { name: 'Bank Transactions (pageSize: 10)', resourceType: 'BankTransactions', params: { page: 1, pageSize: 10 } },
      { name: 'Accounts (pageSize: 50)', resourceType: 'Accounts', params: { page: 1, pageSize: 50 } },
      { name: 'Organizations', resourceType: 'Organisations', params: {} },
      { name: 'Invoices (Total)', resourceType: 'Invoices', params: {} },
      { name: 'Contacts (Total)', resourceType: 'Contacts', params: {} },
      { name: 'Bank Transactions (Total)', resourceType: 'BankTransactions', params: {} }
    ];
    
    for (const call of dashboardCalls) {
      try {
        console.log(`\n🔍 ${call.name}:`);
        const data = await fetchXeroData(setting.access_token, tenantId, call.resourceType, call.params, companyId);
        
        const records = data[call.resourceType] || [];
        console.log(`✅ Records found: ${records.length}`);
        
        if (records.length > 0) {
          console.log(`   First record ID: ${records[0].InvoiceID || records[0].ContactID || records[0].BankTransactionID || records[0].AccountID || 'N/A'}`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
testDashboardFetch().catch(console.error);

