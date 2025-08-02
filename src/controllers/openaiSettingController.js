const OpenAISetting = require('../models/OpenAISetting');
const Joi = require('joi');

/**
 * Save OpenAI settings (Admin only)
 */
const saveOpenAISettings = async (req, res, next) => {
  try {
    const { apiKey, model, maxTokens, temperature } = req.body;
    
    // Validation schema
    const schema = Joi.object({
      apiKey: Joi.string().required().pattern(/^sk-/).message('API key must start with sk-'),
      model: Joi.string().optional().default('gpt-3.5-turbo'),
      maxTokens: Joi.number().integer().min(1).max(4000).optional().default(1000),
      temperature: Joi.number().min(0).max(2).optional().default(0.7)
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    // Test the API key before saving
    const testResult = await OpenAISetting.testApiKey(apiKey);
    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OpenAI API key',
        error: testResult.error
      });
    }
    
    // Save settings
    const settings = await OpenAISetting.saveSettings({
      apiKey,
      model: value.model,
      maxTokens: value.maxTokens,
      temperature: value.temperature,
      createdBy: req.user?.id || 1 // Default to admin user
    });
    
    res.json({
      success: true,
      message: 'OpenAI settings saved successfully',
      data: {
        id: settings.id,
        model: settings.model,
        maxTokens: settings.max_tokens,
        temperature: settings.temperature,
        isActive: settings.is_active,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at
      }
    });
    
  } catch (error) {
    console.error('Save OpenAI Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save OpenAI settings',
      error: error.message
    });
  }
};

/**
 * Get OpenAI settings (Admin only)
 */
const getOpenAISettings = async (req, res, next) => {
  try {
    const settings = await OpenAISetting.getSettings();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No OpenAI settings found'
      });
    }
    
    res.json({
      success: true,
      message: 'OpenAI settings retrieved successfully',
      data: {
        id: settings.id,
        model: settings.model,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
        isActive: settings.isActive,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Get OpenAI Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get OpenAI settings',
      error: error.message
    });
  }
};

/**
 * Get all OpenAI settings (Admin only)
 */
const getAllOpenAISettings = async (req, res, next) => {
  try {
    const settings = await OpenAISetting.getAllSettings();
    
    res.json({
      success: true,
      message: 'All OpenAI settings retrieved successfully',
      data: settings
    });
    
  } catch (error) {
    console.error('Get All OpenAI Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all OpenAI settings',
      error: error.message
    });
  }
};

/**
 * Update OpenAI settings (Admin only)
 */
const updateOpenAISettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { apiKey, model, maxTokens, temperature } = req.body;
    
    // Validation schema
    const schema = Joi.object({
      apiKey: Joi.string().optional().pattern(/^sk-/).message('API key must start with sk-'),
      model: Joi.string().optional(),
      maxTokens: Joi.number().integer().min(1).max(4000).optional(),
      temperature: Joi.number().min(0).max(2).optional()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    // Test the API key if provided
    if (apiKey) {
      const testResult = await OpenAISetting.testApiKey(apiKey);
      if (!testResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OpenAI API key',
          error: testResult.error
        });
      }
    }
    
    // Update settings
    const settings = await OpenAISetting.updateSettings(id, {
      apiKey: value.apiKey,
      model: value.model,
      maxTokens: value.maxTokens,
      temperature: value.temperature
    });
    
    res.json({
      success: true,
      message: 'OpenAI settings updated successfully',
      data: {
        id: settings.id,
        model: settings.model,
        maxTokens: settings.max_tokens,
        temperature: settings.temperature,
        isActive: settings.is_active,
        updatedAt: settings.updated_at
      }
    });
    
  } catch (error) {
    console.error('Update OpenAI Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update OpenAI settings',
      error: error.message
    });
  }
};

/**
 * Delete OpenAI settings (Admin only)
 */
const deleteOpenAISettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await OpenAISetting.deleteSettings(id);
    
    res.json({
      success: true,
      message: 'OpenAI settings deleted successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Delete OpenAI Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete OpenAI settings',
      error: error.message
    });
  }
};

/**
 * Test OpenAI API key
 */
const testOpenAIApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key is required'
      });
    }
    
    const testResult = await OpenAISetting.testApiKey(apiKey);
    
    res.json({
      success: true,
      message: testResult.message,
      data: {
        isValid: testResult.success,
        model: testResult.model,
        error: testResult.error
      }
    });
    
  } catch (error) {
    console.error('Test OpenAI API Key Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test OpenAI API key',
      error: error.message
    });
  }
};

module.exports = {
  saveOpenAISettings,
  getOpenAISettings,
  getAllOpenAISettings,
  updateOpenAISettings,
  deleteOpenAISettings,
  testOpenAIApiKey
}; 