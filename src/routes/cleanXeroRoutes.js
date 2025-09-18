const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cleanXeroController = require('../controllers/cleanXeroController');

// Clean Xero API routes
router.post('/settings', auth, cleanXeroController.saveSettings);
router.get('/settings', auth, cleanXeroController.getSettings);
router.delete('/settings', auth, cleanXeroController.deleteSettings);

// OAuth routes are now handled by xeroOAuth2Controller

// Data routes
router.get('/data/:dataType', auth, cleanXeroController.getXeroData);

// Simple connection routes (for compatibility)
const simpleXeroController = require('../controllers/simpleXeroController');
router.post('/simple-connect', auth, simpleXeroController.simpleConnect);
router.get('/connection-status', auth, simpleXeroController.getConnectionStatus);
router.get('/sample/:dataType', auth, simpleXeroController.getSampleData);

module.exports = router;
