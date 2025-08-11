const db = require('./src/config/database');
const axios = require('axios');

async function testOrganizationNames() {
  try {
    console.log('🔍 Testing Organization Name Fetching from Xero API\n');
    
    // Get a company with tokens
    const settings = await db.query(`
      SELECT * FROM xero_settings 
      WHERE access_token IS NOT NULL 
      AND refresh_token IS NOT NULL 
      LIMIT 1
    `);
    
    if (settings.rows.length === 0) {
      console.log('❌ No companies with tokens found');
      return;
    }
    
    const companySettings = settings.rows[0];
    console.log(`📊 Testing with Company ID: ${companySettings.company_id}`);
    console.log(`📊 Access Token: ${companySettings.access_token.substring(0, 20)}...`);
    
    // First, get connections
    console.log('\n🔍 Step 1: Getting Xero connections...');
    const connectionsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${companySettings.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Found ${connectionsResponse.data.length} connections`);
    connectionsResponse.data.forEach((connection, index) => {
      console.log(`   Connection ${index + 1}:`);
      console.log(`     Tenant ID: ${connection.tenantId}`);
      console.log(`     Tenant Name: ${connection.tenantName || 'Not provided'}`);
      console.log(`     Tenant Type: ${connection.tenantType || 'Not provided'}`);
    });
    
    // Test organization details for each tenant
    console.log('\n🔍 Step 2: Getting organization details for each tenant...');
    
    for (const tenant of connectionsResponse.data) {
      console.log(`\n📊 Testing tenant: ${tenant.tenantId}`);
      
      try {
        // Method 1: Try the organizations endpoint
        console.log('   Trying /organisations endpoint...');
        const orgResponse = await axios.get('https://api.xero.com/organisations', {
          headers: {
            'Authorization': `Bearer ${companySettings.access_token}`,
            'Xero-tenant-id': tenant.tenantId,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`   ✅ Organizations response:`, {
          status: orgResponse.status,
          dataLength: orgResponse.data.length,
          firstOrg: orgResponse.data[0] ? {
            name: orgResponse.data[0].name,
            organisationID: orgResponse.data[0].organisationID,
            legalName: orgResponse.data[0].legalName
          } : 'No organizations'
        });
        
        if (orgResponse.data.length > 0) {
          console.log(`   🎯 Organization Name: ${orgResponse.data[0].name}`);
          console.log(`   🎯 Legal Name: ${orgResponse.data[0].legalName || 'Not provided'}`);
          console.log(`   🎯 Organization ID: ${orgResponse.data[0].organisationID}`);
        }
        
      } catch (orgError) {
        console.log(`   ❌ Organizations endpoint failed:`, {
          status: orgError.response?.status,
          message: orgError.response?.data?.message || orgError.message,
          error: orgError.response?.data?.error || 'Unknown error'
        });
        
        // Try alternative endpoints
        try {
          console.log('   Trying /organisation endpoint (singular)...');
          const orgResponse2 = await axios.get('https://api.xero.com/organisation', {
            headers: {
              'Authorization': `Bearer ${companySettings.access_token}`,
              'Xero-tenant-id': tenant.tenantId,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`   ✅ Organisation (singular) response:`, {
            status: orgResponse2.status,
            data: orgResponse2.data
          });
          
        } catch (orgError2) {
          console.log(`   ❌ Organisation (singular) endpoint also failed:`, {
            status: orgError2.response?.status,
            message: orgError2.response?.data?.message || orgError2.message
          });
        }
      }
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('   Based on the test results, we can see:');
    console.log('   1. Whether the connections endpoint works');
    console.log('   2. Whether the organizations endpoint works');
    console.log('   3. What the actual organization names are');
    console.log('   4. What fallback options are available');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testOrganizationNames();
