# Frontend OpenAI API Integration Guide

## Base URL
```
http://localhost:3000/api/openai
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. OpenAI Settings Management

### 1.1 Save OpenAI Settings
**POST** `/api/openai/settings`

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key-here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OpenAI settings saved successfully",
  "data": {
    "id": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "API key must start with sk-"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid OpenAI API key",
  "error": "Incorrect API key provided"
}
```

### 1.2 Get OpenAI Settings
**GET** `/api/openai/settings`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OpenAI settings retrieved successfully",
  "data": {
    "id": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "No OpenAI settings found"
}
```

### 1.3 Update OpenAI Settings
**PUT** `/api/openai/settings/:id`

**Request Body:**
```json
{
  "apiKey": "sk-your-new-openai-api-key-here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OpenAI settings updated successfully",
  "data": {
    "id": 1,
    "isActive": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 1.4 Delete OpenAI Settings
**DELETE** `/api/openai/settings/:id`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OpenAI settings deleted successfully",
  "data": {
    "id": 1
  }
}
```

### 1.5 Test OpenAI API Key
**POST** `/api/openai/test-api-key`

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key-here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "API key is valid",
  "data": {
    "isValid": true,
    "model": "Hello",
    "error": null
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "API key is invalid",
  "data": {
    "isValid": false,
    "model": null,
    "error": "Incorrect API key provided"
  }
}
```

---

## 2. OpenAI API Endpoints

### 2.1 Chat Completion
**POST** `/api/openai/chat`

**Request Body:**
```json
{
  "prompt": "Generate a compliance reminder for BAS filing",
  "model": "gpt-3.5-turbo",     // Optional, defaults to gpt-3.5-turbo
  "maxTokens": 1000,            // Optional, defaults to 1000
  "temperature": 0.7             // Optional, defaults to 0.7
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "This is a reminder that your BAS filing is due...",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 15,
      "completion_tokens": 45,
      "total_tokens": 60
    },
    "finishReason": "stop"
  }
}
```

### 2.2 Generate Compliance Text
**POST** `/api/openai/generate-compliance-text`

**Request Body:**
```json
{
  "complianceType": "BAS",
  "companyName": "ABC Company",
  "daysLeft": 30,
  "customPrompt": "Optional custom prompt",  // Optional
  "model": "gpt-4",                         // Optional
  "maxTokens": 1500,                        // Optional
  "temperature": 0.5                        // Optional
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Compliance text generated successfully",
  "data": {
    "response": "Dear ABC Company, your BAS filing is due in 30 days...",
    "complianceType": "BAS",
    "companyName": "ABC Company",
    "daysLeft": 30,
    "model": "gpt-4",
    "usage": {
      "prompt_tokens": 25,
      "completion_tokens": 65,
      "total_tokens": 90
    }
  }
}
```

### 2.3 Generate Template
**POST** `/api/openai/generate-template`

**Request Body:**
```json
{
  "templateType": "email",        // "email" or "sms"
  "complianceType": "BAS",
  "tone": "professional",         // Optional, defaults to "professional"
  "customPrompt": "Optional",     // Optional
  "model": "gpt-4",              // Optional
  "maxTokens": 1000,             // Optional
  "temperature": 0.7              // Optional
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "EMAIL template generated successfully",
  "data": {
    "template": "Subject: BAS Filing Reminder\n\nDear [Company Name],\n\nThis is a reminder...",
    "templateType": "email",
    "complianceType": "BAS",
    "tone": "professional",
    "model": "gpt-4",
    "usage": {
      "prompt_tokens": 30,
      "completion_tokens": 120,
      "total_tokens": 150
    }
  }
}
```

### 2.4 Analyze Content
**POST** `/api/openai/analyze-content`

**Request Body:**
```json
{
  "content": "Your compliance message content here",
  "analysisType": "compliance",   // "compliance", "tone", or "effectiveness"
  "customPrompt": "Optional",     // Optional
  "model": "gpt-4",              // Optional
  "maxTokens": 1000,             // Optional
  "temperature": 0.7              // Optional
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Content analysis completed successfully",
  "data": {
    "analysis": "1. Compliance relevance: High\n2. Clarity and effectiveness: Good\n3. Professional tone: Excellent...",
    "analysisType": "compliance",
    "content": "Your compliance message content here",
    "model": "gpt-4",
    "usage": {
      "prompt_tokens": 45,
      "completion_tokens": 180,
      "total_tokens": 225
    }
  }
}
```

---

## 3. Frontend Integration Examples

### 3.1 React/JavaScript Example

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/openai';
const token = localStorage.getItem('jwt_token');

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Save OpenAI Settings
async function saveOpenAISettings(apiKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ apiKey })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Settings saved:', data.data);
      return data.data;
    } else {
      throw new Error(data.error || data.message);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

// Test API Key
async function testApiKey(apiKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/test-api-key`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ apiKey })
    });
    
    const data = await response.json();
    return data.data.isValid;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}

// Chat Completion
async function chatCompletion(prompt, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt,
        model: options.model || 'gpt-3.5-turbo',
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.response;
    } else {
      throw new Error(data.error || data.message);
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
}

// Generate Compliance Text
async function generateComplianceText(complianceType, companyName, daysLeft, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-compliance-text`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        complianceType,
        companyName,
        daysLeft,
        model: options.model || 'gpt-3.5-turbo',
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.response;
    } else {
      throw new Error(data.error || data.message);
    }
  } catch (error) {
    console.error('Error generating compliance text:', error);
    throw error;
  }
}
```

### 3.2 React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const OpenAISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Test API key
  const handleTestKey = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    try {
      const isValid = await testApiKey(apiKey);
      setIsValid(isValid);
      setMessage(isValid ? 'API key is valid!' : 'Invalid API key');
    } catch (error) {
      setMessage('Error testing API key');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    try {
      await saveOpenAISettings(apiKey);
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="openai-settings">
      <h2>OpenAI Settings</h2>
      
      <div className="form-group">
        <label>API Key:</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="form-control"
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleTestKey} 
          disabled={!apiKey || loading}
          className="btn btn-secondary"
        >
          {loading ? 'Testing...' : 'Test Key'}
        </button>
        
        <button 
          onClick={handleSaveSettings} 
          disabled={!apiKey || !isValid || loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      
      {message && (
        <div className={`alert ${isValid ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default OpenAISettings;
```

### 3.3 Compliance Text Generator Component

```jsx
import React, { useState } from 'react';

const ComplianceTextGenerator = () => {
  const [formData, setFormData] = useState({
    complianceType: '',
    companyName: '',
    daysLeft: '',
    customPrompt: ''
  });
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const text = await generateComplianceText(
        formData.complianceType,
        formData.companyName,
        formData.daysLeft,
        { customPrompt: formData.customPrompt }
      );
      setGeneratedText(text);
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compliance-generator">
      <h2>Generate Compliance Text</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Compliance Type:</label>
          <select
            value={formData.complianceType}
            onChange={(e) => setFormData({...formData, complianceType: e.target.value})}
            className="form-control"
            required
          >
            <option value="">Select Type</option>
            <option value="BAS">BAS</option>
            <option value="FBT">FBT</option>
            <option value="IAS">IAS</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Days Left:</label>
          <input
            type="number"
            value={formData.daysLeft}
            onChange={(e) => setFormData({...formData, daysLeft: e.target.value})}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Custom Prompt (Optional):</label>
          <textarea
            value={formData.customPrompt}
            onChange={(e) => setFormData({...formData, customPrompt: e.target.value})}
            className="form-control"
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Generating...' : 'Generate Text'}
        </button>
      </form>
      
      {generatedText && (
        <div className="generated-text">
          <h3>Generated Text:</h3>
          <div className="text-content">
            {generatedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceTextGenerator;
```

---

## 4. Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "OpenAI settings not configured. Please contact administrator."
}
```

**429 Rate Limit:**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

---

## 5. Default Values

When not specified in requests, these defaults are used:

- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: `1000`
- **Temperature**: `0.7`

These provide a good balance for compliance-related tasks. 