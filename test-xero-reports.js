#!/usr/bin/env node

/**
 * Test script to troubleshoot Xero reports 401 error
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('📊 Troubleshooting Xero Reports 401 Error\n');

async function testXeroReports() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-xero-reports.js YOUR_JWT_TOKEN');
      return;
    }

    const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc';
    const reportID = 'BalanceSheet';

    console.log('1️⃣ Testing Xero connection status...');
    try {
      const response = await axios.get(`${API_URL}/xero/connection-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Connection status retrieved!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Connection status failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n2️⃣ Testing Xero settings...');
    try {
      const response = await axios.get(`${API_URL}/xero/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Xero settings retrieved!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Xero settings failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

    console.log('\n3️⃣ Testing Xero reports endpoint...');
    try {
      const response = await axios.get(`${API_URL}/xero/reports?reportID=${reportID}&tenantId=${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Xero reports retrieved!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Xero reports failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.status === 401) {
        console.log('\n🔧 Troubleshooting steps for 401 error:');
        console.log('1. Check if Xero connection is still valid');
        console.log('2. Re-authenticate with Xero if needed');
        console.log('3. Verify the tenant ID is correct');
        console.log('4. Check if Xero tokens have expired');
        console.log('5. Try refreshing the Xero connection');
      }
    }

    console.log('\n4️⃣ Testing Xero dashboard data...');
    try {
      const response = await axios.get(`${API_URL}/xero/dashboard-data?tenantId=${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Xero dashboard data retrieved!');
      console.log('📊 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Xero dashboard data failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testXeroReports().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If connection status shows "connected", Xero is working');
  console.log('❌ If you get 401 errors, Xero authentication has expired');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Check Xero connection status');
  console.log('2. Re-authenticate with Xero if needed');
  console.log('3. Verify tenant ID is correct');
  console.log('4. Check Xero token expiration');
}).catch(console.error);
