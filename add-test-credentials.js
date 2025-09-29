const db = require('./src/config/database');

async function addTestXeroCredentials() {
  try {
    console.log('🔧 Adding test Xero credentials...');
    
    // Add credentials for company ID 1
    const companyId = 1;
    const testCredentials = {
      client_id: 'test-client-id-12345678-1234-1234-1234-123456789012', // UUID format
      client_secret: 'test-secret-abcdefghijklmnopqrstuvwxyz123456',
      redirect_uri: 'http://localhost:3004/redirecturl'
    };
    
    // Insert or update Xero settings
    const query = `
      INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (company_id) 
      DO UPDATE SET 
        client_id = EXCLUDED.client_id,
        client_secret = EXCLUDED.client_secret,
        redirect_uri = EXCLUDED.redirect_uri,
        updated_at = NOW()
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      companyId,
      testCredentials.client_id,
      testCredentials.client_secret,
      testCredentials.redirect_uri
    ]);
    
    console.log('✅ Test Xero credentials added successfully!');
    console.log('📋 Credentials:', {
      company_id: result.rows[0].company_id,
      client_id: result.rows[0].client_id.substring(0, 8) + '...',
      redirect_uri: result.rows[0].redirect_uri
    });
    
    console.log('\n🚀 Now you can:');
    console.log('1. Refresh http://localhost:3004/xero-oauth2');
    console.log('2. You should see ✅ credentials configured');
    console.log('3. Click "Connect to Xero" (will fail with test credentials, but UI will work)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('relation "xero_settings" does not exist')) {
      console.log('\n💡 Run the database migration first:');
      console.log('node src/utils/xeroOAuth2Migration.js');
    }
  } finally {
    process.exit(0);
  }
}

addTestXeroCredentials();
