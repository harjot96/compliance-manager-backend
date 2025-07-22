const express = require('express');
const router = express.Router();
const { getDeadlines, updateDeadlines } = require('../controllers/complianceDeadlinesController');
const authMiddleware = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/auth');

router.get('/', authMiddleware, requireSuperAdmin, getDeadlines);
router.put('/', authMiddleware, requireSuperAdmin, updateDeadlines);

module.exports = router; 