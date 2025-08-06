const db = require('./src/config/database');

async function checkCompanyEnrollment() {
  console.log('📋 Checking Company Enrollment Status\n');

  try {
    // Get all companies
    const companies = await db.query(`
      SELECT 
        c.id, 
        c.company_name, 
        c.email, 
        c.role,
        CASE WHEN cc.id IS NOT NULL THEN true ELSE false END as is_enrolled
      FROM companies c
      LEFT JOIN company_compliance cc ON c.id = cc.company_id
      ORDER BY c.id
    `);

    console.log('📊 Company Enrollment Status:');
    console.log('─'.repeat(80));
    
    companies.rows.forEach(company => {
      const status = company.is_enrolled ? '✅ ENROLLED' : '❌ NOT ENROLLED';
      console.log(`ID: ${company.id} | ${company.company_name} | ${company.email} | ${company.role} | ${status}`);
    });

    console.log('\n📋 Available Test Tokens:');
    console.log('─'.repeat(80));
    
    // Generate tokens for each company
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    companies.rows.forEach(company => {
      const token = jwt.sign(
        { id: company.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const status = company.is_enrolled ? '✅ ENROLLED' : '❌ NOT ENROLLED';
      console.log(`\n🔑 Company ID ${company.id} (${company.company_name}):`);
      console.log(`   Status: ${status}`);
      console.log(`   Token: ${token}`);
      console.log(`   Test URL: curl -X GET http://localhost:3333/api/xero/company-info -H "Authorization: Bearer ${token}"`);
    });

  } catch (error) {
    console.error('❌ Error checking companies:', error.message);
  } finally {
    await db.pool.end();
  }
}

checkCompanyEnrollment(); 