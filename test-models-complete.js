const { pool } = require('./src/config/database');
const anomalyDetectionService = require('./src/services/anomalyDetectionService');
const { IsolationForest } = require('isolation-forest');

async function testModelsComplete() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Complete Model Testing\n');
    
    // Step 1: Load models from database to service memory
    console.log('🔄 Step 1: Loading models from database...\n');
    
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
        const trainingData = model.training_data;
        const parameters = model.parameters;
        
        const preprocessedData = preprocessData(trainingData);
        
        const isolationForest = new IsolationForest({
          contamination: parameters.contamination || 0.1,
          nEstimators: parameters.nEstimators || 100,
          maxSamples: parameters.maxSamples || 'auto',
          randomState: parameters.randomState || 42
        });
        
        isolationForest.fit(preprocessedData);
        
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
    
    console.log('🎉 All models loaded to service memory!\n');
    
    // Step 2: Test each model
    console.log('🧪 Step 2: Testing each model...\n');
    
    for (const model of models) {
      console.log(`🔍 Testing: ${model.name}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Active: ${model.is_active ? 'Yes' : 'No'}`);
      console.log(`   Threshold: ${parseFloat(model.threshold || 0.5).toFixed(4)}`);
      
      // Test with appropriate sample data based on model type
      let testData;
      if (model.name.includes('Financial')) {
        testData = [
          { amount: 120, frequency: 1, location: "Sydney", category: "food" },
          { amount: 180, frequency: 1, location: "Melbourne", category: "transport" },
          { amount: 10000, frequency: 1, location: "Sydney", category: "luxury" },
          { amount: 20, frequency: 50, location: "Melbourne", category: "micro" }
        ];
      } else if (model.name.includes('Network')) {
        testData = [
          { bytes: 1024, packets: 10, duration: 60, source: "192.168.1.1" },
          { bytes: 2048, packets: 20, duration: 120, source: "192.168.1.2" },
          { bytes: 50000, packets: 500, duration: 300, source: "10.0.0.1" },
          { bytes: 100, packets: 1, duration: 5, source: "192.168.1.100" }
        ];
      } else if (model.name.includes('Manufacturing')) {
        testData = [
          { temperature: 25, pressure: 100, humidity: 50, quality: 95 },
          { temperature: 26, pressure: 102, humidity: 52, quality: 94 },
          { temperature: 50, pressure: 200, humidity: 80, quality: 60 },
          { temperature: 15, pressure: 50, humidity: 20, quality: 85 }
        ];
      } else if (model.name.includes('E-commerce')) {
        testData = [
          { orderValue: 50, items: 2, customerAge: 25, region: "North" },
          { orderValue: 75, items: 3, customerAge: 30, region: "South" },
          { orderValue: 5000, items: 50, customerAge: 18, region: "North" },
          { orderValue: 10, items: 1, customerAge: 65, region: "South" }
        ];
      } else {
        testData = [
          { amount: 100, frequency: 1, location: "Sydney", category: "food" },
          { amount: 5000, frequency: 1, location: "Sydney", category: "luxury" }
        ];
      }
      
      try {
        const results = await anomalyDetectionService.scoreData(
          model.id,
          testData,
          parseFloat(model.threshold || 0.5)
        );
        
        if (results.success) {
          console.log(`   ✅ Scoring successful`);
          console.log(`   📈 Results:`);
          console.log(`      - Total samples: ${results.totalSamples}`);
          console.log(`      - Anomalies detected: ${results.anomaliesDetected}`);
          console.log(`      - Threshold: ${results.threshold}`);
          
          results.results.forEach((result, index) => {
            const status = result.isAnomaly ? '🚨 ANOMALY' : '✅ Normal';
            console.log(`      - Sample ${index + 1}: ${status} (score: ${result.score.toFixed(4)})`);
          });
        } else {
          console.log(`   ❌ Scoring failed: ${results.message}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing model: ${error.message}`);
      }
      
      console.log('');
    }
    
    // Step 3: Test with different data types using active model
    console.log('🎯 Step 3: Testing with different data types using active model...\n');
    
    const activeModel = models.find(m => m.is_active);
    if (activeModel) {
      console.log(`📋 Using active model: ${activeModel.name}\n`);
      
      const testCases = [
        {
          name: "Financial Data",
          data: [
            { amount: 100, frequency: 1, location: "Sydney", category: "food" },
            { amount: 5000, frequency: 1, location: "Sydney", category: "luxury" }
          ]
        },
        {
          name: "Network Data", 
          data: [
            { bytes: 1024, packets: 10, duration: 60, source: "192.168.1.1" },
            { bytes: 50000, packets: 500, duration: 300, source: "10.0.0.1" }
          ]
        },
        {
          name: "Manufacturing Data",
          data: [
            { temperature: 25, pressure: 100, humidity: 50, quality: 95 },
            { temperature: 50, pressure: 200, humidity: 80, quality: 60 }
          ]
        },
        {
          name: "E-commerce Data",
          data: [
            { orderValue: 50, items: 2, customerAge: 25, region: "North" },
            { orderValue: 5000, items: 50, customerAge: 18, region: "North" }
          ]
        }
      ];
      
      for (const testCase of testCases) {
        console.log(`📋 Testing ${testCase.name}:`);
        
        try {
          const results = await anomalyDetectionService.scoreData(
            activeModel.id,
            testCase.data,
            parseFloat(activeModel.threshold || 0.5)
          );
          
          if (results.success) {
            console.log(`   ✅ ${testCase.name} processed successfully`);
            console.log(`   📊 Anomalies: ${results.anomaliesDetected}/${results.totalSamples}`);
            
            results.results.forEach((result, index) => {
              const status = result.isAnomaly ? '🚨 ANOMALY' : '✅ Normal';
              console.log(`      - Sample ${index + 1}: ${status} (score: ${result.score.toFixed(4)})`);
            });
          } else {
            console.log(`   ❌ ${testCase.name} failed: ${results.message}`);
          }
        } catch (error) {
          console.log(`   ❌ Error with ${testCase.name}: ${error.message}`);
        }
        
        console.log('');
      }
    } else {
      console.log('❌ No active model found');
    }
    
    console.log('✅ Complete model testing finished!');
    
  } catch (error) {
    console.error('❌ Error in complete model testing:', error);
  } finally {
    client.release();
  }
}

function preprocessData(data) {
  return data.map(item => {
    const values = [];
    for (const key in item) {
      const value = item[key];
      if (typeof value === 'number') {
        values.push(value);
      } else if (typeof value === 'string') {
        values.push(value.length);
      }
    }
    return values;
  });
}

// Run the script
if (require.main === module) {
  testModelsComplete()
    .then(() => {
      console.log('✅ Complete test script finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Complete test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testModelsComplete };
