const anomalyDetectionService = require('../services/anomalyDetectionService');
const AnomalyDetection = require('../models/AnomalyDetection');

// Train a new anomaly detection model
const trainModel = async (req, res) => {
  try {
    const { dataset, parameters, name, description } = req.body;
    const companyId = req.company.id;

    // Validate input
    if (!dataset || !Array.isArray(dataset) || dataset.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dataset is required and must be a non-empty array'
      });
    }

    // Validate data format
    try {
      anomalyDetectionService.validateData(dataset);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Data validation failed: ${error.message}`
      });
    }

    // Generate model ID
    const modelId = `model_${companyId}_${Date.now()}`;
    
    // Start training
    const trainingResult = await anomalyDetectionService.trainModel(
      modelId, 
      dataset, 
      parameters
    );

    // Save model metadata to database
    const modelData = await AnomalyDetection.saveModel(
      name || `Anomaly Model ${new Date().toISOString()}`,
      description || 'Anomaly detection model',
      dataset,
      parameters || {},
      null // Model state will be updated after training
    );

    res.status(200).json({
      success: true,
      message: 'Training started successfully',
      data: {
        modelId: modelData.id,
        jobId: trainingResult.jobId,
        name: modelData.name,
        description: modelData.description,
        datasetSize: dataset.length,
        parameters: parameters || {}
      }
    });

  } catch (error) {
    console.error('❌ Error in trainModel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start training',
      error: error.message
    });
  }
};

// Score new data using the trained model
const scoreData = async (req, res) => {
  try {
    const { data, threshold = 0.5, modelId } = req.body;

    // Validate input
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data is required and must be a non-empty array'
      });
    }

    if (threshold < 0 || threshold > 1) {
      return res.status(400).json({
        success: false,
        message: 'Threshold must be between 0 and 1'
      });
    }

    // Get active model if modelId not provided
    let activeModelId = modelId;
    if (!activeModelId) {
      const activeModel = await AnomalyDetection.getActiveModel();
      if (!activeModel) {
        return res.status(400).json({
          success: false,
          message: 'No active model found. Please train a model first.'
        });
      }
      // Use the most recent completed training job to get the actual model ID
      const jobs = anomalyDetectionService.getTrainingJobs();
      const completedJobs = jobs.filter(job => job.status === 'completed');
      if (completedJobs.length > 0) {
        activeModelId = completedJobs[completedJobs.length - 1].modelId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No completed training jobs found. Please train a model first.'
        });
      }
    } else {
      // If modelId is provided but it's a numeric ID, we need to find the actual model ID
      if (/^\d+$/.test(activeModelId)) {
        // Use the most recent completed training job to get the actual model ID
        const jobs = anomalyDetectionService.getTrainingJobs();
        const completedJobs = jobs.filter(job => job.status === 'completed');
        if (completedJobs.length > 0) {
          activeModelId = completedJobs[completedJobs.length - 1].modelId;
        } else {
          return res.status(400).json({
            success: false,
            message: 'No completed training jobs found. Please train a model first.'
          });
        }
      }
    }

    // Validate data format
    try {
      anomalyDetectionService.validateData(data);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Data validation failed: ${error.message}`
      });
    }

    // Score the data
    const scoringResult = await anomalyDetectionService.scoreData(
      activeModelId,
      data,
      threshold
    );

    res.status(200).json({
      success: true,
      message: 'Scoring completed successfully',
      data: {
        results: scoringResult.results,
        threshold: scoringResult.threshold,
        totalSamples: scoringResult.totalSamples,
        anomaliesDetected: scoringResult.anomaliesDetected,
        modelId: scoringResult.modelId,
        summary: {
          anomalyRate: (scoringResult.anomaliesDetected / scoringResult.totalSamples * 100).toFixed(2) + '%',
          averageScore: (scoringResult.results.reduce((sum, r) => sum + r.score, 0) / scoringResult.results.length).toFixed(4)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in scoreData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to score data',
      error: error.message
    });
  }
};

// Get training job status
const getTrainingStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    const status = anomalyDetectionService.getTrainingStatus(jobId);

    res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('❌ Error in getTrainingStatus:', error);
    res.status(404).json({
      success: false,
      message: 'Training job not found',
      error: error.message
    });
  }
};

// Get all models
const getAllModels = async (req, res) => {
  try {
    const models = await AnomalyDetection.getAllModels();

    res.status(200).json({
      success: true,
      data: models
    });

  } catch (error) {
    console.error('❌ Error in getAllModels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get models',
      error: error.message
    });
  }
};

// Get model by ID
const getModelById = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await AnomalyDetection.getModelById(id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    // Get in-memory model info if available
    const inMemoryInfo = anomalyDetectionService.getModelInfo(id);
    
    res.status(200).json({
      success: true,
      data: {
        ...model,
        inMemory: !!inMemoryInfo,
        inMemoryInfo
      }
    });

  } catch (error) {
    console.error('❌ Error in getModelById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get model',
      error: error.message
    });
  }
};

// Activate a model
const activateModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await AnomalyDetection.activateModel(id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    // Load the model into memory
    await anomalyDetectionService.loadModelFromDatabase(model);

    res.status(200).json({
      success: true,
      message: 'Model activated successfully',
      data: model
    });

  } catch (error) {
    console.error('❌ Error in activateModel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate model',
      error: error.message
    });
  }
};

// Delete a model
const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await AnomalyDetection.deleteModel(id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Model deleted successfully',
      data: model
    });

  } catch (error) {
    console.error('❌ Error in deleteModel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete model',
      error: error.message
    });
  }
};

// Get all training jobs
const getAllTrainingJobs = async (req, res) => {
  try {
    const jobs = anomalyDetectionService.getAllTrainingJobs();

    res.status(200).json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error('❌ Error in getAllTrainingJobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get training jobs',
      error: error.message
    });
  }
};

// Export results as CSV
const exportResults = async (req, res) => {
  try {
    const { results, filename = 'anomaly_results.csv' } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        message: 'Results array is required'
      });
    }

    // Generate CSV content
    let csvContent = 'Index,Score,IsAnomaly,OriginalData\n';
    
    results.forEach(result => {
      const originalDataStr = JSON.stringify(result.originalData).replace(/"/g, '""');
      csvContent += `${result.index},${result.score},${result.isAnomaly},"${originalDataStr}"\n`;
    });

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('❌ Error in exportResults:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export results',
      error: error.message
    });
  }
};

module.exports = {
  trainModel,
  scoreData,
  getTrainingStatus,
  getAllModels,
  getModelById,
  activateModel,
  deleteModel,
  getAllTrainingJobs,
  exportResults
};
