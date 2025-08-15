#!/usr/bin/env node

/**
 * Simple test script for Xero reports endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('📊 Testing Xero Reports Endpoint\n');

async function testXeroReportsSimple() {
  try {
    // Get token from command line argument
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_JWT_TOKEN') {
      console.log('❌ Please provide your JWT token:');
      console.log('   node test-xero-reports-simple.js YOUR_JWT_TOKEN');
      return;
    }

    const tenantId = '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc';
    const reportID = 'BalanceSheet';

    console.log('1️⃣ Testing Xero reports endpoint...');
    console.log(`URL: ${API_URL}/xero/reports?reportID=${reportID}&tenantId=${tenantId}`);
    
    try {
      const response = await axios.get(`${API_URL}/xero/reports?reportID=${reportID}&tenantId=${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Xero reports retrieved successfully!');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Xero reports failed');
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message}`);
      console.log(`Error: ${error.response?.data?.error}`);
      
      if (error.response?.status === 401) {
        console.log('\n🔧 401 Error - Xero authorization expired:');
        console.log('1. Re-authenticate with Xero');
        console.log('2. Check if tokens are valid');
        console.log('3. Verify Xero connection');
      } else if (error.response?.status === 404) {
        console.log('\n🔧 404 Error - Not found:');
        console.log('1. Check if Xero settings exist');
        console.log('2. Verify tenant ID is correct');
        console.log('3. Check if organization exists');
      } else if (error.response?.status === 500) {
        console.log('\n🔧 500 Error - Server error:');
        console.log('1. Check server logs for details');
        console.log('2. Verify Xero API is accessible');
        console.log('3. Check if report ID is valid');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testXeroReportsSimple().then(() => {
  console.log('\n📝 Summary:');
  console.log('✅ If successful, the reports endpoint is working');
  console.log('❌ If failed, check the error message above');
  console.log('');
  console.log('🔧 Common issues:');
  console.log('- Xero tokens expired (401)');
  console.log('- Invalid tenant ID (404)');
  console.log('- Server configuration (500)');
}).catch(console.error);
