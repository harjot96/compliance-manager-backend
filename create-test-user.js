const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function createTestUser() {
  console.log('👤 Creating Test User\n');

  const testUser = {
    companyName: 'Test Company for Xero',
    email: 'xero-test@example.com',
    password: 'test123',
    mobileNumber: '1234567890',
    countryCode: '+61',
    role: 'company'
  };

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id, email FROM companies WHERE email = $1',
      [testUser.email]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  User already exists:');
      console.log(`Email: ${existingUser.rows[0].email}`);
      console.log(`ID: ${existingUser.rows[0].id}`);
      console.log('\n💡 You can use this existing user for testing');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(testUser.password, saltRounds);

    // Create user
    const result = await db.query(`
      INSERT INTO companies (company_name, email, mobile_number, country_code, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, company_name, email, role
    `, [
      testUser.companyName,
      testUser.email,
      testUser.mobileNumber,
      testUser.countryCode,
      passwordHash,
      testUser.role
    ]);

    const newUser = result.rows[0];
    console.log('✅ Test user created successfully!');
    console.log(`ID: ${newUser.id}`);
    console.log(`Name: ${newUser.company_name}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Role: ${newUser.role}`);
    console.log(`Password: ${testUser.password}`);

    console.log('\n🔧 Test credentials:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);

    console.log('\n🔧 Test login with:');
    console.log(`curl -X POST http://localhost:3333/api/companies/login \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"email": "${testUser.email}", "password": "${testUser.password}"}'`);

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await db.pool.end();
  }
}

createTestUser(); 