#!/usr/bin/env node

// Create proper JWT token for testing
const jwt = require('jsonwebtoken');

function createProperToken() {
  try {
    console.log('🔑 Creating proper JWT token...\n');
    
    // Create token with correct payload structure
    const payload = { id: 62 }; // Company ID 62
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('📋 Token payload:', payload);
    console.log('\n🔑 Proper JWT Token:');
    console.log(token);
    
    console.log('\n💡 Use this token in Authorization header:');
    console.log(`Authorization: Bearer ${token}`);
    
    // Verify the token
    console.log('\n🔍 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token verified successfully');
    console.log('   Decoded payload:', decoded);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProperToken();
