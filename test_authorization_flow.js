const db = require('./src/config/database');
const XeroSettings = require('./src/models/XeroSettings');

async function testAuthorizationFlow() {
  try {
    console.log('🔍 Testing Complete Xero Authorization Flow\n');
    
    // Get all companies with their Xero settings
    console.log('📊 Analyzing all companies and their Xero settings...');
    const companiesWithSettings = await db.query(`
      SELECT 
        c.id as company_id,
        c.company_name,
        c.email,
        xs.access_token,
        xs.refresh_token,
        xs.token_expires_at,
        xs.client_id,
        xs.redirect_uri,
        xs.updated_at
      FROM companies c
      LEFT JOIN xero_settings xs ON c.id = xs.company_id
      ORDER BY c.id
    `);
    
    console.log(`📊 Found ${companiesWithSettings.rows.length} companies with Xero settings`);
    
    // Analyze each company
    let companiesWithTokens = 0;
    let companiesWithoutTokens = 0;
    
    companiesWithSettings.rows.forEach(company => {
      const hasTokens = company.access_token && company.refresh_token;
      const status = hasTokens ? '✅ HAS TOKENS' : '❌ NO TOKENS';
      
      console.log(`\n${status} - Company ID: ${company.company_id}`);
      console.log(`   Name: ${company.company_name}`);
      console.log(`   Email: ${company.email}`);
      console.log(`   Access Token: ${company.access_token ? 'Present' : 'Missing'}`);
      console.log(`   Refresh Token: ${company.refresh_token ? 'Present' : 'Missing'}`);
      console.log(`   Token Expires: ${company.token_expires_at || 'Missing'}`);
      console.log(`   Client ID: ${company.client_id ? 'Present' : 'Missing'}`);
      console.log(`   Redirect URI: ${company.redirect_uri || 'Missing'}`);
      console.log(`   Last Updated: ${company.updated_at || 'Never'}`);
      
      if (hasTokens) {
        companiesWithTokens++;
      } else {
        companiesWithoutTokens++;
      }
    });
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Companies with tokens: ${companiesWithTokens}`);
    console.log(`   Companies without tokens: ${companiesWithoutTokens}`);
    console.log(`   Total companies: ${companiesWithSettings.rows.length}`);
    
    // Check for companies that might be the current user
    console.log('\n🔍 IDENTIFYING POTENTIAL CURRENT USER:');
    const potentialUsers = companiesWithSettings.rows.filter(company => 
      company.email.includes('test') || 
      company.email.includes('debug') || 
      company.email.includes('xero') ||
      company.company_name.toLowerCase().includes('test') ||
      company.company_name.toLowerCase().includes('debug')
    );
    
    if (potentialUsers.length > 0) {
      console.log('📋 Potential current user companies:');
      potentialUsers.forEach(company => {
        const hasTokens = company.access_token && company.refresh_token;
        const status = hasTokens ? '✅ READY' : '❌ NEEDS AUTH';
        console.log(`   ${status} - ID: ${company.company_id}, Email: ${company.email}`);
      });
    }
    
    // Check OAuth states
    console.log('\n🔍 Checking OAuth states...');
    const oauthStates = await db.query('SELECT * FROM xero_oauth_states ORDER BY created_at DESC LIMIT 5');
    console.log(`📊 Found ${oauthStates.rows.length} recent OAuth states`);
    
    oauthStates.rows.forEach(state => {
      console.log(`   Company ID: ${state.company_id}, State: ${state.state.substring(0, 10)}..., Created: ${state.created_at}`);
    });
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (companiesWithTokens === 0) {
      console.log('   ❌ No companies have valid tokens');
      console.log('   🔧 Solution: Complete OAuth flow for any company');
    } else if (companiesWithTokens === 1) {
      const companyWithTokens = companiesWithSettings.rows.find(c => c.access_token);
      console.log(`   ✅ Company ID ${companyWithTokens.company_id} has tokens`);
      console.log(`   🔧 Solution: Make sure you're logged in as this company`);
      console.log(`   📧 Email: ${companyWithTokens.email}`);
    } else {
      console.log('   ⚠️ Multiple companies have tokens');
      console.log('   🔧 Solution: Check which company you should be using');
    }
    
    // Test token validation
    if (companiesWithTokens > 0) {
      console.log('\n🔧 Testing token validation...');
      const companyWithTokens = companiesWithSettings.rows.find(c => c.access_token);
      
      if (companyWithTokens) {
        console.log(`📊 Testing tokens for Company ID ${companyWithTokens.company_id}...`);
        
        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(companyWithTokens.token_expires_at);
        const isExpired = expiresAt <= now;
        
        console.log(`   Token expires at: ${expiresAt}`);
        console.log(`   Current time: ${now}`);
        console.log(`   Token status: ${isExpired ? '❌ EXPIRED' : '✅ VALID'}`);
        
        if (isExpired) {
          console.log('   🔧 Solution: Token is expired, need to refresh or re-authorize');
        } else {
          console.log('   ✅ Token is still valid');
        }
      }
    }
    
    console.log('\n✅ Authorization flow test completed!');
    
  } catch (error) {
    console.error('❌ Authorization flow test failed:', error);
  } finally {
    process.exit(0);
  }
}

testAuthorizationFlow();
