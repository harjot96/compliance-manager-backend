#!/usr/bin/env node

/**
 * Test Render.com Database Connection
 * Tests different SSL configurations for Render.com PostgreSQL
 */

require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Render.com Database Connection Test\n');

// Test different SSL configurations
const sslConfigs = [
  { name: 'No SSL', config: false },
  { name: 'SSL with rejectUnauthorized: false', config: { rejectUnauthorized: false } },
  { name: 'SSL with sslmode: require', config: { rejectUnauthorized: false, sslmode: 'require' } },
  { name: 'SSL with sslmode: no-verify', config: { rejectUnauthorized: false, sslmode: 'no-verify' } },
  { name: 'SSL with sslmode: prefer', config: { rejectUnauthorized: false, sslmode: 'prefer' } }
];

async function testSSLConfig(sslConfig) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 1,
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    ssl: sslConfig.config
  });

  let client;
  
  try {
    console.log(`\n🔗 Testing: ${sslConfig.name}`);
    client = await pool.connect();
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ SUCCESS: ${sslConfig.name}`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    
    return { success: true, config: sslConfig.name };
    
  } catch (error) {
    console.log(`❌ FAILED: ${sslConfig.name}`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}`);
    
    return { success: false, config: sslConfig.name, error: error.message };
    
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

async function testAllConfigs() {
  console.log('📋 Testing all SSL configurations...\n');
  
  const results = [];
  
  for (const sslConfig of sslConfigs) {
    const result = await testSSLConfig(sslConfig);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 Results Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Successful configurations:');
    successful.forEach(r => console.log(`   - ${r.config}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed configurations:');
    failed.forEach(r => console.log(`   - ${r.config}: ${r.error}`));
  }
  
  if (successful.length === 0) {
    console.log('\n💡 All configurations failed. Possible issues:');
    console.log('   - Database server is down');
    console.log('   - Network connectivity issues');
    console.log('   - Firewall blocking connections');
    console.log('   - Invalid credentials');
    console.log('   - Database doesn\'t exist');
  } else {
    console.log(`\n🎉 Found ${successful.length} working configuration(s)!`);
    console.log('💡 Use the first successful configuration in your database.js file.');
  }
  
  return successful.length > 0;
}

// Run the test
testAllConfigs().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test crashed:', error);
  process.exit(1);
});
