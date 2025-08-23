# Anomaly Detection System Integration

## Overview

The anomaly detection system has been successfully integrated into the compliance management backend using the JS Isolation Forest library. This system provides machine learning-based anomaly detection capabilities for identifying unusual patterns in data.

## Features

### ✅ Backend Implementation

1. **JS Isolation Forest Library**: Installed and integrated for anomaly detection
2. **API Endpoints**: Complete REST API for training and scoring
3. **Background Training**: Non-blocking model training with job tracking
4. **Model Persistence**: Database storage of training data and parameters
5. **Model Management**: CRUD operations for anomaly detection models

### ✅ Frontend-Ready API

The system provides all necessary endpoints for frontend integration:

- **Training**: `POST /api/anomaly-detection/train`
- **Scoring**: `POST /api/anomaly-detection/score`
- **Model Management**: Full CRUD operations
- **Export**: CSV export functionality
- **Job Tracking**: Real-time training status monitoring

## API Endpoints

### Training Endpoints

#### `POST /api/anomaly-detection/train`
Train a new anomaly detection model.

**Request Body:**
```json
{
  "dataset": [
    {"amount": 100, "frequency": 1, "location": "Sydney"},
    {"amount": 5000, "frequency": 1, "location": "Melbourne"}
  ],
  "parameters": {
    "contamination": 0.1,
    "nEstimators": 100,
    "maxSamples": "auto",
    "randomState": 42
  },
  "name": "Financial Transactions Model",
  "description": "Model for detecting anomalies in financial data"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Training started successfully",
  "data": {
    "modelId": 1,
    "jobId": "job_model_1_1234567890",
    "name": "Financial Transactions Model",
    "description": "Model for detecting anomalies in financial data",
    "datasetSize": 14,
    "parameters": {...}
  }
}
```

#### `GET /api/anomaly-detection/training/status/:jobId`
Get training job status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "progress": 100,
    "startTime": "2024-01-01T00:00:00.000Z",
    "endTime": "2024-01-01T00:00:05.000Z",
    "modelId": "model_1_1234567890"
  }
}
```

### Scoring Endpoints

#### `POST /api/anomaly-detection/score`
Score new data using trained model.

**Request Body:**
```json
{
  "data": [
    {"amount": 100, "frequency": 1, "location": "Sydney"},
    {"amount": 5000, "frequency": 1, "location": "Melbourne"}
  ],
  "threshold": 0.5,
  "modelId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scoring completed successfully",
  "data": {
    "results": [
      {
        "index": 0,
        "score": 0.1234,
        "isAnomaly": false,
        "originalData": {"amount": 100, "frequency": 1, "location": "Sydney"}
      },
      {
        "index": 1,
        "score": 0.8765,
        "isAnomaly": true,
        "originalData": {"amount": 5000, "frequency": 1, "location": "Melbourne"}
      }
    ],
    "threshold": 0.5,
    "totalSamples": 2,
    "anomaliesDetected": 1,
    "modelId": "1",
    "summary": {
      "anomalyRate": "50.00%",
      "averageScore": "0.5000"
    }
  }
}
```

### Model Management Endpoints

#### `GET /api/anomaly-detection/models`
Get all models.

#### `GET /api/anomaly-detection/models/:id`
Get specific model details.

#### `PUT /api/anomaly-detection/models/:id/activate`
Activate a model (deactivates others).

#### `DELETE /api/anomaly-detection/models/:id`
Delete a model.

### Export Endpoints

#### `POST /api/anomaly-detection/export`
Export results as CSV.

**Request Body:**
```json
{
  "results": [...],
  "filename": "anomaly_results.csv"
}
```

## Database Schema

### `anomaly_detection_models` Table

```sql
CREATE TABLE anomaly_detection_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  training_data JSONB NOT NULL,
  parameters JSONB NOT NULL,
  model_state JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

## Technical Implementation

### Key Components

1. **AnomalyDetection Model** (`src/models/AnomalyDetection.js`)
   - Database operations for model persistence
   - CRUD operations for model management

2. **AnomalyDetectionService** (`src/services/anomalyDetectionService.js`)
   - Core anomaly detection logic using Isolation Forest
   - Background training with job tracking
   - Data preprocessing and validation
   - Model state management

3. **AnomalyDetectionController** (`src/controllers/anomalyDetectionController.js`)
   - API endpoint handlers
   - Request validation and response formatting
   - Error handling

4. **AnomalyDetectionRoutes** (`src/routes/anomalyDetectionRoutes.js`)
   - Route definitions with authentication middleware

### Features

- **Background Training**: Models train asynchronously without blocking the API
- **Job Tracking**: Real-time status monitoring for training jobs
- **Model Persistence**: Training data and parameters stored in database
- **Model Rebuilding**: Models can be rebuilt from stored data on server restart
- **Data Validation**: Comprehensive input validation for datasets
- **Error Handling**: Robust error handling with meaningful messages
- **Export Functionality**: CSV export for results analysis

## Usage Examples

### Training a Model

```javascript
// Frontend code example
const trainModel = async () => {
  const response = await fetch('/api/anomaly-detection/train', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      dataset: financialData,
      parameters: {
        contamination: 0.1,
        nEstimators: 100
      },
      name: 'Financial Anomaly Model',
      description: 'Detects anomalies in financial transactions'
    })
  });
  
  const result = await response.json();
  console.log('Training started:', result.data.jobId);
};
```

### Scoring Data

```javascript
// Frontend code example
const scoreData = async (newData) => {
  const response = await fetch('/api/anomaly-detection/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      data: newData,
      threshold: 0.5
    })
  });
  
  const result = await response.json();
  return result.data.results;
};
```

### Monitoring Training Status

```javascript
// Frontend code example
const checkTrainingStatus = async (jobId) => {
  const response = await fetch(`/api/anomaly-detection/training/status/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  return result.data;
};
```

## Testing

Run the test script to verify functionality:

```bash
node test-anomaly-detection.js
```

This will:
1. Train a model with sample financial data
2. Monitor training progress
3. Score new data for anomalies
4. Display results
5. Test model management
6. Test export functionality

## Configuration

### Model Parameters

- **contamination**: Expected proportion of anomalies (0.0 to 1.0)
- **nEstimators**: Number of trees in the forest (default: 100)
- **maxSamples**: Number of samples for each tree (default: 'auto')
- **randomState**: Random seed for reproducibility

### Threshold Settings

- **0.0-0.3**: Very sensitive (detects many anomalies)
- **0.3-0.7**: Balanced (recommended)
- **0.7-1.0**: Less sensitive (detects only obvious anomalies)

## Security

- All endpoints require authentication
- Input validation prevents malicious data
- Rate limiting applied to all endpoints
- No sensitive data exposed in responses

## Performance

- Background training prevents API blocking
- Efficient data preprocessing
- Memory-based model storage for fast scoring
- Database persistence for model recovery

## Next Steps for Frontend Integration

1. **Upload Interface**: Create file upload for dataset CSV/JSON
2. **Training Dashboard**: Real-time training progress monitoring
3. **Scoring Interface**: Data input and threshold adjustment
4. **Results Visualization**: Charts and tables for anomaly display
5. **Model Management**: UI for model CRUD operations
6. **Export Interface**: Download buttons for results

## Support

For issues or questions:
1. Check the test script output
2. Review API response messages
3. Verify database connectivity
4. Check authentication tokens
