const NotificationSetting = require('../models/NotificationSetting');

// Create a new setting
const createSetting = async (req, res, next) => {
  try {
    const { type, config } = req.body;
    if (!type || !['smtp', 'twilio'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be smtp or twilio' });
    }
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, message: 'Config must be an object' });
    }
    const setting = await NotificationSetting.create({ type, config });
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
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, message: 'Config must be an object' });
    }
    const setting = await NotificationSetting.update(id, { config });
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.json({ success: true, data: setting.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Get a setting by type
const getSettingByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!type || !['smtp', 'twilio'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be smtp or twilio' });
    }
    const setting = await NotificationSetting.getByType(type);
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