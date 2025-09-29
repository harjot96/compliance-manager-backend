#!/usr/bin/env node

// Comprehensive OAuth flow test
const axios = require('axios');
const db = require('./src/config/database');

async function testOAuthFlow() {
  try {
    console.log('🧪 Testing Complete OAuth Flow...\n');
    
    // Test 1: Check database state
    console.log('📋 Test 1: Checking database state...');
    const dbStates = await db.query('SELECT * FROM xero_oauth_states ORDER BY created_at DESC LIMIT 5');
    console.log(`   Found ${dbStates.rows.length} OAuth states in database`);
    
    if (dbStates.rows.length > 0) {
      console.log('   Recent states:');
      dbStates.rows.forEach((state, index) => {
        console.log(`     ${index + 1}. ${state.state} (Company: ${state.company_id}, Created: ${state.created_at})`);
      });
    }
    
    // Test 2: Check Xero settings
    console.log('\n📋 Test 2: Checking Xero settings...');
    const xeroSettings = await db.query('SELECT company_id, client_id, client_secret, redirect_uri FROM xero_settings LIMIT 3');
    console.log(`   Found ${xeroSettings.rows.length} Xero settings`);
    
    xeroSettings.rows.forEach((setting, index) => {
      console.log(`     Company ${setting.company_id}: Client ID ${setting.client_id ? setting.client_id.substring(0, 8) + '...' : 'MISSING'}`);
    });
    
    // Test 3: Test getAuthUrl endpoint
    console.log('\n📋 Test 3: Testing getAuthUrl endpoint...');
    try {
      const authResponse = await axios.get('http://localhost:3001/api/xero-plug-play/connect', {
        headers: {
          'Authorization': 'Bearer test_token'
        },
        params: {
          state: 'test_state_' + Date.now()
        }
      });
      
      console.log('   ✅ getAuthUrl endpoint accessible');
      console.log('   Response structure:', Object.keys(authResponse.data));
      
      if (authResponse.data.data && authResponse.data.data.authUrl) {
        console.log('   ✅ Authorization URL generated');
        
        // Extract state from auth URL
        const authUrl = authResponse.data.data.authUrl;
        const stateMatch = authUrl.match(/state=([^&]+)/);
        if (stateMatch) {
          const generatedState = stateMatch[1];
          console.log(`   Generated state: ${generatedState}`);
          
          // Test 4: Check if state was stored
          console.log('\n📋 Test 4: Checking if state was stored...');
          const stateCheck = await db.query('SELECT * FROM xero_oauth_states WHERE state = $1', [generatedState]);
          if (stateCheck.rows.length > 0) {
            console.log('   ✅ State stored in database');
          } else {
            console.log('   ❌ State NOT stored in database');
          }
        }
      }
      
    } catch (error) {
      console.log('   ❌ getAuthUrl endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test 5: Test OAuth callback with the payload you provided
    console.log('\n📋 Test 5: Testing OAuth callback with your payload...');
    const testPayload = {
      code: "IMdWMwsK1tO-dTVvkALi7pERBqxiGjV3q-0rsvGBFu8",
      redirect_uri: "https://compliance-manager-frontend.onrender.com/redirecturl",
      state: "xmwxwffqylqzbi590ppea"
    };
    
    console.log('   Test payload:', testPayload);
    
    // Check if this state exists in database
    const stateExists = await db.query('SELECT * FROM xero_oauth_states WHERE state = $1', [testPayload.state]);
    console.log(`   State exists in database: ${stateExists.rows.length > 0 ? 'YES' : 'NO'}`);
    
    if (stateExists.rows.length > 0) {
      console.log('   State details:', stateExists.rows[0]);
    } else {
      console.log('   ❌ This state was never stored - this is the problem!');
      
      // Let's manually add this state for testing
      console.log('   🔧 Manually adding state for testing...');
      await db.query(
        'INSERT INTO xero_oauth_states (state, company_id, created_at) VALUES ($1, $2, NOW())',
        [testPayload.state, 6] // Using SuperAdmin company ID
      );
      console.log('   ✅ State manually added for testing');
    }
    
    // Test 6: Test the actual callback
    console.log('\n📋 Test 6: Testing OAuth callback endpoint...');
    try {
      const callbackResponse = await axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        }
      });
      
      console.log('   ✅ OAuth callback successful');
      console.log('   Response:', callbackResponse.data);
      
    } catch (error) {
      console.log('   ❌ OAuth callback error:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
      console.log('   Error:', error.response?.data?.error);
      
      if (error.response?.data?.details) {
        console.log('   Details:', error.response?.data?.details);
      }
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('   - Check if states are being stored during getAuthUrl');
    console.log('   - Check if states are being validated during callback');
    console.log('   - Check if token exchange is working');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await db.end();
  }
}

testOAuthFlow();
