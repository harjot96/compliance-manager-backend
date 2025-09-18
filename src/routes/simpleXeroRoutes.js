const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const simpleXeroController = require('../controllers/simpleXeroController');

// Simple Xero connection routes
router.post('/simple-connect', auth, simpleXeroController.simpleConnect);
router.get('/connection-status', auth, simpleXeroController.getConnectionStatus);
router.get('/sample/:dataType', auth, simpleXeroController.getSampleData);

module.exports = router;


