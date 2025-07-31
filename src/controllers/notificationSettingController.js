const Joi = require('joi');
const NotificationSetting = require('../models/NotificationSetting');

const twilioSchema = Joi.object({
  accountSid: Joi.string().required(),
  authToken: Joi.string().required(),
  fromNumber: Joi.string().required()
});

const sendgridSchema = Joi.object({
  apiKey: Joi.string().required(),
  fromEmail: Joi.string().email().required(),
  fromName: Joi.string().required()
});

// Create a new setting
const createSetting = async (req, res, next) => {
  try {
    const { type, config } = req.body;
    
    // Handle both 'sendgrid' and 'smtp' types for SendGrid configuration
    const normalizedType = type === 'sendgrid' ? 'smtp' : type;
    
    if (!type || !['smtp', 'twilio', 'sendgrid'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be smtp, sendgrid, or twilio' });
    }
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, message: 'Config must be an object' });
    }
    // Validate config
    let validation;
    if (normalizedType === 'twilio') {
      validation = twilioSchema.validate(config);
    } else if (normalizedType === 'smtp') {
      validation = sendgridSchema.validate(config);
    }
    if (validation && validation.error) {
      return res.status(400).json({ success: false, message: validation.error.details[0].message });
    }
    const setting = await NotificationSetting.create({ type: normalizedType, config });
    res.status(201).json({ success: true, data: setting.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Update a setting
const updateSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { config } = req.body;
    // Find type for this setting
    const setting = await NotificationSetting.getById(id);
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    // Validate config
    let validation;
    if (setting.type === 'twilio') {
      validation = twilioSchema.validate(config);
    } else if (setting.type === 'smtp') {
      validation = sendgridSchema.validate(config);
    }
    if (validation && validation.error) {
      return res.status(400).json({ success: false, message: validation.error.details[0].message });
    }
    const updated = await NotificationSetting.update(id, { config });
    res.json({ success: true, data: updated.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Get a setting by type
const getSettingByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    // Handle both 'sendgrid' and 'smtp' types for SendGrid configuration
    const normalizedType = type === 'sendgrid' ? 'smtp' : type;
    
    if (!type || !['smtp', 'twilio', 'sendgrid'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be smtp, sendgrid, or twilio' });
    }
    const setting = await NotificationSetting.getByType(normalizedType);
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Get all settings
const getAllSettings = async (req, res, next) => {
  try {
    const settings = await NotificationSetting.getAll();
    res.json({ success: true, data: settings.map(s => s.toJSON()) });
  } catch (error) {
    next(error);
  }
};

// Delete a setting
const deleteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const setting = await NotificationSetting.delete(id);
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, message: 'Setting deleted', data: setting.toJSON() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSetting,
  updateSetting,
  getSettingByType,
  getAllSettings,
  deleteSetting
}; 