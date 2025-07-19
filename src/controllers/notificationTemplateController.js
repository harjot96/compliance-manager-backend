const NotificationTemplate = require('../models/NotificationTemplate');

// Create a new template
const createTemplate = async (req, res, next) => {
  try {
    const { type, name, subject, body } = req.body;
    if (!type || !['email', 'sms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be email or sms' });
    }
    if (!name || !body) {
      return res.status(400).json({ success: false, message: 'Name and body are required' });
    }
    const template = await NotificationTemplate.create({ type, name, subject, body });
    res.status(201).json({ success: true, data: template.toJSON() });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Template name must be unique' });
    }
    next(error);
  }
};

// Update a template
const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, name, subject, body } = req.body;
    if (!type || !['email', 'sms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be email or sms' });
    }
    if (!name || !body) {
      return res.status(400).json({ success: false, message: 'Name and body are required' });
    }
    const template = await NotificationTemplate.update(id, { type, name, subject, body });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template.toJSON() });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Template name must be unique' });
    }
    next(error);
  }
};

// Get a template by ID
const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await NotificationTemplate.getById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Get all templates
const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await NotificationTemplate.getAll();
    res.json({ success: true, data: templates.map(t => t.toJSON()) });
  } catch (error) {
    next(error);
  }
};

// Delete a template
const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await NotificationTemplate.delete(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, message: 'Template deleted', data: template.toJSON() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTemplate,
  updateTemplate,
  getTemplateById,
  getAllTemplates,
  deleteTemplate
}; 