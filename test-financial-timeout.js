#!/usr/bin/env node

/**
 * Test script to verify financial analysis timeout handling
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🧪 Testing Financial Analysis Timeout Handling\n');

async function testFinancialTimeout() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-financial-timeout.js YOUR_JWT_TOKEN');
      return;
    }

    console.log('1️⃣ Testing financial summary endpoint with timeout handling...');
    
    try {
      const startTime = Date.now();
      
      const response = await axios.get(`${API_URL}/xero/financial-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000 // 45 second timeout for the entire request
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('✅ Financial summary retrieved successfully!');
      console.log(`📊 Request duration: ${duration}ms`);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
      
      // Check if we got partial data
      if (response.data.data.dataQuality) {
        console.log('📊 Data quality info:');
        console.log(`   - Invoices retrieved: ${response.data.data.dataQuality.invoicesRetrieved}`);
        console.log(`   - Transactions retrieved: ${response.data.data.dataQuality.transactionsRetrieved}`);
        console.log(`   - Partial data: ${response.data.data.dataQuality.partialData}`);
      }
      
    } catch (error) {
      console.log('❌ Financial summary failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.status === 408) {
        console.log('🔧 This is a timeout error - the system handled it correctly');
        console.log('💡 Suggestion:', error.response.data.suggestion);
      } else if (error.code === 'ECONNABORTED') {
        console.log('🔧 Request timed out at the client level');
      }
    }

    console.log('\n2️⃣ Testing with specific tenant ID...');
    
    try {
      const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc'; // Your tenant ID
      
      const response = await axios.get(`${API_URL}/xero/financial-summary?tenantId=${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      });
      
      console.log('✅ Financial summary with tenant ID successful!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Data received');
      
    } catch (error) {
      console.log('❌ Financial summary with tenant ID failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n3️⃣ Testing dashboard data (which also uses fetchXeroData)...');
    
    try {
      const response = await axios.get(`${API_URL}/xero/dashboard-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      });
      
      console.log('✅ Dashboard data retrieved successfully!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Data received');
      
    } catch (error) {
      console.log('❌ Dashboard data failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFinancialTimeout().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If tests pass, timeout handling is working correctly');
  console.log('✅ Financial analysis should complete within 45 seconds');
  console.log('✅ Partial data handling should work if some sources timeout');
  console.log('✅ Proper error messages should be returned for timeouts');
  console.log('');
  console.log('🔧 Expected behavior:');
  console.log('- Requests should complete within 45 seconds');
  console.log('- If Xero API is slow, partial data should be returned');
  console.log('- Clear timeout error messages should be shown');
  console.log('- Graceful degradation for slow responses');
}).catch(console.error);
