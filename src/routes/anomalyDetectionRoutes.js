const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  trainModel,
  scoreData,
  getTrainingStatus,
  getAllModels,
  getModelById,
  activateModel,
  deleteModel,
  getAllTrainingJobs,
  exportResults
} = require('../controllers/anomalyDetectionController');

// All routes require authentication
router.use(auth);

// Training endpoints
router.post('/train', trainModel);
router.get('/training/status/:jobId', getTrainingStatus);
router.get('/training/jobs', getAllTrainingJobs);

// Scoring endpoints
router.post('/score', scoreData);

// Model management endpoints
router.get('/models', getAllModels);
router.get('/models/:id', getModelById);
router.put('/models/:id/activate', activateModel);
router.delete('/models/:id', deleteModel);

// Export endpoints
router.post('/export', exportResults);

module.exports = router;
