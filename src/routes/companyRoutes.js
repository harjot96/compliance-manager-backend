const express = require('express');
const router = express.Router();
const notificationTemplateController = require('../controllers/notificationTemplateController');
const notificationSettingController = require('../controllers/notificationSettingController');
const companyController = require('../controllers/companyController');

// Authentication routes
router.post('/register', companyController.register);
router.post('/login', companyController.login);
router.post('/register-super-admin', companyController.registerSuperAdmin);

// Add /settings and /all routes
router.get('/settings', notificationSettingController.getAllSettings);
router.post('/settings', notificationSettingController.createSetting);
router.get('/all', companyController.getAllCompaniesNoPagination);

// Simple test routes
router.get('/test', (req, res) => {
  console.log('🎯 TEST ROUTE HIT');
  res.json({ success: true, message: 'Test route works!' });
});

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Company routes are working!' });
});

// Template routes
router.post('/templates', notificationTemplateController.createTemplate);
router.get('/templates', notificationTemplateController.getAllTemplates);
router.get('/templates/:id', notificationTemplateController.getTemplateById);
router.put('/templates/:id', notificationTemplateController.updateTemplate);
router.delete('/templates/:id', notificationTemplateController.deleteTemplate);
// Test template route
router.post('/templates/:id/test', notificationTemplateController.testTemplate);

// Notification testing API endpoints
router.post('/test/sms', notificationTemplateController.testSMS);
router.post('/test/email', notificationTemplateController.testEmail);
router.post('/test/notification-settings', notificationTemplateController.testNotificationSettings);
router.get('/test/status', notificationTemplateController.getTestStatus);

router.get('/notification-settings', async (req, res) => {
  try {
    const CronjobSetting = require('../models/CronjobSetting');
    const settings = await CronjobSetting.getAll();
    res.status(200).json({ success: true, data: settings.map(s => s.toJSON()) });
  } catch (error) {
    console.error('❌ Error in GET /notification-settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.post('/notification-settings', async (req, res) => {
  console.log('🎯 POST NOTIFICATION SETTINGS ROUTE HIT');
  console.log('Body:', req.body);
  const settings = Array.isArray(req.body.settings) ? req.body.settings : req.body;
  const results = [];
  for (const setting of settings) {
    const smsEnabled = setting.sms && typeof setting.sms.enabled === 'boolean' ? setting.sms.enabled : false;
    const smsDays = (setting.sms && Array.isArray(setting.sms.days)) ? setting.sms.days.join(',') : '';
    const emailEnabled = setting.email && typeof setting.email.enabled === 'boolean' ? setting.email.enabled : false;
    const emailDays = (setting.email && Array.isArray(setting.email.days)) ? setting.email.days.join(',') : '';
    const type = setting.type;
    const durationDays = [...(setting.sms?.days || []), ...(setting.email?.days || [])].join(',');
    const enabled = smsEnabled || emailEnabled;
    const saved = await require('../models/CronjobSetting').upsertByType({
      type,
      durationDays,
      enabled,
      smsEnabled,
      smsDays,
      emailEnabled,
      emailDays
    });
    results.push(saved);
  }
  res.json({ 
    success: true, 
    message: 'Notification settings saved!',
    data: results.map(r => r.toJSON())
  });
});

// Protected routes (require authentication)
const auth = require('../middleware/auth');

// Profile and compliance routes (authenticated users)
router.put('/profile/update', auth, companyController.updateProfile);
router.put('/compliance/update', auth, companyController.updateComplianceDetails);
router.post('/compliance/upsert', auth, companyController.upsertComplianceDetails);
router.get('/compliance/details', auth, companyController.getComplianceDetails);

// Super Admin routes
router.get('/admin/all', auth, companyController.getAllCompanies);
router.get('/admin/:companyId/compliance', auth, companyController.getComplianceDetailsByCompanyId);
router.put('/admin/:companyId/status', auth, companyController.setCompanyActiveStatus);

// Company management routes (Super Admin) - These must come after specific routes
router.get('/:companyId', companyController.getCompanyById);
router.put('/:companyId', companyController.editCompany);

module.exports = router;
