#!/usr/bin/env node

// Create working JWT token for testing
const jwt = require('jsonwebtoken');

function createWorkingToken() {
  try {
    console.log('🔑 Creating working JWT token...\n');
    
    // Try common JWT secrets
    const secrets = [
      'your-secret-key',
      'compliance-manager-secret',
      'xero-integration-secret',
      'jwt-secret-key',
      'secret-key-123',
      'compliance-secret',
      'xero-secret'
    ];
    
    const payload = { id: 62 }; // Company ID 62
    
    console.log('📋 Token payload:', payload);
    
    for (const secret of secrets) {
      try {
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        
        console.log(`\n🔑 Token with secret "${secret}":`);
        console.log(token);
        
        // Test the token
        console.log(`\n🔍 Testing token with secret "${secret}"...`);
        
        // Make a simple test request
        const axios = require('axios');
        
        axios.post('http://localhost:3001/api/xero-plug-play/oauth-callback', {
          code: "test",
          redirect_uri: "test",
          state: "test"
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          console.log(`✅ Token works with secret "${secret}"`);
        }).catch(error => {
          if (error.response?.status === 400) {
            console.log(`✅ Token authenticated with secret "${secret}" (got 400, not 401)`);
          } else if (error.response?.status === 401) {
            console.log(`❌ Token failed with secret "${secret}" (401 error)`);
          } else {
            console.log(`⚠️ Unexpected response with secret "${secret}": ${error.response?.status}`);
          }
        });
        
        // Only test one token at a time
        break;
        
      } catch (error) {
        console.log(`❌ Failed to create token with secret "${secret}": ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createWorkingToken();