const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const demoXeroController = require('../controllers/demoXeroController');

// Demo data routes (for testing data visibility)
router.get('/demo/:dataType', auth, demoXeroController.getDemoData);

module.exports = router;
