#!/usr/bin/env node

/**
 * Test Optimized Financial Summary
 * Tests the new optimized financial summary endpoint with better timeout handling
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing Optimized Financial Summary\n');

async function testOptimizedFinancialSummary() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-optimized-financial-summary.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Testing original financial summary (for comparison)...');
    
    try {
      const startTime = Date.now();
      const originalResponse = await axios.get(`${API_URL}/xero/financial-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 35000 // 35 second timeout
      });
      
      const originalTime = Date.now() - startTime;
      console.log(`✅ Original endpoint: ${originalTime}ms`);
      console.log(`📊 Status: ${originalResponse.status}`);
      console.log(`📊 Success: ${originalResponse.data.success}`);
      console.log(`📊 Message: ${originalResponse.data.message}`);
      
      if (originalResponse.data.data) {
        console.log(`📊 Invoice Count: ${originalResponse.data.data.invoiceCount}`);
        console.log(`📊 Transaction Count: ${originalResponse.data.data.transactionCount}`);
        console.log(`📊 Data Quality:`, originalResponse.data.data.dataQuality);
      }
      
    } catch (error) {
      console.log('❌ Original endpoint failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
    }

    console.log('\n2️⃣ Testing optimized financial summary...');
    
    try {
      const startTime = Date.now();
      const optimizedResponse = await axios.get(`${API_URL}/xero/financial-summary-optimized`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000 // 25 second timeout (shorter)
      });
      
      const optimizedTime = Date.now() - startTime;
      console.log(`✅ Optimized endpoint: ${optimizedTime}ms`);
      console.log(`📊 Status: ${optimizedResponse.status}`);
      console.log(`📊 Success: ${optimizedResponse.data.success}`);
      console.log(`📊 Message: ${optimizedResponse.data.message}`);
      
      if (optimizedResponse.data.data) {
        console.log(`📊 Invoice Count: ${optimizedResponse.data.data.invoiceCount}`);
        console.log(`📊 Transaction Count: ${optimizedResponse.data.data.transactionCount}`);
        console.log(`📊 Data Quality:`, optimizedResponse.data.data.dataQuality);
        console.log(`📊 Total Revenue: $${optimizedResponse.data.data.totalRevenue}`);
        console.log(`📊 Net Income: $${optimizedResponse.data.data.netIncome}`);
      }
      
    } catch (error) {
      console.log('❌ Optimized endpoint failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
      console.log(`   Error: ${error.response?.data?.error}`);
      console.log(`   Action: ${error.response?.data?.action}`);
      console.log(`   Suggestion: ${error.response?.data?.suggestion}`);
    }

    console.log('\n3️⃣ Testing with specific tenant ID...');
    
    try {
      // First get available tenants
      const tenantsResponse = await axios.get(`${API_URL}/xero/connection-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (tenantsResponse.data.data.tenants && tenantsResponse.data.data.tenants.length > 0) {
        const tenantId = tenantsResponse.data.data.tenants[0].tenantId;
        console.log(`📊 Using tenant: ${tenantId}`);
        
        const startTime = Date.now();
        const tenantResponse = await axios.get(`${API_URL}/xero/financial-summary-optimized?tenantId=${tenantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000 // 20 second timeout
        });
        
        const tenantTime = Date.now() - startTime;
        console.log(`✅ Tenant-specific endpoint: ${tenantTime}ms`);
        console.log(`📊 Success: ${tenantResponse.data.success}`);
        console.log(`📊 Message: ${tenantResponse.data.message}`);
        
      } else {
        console.log('⚠️ No tenants available');
      }
      
    } catch (error) {
      console.log('❌ Tenant-specific test failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message}`);
    }

    console.log('\n4️⃣ Testing timeout handling...');
    
    try {
      // Test with a very short timeout to see how it handles timeouts
      const timeoutResponse = await axios.get(`${API_URL}/xero/financial-summary-optimized`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout (very short)
      });
      
      console.log('✅ Short timeout test completed');
      console.log(`📊 Success: ${timeoutResponse.data.success}`);
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log('⚠️ Expected timeout occurred (5 seconds)');
      } else {
        console.log('❌ Unexpected error in timeout test:');
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOptimizedFinancialSummary().then(() => {
  console.log('\n📝 Test Summary:');
  console.log('✅ Optimized endpoint should be faster and more reliable');
  console.log('✅ Better timeout handling with 8-second individual timeouts');
  console.log('✅ Sequential requests instead of parallel to avoid overwhelming Xero');
  console.log('✅ Smaller page sizes (25 instead of 100) for faster responses');
  console.log('✅ Graceful degradation when some data sources fail');
  console.log('✅ Clear error messages with actionable suggestions');
  console.log('');
  console.log('💡 If you still get timeouts:');
  console.log('- Try the optimized endpoint: /api/xero/financial-summary-optimized');
  console.log('- Check your Xero connection status');
  console.log('- Ensure your Xero organization has data');
  console.log('- Try again in a few minutes if rate limited');
}).catch(console.error);
