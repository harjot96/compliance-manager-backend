const axios = require('axios');
const db = require('./src/config/database');
const XeroSettings = require('./src/models/XeroSettings');

async function debugXeroDataFetching() {
  console.log('🔍 Xero Data Fetching Diagnostic Tool\n');
  
  try {
    // 1. Check database connection
    console.log('1. Testing Database Connection...');
    const dbTest = await db.query('SELECT NOW() as current_time');
    console.log('✅ Database connected:', dbTest.rows[0].current_time);
    
    // 2. Get all companies with Xero settings
    console.log('\n2. Checking Xero Settings...');
    const allSettings = await XeroSettings.getAllSettings();
    console.log(`Found ${allSettings.length} companies with Xero settings`);
    
    if (allSettings.length === 0) {
      console.log('❌ No Xero settings found. Please configure Xero settings first.');
      return;
    }
    
    // 3. Test each company's Xero connection
    for (const setting of allSettings) {
      console.log(`\n--- Testing Company: ${setting.company_name} (ID: ${setting.company_id}) ---`);
      
      // Check if tokens exist
      if (!setting.access_token || !setting.refresh_token) {
        console.log('❌ No access token or refresh token found');
        continue;
      }
      
      // Check token expiration
      const now = new Date();
      const tokenExpiresAt = setting.token_expires_at ? new Date(setting.token_expires_at) : null;
      
      if (tokenExpiresAt && tokenExpiresAt <= now) {
        console.log('⚠️ Token expired at:', tokenExpiresAt);
        console.log('🔄 Attempting token refresh...');
        
        try {
          const refreshResponse = await refreshXeroToken(
            setting.refresh_token, 
            setting.client_id, 
            setting.client_secret
          );
          
          if (refreshResponse.success) {
            console.log('✅ Token refreshed successfully');
            
            // Update tokens in database
            await db.query(
              'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
              [
                refreshResponse.accessToken,
                refreshResponse.refreshToken,
                new Date(Date.now() + refreshResponse.expiresIn * 1000),
                setting.company_id
              ]
            );
            
            // Use new token for testing
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
      
      // 4. Test Xero connections
      console.log('\n4. Testing Xero Connections...');
      try {
        const connectionsResponse = await axios.get('https://api.xero.com/connections', {
          headers: {
            'Authorization': `Bearer ${setting.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Found ${connectionsResponse.data.length} Xero organizations`);
        
        if (connectionsResponse.data.length === 0) {
          console.log('❌ No organizations found in Xero account');
          continue;
        }
        
        // 5. Test data fetching for each organization
        for (const connection of connectionsResponse.data) {
          console.log(`\n--- Testing Organization: ${connection.tenantName} (ID: ${connection.tenantId}) ---`);
          
          const tenantId = connection.tenantId;
          
          // Test different data types
          const dataTypes = [
            'Invoices',
            'Contacts', 
            'BankTransactions',
            'Accounts',
            'Organisations'
          ];
          
          for (const dataType of dataTypes) {
            console.log(`\nTesting ${dataType}...`);
            
            try {
              const data = await fetchXeroData(setting.access_token, tenantId, dataType, { page: 1, pageSize: 5 });
              
              if (data) {
                const count = getDataCount(data, dataType);
                console.log(`✅ ${dataType}: Found ${count} records`);
                
                // Show sample data structure
                if (count > 0) {
                  const sampleKey = Object.keys(data)[0];
                  const sampleData = data[sampleKey];
                  if (Array.isArray(sampleData) && sampleData.length > 0) {
                    console.log(`   Sample record:`, JSON.stringify(sampleData[0], null, 2).substring(0, 200) + '...');
                  }
                }
              } else {
                console.log(`⚠️ ${dataType}: No data returned`);
              }
            } catch (error) {
              console.log(`❌ ${dataType}: Error -`, error.response?.data?.Elements?.[0]?.ValidationErrors?.[0]?.Message || error.message);
            }
          }
        }
        
      } catch (error) {
        console.log('❌ Failed to get Xero connections:', error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 Diagnostic completed!');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  } finally {
    process.exit(0);
  }
}

/**
 * Helper function to refresh Xero access token
 */
async function refreshXeroToken(refreshToken, clientId, clientSecret) {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await axios.post('https://identity.xero.com/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }
    });

    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

/**
 * Helper function to fetch Xero data
 */
async function fetchXeroData(accessToken, tenantId, resourceType, params = {}) {
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

  const response = await axios.get(url, { headers });
  return response.data;
}

/**
 * Helper function to get data count from Xero response
 */
function getDataCount(data, dataType) {
  if (!data) return 0;
  
  // Xero returns data in different formats depending on the endpoint
  const possibleKeys = [
    dataType.toLowerCase(), // e.g., 'invoices'
    dataType.toLowerCase() + 's', // e.g., 'invoicess' (fallback)
    'Elements', // Generic Xero response format
    'Items' // Some endpoints use 'Items'
  ];
  
  for (const key of possibleKeys) {
    if (data[key] && Array.isArray(data[key])) {
      return data[key].length;
    }
  }
  
  // If no array found, check if it's a single object
  if (typeof data === 'object' && !Array.isArray(data)) {
    return 1;
  }
  
  return 0;
}

// Run the diagnostic
debugXeroDataFetching().catch(console.error);

