const { pool } = require('./src/config/database');
const anomalyDetectionService = require('./src/services/anomalyDetectionService');
const { IsolationForest } = require('isolation-forest');

async function loadModelsToService() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Loading models from database to service memory...\n');
    
    // Get all models from database
    const modelsQuery = 'SELECT * FROM anomaly_detection_models ORDER BY created_at DESC';
    const modelsResult = await client.query(modelsQuery);
    const models = modelsResult.rows;
    
    if (models.length === 0) {
      console.log('❌ No models found in database.');
      return;
    }
    
    console.log(`📊 Found ${models.length} models to load:\n`);
    
    for (const model of models) {
      console.log(`🔍 Loading: ${model.name} (ID: ${model.id})`);
      
      try {
        // Get the training data (already an object from JSONB)
        const trainingData = model.training_data;
        const parameters = model.parameters;
        
        // Preprocess the data
        const preprocessedData = preprocessData(trainingData);
        
        // Create and train the isolation forest model
        const isolationForest = new IsolationForest({
          contamination: parameters.contamination || 0.1,
          nEstimators: parameters.nEstimators || 100,
          maxSamples: parameters.maxSamples || 'auto',
          randomState: parameters.randomState || 42
        });
        
        // Fit the model
        isolationForest.fit(preprocessedData);
        
        // Store the trained model in service memory
        anomalyDetectionService.models.set(model.id, {
          model: isolationForest,
          parameters: parameters,
          trainingData: preprocessedData,
          trainedAt: new Date(model.created_at)
        });
        
        console.log(`   ✅ Model loaded successfully`);
        console.log(`   📊 Training data: ${trainingData.length} samples`);
        console.log(`   ⚙️  Parameters: contamination=${parameters.contamination}, nEstimators=${parameters.nEstimators}`);
        
      } catch (error) {
        console.log(`   ❌ Error loading model: ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎉 All models loaded to service memory!');
    
    // Test one model to verify it works
    const activeModel = models.find(m => m.is_active);
    if (activeModel) {
      console.log(`\n🧪 Testing active model: ${activeModel.name}`);
      
      const testData = [
        { amount: 100, frequency: 1, location: "Sydney", category: "food" },
        { amount: 5000, frequency: 1, location: "Sydney", category: "luxury" }
      ];
      
      try {
        const results = await anomalyDetectionService.scoreData(
          activeModel.id,
          testData,
          parseFloat(activeModel.threshold || 0.5)
        );
        
        if (results.success) {
          console.log(`   ✅ Test successful`);
          console.log(`   📊 Anomalies detected: ${results.data.anomaliesDetected}/${results.data.totalSamples}`);
        } else {
          console.log(`   ❌ Test failed: ${results.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Test error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error loading models to service:', error);
  } finally {
    client.release();
  }
}

function preprocessData(data) {
  // Convert objects to numerical arrays for the isolation forest
  return data.map(item => {
    const values = [];
    for (const key in item) {
      const value = item[key];
      if (typeof value === 'number') {
        values.push(value);
      } else if (typeof value === 'string') {
        // Simple string encoding - you might want to use more sophisticated encoding
        values.push(value.length);
      }
    }
    return values;
  });
}

// Run the script
if (require.main === module) {
  loadModelsToService()
    .then(() => {
      console.log('✅ Model loading script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Model loading script failed:', error);
      process.exit(1);
    });
}

module.exports = { loadModelsToService };
