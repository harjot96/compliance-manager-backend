const OpenAISetting = require('../models/OpenAISetting');
const Joi = require('joi');

/**
 * Save OpenAI settings (Admin only)
 */
const saveOpenAISettings = async (req, res, next) => {
  try {
    const { apiKey } = req.body;
    
    // Validation schema
    const schema = Joi.object({
      apiKey: Joi.string().required().pattern(/^sk-/).message('API key must start with sk-')
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
      createdBy: req.company?.id || 1 // Use company ID from auth middleware
    });
    
    res.json({
      success: true,
      message: 'OpenAI settings saved successfully',
      data: {
        id: settings.id,
        isActive: settings.is_active,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at,
        apiKeyStatus: 'encrypted_and_stored',
        apiKeyPreview: `sk-...${apiKey.substring(apiKey.length - 4)}` // Show last 4 characters
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
        isActive: settings.isActive,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
        apiKeyStatus: 'encrypted_and_stored',
        apiKeyPreview: `sk-...${settings.apiKey.substring(settings.apiKey.length - 4)}` // Show last 4 characters
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
    const { apiKey } = req.body;
    
    // Validation schema
    const schema = Joi.object({
      apiKey: Joi.string().required().pattern(/^sk-/).message('API key must start with sk-')
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    // Test the API key
    const testResult = await OpenAISetting.testApiKey(apiKey);
    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OpenAI API key',
        error: testResult.error
      });
    }
    
    // Update settings
    const settings = await OpenAISetting.updateSettings(id, {
      apiKey: value.apiKey
    });
    
    res.json({
      success: true,
      message: 'OpenAI settings updated successfully',
      data: {
        id: settings.id,
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
    
    // Handle specific error types
    if (!testResult.success) {
      if (testResult.errorType === 'quota_exceeded') {
        return res.status(429).json({
          success: false,
          message: testResult.message,
          data: {
            isValid: false,
            error: testResult.error,
            errorType: testResult.errorType,
            suggestion: 'Please check your OpenAI billing and upgrade your plan if needed.'
          }
        });
      } else if (testResult.errorType === 'invalid_key') {
        return res.status(401).json({
          success: false,
          message: testResult.message,
          data: {
            isValid: false,
            error: testResult.error,
            errorType: testResult.errorType,
            suggestion: 'Please check your API key and ensure it starts with "sk-".'
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: testResult.message,
          data: {
            isValid: false,
            error: testResult.error,
            errorType: testResult.errorType
          }
        });
      }
    }
    
    res.json({
      success: true,
      message: testResult.message,
      data: {
        isValid: testResult.success,
        model: testResult.model,
        error: null,
        errorType: null
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

/**
 * Get OpenAI API key temporarily (with security measures)
 * WARNING: This should only be used for admin purposes
 */
const getOpenAIApiKey = async (req, res, next) => {
  try {
    // Any authenticated user can access
    if (!req.company) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    const settings = await OpenAISetting.getSettings();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No OpenAI settings found'
      });
    }

    // Return the full API key with security warnings
    res.json({
      success: true,
      message: 'OpenAI API key retrieved (use with caution)',
      data: {
        apiKey: settings.apiKey,
        apiKeyPreview: `sk-...${settings.apiKey.substring(settings.apiKey.length - 4)}`,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        securityWarning: 'This key should be used immediately and not stored in frontend'
      }
    });
    
  } catch (error) {
    console.error('Get OpenAI API Key Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve OpenAI API key',
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
  testOpenAIApiKey,
  getOpenAIApiKey
}; 