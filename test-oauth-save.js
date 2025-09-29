const db = require('./src/config/database');

async function testTokenSave() {
  try {
    console.log('🧪 Testing token save functionality...');
    
    const companyId = 7;
    const testTokens = {
      access_token: 'test-access-token-' + Date.now(),
      refresh_token: 'test-refresh-token-' + Date.now(),
      expires_in: 1800, // 30 minutes
      xero_userid: 'test-user-id'
    };
    
    const testTenants = [
      {
        tenantId: 'test-tenant-123',
        tenantName: 'Test Company',
        organisationName: 'Test Organization'
      }
    ];
    
    const expiresAt = new Date(Date.now() + testTokens.expires_in * 1000);
    
    // Save test tokens
    const result = await db.query(`
      UPDATE xero_settings 
      SET 
        access_token = $1,
        refresh_token = $2,
        token_expires_at = $3,
        xero_user_id = $4,
        tenant_data = $5,
        updated_at = NOW()
      WHERE company_id = $6
      RETURNING *
    `, [
      testTokens.access_token,
      testTokens.refresh_token,
      expiresAt,
      testTokens.xero_userid,
      JSON.stringify(testTenants),
      companyId
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Test tokens saved successfully!');
      console.log('📋 Saved data:', {
        company_id: result.rows[0].company_id,
        access_token: result.rows[0].access_token.substring(0, 20) + '...',
        refresh_token: result.rows[0].refresh_token.substring(0, 20) + '...',
        expires_at: result.rows[0].token_expires_at,
        tenant_count: JSON.parse(result.rows[0].tenant_data || '[]').length
      });
      
      console.log('\n🚀 Now test the integration:');
      console.log('1. Go to http://localhost:3004/integrations/xero (development)');
      console.log('   OR https://compliance-manager-frontend.onrender.com/integrations/xero (production)');
      console.log('2. Should show ✅ Connected status');
      console.log('3. Should auto-load data or show load buttons');
      console.log('\n📝 Note: Make sure your backend is running on port 3333:');
      console.log('   npm run dev (should start on http://localhost:3333)');
      
    } else {
      console.log('❌ No rows updated - company might not have Xero settings');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testTokenSave();
