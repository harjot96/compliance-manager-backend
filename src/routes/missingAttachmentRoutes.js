const express = require('express');
const router = express.Router();
const missingAttachmentController = require('../controllers/missingAttachmentController');
const auth = require('../middleware/auth');

// Configuration routes (require authentication)
router.get('/config', auth, missingAttachmentController.getConfig);
router.put('/config', auth, missingAttachmentController.updateConfig);

// Detection and processing routes (require authentication)
router.get('/detect', auth, missingAttachmentController.detectMissingAttachments);
router.post('/process', auth, missingAttachmentController.processMissingAttachments);

// Upload link management (require authentication)
router.get('/upload-links', auth, missingAttachmentController.getUploadLinks);
router.get('/statistics', auth, missingAttachmentController.getStatistics);
router.delete('/cleanup', auth, missingAttachmentController.cleanupExpiredLinks);
router.get('/duplicates', auth, missingAttachmentController.getDuplicateStats);

// Public upload routes (no authentication required)
router.get('/upload/:linkId', missingAttachmentController.getUploadPage);
router.post('/upload/:linkId', missingAttachmentController.uploadReceipt);

module.exports = router;
