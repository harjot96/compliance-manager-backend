const db = require('./src/config/database');

async function enrollAnyCompany(companyId) {
  console.log(`📋 Enrolling Company ID ${companyId} for Xero Integration\n`);

  const complianceData = {
    basFrequency: 'Quarterly',
    nextBasDue: '2024-12-31',
    fbtApplicable: true,
    nextFbtDue: '2024-12-31',
    iasRequired: true,
    iasFrequency: 'Monthly',
    nextIasDue: '2024-12-31',
    financialYearEnd: '2024-06-30'
  };

  try {
    // Check if company exists
    const companyCheck = await db.query(
      'SELECT id, company_name, email FROM companies WHERE id = $1',
      [companyId]
    );

    if (companyCheck.rows.length === 0) {
      console.log('❌ Company not found');
      return;
    }

    const company = companyCheck.rows[0];
    console.log(`✅ Found company: ${company.company_name} (${company.email})`);

    // Check if already enrolled
    const existingCompliance = await db.query(
      'SELECT id FROM company_compliance WHERE company_id = $1',
      [companyId]
    );

    if (existingCompliance.rows.length > 0) {
      console.log('⚠️  Company is already enrolled');
      console.log('✅ Company can now use Xero integration');
      return;
    }

    // Create compliance record
    const result = await db.query(`
      INSERT INTO company_compliance (
        company_id, bas_frequency, next_bas_due, fbt_applicable, 
        next_fbt_due, ias_required, ias_frequency, next_ias_due, 
        financial_year_end
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, company_id, bas_frequency, next_bas_due
    `, [
      companyId,
      complianceData.basFrequency,
      complianceData.nextBasDue,
      complianceData.fbtApplicable,
      complianceData.nextFbtDue,
      complianceData.iasRequired,
      complianceData.iasFrequency,
      complianceData.nextIasDue,
      complianceData.financialYearEnd
    ]);

    const compliance = result.rows[0];
    console.log('✅ Company enrolled successfully!');
    console.log(`📋 Compliance ID: ${compliance.id}`);
    console.log(`📋 BAS Frequency: ${compliance.bas_frequency}`);
    console.log(`📋 Next BAS Due: ${compliance.next_bas_due}`);

    // Generate new token
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { id: companyId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('\n🎉 Company is now enrolled and can:');
    console.log('✅ Setup Xero integration');
    console.log('✅ Access Xero OAuth flow');
    console.log('✅ Connect Xero accounts');
    console.log(`\n🔑 New Token: ${token}`);
    console.log(`🔗 Test URL: curl -X GET http://localhost:3333/api/xero/login -H "Authorization: Bearer ${token}"`);

  } catch (error) {
    console.error('❌ Error enrolling company:', error.message);
  } finally {
    await db.pool.end();
  }
}

// Get company ID from command line argument
const companyId = process.argv[2];
if (!companyId) {
  console.log('❌ Please provide a company ID');
  console.log('Usage: node enroll-any-company.js <company_id>');
  console.log('\nAvailable companies:');
  console.log('1, 2, 5, 6, 7, 8, 11, 16, 17');
  process.exit(1);
}

enrollAnyCompany(parseInt(companyId)); 