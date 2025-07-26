const NotificationTemplate = require('../models/NotificationTemplate');
const Company = require('../models/Company');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);
const NotificationSetting = require('../models/NotificationSetting');

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

// Test a template by sending to a company
const testTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, channel, testData } = req.body;
    if (!companyId || !channel || !['sms', 'email'].includes(channel)) {
      return res.status(400).json({ success: false, message: 'companyId and valid channel (sms/email) are required' });
    }
    // Fetch template
    const template = await NotificationTemplate.getById(id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    // Fetch company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    // Prepare message
    let message = template.body;
    // Replace placeholders with testData or company data
    if (testData && typeof testData === 'object') {
      for (const [key, value] of Object.entries(testData)) {
        message = message.replace(new RegExp(`{${key}}`, 'g'), value);
      }
    }
    // Send SMS via Twilio if channel is sms
    let sendResult = { sent: false, channel, to: company.email || company.mobileNumber, preview: message };
    if (channel === 'sms') {
      if (!company.mobileNumber) {
        return res.status(400).json({ success: false, message: 'Company does not have a phone number.' });
      }
      // Fetch Twilio credentials from admin settings
      const twilioConfig = await NotificationSetting.getTwilioSettings();
      if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber) {
        return res.status(500).json({ success: false, message: 'Twilio settings not configured by admin.' });
      }
      const twilioClient = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
      try {
        const twilioResult = await twilioClient.messages.create({
          body: message,
          from: twilioConfig.phoneNumber,
          to: company.mobileNumber
        });
        sendResult.sent = true;
        sendResult.twilioSid = twilioResult.sid;
        sendResult.to = company.mobileNumber;
      } catch (twilioError) {
        return res.status(500).json({ success: false, message: 'Twilio SMS send failed', error: twilioError.message });
      }
    } else {
      // Simulate email send (or integrate real email logic here)
      sendResult.sent = true;
    }
    res.json({ success: true, message: channel === 'sms' ? 'SMS sent via Twilio' : 'Test message sent (simulated)', data: sendResult });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTemplate,
  updateTemplate,
  getTemplateById,
  getAllTemplates,
  deleteTemplate,
  testTemplate
}; 