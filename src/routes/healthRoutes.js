const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Health check endpoint
 * Tests basic server and database connectivity
 */
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      const result = await db.query('SELECT NOW() as current_time');
      dbStatus = 'connected';
      console.log('✅ Health check: Database connected');
    } catch (error) {
      dbStatus = 'error';
      dbError = error.message;
      console.log('❌ Health check: Database error -', error.message);
    }
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        error: dbError
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };
    
    // If database is not connected, return 503 Service Unavailable
    if (dbStatus === 'error') {
      return res.status(503).json({
        ...healthData,
        status: 'degraded',
        message: 'Database connection failed'
      });
    }
    
    res.json({
      ...healthData,
      message: 'Server is healthy'
    });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Database test endpoint
 * Tests database connectivity specifically
 */
router.get('/health/db', async (req, res) => {
  try {
    console.log('🔍 Testing database connectivity...');
    
    const result = await db.query(`
      SELECT 
        NOW() as current_time,
        current_database() as database_name,
        current_user as current_user,
        version() as db_version
    `);
    
    res.json({
      status: 'connected',
      message: 'Database connection successful',
      data: {
        currentTime: result.rows[0].current_time,
        databaseName: result.rows[0].database_name,
        currentUser: result.rows[0].current_user,
        dbVersion: result.rows[0].db_version.split(' ')[0] + ' ' + result.rows[0].db_version.split(' ')[1]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
