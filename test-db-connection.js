const db = require('./src/config/database');

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    console.log('📋 Connection Details:');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`Port: ${process.env.DB_PORT || 5432}`);
    console.log(`Database: ${process.env.DB_NAME || 'compliance_management'}`);
    console.log(`User: ${process.env.DB_USER || 'postgres'}`);
    console.log(`SSL: ${process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'}\n`);
    
    // Test basic connection
    console.log('🔌 Testing basic connection...');
    const result = await db.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection successful!');
    console.log(`⏰ Current time: ${result.rows[0].current_time}`);
    console.log(`📊 Database: ${result.rows[0].db_version.split(' ')[0]}\n`);
    
    // Test pool status
    console.log('📊 Pool Status:');
    console.log(`Total connections: ${db.pool.totalCount}`);
    console.log(`Idle connections: ${db.pool.idleCount}`);
    console.log(`Waiting connections: ${db.pool.waitingCount}\n`);
    
    // Test a more complex query
    console.log('🔍 Testing table queries...');
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Table query successful!');
    console.log(`📋 Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check if database server is running');
      console.log('2. Verify host and port in .env file');
      console.log('3. Check firewall settings');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('1. Check DB_USER and DB_PASSWORD in .env');
      console.log('2. Verify user has proper permissions');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('1. Check DB_NAME in .env file');
      console.log('2. Create the database if it doesn\'t exist');
    }
    
    process.exit(1);
  } finally {
    // Close the pool
    await db.pool.end();
  }
}

// Run the test
testDatabaseConnection(); 