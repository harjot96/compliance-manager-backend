#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Compliance Management Backend in Development Mode...\n');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  Warning: .env file not found');
  console.log('💡 Create a .env file with your environment variables\n');
} else {
  console.log('✅ .env file found');
}

// Check if database connection is available
const db = require('./src/config/database');

async function testDatabaseConnection() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('💡 Make sure your database is running and credentials are correct\n');
  }
}

// Start nodemon
function startNodemon() {
  console.log('🔄 Starting nodemon...\n');
  
  const nodemon = spawn('npx', ['nodemon', 'src/server.js'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  nodemon.on('error', (error) => {
    console.error('❌ Failed to start nodemon:', error.message);
    process.exit(1);
  });

  nodemon.on('exit', (code) => {
    console.log(`\n🛑 Nodemon exited with code ${code}`);
    process.exit(code);
  });
}

// Run database test and start server
testDatabaseConnection()
  .then(() => {
    startNodemon();
  })
  .catch((error) => {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }); 