const express = require('express');
const router = express.Router();
const notificationTemplateController = require('../controllers/notificationTemplateController');

// Simple test routes
router.get('/test', (req, res) => {
  console.log('🎯 TEST ROUTE HIT');
  res.json({ success: true, message: 'Test route works!' });
});

// Template routes
router.post('/templates', notificationTemplateController.createTemplate);
router.get('/templates', notificationTemplateController.getAllTemplates);
router.get('/templates/:id', notificationTemplateController.getTemplateById);
router.put('/templates/:id', notificationTemplateController.updateTemplate);
router.delete('/templates/:id', notificationTemplateController.deleteTemplate);

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

module.exports = router;
