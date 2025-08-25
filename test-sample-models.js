const { pool } = require('./src/config/database');
const anomalyDetectionService = require('./src/services/anomalyDetectionService');

async function testSampleModels() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testing sample models...\n');
    
    // Get all models from database
    const modelsQuery = 'SELECT * FROM anomaly_detection_models ORDER BY created_at DESC';
    const modelsResult = await client.query(modelsQuery);
    const models = modelsResult.rows;
    
    if (models.length === 0) {
      console.log('❌ No models found. Please run add-sample-models.js first.');
      return;
    }
    
    console.log(`📊 Found ${models.length} models to test:\n`);
    
    for (const model of models) {
      console.log(`🔍 Testing: ${model.name}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Active: ${model.is_active ? 'Yes' : 'No'}`);
      console.log(`   Threshold: ${parseFloat(model.threshold || 0.5).toFixed(4)}`);
      
      // Test with some sample data
      const testData = [
        // Normal data
        { amount: 120, frequency: 1, location: "Sydney", category: "food" },
        { amount: 180, frequency: 1, location: "Melbourne", category: "transport" },
        // Anomalous data
        { amount: 10000, frequency: 1, location: "Sydney", category: "luxury" },
        { amount: 20, frequency: 50, location: "Melbourne", category: "micro" }
      ];
      
      try {
        // Score the test data
        const results = await anomalyDetectionService.scoreData(
          model.id,
          testData,
          model.threshold
        );
        
        if (results.success) {
          console.log(`   ✅ Scoring successful`);
          console.log(`   📈 Results:`);
          console.log(`      - Total samples: ${results.data.totalSamples}`);
          console.log(`      - Anomalies detected: ${results.data.anomaliesDetected}`);
          console.log(`      - Anomaly rate: ${results.data.summary.anomalyRate}`);
          
          // Show individual results
          results.data.results.forEach((result, index) => {
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
    
    // Test with different datasets
    console.log('🎯 Testing with different data types...\n');
    
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
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`📋 Testing ${testCase.name}:`);
      
      // Use the first active model
      const activeModel = models.find(m => m.is_active);
      if (!activeModel) {
        console.log('   ❌ No active model found');
        continue;
      }
      
      try {
        const results = await anomalyDetectionService.scoreData(
          activeModel.id,
          testCase.data,
          activeModel.threshold
        );
        
        if (results.success) {
          console.log(`   ✅ ${testCase.name} processed successfully`);
          console.log(`   📊 Anomalies: ${results.data.anomaliesDetected}/${results.data.totalSamples}`);
        } else {
          console.log(`   ❌ ${testCase.name} failed: ${results.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Error with ${testCase.name}: ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('✅ Sample model testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing sample models:', error);
  } finally {
    client.release();
  }
}

// Run the test
if (require.main === module) {
  testSampleModels()
    .then(() => {
      console.log('✅ Test script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testSampleModels };
