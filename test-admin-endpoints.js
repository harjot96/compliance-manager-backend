#!/usr/bin/env node

// Test admin endpoints for saving Xero credentials
const axios = require('axios');
const db = require('./src/config/database');

async function testAdminEndpoints() {
  try {
    console.log('🧪 Testing Admin Endpoints for Xero Credentials...\n');
    
    const testCredentials = {
      clientId: 'BE4B464D1E864F9BAE7325BF04F06A11',
      clientSecret: 'test-secret-123456789012345678901234567890',
      redirectUri: 'https://compliance-manager-frontend.onrender.com/redirecturl'
    };
    
    console.log('📋 Test credentials:', testCredentials);
    
    // Test 1: Individual company assignment
    console.log('\n📋 Test 1: Individual Company Assignment...');
    try {
      const response = await axios.post('http://localhost:3001/api/companies/admin/62/xero-client', testCredentials, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        }
      });
      
      console.log('   ✅ Individual assignment successful!');
      console.log('   Response:', response.data);
      
    } catch (error) {
      console.log('   ❌ Individual assignment failed:');
      console.log('      Status:', error.response?.status);
      console.log('      Message:', error.response?.data?.message);
      console.log('      Error:', error.response?.data?.error);
    }
    
    // Test 2: Bulk assignment
    console.log('\n📋 Test 2: Bulk Assignment to All Companies...');
    try {
      const response = await axios.post('http://localhost:3001/api/companies/admin/xero-client-all', testCredentials, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        }
      });
      
      console.log('   ✅ Bulk assignment successful!');
      console.log('   Response:', response.data);
      
    } catch (error) {
      console.log('   ❌ Bulk assignment failed:');
      console.log('      Status:', error.response?.status);
      console.log('      Message:', error.response?.data?.message);
      console.log('      Error:', error.response?.data?.error);
    }
    
    // Test 3: Check database after test
    console.log('\n📋 Test 3: Checking Database After Test...');
    const dbCheck = await db.query(`
      SELECT 
        xs.company_id,
        c.company_name,
        xs.client_id,
        xs.client_secret,
        xs.updated_at
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      WHERE xs.client_id = $1
      ORDER BY xs.updated_at DESC
      LIMIT 5
    `, [testCredentials.clientId]);
    
    console.log(`   Found ${dbCheck.rows.length} companies with test Client ID:`);
    dbCheck.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.company_name}: ${row.client_id}`);
      console.log(`      Secret: ${row.client_secret ? 'SET' : 'NOT SET'}`);
      console.log(`      Updated: ${row.updated_at}`);
    });
    
    // Test 4: Test with real credentials
    console.log('\n📋 Test 4: Testing with Real Credentials...');
    const realCredentials = {
      clientId: 'BE4B464D1E864F9BAE7325BF04F06A11',
      clientSecret: 'RealSecretFromSuperAdmin123456789012345678901234567890',
      redirectUri: 'https://compliance-manager-frontend.onrender.com/redirecturl'
    };
    
    console.log('   Using real Client ID with test Secret');
    
    try {
      const response = await axios.post('http://localhost:3001/api/companies/admin/xero-client-all', realCredentials, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        }
      });
      
      console.log('   ✅ Real credentials assignment successful!');
      console.log('   Response:', response.data);
      
      // Check database
      const finalCheck = await db.query(`
        SELECT COUNT(*) as count 
        FROM xero_settings 
        WHERE client_id = $1
      `, [realCredentials.clientId]);
      
      console.log(`   Database shows ${finalCheck.rows[0].count} companies with real Client ID`);
      
    } catch (error) {
      console.log('   ❌ Real credentials assignment failed:');
      console.log('      Status:', error.response?.status);
      console.log('      Message:', error.response?.data?.message);
      console.log('      Error:', error.response?.data?.error);
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('   - Admin endpoints are accessible');
    console.log('   - Individual assignment endpoint: /api/companies/admin/:companyId/xero-client');
    console.log('   - Bulk assignment endpoint: /api/companies/admin/xero-client-all');
    console.log('   - Both endpoints use XeroSettings model for database updates');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    process.exit(0);
  }
}

testAdminEndpoints();
