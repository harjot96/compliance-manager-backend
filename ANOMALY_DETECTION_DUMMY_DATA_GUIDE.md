# Anomaly Detection Dummy Dataset Guide

This guide provides comprehensive information about the dummy dataset for the Anomaly Detection system, including data structure, usage examples, and integration instructions.

## 📊 Dataset Overview

The dummy dataset contains **3 pre-trained anomaly detection models** for compliance-related scenarios:

1. **BAS Compliance Anomaly Detector** - Business Activity Statement anomalies
2. **FBT Filing Anomaly Detector** - Fringe Benefits Tax anomalies  
3. **IAS Payment Anomaly Detector** - Instalment Activity Statement anomalies

### Dataset Statistics
- **Total Models**: 3
- **Total Training Samples**: 23
- **Anomaly Samples**: 7 (30% anomaly rate)
- **Normal Samples**: 16 (70% normal rate)
- **Features per Model**: 10-12 features
- **Algorithms Used**: Isolation Forest, Local Outlier Factor, One-Class SVM

## 🏗️ Data Structure

### Model Structure
Each model contains:
```json
{
  "id": 1,
  "name": "Model Name",
  "description": "Model description",
  "training_data": {
    "features": ["feature1", "feature2", ...],
    "samples": [...],
    "metadata": {...}
  },
  "parameters": {
    "algorithm": "algorithm_name",
    "hyperparameters": {...}
  },
  "model_state": {
    "trained_model": {...},
    "scaler": {...},
    "training_metrics": {...}
  },
  "threshold": 0.5,
  "is_active": true
}
```

## 📈 Model Details

### 1. BAS Compliance Anomaly Detector

**Purpose**: Detects anomalies in Business Activity Statement filing patterns and amounts

**Features** (12 total):
- `bas_amount` - Total BAS amount
- `gst_collected` - GST collected from customers
- `gst_paid` - GST paid on purchases
- `net_gst` - Net GST liability
- `payg_withholding` - PAYG withholding amount
- `payg_installment` - PAYG installment amount
- `luxury_car_tax` - Luxury car tax amount
- `fuel_tax_credits` - Fuel tax credits
- `days_late` - Days late for filing
- `filing_frequency` - Filing frequency (3 = quarterly)
- `amount_variance` - Variance from expected amount
- `seasonal_factor` - Seasonal adjustment factor

**Algorithm**: Isolation Forest
- **Contamination**: 0.3 (30% expected anomalies)
- **N Estimators**: 100
- **Max Samples**: Auto

**Training Metrics**:
- Accuracy: 90%
- Precision: 85%
- Recall: 80%
- F1 Score: 82%
- AUC: 88%

### 2. FBT Filing Anomaly Detector

**Purpose**: Detects anomalies in Fringe Benefits Tax filing patterns and calculations

**Features** (10 total):
- `fbt_amount` - FBT amount
- `grossed_up_amount` - Grossed up FBT amount
- `employee_count` - Number of employees
- `fbt_rate` - FBT rate (0.47)
- `days_late` - Days late for filing
- `filing_frequency` - Filing frequency (1 = annual)
- `amount_per_employee` - FBT amount per employee
- `variance_from_previous` - Variance from previous year
- `seasonal_factor` - Seasonal adjustment factor
- `industry_benchmark` - Industry benchmark amount

**Algorithm**: Local Outlier Factor
- **N Neighbors**: 5
- **Contamination**: 0.2 (20% expected anomalies)
- **Metric**: Minkowski (p=2)

**Training Metrics**:
- Accuracy: 86%
- Precision: 80%
- Recall: 75%
- F1 Score: 77%
- AUC: 84%

### 3. IAS Payment Anomaly Detector

**Purpose**: Detects anomalies in Instalment Activity Statement payment patterns

**Features** (10 total):
- `ias_amount` - IAS amount
- `gst_component` - GST component
- `payg_component` - PAYG component
- `total_liability` - Total liability
- `payment_frequency` - Payment frequency (3 = quarterly)
- `days_late` - Days late for payment
- `amount_variance` - Variance from expected amount
- `seasonal_factor` - Seasonal adjustment factor
- `business_size` - Business size category
- `payment_method` - Payment method (electronic/manual)

**Algorithm**: One-Class SVM
- **Kernel**: RBF
- **Nu**: 0.1
- **Gamma**: Scale

**Training Metrics**:
- Accuracy: 83%
- Precision: 75%
- Recall: 70%
- F1 Score: 72%
- AUC: 81%

## 🧪 Test Data Examples

### BAS Anomaly Test Cases

#### High Anomaly Score (0.85)
```json
{
  "bas_amount": 35000,
  "gst_collected": 3182,
  "gst_paid": 2673,
  "net_gst": 509,
  "payg_withholding": 18000,
  "payg_installment": 4500,
  "luxury_car_tax": 0,
  "fuel_tax_credits": 0,
  "days_late": 60,
  "filing_frequency": 3,
  "amount_variance": 0.45,
  "seasonal_factor": 0.5
}
```
**Anomaly Indicators**: High days late (60), high amount variance (0.45), low seasonal factor (0.5)

#### Low Anomaly Score (0.15)
```json
{
  "bas_amount": 1500000,
  "gst_collected": 136364,
  "gst_paid": 114545,
  "net_gst": 21819,
  "payg_withholding": 400000,
  "payg_installment": 120000,
  "luxury_car_tax": 0,
  "fuel_tax_credits": 0,
  "days_late": 0,
  "filing_frequency": 3,
  "amount_variance": 0.01,
  "seasonal_factor": 1.0
}
```
**Normal Indicators**: On-time filing (0 days late), low variance (0.01), normal seasonal factor (1.0)

### FBT Anomaly Test Cases

#### High Anomaly Score (0.92)
```json
{
  "fbt_amount": 2000,
  "grossed_up_amount": 3333,
  "employee_count": 3,
  "fbt_rate": 0.47,
  "days_late": 90,
  "filing_frequency": 1,
  "amount_per_employee": 667,
  "variance_from_previous": 0.6,
  "seasonal_factor": 0.5,
  "industry_benchmark": 550
}
```
**Anomaly Indicators**: Very late filing (90 days), high variance from previous (0.6), low seasonal factor (0.5)

### IAS Anomaly Test Cases

#### High Anomaly Score (0.88)
```json
{
  "ias_amount": 5000,
  "gst_component": 3000,
  "payg_component": 2000,
  "total_liability": 5000,
  "payment_frequency": 3,
  "days_late": 90,
  "amount_variance": 0.5,
  "seasonal_factor": 0.4,
  "business_size": "micro",
  "payment_method": "manual"
}
```
**Anomaly Indicators**: Very late payment (90 days), high variance (0.5), manual payment method

## 🚀 Loading the Dataset

### Using the Load Script

```bash
# Run the load script
node load-anomaly-detection-dummy-data.js
```

### Manual Loading

```javascript
const AnomalyDetection = require('./src/models/AnomalyDetection');
const fs = require('fs');

// Read the dummy data
const dummyData = JSON.parse(fs.readFileSync('sample-datasets/anomaly-detection-dummy-data.json', 'utf8'));

// Load each model
for (const modelData of dummyData.anomalyDetectionModels) {
  await AnomalyDetection.saveModel(
    modelData.name,
    modelData.description,
    modelData.training_data,
    modelData.parameters,
    modelData.model_state
  );
}
```

## 🔍 Using the Models

### Get All Models
```javascript
const models = await AnomalyDetection.getAllModels();
console.log('Available models:', models.map(m => ({ id: m.id, name: m.name, isActive: m.is_active })));
```

### Get Active Model
```javascript
const activeModel = await AnomalyDetection.getActiveModel();
console.log('Active model:', activeModel.name);
```

### Activate a Model
```javascript
await AnomalyDetection.activateModel(modelId);
```

### Test Anomaly Detection
```javascript
// Example test data for BAS
const testData = {
  bas_amount: 35000,
  gst_collected: 3182,
  gst_paid: 2673,
  net_gst: 509,
  payg_withholding: 18000,
  payg_installment: 4500,
  luxury_car_tax: 0,
  fuel_tax_credits: 0,
  days_late: 60,
  filing_frequency: 3,
  amount_variance: 0.45,
  seasonal_factor: 0.5
};

// This would be processed by your anomaly detection service
const anomalyScore = await detectAnomaly(testData);
console.log('Anomaly score:', anomalyScore);
```

## 📊 Data Quality Metrics

The dataset includes comprehensive quality metrics:

- **Completeness**: 98% (98% of required fields are present)
- **Consistency**: 95% (95% of data follows expected patterns)
- **Accuracy**: 92% (92% of data is accurate)
- **Timeliness**: 90% (90% of data is current)

## 🎯 Anomaly Detection Patterns

### Common Anomaly Indicators

1. **Late Filing/Payment**
   - Days late > 30 for BAS
   - Days late > 60 for FBT
   - Days late > 45 for IAS

2. **Amount Variances**
   - Variance > 0.25 for BAS
   - Variance > 0.4 for FBT
   - Variance > 0.3 for IAS

3. **Seasonal Deviations**
   - Seasonal factor < 0.7 (unusual seasonal patterns)
   - Seasonal factor > 1.2 (unusual seasonal patterns)

4. **Business Size Mismatches**
   - Micro businesses with large amounts
   - Large businesses with small amounts

5. **Payment Method Anomalies**
   - Large amounts with manual payment
   - Electronic payments for very small amounts

## 🔧 Customization

### Adding New Features
```javascript
// Example: Adding a new feature to BAS model
const newFeature = {
  name: "industry_sector",
  type: "categorical",
  values: ["retail", "manufacturing", "services", "construction"]
};
```

### Modifying Thresholds
```javascript
// Adjust anomaly detection sensitivity
const newThreshold = 0.3; // More sensitive (detects more anomalies)
await AnomalyDetection.updateThreshold(modelId, newThreshold);
```

### Adding New Models
```javascript
const newModel = {
  name: "Custom Anomaly Detector",
  description: "Detects custom anomalies",
  training_data: {...},
  parameters: {...},
  model_state: {...}
};

await AnomalyDetection.saveModel(
  newModel.name,
  newModel.description,
  newModel.training_data,
  newModel.parameters,
  newModel.model_state
);
```

## 📈 Performance Monitoring

### Training Metrics
Each model includes comprehensive training metrics:
- **Accuracy**: Overall prediction accuracy
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1 Score**: Harmonic mean of precision and recall
- **AUC**: Area under the ROC curve
- **Training Time**: Time taken to train the model
- **Prediction Time**: Time taken for single prediction

### Model Comparison
```javascript
const models = await AnomalyDetection.getAllModels();
models.forEach(model => {
  console.log(`${model.name}:`);
  console.log(`  Accuracy: ${model.training_metrics.accuracy}`);
  console.log(`  F1 Score: ${model.training_metrics.f1_score}`);
  console.log(`  Training Time: ${model.training_metrics.training_time}s`);
});
```

## 🛠️ Integration Examples

### Frontend Integration
```javascript
// React hook for anomaly detection
const useAnomalyDetection = () => {
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/anomaly-detection/models');
      const data = await response.json();
      setModels(data.models);
      setActiveModel(data.activeModel);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return { models, activeModel, loading, refetch: fetchModels };
};
```

### API Integration
```javascript
// Test anomaly detection
const testAnomaly = async (data) => {
  try {
    const response = await fetch('/api/anomaly-detection/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result.anomaly_score;
  } catch (error) {
    console.error('Error detecting anomaly:', error);
    return null;
  }
};
```

## 📝 Best Practices

1. **Data Validation**: Always validate input data before anomaly detection
2. **Threshold Tuning**: Adjust thresholds based on business requirements
3. **Model Monitoring**: Regularly monitor model performance and retrain as needed
4. **Feature Engineering**: Add domain-specific features for better detection
5. **Error Handling**: Implement proper error handling for model failures
6. **Performance Optimization**: Cache model predictions for frequently accessed data

## 🔍 Troubleshooting

### Common Issues

1. **Model Not Found**
   - Ensure the model is properly loaded
   - Check if the model ID exists in the database

2. **Low Prediction Accuracy**
   - Verify training data quality
   - Check feature scaling
   - Consider retraining with more data

3. **High False Positives**
   - Increase threshold value
   - Review feature selection
   - Add more normal samples to training data

4. **High False Negatives**
   - Decrease threshold value
   - Add more anomaly samples to training data
   - Review feature engineering

## 📚 Additional Resources

- [Anomaly Detection API Documentation](./ANOMALY_DETECTION_API.md)
- [Model Training Guide](./MODEL_TRAINING_GUIDE.md)
- [Feature Engineering Best Practices](./FEATURE_ENGINEERING.md)
- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION.md)

---

This dummy dataset provides a solid foundation for testing and developing anomaly detection capabilities in your compliance management system. The realistic data patterns and comprehensive model states enable immediate testing and validation of anomaly detection functionality.
