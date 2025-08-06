const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'compliance_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10, // Reduced from 20
  min: 2, // Add minimum connections
  idleTimeoutMillis: 60000, // Increased from 30000
  connectionTimeoutMillis: 10000, // Increased from 2000
  acquireTimeoutMillis: 10000, // Add acquire timeout
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
