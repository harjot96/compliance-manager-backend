const express = require('express');
const router = express.Router();
const notificationTemplateController = require('../controllers/notificationTemplateController');
const openaiController = require('../controllers/openaiController');

// ========================================
// NOTIFICATION TEMPLATES ROUTES
// ========================================

// Get all notification templates
router.get('/notification', notificationTemplateController.getAllTemplates);

// Get a specific notification template by ID
router.get('/notification/:id', notificationTemplateController.getTemplateById);

// Create a new notification template
router.post('/notification', notificationTemplateController.createTemplate);

// Update a notification template
router.put('/notification/:id', notificationTemplateController.updateTemplate);

// Delete a notification template
router.delete('/notification/:id', notificationTemplateController.deleteTemplate);

// Test a notification template
router.post('/notification/:id/test', notificationTemplateController.testTemplate);

// ========================================
// AI TEMPLATE GENERATION ROUTES
// ========================================

// Generate email/SMS templates using AI
router.post('/generate', openaiController.generateTemplate);

// Generate compliance text using AI
router.post('/generate-compliance-text', openaiController.generateComplianceText);

// ========================================
// COMPREHENSIVE TEMPLATES ROUTES
// ========================================

// Get all templates (both notification and AI-generated examples)
router.get('/', async (req, res) => {
  try {
    const NotificationTemplate = require('../models/NotificationTemplate');
    
    // Get all notification templates
    const notificationTemplates = await NotificationTemplate.getAll();
    
    // Create AI template examples (these are not stored, just examples)
    const aiTemplateExamples = [
      {
        id: 'ai-email-example',
        type: 'ai-generated',
        category: 'email',
        name: 'AI Email Template Example',
        description: 'Example of AI-generated email template',
        example: {
          templateType: 'email',
          complianceType: 'Tax Filing',
          tone: 'professional',
          generatedContent: 'Subject: Reminder: Tax Filing Deadline Approaching\n\nDear [Recipient],\n\nI hope this email finds you well. As tax season is quickly approaching, I wanted to send you a friendly reminder to ensure that all necessary documents are in order for the upcoming filing deadline...'
        }
      },
      {
        id: 'ai-sms-example',
        type: 'ai-generated',
        category: 'sms',
        name: 'AI SMS Template Example',
        description: 'Example of AI-generated SMS template',
        example: {
          templateType: 'sms',
          complianceType: 'BAS',
          tone: 'urgent',
          generatedContent: 'Hi [CompanyName], your BAS is due in [daysLeft] days. Please ensure all documents are prepared and submitted on time to avoid penalties.'
        }
      }
    ];
    
    // Combine both types of templates
    const allTemplates = {
      notificationTemplates: notificationTemplates.map(t => t.toJSON()),
      aiTemplateExamples: aiTemplateExamples,
      summary: {
        totalNotificationTemplates: notificationTemplates.length,
        totalAiExamples: aiTemplateExamples.length,
        emailTemplates: notificationTemplates.filter(t => t.type === 'email').length,
        smsTemplates: notificationTemplates.filter(t => t.type === 'sms').length
      }
    };
    
    res.json({
      success: true,
      message: 'All templates retrieved successfully',
      data: allTemplates
    });
    
  } catch (error) {
    console.error('Get All Templates Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates',
      error: error.message
    });
  }
});

// Get templates by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const NotificationTemplate = require('../models/NotificationTemplate');
    
    if (type === 'ai-generated') {
      // Return AI template generation examples
      const aiExamples = [
        {
          id: 'ai-email',
          type: 'ai-generated',
          category: 'email',
          name: 'AI Email Template Generator',
          description: 'Generate professional email templates using AI',
          endpoint: '/api/templates/generate',
          parameters: {
            templateType: 'email',
            complianceType: 'string (required)',
            tone: 'string (optional)',
            customPrompt: 'string (optional)'
          }
        },
        {
          id: 'ai-sms',
          type: 'ai-generated',
          category: 'sms',
          name: 'AI SMS Template Generator',
          description: 'Generate concise SMS templates using AI',
          endpoint: '/api/templates/generate',
          parameters: {
            templateType: 'sms',
            complianceType: 'string (required)',
            tone: 'string (optional)',
            customPrompt: 'string (optional)'
          }
        }
      ];
      
      res.json({
        success: true,
        message: 'AI template generators retrieved successfully',
        data: aiExamples
      });
    } else if (['email', 'sms'].includes(type)) {
      // Get notification templates by type
      const templates = await NotificationTemplate.getAll();
      const filteredTemplates = templates.filter(t => t.type === type);
      
      res.json({
        success: true,
        message: `${type.toUpperCase()} templates retrieved successfully`,
        data: filteredTemplates.map(t => t.toJSON())
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid template type. Must be: email, sms, or ai-generated'
      });
    }
    
  } catch (error) {
    console.error('Get Templates by Type Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates by type',
      error: error.message
    });
  }
});

// Get template statistics
router.get('/stats', async (req, res) => {
  try {
    const NotificationTemplate = require('../models/NotificationTemplate');
    
    const templates = await NotificationTemplate.getAll();
    
    const stats = {
      totalTemplates: templates.length,
      emailTemplates: templates.filter(t => t.type === 'email').length,
      smsTemplates: templates.filter(t => t.type === 'sms').length,
      templatesByComplianceType: {},
      recentTemplates: templates
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          createdAt: t.createdAt
        }))
    };
    
    // Count templates by compliance type
    templates.forEach(template => {
      template.notificationTypes.forEach(type => {
        stats.templatesByComplianceType[type] = (stats.templatesByComplianceType[type] || 0) + 1;
      });
    });
    
    res.json({
      success: true,
      message: 'Template statistics retrieved successfully',
      data: stats
    });
    
  } catch (error) {
    console.error('Get Template Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve template statistics',
      error: error.message
    });
  }
});

module.exports = router;
