// Plug and Play Xero Routes
// Complete route definitions for Xero integration
// This provides all necessary endpoints for a complete Xero integration

const express = require('express');
const router = express.Router();
const plugAndPlayXeroController = require('../controllers/plugAndPlayXeroController');
const auth = require('../middleware/auth');
const { addCompanyContext } = require('../middleware/companyIsolation');

// Apply authentication and company isolation to all routes
router.use(auth);
router.use(addCompanyContext);

// Settings Management Routes
router.post('/settings', plugAndPlayXeroController.saveSettings);
router.get('/settings', plugAndPlayXeroController.getSettings);
router.delete('/settings', plugAndPlayXeroController.deleteSettings);

// Connection Status Routes
router.get('/status', plugAndPlayXeroController.getConnectionStatus);

// OAuth Flow Routes
router.get('/connect', plugAndPlayXeroController.getAuthUrl);
router.post('/oauth-callback', plugAndPlayXeroController.handleCallback);
router.post('/refresh-token', plugAndPlayXeroController.refreshToken);

// Data Access Routes
router.get('/:resourceType', plugAndPlayXeroController.loadData);

// Specific Data Routes (for convenience)
router.get('/invoices', (req, res, next) => {
  req.query.resourceType = 'invoices';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/contacts', (req, res, next) => {
  req.query.resourceType = 'contacts';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/accounts', (req, res, next) => {
  req.query.resourceType = 'accounts';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/bank-transactions', (req, res, next) => {
  req.query.resourceType = 'bank-transactions';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/organization', (req, res, next) => {
  req.query.resourceType = 'organization';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/items', (req, res, next) => {
  req.query.resourceType = 'items';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/tax-rates', (req, res, next) => {
  req.query.resourceType = 'tax-rates';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/tracking-categories', (req, res, next) => {
  req.query.resourceType = 'tracking-categories';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/purchase-orders', (req, res, next) => {
  req.query.resourceType = 'purchase-orders';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/receipts', (req, res, next) => {
  req.query.resourceType = 'receipts';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/credit-notes', (req, res, next) => {
  req.query.resourceType = 'credit-notes';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/manual-journals', (req, res, next) => {
  req.query.resourceType = 'manual-journals';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/prepayments', (req, res, next) => {
  req.query.resourceType = 'prepayments';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/overpayments', (req, res, next) => {
  req.query.resourceType = 'overpayments';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/quotes', (req, res, next) => {
  req.query.resourceType = 'quotes';
  next();
}, plugAndPlayXeroController.loadData);

// Special Data Routes
router.get('/financial-summary', (req, res, next) => {
  req.query.resourceType = 'financial-summary';
  next();
}, plugAndPlayXeroController.loadData);

router.get('/dashboard-data', (req, res, next) => {
  req.query.resourceType = 'dashboard-data';
  next();
}, plugAndPlayXeroController.loadData);

// Health Check Route
router.get('/health', plugAndPlayXeroController.healthCheck);

// Demo Data Routes (for testing)
router.get('/demo/:resourceType', plugAndPlayXeroController.getDemoData);

module.exports = router;
