const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const xeroOAuth2Controller = require('../controllers/xeroOAuth2Controller');

// Settings management (for backward compatibility)
const cleanXeroController = require('../controllers/cleanXeroController');
router.post('/settings', auth, cleanXeroController.saveSettings);
router.get('/settings', auth, cleanXeroController.getSettings);
router.delete('/settings', auth, cleanXeroController.deleteSettings);

// OAuth2 flow routes
router.get('/auth-url', auth, xeroOAuth2Controller.getAuthUrl);
router.get('/connect', auth, xeroOAuth2Controller.connectXero);
router.get('/callback', xeroOAuth2Controller.handleCallback);

// Connection management
router.get('/status', auth, xeroOAuth2Controller.getConnectionStatus);
router.get('/tenants', auth, xeroOAuth2Controller.getTenants);
router.delete('/disconnect', auth, xeroOAuth2Controller.disconnect);

// Data access routes
router.get('/data/:dataType', auth, xeroOAuth2Controller.getXeroData);

module.exports = router;
