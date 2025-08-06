const express = require('express');
const router = express.Router();
const cronjobSettingController = require('../controllers/cronjobSettingController');
const auth = require('../middleware/auth');

// Get all cronjob settings (super admin only)
router.get('/', auth, cronjobSettingController.getAllCronjobSettings);

// Update a cronjob setting by id (super admin only)
router.put('/:id', auth, cronjobSettingController.updateCronjobSetting);

// Create a new cronjob setting (super admin only)
router.post('/', auth, cronjobSettingController.createCronjobSetting);

module.exports = router; 