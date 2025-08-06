const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const xeroController = require('../controllers/xeroController');
const auth = require('../middleware/auth');

// Xero-specific rate limiter - more permissive for development
const xeroLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 50, // more permissive in development
  message: {
    success: false,
    message: 'Too many Xero API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OAuth2 Authentication
router.get('/login', auth, xeroController.buildAuthUrl);
router.post('/callback', xeroController.handleCallback);
router.get('/callback', xeroController.handleCallback); // Add GET route for OAuth2 callback

// Company Information
router.get('/company-info', auth, xeroController.getCompanyInfo);

// Token Management
router.post('/refresh-token', xeroController.refreshToken);

// Data Access
router.post('/data/:resourceType', auth, xeroController.getXeroData);

// Xero Settings Management
router.post('/settings', xeroLimiter, auth, xeroController.createXeroSettings);
router.get('/settings', xeroLimiter, auth, xeroController.getXeroSettings);
router.delete('/settings', xeroLimiter, auth, xeroController.deleteXeroSettings);
router.get('/settings/all', xeroLimiter, auth, xeroController.getAllXeroSettings);

// Xero-specific state creation for OAuth
router.post('/create-auth-state', auth, xeroController.createXeroAuthState);

module.exports = router; 