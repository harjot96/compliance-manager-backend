#!/usr/bin/env node

/**
 * Test script to debug OpenAI admin routes
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

console.log('🔍 Testing OpenAI Admin Routes\n');

async function testRoutes() {
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Server health check failed:', error.message);
      return;
    }

    // Test 2: Check API health
    console.log('\n2️⃣ Testing API health...');
    try {
      const apiHealthResponse = await axios.get(`${API_URL}/health`);
      console.log('✅ API is running:', apiHealthResponse.data);
    } catch (error) {
      console.log('❌ API health check failed:', error.message);
      return;
    }

    // Test 3: Test OpenAI admin routes without auth (should return 401)
    console.log('\n3️⃣ Testing OpenAI admin routes without authentication...');
    
    const routesToTest = [
      { method: 'GET', path: '/openai-admin/settings', name: 'Get Settings' },
      { method: 'POST', path: '/openai-admin/settings', name: 'Save Settings' },
      { method: 'GET', path: '/openai-admin/settings/all', name: 'Get All Settings' },
      { method: 'POST', path: '/openai-admin/test-api-key', name: 'Test API Key' }
    ];

    for (const route of routesToTest) {
      try {
        if (route.method === 'GET') {
          await axios.get(`${API_URL}${route.path}`);
        } else {
          await axios.post(`${API_URL}${route.path}`, {});
        }
        console.log(`❌ ${route.name}: Should have returned 401 (no auth)`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${route.name}: Correctly returned 401 (no auth)`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${route.name}: Route not found (404)`);
        } else {
          console.log(`⚠️ ${route.name}: Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
        }
      }
    }

    // Test 4: Check available routes
    console.log('\n4️⃣ Checking available routes...');
    console.log('Available routes should be:');
    console.log('  - GET  /api/openai-admin/settings');
    console.log('  - POST /api/openai-admin/settings');
    console.log('  - GET  /api/openai-admin/settings/all');
    console.log('  - PUT  /api/openai-admin/settings/:id');
    console.log('  - DELETE /api/openai-admin/settings/:id');
    console.log('  - POST /api/openai-admin/test-api-key');

    // Test 5: Check if the issue is with the URL path
    console.log('\n5️⃣ Testing URL path variations...');
    
    const urlVariations = [
      '/api/openai-admin/settings',
      '/api/api/openai-admin/settings', // This is the problematic one
      '/openai-admin/settings',
      '/api/openai-admin/settings/'
    ];

    for (const url of urlVariations) {
      try {
        await axios.post(`${BASE_URL}${url}`, {});
        console.log(`❌ ${url}: Should have returned 401 or 404`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${url}: Correctly returned 401 (no auth)`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${url}: Route not found (404)`);
        } else {
          console.log(`⚠️ ${url}: Unexpected response ${error.response?.status}: ${error.response?.data?.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testRoutes().then(() => {
  console.log('\n✅ Route testing completed!');
  console.log('\n📝 Summary:');
  console.log('If you see "Route not found (404)" for /api/openai-admin/settings, the route is working.');
  console.log('If you see "Route not found (404)" for /api/api/openai-admin/settings, that confirms the duplicate /api/ issue.');
  console.log('The frontend should use: /api/openai-admin/settings (not /api/api/openai-admin/settings)');
}).catch(console.error);
