const express = require('express');
const router = express.Router();
const cronjobSettingController = require('../controllers/cronjobSettingController');
const authMiddleware = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/auth');

// Get all cronjob settings
router.get('/', authMiddleware, requireSuperAdmin, cronjobSettingController.getAllCronjobSettings);

// Update a cronjob setting by id
router.put('/:id', authMiddleware, requireSuperAdmin, cronjobSettingController.updateCronjobSetting);

// Create a new cronjob setting
router.post('/', authMiddleware, requireSuperAdmin, cronjobSettingController.createCronjobSetting);

module.exports = router; 