#!/usr/bin/env node

// Get a valid JWT token for testing
const jwt = require('jsonwebtoken');
const db = require('./src/config/database');

async function getValidToken() {
  try {
    console.log('🔑 Getting valid JWT token for testing...\n');
    
    // Get company 62 details
    const companyResult = await db.query('SELECT * FROM companies WHERE id = 62');
    
    if (companyResult.rows.length === 0) {
      console.log('❌ Company 62 not found');
      return;
    }
    
    const company = companyResult.rows[0];
    console.log('📋 Company 62 details:');
    console.log(`   Name: ${company.company_name}`);
    console.log(`   Email: ${company.email}`);
    
    // Create a valid JWT token
    const token = jwt.sign(
      { 
        companyId: company.id,
        email: company.email,
        role: company.role || 'user'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('\n🔑 Valid JWT Token:');
    console.log(token);
    
    console.log('\n💡 Use this token in Authorization header:');
    console.log(`Authorization: Bearer ${token}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

getValidToken();
