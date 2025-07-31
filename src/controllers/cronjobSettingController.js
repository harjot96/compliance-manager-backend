const CronjobSetting = require('../models/CronjobSetting');

const getAllCronjobSettings = async (req, res, next) => {
  try {
    const settings = await CronjobSetting.getAll();
    res.status(200).json({ success: true, data: settings.map(s => ({
      id: s.id,
      type: s.type,
      durationDays: s.durationDays,
      enabled: s.enabled
    })) });
  } catch (error) {
    next(error);
  }
};

const updateCronjobSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, durationDays, enabled } = req.body;
    const updated = await CronjobSetting.update(id, { type, durationDays, enabled });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const createCronjobSetting = async (req, res, next) => {
  try {
    const { type, durationDays, enabled } = req.body;
    const created = await CronjobSetting.create({ type, durationDays, enabled });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCronjobSettings,
  updateCronjobSetting,
  createCronjobSetting
}; 