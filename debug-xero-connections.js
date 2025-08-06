const axios = require('axios');
const db = require('./src/config/database');

const BASE_URL = 'http://localhost:5000'; // Change to your server URL

async function debugXeroConnections() {
  console.log('🔍 Debugging Xero Connections Endpoint\n');

  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    const dbTest = await db.query('SELECT 1');
    console.log('✅ Database connection successful\n');

    // 2. Check if xero_connections table exists
    console.log('2️⃣ Checking if xero_connections table exists...');
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'xero_connections'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ xero_connections table exists');
      
      // 3. Check table structure
      console.log('\n3️⃣ Checking table structure...');
      const structure = await db.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'xero_connections'
        ORDER BY ordinal_position;
      `);
      
      console.log('📋 Table structure:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // 4. Check if there are any connections
      console.log('\n4️⃣ Checking existing connections...');
      const connections = await db.query('SELECT COUNT(*) as count FROM xero_connections');
      console.log(`📊 Found ${connections.rows[0].count} connections`);
      
    } else {
      console.log('❌ xero_connections table does not exist');
      console.log('💡 Run migrations to create the table');
    }

    // 5. Test the API endpoint (if you have a valid JWT token)
    console.log('\n5️⃣ Testing API endpoint...');
    console.log('⚠️  Note: You need a valid JWT token to test the API');
    console.log('💡 Add your JWT token to test the actual endpoint');
    
    // Uncomment and add your JWT token to test the API
    /*
    const response = await axios.get(`${BASE_URL}/api/xero/connections`, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Response:', response.data);
    */

  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server is not running. Start with: npm run dev');
    } else if (error.code === '28P01') {
      console.log('\n💡 Database authentication failed. Check your .env file');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist. Check your .env file');
    }
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run the debug script
debugXeroConnections(); 