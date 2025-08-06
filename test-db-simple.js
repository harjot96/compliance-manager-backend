const { Pool } = require('pg');
require('dotenv').config();

// Test database connection with different configurations
async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  // Configuration 1: Individual parameters
  const config1 = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'compliance_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false // Disable SSL for testing
  };
  
  console.log('📋 Configuration 1 (Individual params):');
  console.log(`Host: ${config1.host}`);
  console.log(`Port: ${config1.port}`);
  console.log(`Database: ${config1.database}`);
  console.log(`User: ${config1.user}`);
  console.log(`SSL: ${config1.ssl}\n`);
  
  try {
    const pool1 = new Pool(config1);
    const result1 = await pool1.query('SELECT 1 as test');
    console.log('✅ Configuration 1 works:', result1.rows[0]);
    await pool1.end();
  } catch (error) {
    console.log('❌ Configuration 1 failed:', error.message);
  }
  
  // Configuration 2: DATABASE_URL if available
  if (process.env.DATABASE_URL) {
    console.log('\n📋 Configuration 2 (DATABASE_URL):');
    console.log(`URL: ${process.env.DATABASE_URL.substring(0, 20)}...`);
    
    try {
      const pool2 = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
      });
      const result2 = await pool2.query('SELECT 1 as test');
      console.log('✅ Configuration 2 works:', result2.rows[0]);
      await pool2.end();
    } catch (error) {
      console.log('❌ Configuration 2 failed:', error.message);
    }
  } else {
    console.log('\n📋 Configuration 2: DATABASE_URL not set');
  }
  
  // Test the actual database config
  console.log('\n📋 Testing actual database config...');
  try {
    const db = require('./src/config/database');
    const result = await db.query('SELECT 1 as test');
    console.log('✅ Main database config works:', result.rows[0]);
    await db.pool.end();
  } catch (error) {
    console.log('❌ Main database config failed:', error.message);
  }
}

testDatabaseConnection(); 