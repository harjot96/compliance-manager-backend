#!/usr/bin/env node

// Script to debug current company authentication and Xero settings
const jwt = require('jsonwebtoken');

async function debugCurrentCompany() {
  try {
    console.log('🔍 Debugging current company authentication...');
    
    // Instructions for the user
    console.log('\n📋 To use this debug script:');
    console.log('1. Open your browser and go to the Xero page');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Application/Storage tab');
    console.log('4. Find localStorage and look for the "token" key');
    console.log('5. Copy the token value');
    console.log('6. Replace "YOUR_TOKEN_HERE" in this script with your actual token');
    console.log('7. Run this script again\n');
    
    // Check if token is provided
    const token = process.argv[2];
    
    if (!token || token === 'YOUR_TOKEN_HERE') {
      console.log('⚠️  No token provided. Please provide your JWT token as an argument:');
      console.log('   node debug-current-company.js YOUR_ACTUAL_TOKEN_HERE');
      console.log('\n💡 You can find your token in browser localStorage (key: "token")');
      return;
    }
    
    try {
      // Decode the JWT token
      const decoded = jwt.decode(token);
      
      if (!decoded) {
        console.log('❌ Invalid token format');
        return;
      }
      
      console.log('🔓 Token decoded successfully!');
      console.log('📊 Token payload:', JSON.stringify(decoded, null, 2));
      
      // Extract company ID
      const companyId = decoded.id || decoded.companyId || decoded.company_id;
      
      if (!companyId) {
        console.log('❌ No company ID found in token');
        console.log('Available fields:', Object.keys(decoded));
        return;
      }
      
      console.log(`\n🎯 Current Company ID: ${companyId}`);
      
      // Check Xero settings for this company
      const db = require('./src/config/database');
      
      const result = await db.query(`
        SELECT 
          c.id,
          c.email,
          xs.client_id,
          xs.client_secret,
          xs.redirect_uri,
          xs.access_token,
          xs.refresh_token,
          xs.tenant_id,
          xs.organization_name,
          xs.created_at as settings_created,
          xs.updated_at as settings_updated
        FROM companies c
        LEFT JOIN xero_settings xs ON c.id = xs.company_id
        WHERE c.id = $1
      `, [companyId]);
      
      if (result.rows.length === 0) {
        console.log(`❌ Company ${companyId} not found in database`);
        return;
      }
      
      const company = result.rows[0];
      console.log(`\n📧 Company Email: ${company.email}`);
      
      if (company.client_id) {
        console.log('✅ Xero Settings Found:');
        console.log(`   └─ Client ID: ${company.client_id.substring(0, 8)}...`);
        console.log(`   └─ Redirect URI: ${company.redirect_uri || 'None'}`);
        console.log(`   └─ Has Access Token: ${company.access_token ? 'Yes' : 'No'}`);
        console.log(`   └─ Has Refresh Token: ${company.refresh_token ? 'Yes' : 'No'}`);
        console.log(`   └─ Tenant ID: ${company.tenant_id || 'None'}`);
        console.log(`   └─ Organization: ${company.organization_name || 'None'}`);
        console.log(`   └─ Settings Updated: ${company.settings_updated || 'Never'}`);
        
        if (!company.access_token) {
          console.log('\n⚠️  No access token found - this means you need to connect to Xero');
          console.log('   Click "Connect to Xero" button to authorize your account');
        }
      } else {
        console.log('❌ No Xero settings found for this company');
        console.log('\n🔧 This company needs Xero settings to be assigned');
        
        // Offer to auto-assign from super admin
        const superAdminResult = await db.query(`
          SELECT client_id, client_secret, redirect_uri 
          FROM xero_settings 
          WHERE company_id IN (6, 29) 
          AND client_id IS NOT NULL 
          LIMIT 1
        `);
        
        if (superAdminResult.rows.length > 0) {
          const superAdminSettings = superAdminResult.rows[0];
          console.log('\n🎯 Found super admin settings to copy:');
          console.log(`   └─ Client ID: ${superAdminSettings.client_id.substring(0, 8)}...`);
          
          try {
            await db.query(`
              INSERT INTO xero_settings (
                company_id, 
                client_id, 
                client_secret, 
                redirect_uri, 
                created_at, 
                updated_at
              ) VALUES ($1, $2, $3, $4, NOW(), NOW())
            `, [
              companyId,
              superAdminSettings.client_id,
              superAdminSettings.client_secret,
              superAdminSettings.redirect_uri
            ]);
            
            console.log('✅ Successfully assigned Xero settings to this company!');
            console.log('   You can now try connecting to Xero again.');
          } catch (error) {
            console.error('❌ Failed to assign settings:', error.message);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Token decode error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
debugCurrentCompany();
