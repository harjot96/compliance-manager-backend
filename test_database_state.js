const db = require('./src/config/database');
const XeroSettings = require('./src/models/XeroSettings');

async function testDatabaseState() {
  try {
    console.log('🔍 Testing Database State for Xero Tokens\n');
    
    // Test database connection
    console.log('📊 Testing database connection...');
    const connectionTest = await db.query('SELECT NOW()');
    console.log('✅ Database connected:', connectionTest.rows[0].now);
    
    // Check table structure
    console.log('\n📋 Checking xero_settings table structure...');
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'xero_settings' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if there are any records
    console.log('\n📊 Checking existing records...');
    const allSettings = await db.query('SELECT * FROM xero_settings');
    console.log(`📊 Found ${allSettings.rows.length} xero_settings records`);
    
    if (allSettings.rows.length > 0) {
      console.log('\n📋 Sample record structure:');
      const sample = allSettings.rows[0];
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const displayValue = key.includes('token') || key.includes('secret') 
          ? (value && typeof value === 'string' ? `${value.substring(0, 10)}...` : value)
          : value;
        console.log(`   ${key}: ${displayValue}`);
      });
      
      // Check token fields specifically
      console.log('\n🔐 Token field analysis:');
      allSettings.rows.forEach((record, index) => {
        console.log(`\n   Record ${index + 1} (Company ID: ${record.company_id}):`);
        console.log(`     access_token: ${record.access_token ? 'Present' : 'Missing'}`);
        console.log(`     refresh_token: ${record.refresh_token ? 'Present' : 'Missing'}`);
        console.log(`     token_expires_at: ${record.token_expires_at || 'Missing'}`);
        console.log(`     client_id: ${record.client_id ? 'Present' : 'Missing'}`);
        console.log(`     redirect_uri: ${record.redirect_uri || 'Missing'}`);
      });
    }
    
    // Test XeroSettings model
    console.log('\n🔧 Testing XeroSettings model...');
    if (allSettings.rows.length > 0) {
      const firstCompanyId = allSettings.rows[0].company_id;
      console.log(`📊 Testing getByCompanyId for company ${firstCompanyId}...`);
      
      const settings = await XeroSettings.getByCompanyId(firstCompanyId);
      if (settings) {
        console.log('✅ XeroSettings.getByCompanyId works');
        console.log(`   access_token: ${settings.access_token ? 'Present' : 'Missing'}`);
        console.log(`   refresh_token: ${settings.refresh_token ? 'Present' : 'Missing'}`);
        console.log(`   token_expires_at: ${settings.token_expires_at || 'Missing'}`);
      } else {
        console.log('❌ XeroSettings.getByCompanyId returned null');
      }
    }
    
    // Check companies table
    console.log('\n📊 Checking companies table...');
    const companies = await db.query('SELECT id, company_name, email FROM companies LIMIT 5');
    console.log(`📊 Found ${companies.rows.length} companies`);
    companies.rows.forEach(company => {
      console.log(`   ID: ${company.id}, Name: ${company.company_name}, Email: ${company.email}`);
    });
    
    console.log('\n✅ Database state test completed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseState();
