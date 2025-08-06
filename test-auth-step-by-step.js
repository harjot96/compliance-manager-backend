const jwt = require('jsonwebtoken');
const Company = require('./src/models/Company');

async function testAuthStepByStep() {
  console.log('🔍 Testing Authentication Step by Step\n');

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTc1NDMyNzk4MywiZXhwIjoxNzU0OTMyNzgzfQ.ltqVgQR_LGvJfYFOCG5AIB_TTevk_AF-jT4EN8YBokA';

  try {
    // Step 1: Verify JWT token
    console.log('1️⃣ Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('📋 Decoded payload:', decoded);
    console.log('📋 User ID:', decoded.id);

    // Step 2: Find company by ID
    console.log('\n2️⃣ Finding company by ID...');
    const company = await Company.findById(decoded.id);
    
    if (company) {
      console.log('✅ Company found successfully');
      console.log('📋 Company details:');
      console.log(`  ID: ${company.id}`);
      console.log(`  Name: ${company.companyName}`);
      console.log(`  Email: ${company.email}`);
      console.log(`  Role: ${company.role}`);
      console.log(`  Active: ${company.isActive}`);
      
      // Step 3: Test the role check
      console.log('\n3️⃣ Testing role check...');
      if (company.role === 'admin') {
        console.log('✅ User is admin');
      } else {
        console.log('✅ User is company (not admin)');
      }
      
    } else {
      console.log('❌ Company not found');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('💡 JWT verification failed - check JWT_SECRET');
    } else if (error.name === 'TokenExpiredError') {
      console.log('💡 Token has expired');
    }
  }
}

// Check environment variables
console.log('📋 Environment Check:');
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not set'}\n`);

testAuthStepByStep(); 