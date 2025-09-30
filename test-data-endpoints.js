#!/usr/bin/env node

// Test data loading endpoints
const axios = require('axios');

async function testDataEndpoints() {
  try {
    console.log('🔍 Testing Xero data loading endpoints...\n');
    
    const baseUrl = 'http://localhost:3333';
    const token = 'Bearer test_token'; // This should be a real token in production
    
    // Test with company that has tokens (Sam233 - company ID 7)
    const testData = {
      companyId: 7,
      tenantId: '0525fe61-e8ef-4f1b-92f5-4ba5d5eb8e5c',
      resourceType: 'organization'
    };
    
    console.log('📊 Testing organization endpoint...');
    try {
      const response = await axios.post(`${baseUrl}/api/xero-plug-play/load-data`, {
        resourceType: testData.resourceType,
        tenantId: testData.tenantId
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Organization endpoint response:', {
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        dataLength: response.data.data ? Object.keys(response.data.data).length : 0
      });
    } catch (error) {
      console.log('❌ Organization endpoint error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    console.log('\n📊 Testing contacts endpoint...');
    try {
      const response = await axios.post(`${baseUrl}/api/xero-plug-play/load-data`, {
        resourceType: 'contacts',
        tenantId: testData.tenantId
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Contacts endpoint response:', {
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        dataLength: response.data.data ? response.data.data.length : 0
      });
    } catch (error) {
      console.log('❌ Contacts endpoint error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    console.log('\n📊 Testing invoices endpoint...');
    try {
      const response = await axios.post(`${baseUrl}/api/xero-plug-play/load-data`, {
        resourceType: 'invoices',
        tenantId: testData.tenantId
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Invoices endpoint response:', {
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        dataLength: response.data.data ? response.data.data.length : 0
      });
    } catch (error) {
      console.log('❌ Invoices endpoint error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDataEndpoints();
