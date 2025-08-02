const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');

// OpenAI Chat Completion
router.post('/chat', openaiController.chatCompletion);

// Generate Compliance Text
router.post('/compliance-text', openaiController.generateComplianceText);

// Generate Templates
router.post('/generate-template', openaiController.generateTemplate);

// Analyze Content
router.post('/analyze-content', openaiController.analyzeContent);

module.exports = router; 