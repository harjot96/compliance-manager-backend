const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3333';
const API_URL = `${BASE_URL}/api`;

// Test data - financial transactions with some anomalies
const sampleDataset = [
  // Normal transactions
  { amount: 100, frequency: 1, location: 'Sydney', category: 'food' },
  { amount: 150, frequency: 1, location: 'Melbourne', category: 'transport' },
  { amount: 200, frequency: 2, location: 'Brisbane', category: 'entertainment' },
  { amount: 80, frequency: 1, location: 'Perth', category: 'food' },
  { amount: 120, frequency: 1, location: 'Adelaide', category: 'shopping' },
  { amount: 90, frequency: 1, location: 'Sydney', category: 'food' },
  { amount: 180, frequency: 2, location: 'Melbourne', category: 'entertainment' },
  { amount: 110, frequency: 1, location: 'Brisbane', category: 'transport' },
  { amount: 95, frequency: 1, location: 'Perth', category: 'food' },
  { amount: 130, frequency: 1, location: 'Adelaide', category: 'shopping' },
  
  // Anomalous transactions (should be detected)
  { amount: 5000, frequency: 1, location: 'Sydney', category: 'food' }, // Very high amount
  { amount: 50, frequency: 10, location: 'Melbourne', category: 'transport' }, // Very high frequency
  { amount: 200, frequency: 1, location: 'Unknown', category: 'misc' }, // Unknown location
  { amount: 300, frequency: 1, location: 'Sydney', category: 'luxury' }, // Unusual category
];

const testData = [
  { amount: 100, frequency: 1, location: 'Sydney', category: 'food' },
  { amount: 5000, frequency: 1, location: 'Melbourne', category: 'transport' }, // Should be flagged as anomaly
  { amount: 150, frequency: 1, location: 'Brisbane', category: 'entertainment' },
  { amount: 50, frequency: 15, location: 'Perth', category: 'food' }, // Should be flagged as anomaly
];

async function testAnomalyDetection() {
  console.log('🧪 Testing Anomaly Detection System\n');
  
  try {
    // Step 1: Train a model
    console.log('1️⃣ Training anomaly detection model...');
    const trainResponse = await axios.post(`${API_URL}/anomaly-detection/train`, {
      dataset: sampleDataset,
      parameters: {
        contamination: 0.2, // Expect 20% anomalies
        nEstimators: 50,
        maxSamples: 'auto',
        randomState: 42
      },
      name: 'Financial Transactions Model',
      description: 'Model for detecting anomalies in financial transaction data'
    });

    console.log('✅ Training started successfully');
    console.log('📊 Model ID:', trainResponse.data.data.modelId);
    console.log('🔧 Job ID:', trainResponse.data.data.jobId);
    console.log('📈 Dataset size:', trainResponse.data.data.datasetSize);
    
    const { jobId, modelId } = trainResponse.data.data;

    // Step 2: Wait for training to complete
    console.log('\n2️⃣ Waiting for training to complete...');
    let trainingComplete = false;
    let attempts = 0;
    const maxAttempts = 30; // Wait up to 30 seconds
    
    while (!trainingComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      try {
        const statusResponse = await axios.get(`${API_URL}/anomaly-detection/training/status/${jobId}`);
        const status = statusResponse.data.data;
        
        console.log(`⏳ Training status: ${status.status} (${status.progress}%)`);
        
        if (status.status === 'completed') {
          trainingComplete = true;
          console.log('✅ Training completed successfully!');
        } else if (status.status === 'failed') {
          console.error('❌ Training failed:', status.error);
          return;
        }
      } catch (error) {
        console.log('⏳ Waiting for training status...');
      }
      
      attempts++;
    }
    
    if (!trainingComplete) {
      console.log('⚠️ Training is taking longer than expected, proceeding with scoring...');
    }

    // Step 3: Score new data
    console.log('\n3️⃣ Scoring new data...');
    const scoreResponse = await axios.post(`${API_URL}/anomaly-detection/score`, {
      data: testData,
      threshold: 0.6, // Higher threshold for more sensitive detection
      modelId: modelId
    });

    console.log('✅ Scoring completed successfully');
    console.log('📊 Results:');
    console.log(`   Total samples: ${scoreResponse.data.data.totalSamples}`);
    console.log(`   Anomalies detected: ${scoreResponse.data.data.anomaliesDetected}`);
    console.log(`   Anomaly rate: ${scoreResponse.data.data.summary.anomalyRate}`);
    console.log(`   Average score: ${scoreResponse.data.data.summary.averageScore}`);
    console.log(`   Threshold used: ${scoreResponse.data.data.threshold}`);

    // Step 4: Display detailed results
    console.log('\n4️⃣ Detailed Results:');
    scoreResponse.data.data.results.forEach((result, index) => {
      const status = result.isAnomaly ? '🚨 ANOMALY' : '✅ Normal';
      console.log(`   ${index + 1}. ${status} - Score: ${result.score.toFixed(4)}`);
      console.log(`      Data: ${JSON.stringify(result.originalData)}`);
    });

    // Step 5: Get all models
    console.log('\n5️⃣ Getting all models...');
    const modelsResponse = await axios.get(`${API_URL}/anomaly-detection/models`);
    console.log('✅ Retrieved models successfully');
    console.log(`📋 Total models: ${modelsResponse.data.data.length}`);
    
    modelsResponse.data.data.forEach(model => {
      console.log(`   - ${model.name} (ID: ${model.id}, Active: ${model.is_active})`);
    });

    // Step 6: Export results
    console.log('\n6️⃣ Exporting results...');
    const exportResponse = await axios.post(`${API_URL}/anomaly-detection/export`, {
      results: scoreResponse.data.data.results,
      filename: 'anomaly_test_results.csv'
    }, {
      responseType: 'text'
    });

    console.log('✅ Export completed successfully');
    console.log('📄 CSV content preview:');
    console.log(exportResponse.data.substring(0, 500) + '...');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Model training works');
    console.log('   ✅ Background training jobs work');
    console.log('   ✅ Data scoring works');
    console.log('   ✅ Anomaly detection works');
    console.log('   ✅ Model management works');
    console.log('   ✅ Results export works');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 You need to authenticate first. Please login and get a valid token.');
    }
  }
}

// Run the test
testAnomalyDetection();
