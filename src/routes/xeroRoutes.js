const express = require('express');
const router = express.Router();
const xeroController = require('../controllers/xeroController');
const auth = require('../middleware/auth');

// OAuth2 Authentication
router.get('/login', auth, xeroController.buildAuthUrl);
router.get('/callback', auth, xeroController.handleCallback);

// Connections Management (role-based)
router.get('/connections', auth, xeroController.getConnections);
router.delete('/connections/:id', auth, xeroController.deleteConnection);

// Data Access (role-based)
router.get('/:connectionId/invoices', auth, xeroController.getXeroData);
router.get('/:connectionId/contacts', auth, xeroController.getXeroData);
router.get('/:connectionId/bank-transactions', auth, xeroController.getXeroData);
router.get('/:connectionId/accounts', auth, xeroController.getXeroData);
router.get('/:connectionId/items', auth, xeroController.getXeroData);

// Sync Management (role-based)
router.get('/:connectionId/sync-cursors', auth, xeroController.getSyncCursors);
router.post('/:connectionId/sync-cursors/:resourceType/reset', auth, xeroController.resetSyncCursor);

// Webhook Events (role-based)
router.get('/:connectionId/webhook-events', auth, xeroController.getWebhookEvents);

// Webhook Endpoint (no auth required, signature verification instead)
router.post('/webhook', xeroController.handleWebhook);

module.exports = router; 