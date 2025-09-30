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
router.post('/settings', plugAndPlayXeroController.saveSettings.bind(plugAndPlayXeroController));
router.get('/settings', plugAndPlayXeroController.getSettings.bind(plugAndPlayXeroController));
router.delete('/settings', plugAndPlayXeroController.deleteSettings.bind(plugAndPlayXeroController));
router.post('/disconnect', plugAndPlayXeroController.softDisconnect.bind(plugAndPlayXeroController));

// Connection Status Routes
router.get('/status', plugAndPlayXeroController.getConnectionStatus.bind(plugAndPlayXeroController));

// OAuth Flow Routes
router.get('/connect', plugAndPlayXeroController.getAuthUrl.bind(plugAndPlayXeroController));
router.get('/oauth-callback', plugAndPlayXeroController.handleCallback.bind(plugAndPlayXeroController));
router.post('/oauth-callback', plugAndPlayXeroController.handleCallback.bind(plugAndPlayXeroController));
router.post('/refresh-token', plugAndPlayXeroController.refreshToken.bind(plugAndPlayXeroController));

// Data Access Routes
router.get('/:resourceType', plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

// Specific Data Routes (for convenience)
router.get('/invoices', (req, res, next) => {
  req.query.resourceType = 'invoices';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/contacts', (req, res, next) => {
  req.query.resourceType = 'contacts';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/accounts', (req, res, next) => {
  req.query.resourceType = 'accounts';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/bank-transactions', (req, res, next) => {
  req.query.resourceType = 'bank-transactions';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/organization', (req, res, next) => {
  req.query.resourceType = 'organization';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/items', (req, res, next) => {
  req.query.resourceType = 'items';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/tax-rates', (req, res, next) => {
  req.query.resourceType = 'tax-rates';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/tracking-categories', (req, res, next) => {
  req.query.resourceType = 'tracking-categories';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/purchase-orders', (req, res, next) => {
  req.query.resourceType = 'purchase-orders';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/receipts', (req, res, next) => {
  req.query.resourceType = 'receipts';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/credit-notes', (req, res, next) => {
  req.query.resourceType = 'credit-notes';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/manual-journals', (req, res, next) => {
  req.query.resourceType = 'manual-journals';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/prepayments', (req, res, next) => {
  req.query.resourceType = 'prepayments';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/overpayments', (req, res, next) => {
  req.query.resourceType = 'overpayments';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/quotes', (req, res, next) => {
  req.query.resourceType = 'quotes';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

// Additional Transaction Routes
router.get('/transactions', (req, res, next) => {
  req.query.resourceType = 'transactions';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/payments', (req, res, next) => {
  req.query.resourceType = 'payments';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/journals', (req, res, next) => {
  req.query.resourceType = 'journals';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

// Special Data Routes
router.get('/financial-summary', (req, res, next) => {
  req.query.resourceType = 'financial-summary';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

router.get('/dashboard-data', (req, res, next) => {
  req.query.resourceType = 'dashboard-data';
  next();
}, plugAndPlayXeroController.loadData.bind(plugAndPlayXeroController));

// Health Check Route
router.get('/health', plugAndPlayXeroController.healthCheck.bind(plugAndPlayXeroController));

// Demo Data Routes (for testing)
router.get('/demo/:resourceType', plugAndPlayXeroController.getDemoData.bind(plugAndPlayXeroController));

// Super Admin Routes (require super admin privileges)
router.post('/admin/auto-link-all', plugAndPlayXeroController.autoLinkToAllCompanies.bind(plugAndPlayXeroController));
router.get('/admin/companies-status', plugAndPlayXeroController.getAllCompaniesXeroStatus.bind(plugAndPlayXeroController));

module.exports = router;
