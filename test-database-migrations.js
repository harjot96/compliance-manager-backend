#!/usr/bin/env node

/**
 * Test Database Migrations
 * Tests database connection and migration functions
 */

const { runAllMigrations, migrateNotificationTemplates, migrateOpenAISettings } = require('./src/utils/migrate');
const db = require('./src/config/database');

console.log('🧪 Testing Database Migrations\n');

async function testDatabaseConnection() {
  try {
    console.log('1️⃣ Testing database connection...');
    
    const result = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    console.log(`📊 Test query result: ${result.rows[0].test}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testTableExistence() {
  try {
    console.log('\n2️⃣ Checking table existence...');
    
    // Check for common tables
    const tables = ['companies', 'openai_settings', 'notification_templates', 'xero_settings'];
    
    for (const table of tables) {
      try {
        const result = await db.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          );
        `, [table]);
        
        const exists = result.rows[0].exists;
        console.log(`📋 ${table}: ${exists ? '✅ Exists' : '❌ Not found'}`);
      } catch (error) {
        console.log(`📋 ${table}: ❌ Error checking - ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Table existence check failed:', error.message);
    return false;
  }
}

async function testIndividualMigrations() {
  try {
    console.log('\n3️⃣ Testing individual migrations...');
    
    console.log('\n📝 Testing notification templates migration...');
    await migrateNotificationTemplates();
    
    console.log('\n📝 Testing OpenAI settings migration...');
    await migrateOpenAISettings();
    
    console.log('✅ Individual migrations completed');
    return true;
  } catch (error) {
    console.error('❌ Individual migrations failed:', error.message);
    return false;
  }
}

async function testFullMigration() {
  try {
    console.log('\n4️⃣ Testing full migration process...');
    
    await runAllMigrations();
    
    console.log('✅ Full migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Full migration failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  try {
    const results = {
      connection: await testDatabaseConnection(),
      tables: await testTableExistence(),
      individual: await testIndividualMigrations(),
      full: await testFullMigration()
    };
    
    console.log('\n📊 Test Results:');
    console.log(`🔗 Database Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📋 Table Existence: ${results.tables ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔧 Individual Migrations: ${results.individual ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🚀 Full Migration: ${results.full ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
      console.log('\n🎉 All tests passed! Database migrations are working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the output above for details.');
    }
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    return false;
  } finally {
    // Close database connection
    try {
      await db.end();
      console.log('\n🔌 Database connection closed');
    } catch (error) {
      console.log('\n⚠️  Error closing database connection:', error.message);
    }
  }
}

// Run the tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test suite crashed:', error);
  process.exit(1);
});
