const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');
const openaiSettingController = require('../controllers/openaiSettingController');

// OpenAI Chat Completion
router.post('/chat', openaiController.chatCompletion);

// Generate Compliance Text
router.post('/compliance-text', openaiController.generateComplianceText);

// Generate Templates
router.post('/generate-template', openaiController.generateTemplate);

// Analyze Content
router.post('/analyze-content', openaiController.analyzeContent);

// OpenAI Settings Management (Admin only)
router.post('/settings', openaiSettingController.saveOpenAISettings);
router.get('/settings', openaiSettingController.getOpenAISettings);
router.put('/settings/:id', openaiSettingController.updateOpenAISettings);
router.delete('/settings/:id', openaiSettingController.deleteOpenAISettings);

// Test OpenAI API key
router.post('/test-api-key', openaiSettingController.testOpenAIApiKey);

module.exports = router; 