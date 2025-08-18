const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'compliance_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 5, // Reduced for remote database
  min: 0, // Start with no connections
  idleTimeoutMillis: 30000, // Reduced for remote database
  connectionTimeoutMillis: 15000, // Increased for remote database
  acquireTimeoutMillis: 15000, // Increased for remote database
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { 
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  // Additional settings for remote database stability
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  // Handle connection errors gracefully
  allowExitOnIdle: true
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process, just log the error
  console.log('⚠️  Database pool error - continuing with application...');
});

// Handle pool errors more gracefully
pool.on('acquire', () => {
  console.log('Client acquired from pool');
});

pool.on('release', () => {
  console.log('Client released back to pool');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
