const express = require('express');
const router = express.Router();
const { getDeadlines, updateDeadlines } = require('../controllers/complianceDeadlinesController');
const authMiddleware = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/auth');

router.get('/', getDeadlines); // Publicly accessible
router.put('/', authMiddleware, requireSuperAdmin, updateDeadlines); // Only superadmin can update

module.exports = router; 