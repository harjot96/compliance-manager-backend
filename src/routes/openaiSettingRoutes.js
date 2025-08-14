const express = require('express');
const router = express.Router();
const openaiSettingController = require('../controllers/openaiSettingController');
const auth = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/auth');

// OpenAI Settings Management (Super Admin only)
router.post('/settings', auth, requireSuperAdmin, openaiSettingController.saveOpenAISettings);
router.get('/settings', auth, requireSuperAdmin, openaiSettingController.getOpenAISettings);
router.get('/settings/all', auth, requireSuperAdmin, openaiSettingController.getAllOpenAISettings);
router.put('/settings/:id', auth, requireSuperAdmin, openaiSettingController.updateOpenAISettings);
router.delete('/settings/:id', auth, requireSuperAdmin, openaiSettingController.deleteOpenAISettings);

// Test OpenAI API key (Super Admin only)
router.post('/test-api-key', auth, requireSuperAdmin, openaiSettingController.testOpenAIApiKey);

// Get OpenAI API key temporarily (Super Admin only) - USE WITH CAUTION
router.get('/api-key', auth, requireSuperAdmin, openaiSettingController.getOpenAIApiKey);

module.exports = router; 