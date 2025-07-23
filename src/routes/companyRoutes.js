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

// Super Admin: Edit any company
router.put('/:companyId', authMiddleware, requireSuperAdmin, validateRequest(superAdminCompanyUpdateSchema), companyController.editCompany);

// Allow all authenticated users to get company information by ID
router.get('/:companyId', authMiddleware, companyController.getCompanyById);

module.exports = router;
