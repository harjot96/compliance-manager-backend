const IsolationForest = require('isolation-forest');

class AnomalyDetectionService {
  constructor() {
    this.models = new Map(); // Store models in memory
    this.trainingJobs = new Map(); // Track training jobs
  }

  // Train a new model with the provided dataset and parameters
  async trainModel(modelId, trainingData, parameters = {}) {
    try {
      console.log(`🚀 Starting training for model ${modelId} with ${trainingData.length} samples`);
      
      // Set default parameters
      const defaultParams = {
        contamination: 0.1,
        nEstimators: 100,
        maxSamples: 'auto',
        randomState: 42
      };
      
      const finalParams = { ...defaultParams, ...parameters };
      
      // Create training job
      const jobId = `job_${modelId}_${Date.now()}`;
      this.trainingJobs.set(jobId, {
        status: 'running',
        progress: 0,
        startTime: new Date(),
        modelId
      });

      // Run training in background
      setImmediate(async () => {
        try {
          // Convert data to the format expected by isolation-forest
          const processedData = this.preprocessData(trainingData);
          
          // Create and train the model
          const model = new IsolationForest(finalParams);
          
          // Train the model
          model.fit(processedData);
          
          // Store the trained model
          this.models.set(modelId, {
            model,
            parameters: finalParams,
            trainingData: processedData,
            trainedAt: new Date()
          });
          
          // Update job status
          this.trainingJobs.set(jobId, {
            status: 'completed',
            progress: 100,
            startTime: this.trainingJobs.get(jobId).startTime,
            endTime: new Date(),
            modelId
          });
          
          console.log(`✅ Training completed for model ${modelId}`);
          
        } catch (error) {
          console.error(`❌ Training failed for model ${modelId}:`, error);
          
          // Update job status
          this.trainingJobs.set(jobId, {
            status: 'failed',
            progress: 0,
            startTime: this.trainingJobs.get(jobId).startTime,
            endTime: new Date(),
            error: error.message,
            modelId
          });
        }
      });

      return {
        success: true,
        jobId,
        message: 'Training started successfully',
        modelId
      };
      
    } catch (error) {
      console.error('❌ Error starting training:', error);
      throw error;
    }
  }

  // Score new data points using the trained model
  async scoreData(modelId, newData, threshold = 0.5) {
    try {
      const modelInfo = this.models.get(modelId);
      
      if (!modelInfo) {
        throw new Error(`Model ${modelId} not found. Please train a model first.`);
      }

      const { model } = modelInfo;
      
      // Preprocess the new data
      const processedData = this.preprocessData(newData);
      
      // Get anomaly scores
      const scores = model.predict(processedData);
      
      // Convert scores to results with flags
      const results = scores.map((score, index) => ({
        index,
        score: parseFloat(score),
        isAnomaly: score > threshold,
        originalData: newData[index] || {}
      }));

      return {
        success: true,
        results,
        threshold,
        totalSamples: newData.length,
        anomaliesDetected: results.filter(r => r.isAnomaly).length,
        modelId
      };
      
    } catch (error) {
      console.error('❌ Error scoring data:', error);
      throw error;
    }
  }

  // Get training job status
  getTrainingStatus(jobId) {
    const job = this.trainingJobs.get(jobId);
    if (!job) {
      throw new Error(`Training job ${jobId} not found`);
    }
    return job;
  }

  // Get all training jobs
  getAllTrainingJobs() {
    return Array.from(this.trainingJobs.entries()).map(([jobId, job]) => ({
      jobId,
      ...job
    }));
  }

  // Get model information
  getModelInfo(modelId) {
    const modelInfo = this.models.get(modelId);
    if (!modelInfo) {
      return null;
    }
    
    return {
      modelId,
      parameters: modelInfo.parameters,
      trainedAt: modelInfo.trainedAt,
      trainingDataSize: modelInfo.trainingData.length,
      isActive: true
    };
  }

  // Get all models
  getAllModels() {
    return Array.from(this.models.entries()).map(([modelId, modelInfo]) => ({
      modelId,
      parameters: modelInfo.parameters,
      trainedAt: modelInfo.trainedAt,
      trainingDataSize: modelInfo.trainingData.length,
      isActive: true
    }));
  }

  // Load model from database
  async loadModelFromDatabase(modelData) {
    try {
      const { id, training_data, parameters } = modelData;
      
      // Recreate the model with stored parameters
      const model = new IsolationForest(parameters);
      
      // Retrain the model with stored data
      const processedData = this.preprocessData(training_data);
      model.fit(processedData);
      
      // Store in memory
      this.models.set(id.toString(), {
        model,
        parameters,
        trainingData: processedData,
        trainedAt: new Date()
      });
      
      console.log(`✅ Model ${id} loaded from database`);
      return true;
      
    } catch (error) {
      console.error('❌ Error loading model from database:', error);
      throw error;
    }
  }

  // Preprocess data for the isolation forest
  preprocessData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // Convert to numeric array format expected by isolation-forest
    return data.map(row => {
      if (Array.isArray(row)) {
        return row.map(val => this.convertToNumber(val));
      } else if (typeof row === 'object') {
        return Object.values(row).map(val => this.convertToNumber(val));
      } else {
        return [this.convertToNumber(row)];
      }
    });
  }

  // Convert value to number for the model
  convertToNumber(value) {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    } else {
      return 0;
    }
  }

  // Validate data format
  validateData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (data.length === 0) {
      throw new Error('Data array cannot be empty');
    }
    
    // Check if all rows have the same number of features
    const firstRow = data[0];
    const expectedLength = Array.isArray(firstRow) ? firstRow.length : Object.keys(firstRow).length;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const currentLength = Array.isArray(row) ? row.length : Object.keys(row).length;
      
      if (currentLength !== expectedLength) {
        throw new Error(`Row ${i} has ${currentLength} features, expected ${expectedLength}`);
      }
    }
    
    return true;
  }

  // Clear all models (useful for testing)
  clearModels() {
    this.models.clear();
    this.trainingJobs.clear();
  }
}

// Create a singleton instance
const anomalyDetectionService = new AnomalyDetectionService();

module.exports = anomalyDetectionService;
