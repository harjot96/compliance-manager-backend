const express = require('express');
const router = express.Router();
const openaiSettingController = require('../controllers/openaiSettingController');

// OpenAI Settings Management (Admin only)
router.post('/settings', openaiSettingController.saveOpenAISettings);
router.get('/settings', openaiSettingController.getOpenAISettings);
router.get('/settings/all', openaiSettingController.getAllOpenAISettings);
router.put('/settings/:id', openaiSettingController.updateOpenAISettings);
router.delete('/settings/:id', openaiSettingController.deleteOpenAISettings);

// Test OpenAI API key
router.post('/test-api-key', openaiSettingController.testOpenAIApiKey);

module.exports = router; 