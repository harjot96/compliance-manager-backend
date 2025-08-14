const express = require('express');
const router = express.Router();
const openaiSettingController = require('../controllers/openaiSettingController');
const auth = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/auth');

// OpenAI Settings Management (Any authenticated user)
router.post('/settings', auth, openaiSettingController.saveOpenAISettings);
router.get('/settings', auth, openaiSettingController.getOpenAISettings);
router.get('/settings/all', auth, openaiSettingController.getAllOpenAISettings);
router.put('/settings/:id', auth, openaiSettingController.updateOpenAISettings);
router.delete('/settings/:id', auth, openaiSettingController.deleteOpenAISettings);

// Test OpenAI API key (Any authenticated user)
router.post('/test-api-key', auth, openaiSettingController.testOpenAIApiKey);

// Get OpenAI API key temporarily (Any authenticated user) - USE WITH CAUTION
router.get('/api-key', auth, openaiSettingController.getOpenAIApiKey);

module.exports = router; 