const AnomalyDetection = require('./src/models/AnomalyDetection');
const fs = require('fs');
const path = require('path');

async function loadAnomalyDetectionDummyData() {
  try {
    console.log('🚀 Loading Anomaly Detection Dummy Data...');
    
    // Read the dummy data file
    const dummyDataPath = path.join(__dirname, 'sample-datasets', 'anomaly-detection-dummy-data.json');
    const dummyData = JSON.parse(fs.readFileSync(dummyDataPath, 'utf8'));
    
    console.log(`📊 Found ${dummyData.anomalyDetectionModels.length} models to load`);
    
    // Load each model
    for (const modelData of dummyData.anomalyDetectionModels) {
      console.log(`\n📝 Loading model: ${modelData.name}`);
      
      try {
        const savedModel = await AnomalyDetection.saveModel(
          modelData.name,
          modelData.description,
          modelData.training_data,
          modelData.parameters,
          modelData.model_state
        );
        
        console.log(`✅ Model saved with ID: ${savedModel.id}`);
        
        // Set the active model (only the first one)
        if (modelData.is_active) {
          await AnomalyDetection.activateModel(savedModel.id);
          console.log(`✅ Model ${savedModel.id} activated as active model`);
        }
        
      } catch (error) {
        console.error(`❌ Error loading model ${modelData.name}:`, error.message);
      }
    }
    
    // Display summary
    console.log('\n📋 Loading Summary:');
    const allModels = await AnomalyDetection.getAllModels();
    console.log(`Total models in database: ${allModels.length}`);
    
    const activeModel = await AnomalyDetection.getActiveModel();
    if (activeModel) {
      console.log(`Active model: ${activeModel.name} (ID: ${activeModel.id})`);
    }
    
    console.log('\n✅ Anomaly Detection dummy data loaded successfully!');
    
    // Display test data examples
    console.log('\n🧪 Test Data Examples:');
    console.log('You can use these test cases to verify anomaly detection:');
    
    if (dummyData.testData.bas_anomalies) {
      console.log('\nBAS Anomaly Test Cases:');
      dummyData.testData.bas_anomalies.forEach((testCase, index) => {
        console.log(`${index + 1}. Expected anomaly score: ${testCase.expected_anomaly_score}`);
        console.log(`   BAS Amount: $${testCase.bas_amount.toLocaleString()}`);
        console.log(`   Days Late: ${testCase.days_late}`);
        console.log(`   Amount Variance: ${testCase.amount_variance}`);
      });
    }
    
    if (dummyData.testData.fbt_anomalies) {
      console.log('\nFBT Anomaly Test Cases:');
      dummyData.testData.fbt_anomalies.forEach((testCase, index) => {
        console.log(`${index + 1}. Expected anomaly score: ${testCase.expected_anomaly_score}`);
        console.log(`   FBT Amount: $${testCase.fbt_amount.toLocaleString()}`);
        console.log(`   Days Late: ${testCase.days_late}`);
        console.log(`   Variance from Previous: ${testCase.variance_from_previous}`);
      });
    }
    
    if (dummyData.testData.ias_anomalies) {
      console.log('\nIAS Anomaly Test Cases:');
      dummyData.testData.ias_anomalies.forEach((testCase, index) => {
        console.log(`${index + 1}. Expected anomaly score: ${testCase.expected_anomaly_score}`);
        console.log(`   IAS Amount: $${testCase.ias_amount.toLocaleString()}`);
        console.log(`   Days Late: ${testCase.days_late}`);
        console.log(`   Amount Variance: ${testCase.amount_variance}`);
      });
    }
    
    console.log('\n📚 Dataset Metadata:');
    console.log(`Version: ${dummyData.metadata.dataset_version}`);
    console.log(`Total Training Samples: ${dummyData.metadata.total_training_samples}`);
    console.log(`Anomaly Rate: ${(dummyData.metadata.anomaly_rate * 100).toFixed(1)}%`);
    console.log(`Algorithms Used: ${dummyData.metadata.algorithms_used.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error loading anomaly detection dummy data:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  loadAnomalyDetectionDummyData()
    .then(() => {
      console.log('\n🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { loadAnomalyDetectionDummyData };
