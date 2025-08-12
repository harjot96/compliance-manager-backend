const db = require('./src/config/database');

async function checkXeroSettings() {
  console.log('🔍 Checking Xero Settings\n');
  
  try {
    const result = await db.query(`
      SELECT 
        xs.*,
        c.company_name,
        c.email
      FROM xero_settings xs
      JOIN companies c ON xs.company_id = c.id
      ORDER BY xs.created_at DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No Xero settings found');
      return;
    }
    
    console.log(`✅ Found ${result.rows.length} companies with Xero settings:\n`);
    
    result.rows.forEach((setting, index) => {
      console.log(`${index + 1}. Company ID: ${setting.company_id}`);
      console.log(`   Name: ${setting.company_name}`);
      console.log(`   Email: ${setting.email}`);
      console.log(`   Has Access Token: ${setting.access_token ? '✅ Yes' : '❌ No'}`);
      console.log(`   Has Refresh Token: ${setting.refresh_token ? '✅ Yes' : '❌ No'}`);
      console.log(`   Token Expires: ${setting.token_expires_at || 'N/A'}`);
      console.log(`   Created: ${setting.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking Xero settings:', error.message);
  } finally {
    process.exit(0);
  }
}

checkXeroSettings().catch(console.error);

