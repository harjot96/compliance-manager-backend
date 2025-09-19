#!/usr/bin/env node

/**
 * Temporary Proxy Server
 * 
 * This creates a proxy server that can be deployed to match your production
 * backend URL while forwarding requests to your local development server.
 * 
 * This is useful when you need to use the production frontend with local backend.
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PROXY_PORT || 8080;
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3333';

console.log('🔄 Starting Proxy Server...');
console.log(`📍 Proxy Port: ${PORT}`);
console.log(`🎯 Target: ${TARGET_URL}`);

// Enable CORS for all origins in proxy mode
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Health check for the proxy itself
app.get('/proxy-health', (req, res) => {
  res.json({
    success: true,
    message: 'Proxy server is running',
    target: TARGET_URL,
    timestamp: new Date().toISOString()
  });
});

// Proxy all requests to the target server
app.use('/', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  onError: (err, req, res) => {
    console.error('❌ Proxy Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Proxy connection failed',
      error: err.message,
      target: TARGET_URL
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 ${req.method} ${req.url} -> ${TARGET_URL}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ ${proxyRes.statusCode} ${req.method} ${req.url}`);
  }
}));

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`🔗 Forwarding to: ${TARGET_URL}`);
  console.log('\n💡 Usage:');
  console.log(`   Update your frontend to use: http://localhost:${PORT}`);
  console.log(`   Or deploy this proxy to match your production URL`);
  console.log('\n🧪 Test:');
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl http://localhost:${PORT}/proxy-health`);
});
