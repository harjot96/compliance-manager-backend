const NotificationTemplate = require('../models/NotificationTemplate');

// Create a new template
const createTemplate = async (req, res, next) => {
  try {
    const { type, name, subject, body, notificationTypes, smsDays, emailDays } = req.body;
    
    // Validate type
    if (!type || !['email', 'sms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be email or sms' });
    }
    
    // Validate required fields
    if (!name || !body) {
      return res.status(400).json({ success: false, message: 'Name and body are required' });
    }
    
    // For email templates, subject is required
    if (type === 'email' && !subject) {
      return res.status(400).json({ success: false, message: 'Subject is required for email templates' });
    }
    
    // Process days based on template type
    let processedSmsDays = [];
    let processedEmailDays = [];
    
    if (type === 'email') {
      // For email templates, only use email days
      processedEmailDays = emailDays || [];
      processedSmsDays = []; // SMS days are not relevant for email templates
    } else if (type === 'sms') {
      // For SMS templates, only use SMS days
      processedSmsDays = smsDays || [];
      processedEmailDays = []; // Email days are not relevant for SMS templates
    }
    
    const template = await NotificationTemplate.create({ 
      type, 
      name, 
      subject, 
      body, 
      notificationTypes: notificationTypes || [],
      smsDays: processedSmsDays,
      emailDays: processedEmailDays
    });
    
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
    const { type, name, subject, body, notificationTypes, smsDays, emailDays } = req.body;
    console.log('DEBUG updateTemplate - req.body:', req.body);
    // Validate type
    if (!type || !['email', 'sms'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be email or sms' });
    }
    // Validate required fields
    if (!name || !body) {
      return res.status(400).json({ success: false, message: 'Name and body are required' });
    }
    // For email templates, subject is required
    if (type === 'email' && !subject) {
      return res.status(400).json({ success: false, message: 'Subject is required for email templates' });
    }
    // Process days based on template type
    let processedSmsDays = [];
    let processedEmailDays = [];
    if (type === 'email') {
      processedEmailDays = emailDays || [];
      processedSmsDays = [];
    } else if (type === 'sms') {
      processedSmsDays = smsDays || [];
      processedEmailDays = [];
    }
    const template = await NotificationTemplate.update(id, { 
      type, 
      name, 
      subject, 
      body, 
      notificationTypes: notificationTypes || [],
      smsDays: processedSmsDays,
      emailDays: processedEmailDays
    });
    console.log('DEBUG updateTemplate - updated template:', template);
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