const NotificationTemplate = require('../models/NotificationTemplate');
const Company = require('../models/Company');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const Joi = require('joi');
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
      if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber) {
        return res.status(500).json({ success: false, message: 'Twilio settings not configured by admin.' });
      }
      const twilioClient = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
      try {
        const twilioResult = await twilioClient.messages.create({
          body: message,
          from: twilioConfig.fromNumber,
          to: company.mobileNumber
        });
        sendResult.sent = true;
        sendResult.twilioSid = twilioResult.sid;
        sendResult.to = company.mobileNumber;
      } catch (twilioError) {
        return res.status(500).json({ success: false, message: 'Twilio SMS send failed', error: twilioError.message });
      }
    } else if (channel === 'email') {
      if (!company.email) {
        return res.status(400).json({ success: false, message: 'Company does not have an email address.' });
      }
      
      // Try SendGrid first, then fallback to simulation
      let emailSent = false;
      let emailError = null;
      let sendGridMessageId = null;
      
      try {
        // Fetch SendGrid credentials from admin settings
        const sendGridConfig = await NotificationSetting.getSendGridSettings();
        if (sendGridConfig && sendGridConfig.apiKey && sendGridConfig.fromEmail && sendGridConfig.fromName) {
          // Set SendGrid API key
          sgMail.setApiKey(sendGridConfig.apiKey);
          
          const emailData = {
            to: company.email,
            from: {
              email: sendGridConfig.fromEmail,
              name: sendGridConfig.fromName
            },
            subject: template.subject || 'Test Email',
            text: message,
            html: message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks
          };
          
          const sendGridResult = await sgMail.send(emailData);
          sendResult.sent = true;
          sendResult.sendGridMessageId = sendGridResult[0]?.headers['x-message-id'];
          sendResult.to = company.email;
          emailSent = true;
        }
      } catch (sendGridError) {
        emailError = sendGridError.message;
        console.log('SendGrid failed, using fallback simulation...');
        console.log('Error details:', sendGridError.message);
      }
      
      // If SendGrid failed, use fallback simulation
      if (!emailSent) {
        try {
          // Simulate email sending for development/testing
          sendResult.sent = true;
          sendResult.simulated = true;
          sendResult.to = company.email;
          sendResult.preview = message;
          sendResult.subject = template.subject || 'Test Email';
          sendResult.fallbackReason = emailError || 'SendGrid not configured';
          
          // Log the simulated email for debugging
          console.log('📧 Simulated Email Sent:');
          console.log(`   To: ${company.email}`);
          console.log(`   Subject: ${template.subject || 'Test Email'}`);
          console.log(`   Body: ${message}`);
          console.log(`   Fallback Reason: ${emailError || 'SendGrid not configured'}`);
          
        } catch (simulationError) {
          console.error('Simulation error:', simulationError);
          return res.status(500).json({ 
            success: false, 
            message: 'Email simulation failed', 
            error: simulationError.message,
            originalError: emailError 
          });
        }
      }
    } else {
      // Simulate email send (or integrate real email logic here)
      sendResult.sent = true;
    }
    
    const successMessage = channel === 'sms' ? 'SMS sent via Twilio' : 
                          sendResult.simulated ? 'Email simulated (SendGrid unavailable)' : 
                          'Email sent via SendGrid';
    
    res.json({ 
      success: true, 
      message: successMessage, 
      data: sendResult 
    });
  } catch (error) {
    console.error('Test template error:', error);
    next(error);
  }
};

// Test SMS functionality
const testSMS = async (req, res, next) => {
  try {
    const { companyId, templateId, testData } = req.body;
    
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' });
    }

    // Fetch company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!company.mobileNumber) {
      return res.status(400).json({ success: false, message: 'Company does not have a phone number.' });
    }

    // Fetch Twilio credentials
    const twilioConfig = await NotificationSetting.getTwilioSettings();
    if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber) {
      return res.status(500).json({ success: false, message: 'Twilio settings not configured by admin.' });
    }

    // Prepare message
    let message = 'Test SMS message';
    if (templateId) {
      const template = await NotificationTemplate.getById(templateId);
      if (template) {
        message = template.body;
        // Replace placeholders
        if (testData && typeof testData === 'object') {
          for (const [key, value] of Object.entries(testData)) {
            message = message.replace(new RegExp(`{${key}}`, 'g'), value);
          }
        }
      }
    }

    // Send SMS via Twilio
    const twilioClient = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);
    const twilioResult = await twilioClient.messages.create({
      body: message,
      from: twilioConfig.fromNumber,
      to: company.mobileNumber
    });

    res.json({
      success: true,
      message: 'SMS sent via Twilio',
      data: {
        sent: true,
        channel: 'sms',
        to: company.mobileNumber,
        preview: message,
        twilioSid: twilioResult.sid,
        company: {
          id: company.id,
          companyName: company.companyName,
          mobileNumber: company.mobileNumber
        }
      }
    });
  } catch (error) {
    console.error('SMS Test Error:', error);
    res.status(500).json({ success: false, message: 'Twilio SMS send failed', error: error.message });
  }
};

// Test Email functionality
const testEmail = async (req, res, next) => {
  try {
    const { companyId, templateId, testData } = req.body;
    
    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' });
    }

    // Fetch company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!company.email) {
      return res.status(400).json({ success: false, message: 'Company does not have an email address.' });
    }

    // Prepare message
    let subject = 'Test Email';
    let message = 'Test email message';
    
    if (templateId) {
      const template = await NotificationTemplate.getById(templateId);
      if (template) {
        subject = template.subject || 'Test Email';
        message = template.body;
        // Replace placeholders
        if (testData && typeof testData === 'object') {
          for (const [key, value] of Object.entries(testData)) {
            message = message.replace(new RegExp(`{${key}}`, 'g'), value);
            subject = subject.replace(new RegExp(`{${key}}`, 'g'), value);
          }
        }
      }
    }

    // Try SendGrid first, then fallback to simulation
    let emailSent = false;
    let emailError = null;
    let sendGridMessageId = null;

    try {
      // Fetch SendGrid credentials
      const sendGridConfig = await NotificationSetting.getSendGridSettings();
      if (sendGridConfig && sendGridConfig.apiKey && sendGridConfig.fromEmail && sendGridConfig.fromName) {
        // Send email via SendGrid
        sgMail.setApiKey(sendGridConfig.apiKey);
        
        const emailData = {
          to: company.email,
          from: {
            email: sendGridConfig.fromEmail,
            name: sendGridConfig.fromName
          },
          subject: subject,
          text: message,
          html: message.replace(/\n/g, '<br>')
        };
        
        const sendGridResult = await sgMail.send(emailData);
        sendGridMessageId = sendGridResult[0]?.headers['x-message-id'];
        emailSent = true;
      }
    } catch (sendGridError) {
      emailError = sendGridError.message;
      console.log('SendGrid failed, using fallback simulation...');
      console.log('Error details:', sendGridError.message);
    }

    // If SendGrid failed, use fallback simulation
    if (!emailSent) {
      // Simulate email sending for development/testing
      console.log('📧 Simulated Email Sent:');
      console.log(`   To: ${company.email}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: ${message}`);
      console.log(`   Fallback Reason: ${emailError || 'SendGrid not configured'}`);
    }
    
    res.json({
      success: true,
      message: emailSent ? 'Email sent via SendGrid' : 'Email simulated (SendGrid unavailable)',
      data: {
        sent: true,
        channel: 'email',
        to: company.email,
        preview: message,
        simulated: !emailSent,
        sendGridMessageId: sendGridMessageId,
        fallbackReason: emailError || 'SendGrid not configured',
        company: {
          id: company.id,
          companyName: company.companyName,
          email: company.email
        }
      }
    });
  } catch (error) {
    console.error('Email Test Error:', error);
    res.status(500).json({ success: false, message: 'Email test failed', error: error.message });
  }
};

// Test notification settings configuration
const testNotificationSettings = async (req, res, next) => {
  try {
    const { type, config } = req.body;
    
    // Handle both 'sendgrid' and 'smtp' types for SendGrid configuration
    const normalizedType = type === 'sendgrid' ? 'smtp' : type;
    
    if (!type || !['twilio', 'smtp', 'sendgrid'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be twilio, smtp, or sendgrid' });
    }

    if (!config || typeof config !== 'object') {
      return res.status(400).json({ success: false, message: 'Config must be an object' });
    }

    // Validate config based on type
    let validation;
    if (normalizedType === 'twilio') {
      validation = Joi.object({
        accountSid: Joi.string().required(),
        authToken: Joi.string().required(),
        fromNumber: Joi.string().required()
      }).validate(config);
    } else if (normalizedType === 'smtp') {
      validation = Joi.object({
        apiKey: Joi.string().required(),
        fromEmail: Joi.string().email().required(),
        fromName: Joi.string().required()
      }).validate(config);
    }

    if (validation && validation.error) {
      return res.status(400).json({ success: false, message: validation.error.details[0].message });
    }

    // Save settings
    const setting = await NotificationSetting.create({ type: normalizedType, config });
    
    res.status(201).json({
      success: true,
      message: `${normalizedType === 'twilio' ? 'Twilio' : 'SendGrid'} settings configured successfully`,
      data: setting.toJSON()
    });
  } catch (error) {
    console.error('Settings Test Error:', error);
    res.status(500).json({ success: false, message: 'Failed to configure settings', error: error.message });
  }
};

// Get test status and configuration
const getTestStatus = async (req, res, next) => {
  try {
    // Check Twilio configuration
    const twilioConfig = await NotificationSetting.getTwilioSettings();
    const twilioStatus = {
      configured: !!(twilioConfig && twilioConfig.accountSid && twilioConfig.authToken && twilioConfig.fromNumber),
      accountSid: twilioConfig?.accountSid || null,
      fromNumber: twilioConfig?.fromNumber || null,
      authTokenConfigured: !!(twilioConfig?.authToken)
    };

    // Check SendGrid configuration
    const sendGridConfig = await NotificationSetting.getSendGridSettings();
    const sendGridStatus = {
      configured: !!(sendGridConfig && sendGridConfig.apiKey && sendGridConfig.fromEmail && sendGridConfig.fromName),
      fromEmail: sendGridConfig?.fromEmail || null,
      fromName: sendGridConfig?.fromName || null,
      apiKeyConfigured: !!(sendGridConfig?.apiKey)
    };

    // Get available companies for testing
    const companies = await Company.getAll();
    const testCompanies = companies.map(company => ({
      id: company.id,
      companyName: company.companyName,
      email: company.email,
      mobileNumber: company.mobileNumber,
      hasEmail: !!company.email,
      hasPhone: !!company.mobileNumber
    }));

    // Get available templates
    const templates = await NotificationTemplate.getAll();
    const testTemplates = templates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body
    }));

    res.json({
      success: true,
      data: {
        twilio: twilioStatus,
        sendGrid: sendGridStatus,
        companies: testCompanies,
        templates: testTemplates,
        serverPort: process.env.PORT || 5000
      }
    });
  } catch (error) {
    console.error('Status Test Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get test status', error: error.message });
  }
};

module.exports = {
  createTemplate,
  updateTemplate,
  getTemplateById,
  getAllTemplates,
  deleteTemplate,
  testTemplate,
  testSMS,
  testEmail,
  testNotificationSettings,
  getTestStatus
}; 