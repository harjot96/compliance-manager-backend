# Frontend Integration Guide - Anomaly Detection System

## Quick Start

### 1. API Service Setup

```javascript
// src/services/anomalyDetectionApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333/api';

class AnomalyDetectionApi {
  constructor(token) {
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Training
  async trainModel(dataset, parameters, name, description) {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/train`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ dataset, parameters, name, description })
    });
    return response.json();
  }

  async getTrainingStatus(jobId) {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/training/status/${jobId}`, {
      headers: this.headers
    });
    return response.json();
  }

  // Scoring
  async scoreData(data, threshold = 0.5, modelId = null) {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/score`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ data, threshold, modelId })
    });
    return response.json();
  }

  // Model Management
  async getAllModels() {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/models`, {
      headers: this.headers
    });
    return response.json();
  }

  async activateModel(id) {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/models/${id}/activate`, {
      method: 'PUT',
      headers: this.headers
    });
    return response.json();
  }

  // Export
  async exportResults(results, filename = 'anomaly_results.csv') {
    const response = await fetch(`${API_BASE_URL}/anomaly-detection/export`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ results, filename })
    });
    return response.blob();
  }
}

export default AnomalyDetectionApi;
```

### 2. Custom Hook

```javascript
// src/hooks/useAnomalyDetection.js
import { useState, useEffect, useCallback } from 'react';
import AnomalyDetectionApi from '../services/anomalyDetectionApi';

export const useAnomalyDetection = (token) => {
  const [api] = useState(() => new AnomalyDetectionApi(token));
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllModels();
      if (response.success) {
        setModels(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const trainModel = useCallback(async (dataset, parameters, name, description) => {
    try {
      setLoading(true);
      const response = await api.trainModel(dataset, parameters, name, description);
      if (response.success) {
        await loadModels();
        return response.data;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, loadModels]);

  const scoreData = useCallback(async (data, threshold, modelId) => {
    try {
      setLoading(true);
      const response = await api.scoreData(data, threshold, modelId);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    models,
    loading,
    error,
    trainModel,
    scoreData,
    loadModels
  };
};
```

### 3. Main Component

```jsx
// src/components/AnomalyDetection.jsx
import React, { useState } from 'react';
import { useAnomalyDetection } from '../hooks/useAnomalyDetection';

const AnomalyDetection = () => {
  const token = localStorage.getItem('token');
  const { models, loading, error, trainModel, scoreData } = useAnomalyDetection(token);
  
  const [dataset, setDataset] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setDataset(data);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleTrain = async () => {
    if (!dataset) return;
    
    const result = await trainModel(
      dataset,
      { contamination: 0.1, nEstimators: 100 },
      'My Model',
      'Anomaly detection model'
    );
    
    if (result) {
      alert('Training started!');
    }
  };

  const handleScore = async () => {
    if (!dataset) return;
    
    const result = await scoreData(dataset.slice(0, 5), 0.5);
    if (result) {
      setResults(result);
    }
  };

  return (
    <div>
      <h2>Anomaly Detection</h2>
      
      <div>
        <h3>1. Upload Dataset</h3>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        {dataset && <p>Dataset loaded: {dataset.length} samples</p>}
      </div>

      <div>
        <h3>2. Train Model</h3>
        <button onClick={handleTrain} disabled={!dataset || loading}>
          {loading ? 'Training...' : 'Train Model'}
        </button>
      </div>

      <div>
        <h3>3. Score Data</h3>
        <button onClick={handleScore} disabled={!dataset || loading}>
          {loading ? 'Scoring...' : 'Score Data'}
        </button>
      </div>

      {results && (
        <div>
          <h3>Results</h3>
          <p>Total: {results.totalSamples}</p>
          <p>Anomalies: {results.anomaliesDetected}</p>
          <p>Rate: {results.summary.anomalyRate}</p>
          
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Score</th>
                <th>Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((result, index) => (
                <tr key={index}>
                  <td>{result.index}</td>
                  <td>{result.score.toFixed(4)}</td>
                  <td>{result.isAnomaly ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AnomalyDetection;
```

## API Endpoints Reference

### Training
- `POST /api/anomaly-detection/train` - Train new model
- `GET /api/anomaly-detection/training/status/:jobId` - Check training progress
- `GET /api/anomaly-detection/training/jobs` - List training jobs

### Scoring
- `POST /api/anomaly-detection/score` - Score data for anomalies

### Model Management
- `GET /api/anomaly-detection/models` - List all models
- `PUT /api/anomaly-detection/models/:id/activate` - Activate model
- `DELETE /api/anomaly-detection/models/:id` - Delete model

### Export
- `POST /api/anomaly-detection/export` - Export results as CSV

## Sample Data Format

```json
[
  {"amount": 100, "frequency": 1, "location": "Sydney"},
  {"amount": 5000, "frequency": 1, "location": "Melbourne"},
  {"amount": 150, "frequency": 1, "location": "Brisbane"}
]
```

## Installation

```bash
npm install axios
```

Add to your routes:
```javascript
import AnomalyDetection from './components/AnomalyDetection';
<Route path="/anomaly-detection" element={<AnomalyDetection />} />
```

## Usage Flow

1. **Upload Dataset** - User uploads JSON file
2. **Train Model** - Configure parameters and start training
3. **Monitor Progress** - Check training status
4. **Score Data** - Input new data for anomaly detection
5. **View Results** - See anomalies highlighted
6. **Export Results** - Download as CSV

The system is now ready for frontend integration!
