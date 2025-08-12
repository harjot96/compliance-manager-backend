const axios = require('axios');
const db = require('./src/config/database');

async function testXeroConnections() {
  console.log('🔍 Testing Xero Connections and Data Fetching\n');
  
  try {
    // Get all Xero settings from database
    const result = await db.query(`
      SELECT 
        xs.*,
        c.company_name,
        c.email
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.access_token IS NOT NULL
      ORDER BY xs.created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} companies with Xero tokens\n`);
    
    if (result.rows.length === 0) {
      console.log('❌ No companies with Xero tokens found');
      console.log('Please complete the Xero OAuth flow first');
      return;
    }
    
    for (const setting of result.rows) {
      console.log(`\n=== Testing Company: ${setting.company_name} ===`);
      console.log(`Company ID: ${setting.company_id}`);
      console.log(`Email: ${setting.email}`);
      
      // Check token expiration
      const now = new Date();
      const tokenExpiresAt = setting.token_expires_at ? new Date(setting.token_expires_at) : null;
      
      if (tokenExpiresAt && tokenExpiresAt <= now) {
        console.log('❌ Token expired at:', tokenExpiresAt);
        console.log('🔄 Attempting token refresh...');
        
        try {
          const refreshResponse = await refreshToken(setting);
          if (refreshResponse.success) {
            console.log('✅ Token refreshed successfully');
            setting.access_token = refreshResponse.accessToken;
          } else {
            console.log('❌ Token refresh failed:', refreshResponse.error);
            continue;
          }
        } catch (error) {
          console.log('❌ Token refresh error:', error.message);
          continue;
        }
      } else {
        console.log('✅ Token is valid, expires at:', tokenExpiresAt);
      }
      
      // Test connections
      try {
        console.log('\n🔗 Testing Xero connections...');
        const connectionsResponse = await axios.get('https://api.xero.com/connections', {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Found ${connectionsResponse.data.length} organizations`);
        
        for (const connection of connectionsResponse.data) {
          console.log(`\n--- Organization: ${connection.tenantName} ---`);
          console.log(`Tenant ID: ${connection.tenantId}`);
          console.log(`Connection ID: ${connection.id}`);
          
          // Test data fetching
          await testDataFetching(setting.access_token, connection.tenantId, connection.tenantName);
        }
        
      } catch (error) {
        console.log('❌ Failed to get connections:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

async function refreshToken(setting) {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: setting.refresh_token
    });

    const response = await axios.post('https://identity.xero.com/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${setting.client_id}:${setting.client_secret}`).toString('base64')}`
      }
    });

    // Update database with new tokens
    await db.query(
      'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
      [
        response.data.access_token,
        response.data.refresh_token,
        new Date(Date.now() + response.data.expires_in * 1000),
        setting.company_id
      ]
    );

    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

async function testDataFetching(accessToken, tenantId, orgName) {
  const dataTypes = [
    { name: 'Invoices', endpoint: 'Invoices' },
    { name: 'Contacts', endpoint: 'Contacts' },
    { name: 'Bank Transactions', endpoint: 'BankTransactions' },
    { name: 'Accounts', endpoint: 'Accounts' },
    { name: 'Organizations', endpoint: 'Organisations' }
  ];
  
  for (const dataType of dataTypes) {
    try {
      console.log(`\n📊 Testing ${dataType.name}...`);
      
      const response = await axios.get(`https://api.xero.com/api.xro/2.0/${dataType.endpoint}?page=1&pageSize=5`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
          'Accept': 'application/json'
        }
      });
      
      const data = response.data;
      const count = getRecordCount(data, dataType.endpoint);
      
      console.log(`✅ ${dataType.name}: ${count} records found`);
      
      if (count > 0) {
        // Show first record structure
        const firstRecord = getFirstRecord(data, dataType.endpoint);
        if (firstRecord) {
          console.log(`   First record ID: ${firstRecord.InvoiceID || firstRecord.ContactID || firstRecord.BankTransactionID || firstRecord.AccountID || 'N/A'}`);
        }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || 
                          error.response?.data?.error_description || 
                          error.message;
      console.log(`❌ ${dataType.name}: ${errorMessage}`);
    }
  }
}

function getRecordCount(data, endpoint) {
  if (!data) return 0;
  
  // Check different possible keys - Xero uses capitalized keys
  const keys = [
    endpoint, // 'Invoices', 'Contacts', etc.
    endpoint.toLowerCase(), // 'invoices'
    endpoint.toLowerCase() + 's', // 'invoicess'
    'Elements',
    'Items'
  ];
  
  for (const key of keys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key].length;
    }
  }
  
  return 0;
}

function getFirstRecord(data, endpoint) {
  if (!data) return null;
  
  const keys = [
    endpoint, // 'Invoices', 'Contacts', etc.
    endpoint.toLowerCase(),
    endpoint.toLowerCase() + 's',
    'Elements',
    'Items'
  ];
  
  for (const key of keys) {
    if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
      return data[key][0];
    }
  }
  
  return null;
}

// Run the test
testXeroConnections().catch(console.error);
