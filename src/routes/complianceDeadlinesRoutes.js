const express = require('express');
const router = express.Router();
const { getDeadlines, updateDeadlines } = require('../controllers/complianceDeadlinesController');
const auth = require('../middleware/auth');

router.get('/', getDeadlines); // Publicly accessible
router.put('/', auth, updateDeadlines); // Only superadmin can update

module.exports = router; 