const axios = require('axios');
const db = require('./src/config/database');

async function testTokenValidity() {
  console.log('🔍 Testing Token Validity\n');
  
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
    console.log(`Access Token: ${setting.access_token ? 'Present' : 'Missing'}`);
    console.log(`Refresh Token: ${setting.refresh_token ? 'Present' : 'Missing'}`);
    console.log(`Token Expires: ${setting.token_expires_at || 'Not set'}`);
    
    // Test connections first
    console.log('\n🔍 Testing Xero Connections...');
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${setting.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Connections successful: ${connectionsResponse.data.length} organizations found`);
      
      for (const org of connectionsResponse.data) {
        console.log(`   - ${org.tenantName} (ID: ${org.tenantId})`);
      }
      
      // Test with Demo Company Global
      const demoCompany = connectionsResponse.data.find(org => 
        org.tenantName === 'Demo Company (Global)'
      );
      
      if (demoCompany) {
        console.log(`\n🔍 Testing with Demo Company (Global)...`);
        console.log(`Tenant ID: ${demoCompany.tenantId}`);
        
        // Test invoices
        const invoicesResponse = await axios.get('https://api.xero.com/api.xro/2.0/Invoices', {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': demoCompany.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const invoices = invoicesResponse.data.Invoices || [];
        console.log(`✅ Invoices API call successful: ${invoices.length} invoices found`);
        
        if (invoices.length > 0) {
          console.log(`   First invoice: ${invoices[0].InvoiceNumber} - $${invoices[0].Total}`);
        }
        
        // Test contacts
        const contactsResponse = await axios.get('https://api.xero.com/api.xro/2.0/Contacts', {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Xero-tenant-id': demoCompany.tenantId,
            'Accept': 'application/json'
          }
        });
        
        const contacts = contactsResponse.data.Contacts || [];
        console.log(`✅ Contacts API call successful: ${contacts.length} contacts found`);
        
        if (contacts.length > 0) {
          console.log(`   First contact: ${contacts[0].Name}`);
        }
        
      } else {
        console.log('❌ Demo Company (Global) not found in connections');
      }
      
    } catch (error) {
      console.log('❌ Connections failed:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        console.log('🔄 Token appears to be expired. Attempting refresh...');
        
        try {
          const refreshResponse = await axios.post('https://identity.xero.com/connect/token', 
            new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: setting.refresh_token
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${setting.client_id}:${setting.client_secret}`).toString('base64')}`
              }
            }
          );
          
          console.log('✅ Token refresh successful');
          console.log(`New access token: ${refreshResponse.data.access_token ? 'Present' : 'Missing'}`);
          console.log(`New refresh token: ${refreshResponse.data.refresh_token ? 'Present' : 'Missing'}`);
          console.log(`Expires in: ${refreshResponse.data.expires_in} seconds`);
          
        } catch (refreshError) {
          console.log('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testTokenValidity().catch(console.error);

