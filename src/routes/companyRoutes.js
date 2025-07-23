const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const {
  registrationSchema,
  loginSchema,
  complianceSchema,
  profileUpdateSchema,
  superAdminCompanyUpdateSchema
} = require('../utils/validation');
const { isSuperAdmin, requireSuperAdmin } = require('../middleware/auth');
const notificationTemplateController = require('../controllers/notificationTemplateController');
const notificationSettingController = require('../controllers/notificationSettingController');
const ComplianceDeadlines = require('../models/ComplianceDeadlines');
const NotificationSetting = require('../models/NotificationSetting');
const Joi = require('joi');

const notificationSettingSchema = Joi.object({
  type: Joi.string().required(),
  sms: Joi.object({
    enabled: Joi.boolean().required(),
    days: Joi.array().items(Joi.number()).required()
  }).required(),
  email: Joi.object({
    enabled: Joi.boolean().required(),
    days: Joi.array().items(Joi.number()).required()
  }).required()
});
const notificationSettingsArraySchema = Joi.array().items(notificationSettingSchema);

// Public routes
router.post('/register', validateRequest(registrationSchema), companyController.register);
router.post('/login', validateRequest(loginSchema), companyController.login);
// Super Admin registration route
router.post('/register-superadmin', validateRequest(registrationSchema), companyController.registerSuperAdmin);

// Protected routes
router.patch('/compliance', authMiddleware, validateRequest(complianceSchema), companyController.updateComplianceDetails);
router.patch('/profile', authMiddleware, validateRequest(profileUpdateSchema), companyController.updateProfile);

// Compliance details routes (for authenticated company)
router.get('/compliance-details', authMiddleware, companyController.getComplianceDetails);
router.patch('/compliance-details', authMiddleware, companyController.upsertComplianceDetails);

// Super Admin only test route
router.get('/superadmin-only', authMiddleware, isSuperAdmin, (req, res) => {
  res.json({ success: true, message: 'You are a Super Admin!' });
});

// Super Admin: Get all companies
router.get('/all', authMiddleware, requireSuperAdmin, companyController.getAllCompanies);

// Superadmin: Get compliance details for any company
router.get('/compliance-details/:companyId', authMiddleware, requireSuperAdmin, companyController.getComplianceDetailsByCompanyId);

// Notification Template routes (Super Admin only)
router.post('/templates', authMiddleware, requireSuperAdmin, notificationTemplateController.createTemplate);
router.get('/templates', authMiddleware, requireSuperAdmin, notificationTemplateController.getAllTemplates);
router.get('/templates/:id', authMiddleware, requireSuperAdmin, notificationTemplateController.getTemplateById);
router.put('/templates/:id', authMiddleware, requireSuperAdmin, notificationTemplateController.updateTemplate);
router.delete('/templates/:id', authMiddleware, requireSuperAdmin, notificationTemplateController.deleteTemplate);

// Notification Settings routes (Super Admin only)
router.post('/settings', authMiddleware, requireSuperAdmin, notificationSettingController.createSetting);
router.get('/settings', authMiddleware, requireSuperAdmin, notificationSettingController.getAllSettings);
router.get('/settings/:type', authMiddleware, requireSuperAdmin, notificationSettingController.getSettingByType);
router.put('/settings/:id', authMiddleware, requireSuperAdmin, notificationSettingController.updateSetting);
router.delete('/settings/:id', authMiddleware, requireSuperAdmin, notificationSettingController.deleteSetting);

// Super Admin: Save notification settings for BAS, FBT, IAS, FED, etc.
router.post('/notification-settings', authMiddleware, requireSuperAdmin, async (req, res, next) => {
  try {
    console.log('DEBUG /notification-settings headers:', req.headers);
    console.log('DEBUG /notification-settings typeof req.body:', typeof req.body, 'value:', req.body);
    let body = req.body;
    // If body is a string (stringified JSON), parse it
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON string in request body',
          errors: [{ field: '', message: parseErr.message }]
        });
      }
    }
    // If body is an object with a 'settings' property, use that
    if (body && typeof body === 'object' && Array.isArray(body.settings)) {
      body = body.settings;
    }
    // Validate request body as array of notification settings
    const { error } = notificationSettingsArraySchema.validate(body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    const settings = body;
    // Save each setting (upsert by type)
    const results = [];
    for (const setting of settings) {
      // Upsert by type
      const saved = await NotificationSetting.upsertByType(setting.type, setting);
      results.push(saved);
    }
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

// Super Admin: Edit any company
router.put('/:companyId', authMiddleware, requireSuperAdmin, validateRequest(superAdminCompanyUpdateSchema), companyController.editCompany);

// Allow all authenticated users to get company information by ID
router.get('/:companyId', authMiddleware, companyController.getCompanyById);

// Allow all authenticated users to fetch notification settings
router.get('/notification-settings', authMiddleware, async (req, res, next) => {
  try {
    const settings = await NotificationSetting.getAll();
    res.status(200).json({ success: true, data: settings.map(s => s.toJSON()) });
  } catch (error) {
    next(error);
  }
});

// Endpoint for companies to fetch compliance deadlines data set by superadmin
router.get('/compliance-deadlines', authMiddleware, async (req, res, next) => {
  try {
    const deadlines = await ComplianceDeadlines.get();
    res.json({ success: true, data: deadlines });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
