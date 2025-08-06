const db = require('./src/config/database');

async function listCompanies() {
  console.log('📋 Listing Companies in Database\n');

  try {
    const result = await db.query(`
      SELECT id, company_name, email, role, is_active, created_at
      FROM companies
      ORDER BY created_at DESC
    `);

    if (result.rows.length === 0) {
      console.log('❌ No companies found in database');
      console.log('\n💡 You need to create a company first:');
      console.log('1. Use the registration endpoint');
      console.log('2. Or create a company directly in the database');
    } else {
      console.log(`✅ Found ${result.rows.length} companies:\n`);
      
      result.rows.forEach((company, index) => {
        console.log(`${index + 1}. Company ID: ${company.id}`);
        console.log(`   Name: ${company.company_name}`);
        console.log(`   Email: ${company.email}`);
        console.log(`   Role: ${company.role}`);
        console.log(`   Active: ${company.is_active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${company.created_at}`);
        console.log('');
      });

      console.log('🔧 Use one of these emails to test login:');
      result.rows.forEach(company => {
        console.log(`   - ${company.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error listing companies:', error.message);
  } finally {
    await db.pool.end();
  }
}

listCompanies(); 