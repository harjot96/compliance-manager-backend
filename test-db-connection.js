#!/usr/bin/env node

/**
 * Simple Database Connection Test
 * Tests basic database connectivity
 */

require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Database Connection Test\n');

// Log environment variables (without sensitive data)
console.log('📋 Environment Check:');
console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || 5432}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || 'compliance_management'}`);
console.log(`   DB_USER: ${process.env.DB_USER || 'postgres'}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : '***NOT SET***'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Create a simple pool for testing
const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'compliance_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 1, // Single connection for testing
  min: 0,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  let client;
  
  try {
    console.log('\n🔗 Attempting database connection...');
    
    // Get a client from the pool
    client = await testPool.connect();
    console.log('✅ Successfully connected to database');
    
    // Test a simple query
    console.log('\n📊 Testing simple query...');
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Query successful');
    console.log(`   Current time: ${result.rows[0].current_time}`);
    console.log(`   Database: ${result.rows[0].db_version.split(' ')[0]} ${result.rows[0].db_version.split(' ')[1]}`);
    
    // Test if we can access the database
    console.log('\n📋 Testing database access...');
    const dbResult = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `);
    console.log('✅ Database access successful');
    console.log(`   Database: ${dbResult.rows[0].database_name}`);
    console.log(`   User: ${dbResult.rows[0].current_user}`);
    console.log(`   Server: ${dbResult.rows[0].server_address}:${dbResult.rows[0].server_port}`);
    
    console.log('\n🎉 Database connection test PASSED!');
    return true;
    
  } catch (error) {
    console.error('\n❌ Database connection test FAILED:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Detail: ${error.detail || 'N/A'}`);
    console.error(`   Hint: ${error.hint || 'N/A'}`);
    
    // Provide helpful suggestions based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestion: Database server is not running or not accessible');
      console.log('   - Check if PostgreSQL is running');
      console.log('   - Verify DB_HOST and DB_PORT settings');
      console.log('   - Try: brew services start postgresql (macOS)');
      console.log('   - Try: sudo systemctl start postgresql (Linux)');
    } else if (error.code === '28P01') {
      console.log('\n💡 Suggestion: Authentication failed');
      console.log('   - Check DB_USER and DB_PASSWORD');
      console.log('   - Verify user exists and has correct permissions');
    } else if (error.code === '3D000') {
      console.log('\n💡 Suggestion: Database does not exist');
      console.log('   - Check DB_NAME setting');
      console.log('   - Create the database if it doesn\'t exist');
      console.log('   - Try: createdb compliance_management');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Suggestion: Host not found');
      console.log('   - Check DB_HOST setting');
      console.log('   - Verify network connectivity');
    }
    
    return false;
    
  } finally {
    if (client) {
      client.release();
      console.log('\n🔌 Client released');
    }
    
    // Close the pool
    try {
      await testPool.end();
      console.log('🔌 Pool closed');
    } catch (error) {
      console.log('⚠️  Error closing pool:', error.message);
    }
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test crashed:', error);
  process.exit(1);
}); 