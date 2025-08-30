# Template API Integration Guide

Complete integration guide for all template-related APIs with full parameters, examples, and frontend integration code.

## Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:3333/api';
const AUTH_TOKEN = 'your-jwt-token-here';

// Axios configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});
```

## 1. Get All Templates

### Endpoint
```http
GET /api/templates
```

### Parameters
None

### Response Structure
```typescript
interface AllTemplatesResponse {
  success: boolean;
  message: string;
  data: {
    notificationTemplates: NotificationTemplate[];
    aiTemplateExamples: AITemplateExample[];
    summary: {
      totalNotificationTemplates: number;
      totalAiExamples: number;
      emailTemplates: number;
      smsTemplates: number;
    };
  };
}

interface NotificationTemplate {
  id: number;
  type: 'email' | 'sms';
  name: string;
  subject?: string;
  body: string;
  notificationTypes: string[];
  smsDays: number[];
  emailDays: number[];
  createdAt: string;
  updatedAt: string;
}

interface AITemplateExample {
  id: string;
  type: 'ai-generated';
  category: 'email' | 'sms';
  name: string;
  description: string;
  example: {
    templateType: 'email' | 'sms';
    complianceType: string;
    tone: string;
    generatedContent: string;
  };
}
```

### Frontend Integration
```javascript
// React Hook Example
const useAllTemplates = () => {
  const [templates, setTemplates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Usage in component
const TemplateDashboard = () => {
  const { templates, loading, error } = useAllTemplates();

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Templates Dashboard</h2>
      <div className="stats">
        <p>Total Templates: {templates?.summary.totalNotificationTemplates}</p>
        <p>Email Templates: {templates?.summary.emailTemplates}</p>
        <p>SMS Templates: {templates?.summary.smsTemplates}</p>
      </div>
      
      <h3>Notification Templates</h3>
      {templates?.notificationTemplates.map(template => (
        <div key={template.id} className="template-card">
          <h4>{template.name}</h4>
          <p>Type: {template.type}</p>
          <p>Subject: {template.subject || 'N/A'}</p>
          <p>Body: {template.body}</p>
        </div>
      ))}
    </div>
  );
};
```

## 2. Get Templates by Type

### Endpoint
```http
GET /api/templates/type/{type}
```

### Parameters
| Parameter | Type | Required | Values | Description |
|-----------|------|----------|--------|-------------|
| type | string | Yes | `email`, `sms`, `ai-generated` | Template type filter |

### Response Examples

#### Email Templates
```json
{
  "success": true,
  "message": "EMAIL templates retrieved successfully",
  "data": [
    {
      "id": 9,
      "type": "email",
      "name": "Simulated Email Template",
      "subject": "Simulated: Compliance Reminder",
      "body": "This is a simulated email for testing purposes.",
      "notificationTypes": ["BAS"],
      "smsDays": [],
      "emailDays": [1, 3, 7, 14],
      "createdAt": "2025-08-02T06:07:06.379Z",
      "updatedAt": "2025-08-02T06:07:06.379Z"
    }
  ]
}
```

#### AI-Generated Examples
```json
{
  "success": true,
  "message": "AI template generators retrieved successfully",
  "data": [
    {
      "id": "ai-email",
      "type": "ai-generated",
      "category": "email",
      "name": "AI Email Template Generator",
      "description": "Generate professional email templates using AI",
      "endpoint": "/api/templates/generate",
      "parameters": {
        "templateType": "email",
        "complianceType": "string (required)",
        "tone": "string (optional)",
        "customPrompt": "string (optional)"
      }
    }
  ]
}
```

### Frontend Integration
```javascript
const useTemplatesByType = (type) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/templates/type/${type}`);
      setTemplates(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      fetchTemplates();
    }
  }, [type]);

  return { templates, loading, error, refetch: fetchTemplates };
};

// Usage
const EmailTemplates = () => {
  const { templates, loading, error } = useTemplatesByType('email');
  
  if (loading) return <div>Loading email templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Email Templates</h2>
      {templates.map(template => (
        <div key={template.id} className="email-template">
          <h3>{template.name}</h3>
          <p><strong>Subject:</strong> {template.subject}</p>
          <p><strong>Body:</strong> {template.body}</p>
          <p><strong>Days:</strong> {template.emailDays.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};
```

## 3. Get Template Statistics

### Endpoint
```http
GET /api/templates/stats
```

### Parameters
None

### Response Structure
```typescript
interface TemplateStats {
  success: boolean;
  message: string;
  data: {
    totalTemplates: number;
    emailTemplates: number;
    smsTemplates: number;
    templatesByComplianceType: Record<string, number>;
    recentTemplates: {
      id: number;
      name: string;
      type: string;
      createdAt: string;
    }[];
  };
}
```

### Frontend Integration
```javascript
const useTemplateStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates/stats');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

// Usage
const TemplateStats = () => {
  const { stats, loading, error } = useTemplateStats();

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stats-dashboard">
      <div className="stat-card">
        <h3>Total Templates</h3>
        <p className="stat-number">{stats?.totalTemplates}</p>
      </div>
      <div className="stat-card">
        <h3>Email Templates</h3>
        <p className="stat-number">{stats?.emailTemplates}</p>
      </div>
      <div className="stat-card">
        <h3>SMS Templates</h3>
        <p className="stat-number">{stats?.smsTemplates}</p>
      </div>
      
      <div className="compliance-types">
        <h3>By Compliance Type</h3>
        {Object.entries(stats?.templatesByComplianceType || {}).map(([type, count]) => (
          <div key={type} className="compliance-stat">
            <span>{type}:</span>
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 4. Create Notification Template

### Endpoint
```http
POST /api/templates/notification
```

### Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| type | string | Yes | Template type | `"email"` or `"sms"` |
| name | string | Yes | Template name | `"BAS Reminder"` |
| subject | string | Yes* | Email subject (required for email) | `"BAS Due Soon"` |
| body | string | Yes | Template body content | `"Dear {companyName}..."` |
| notificationTypes | array | No | Compliance types | `["BAS", "FBT"]` |
| smsDays | array | No | Days before deadline for SMS | `[1, 7, 14]` |
| emailDays | array | No | Days before deadline for email | `[1, 3, 7, 14]` |

### Request Examples

#### Email Template
```json
{
  "type": "email",
  "name": "BAS Compliance Reminder",
  "subject": "Important: BAS Filing Due Soon",
  "body": "Dear {companyName},\n\nThis is a reminder that your Business Activity Statement (BAS) is due in {daysLeft} days.\n\nPlease ensure all required documentation is prepared and submitted on time to avoid penalties.\n\nBest regards,\nCompliance Team",
  "notificationTypes": ["BAS"],
  "emailDays": [1, 7, 14],
  "smsDays": []
}
```

#### SMS Template
```json
{
  "type": "sms",
  "name": "Urgent BAS Reminder",
  "subject": "",
  "body": "Hi {companyName}, your BAS is due in {daysLeft} days. Please submit on time to avoid penalties.",
  "notificationTypes": ["BAS"],
  "smsDays": [1, 3],
  "emailDays": []
}
```

### Frontend Integration
```javascript
const useCreateTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createTemplate = async (templateData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await api.post('/templates/notification', templateData);
      
      setSuccess(true);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createTemplate, loading, error, success };
};

// Usage
const CreateTemplateForm = () => {
  const { createTemplate, loading, error, success } = useCreateTemplate();
  const [formData, setFormData] = useState({
    type: 'email',
    name: '',
    subject: '',
    body: '',
    notificationTypes: ['BAS'],
    emailDays: [1, 7, 14],
    smsDays: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTemplate(formData);
      // Reset form or redirect
    } catch (err) {
      console.error('Template creation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type:</label>
        <select 
          value={formData.type} 
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>
      
      <div>
        <label>Name:</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      {formData.type === 'email' && (
        <div>
          <label>Subject:</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />
        </div>
      )}
      
      <div>
        <label>Body:</label>
        <textarea 
          value={formData.body}
          onChange={(e) => setFormData({...formData, body: e.target.value})}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Template'}
      </button>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Template created successfully!</div>}
    </form>
  );
};
```

## 5. Generate AI Template

### Endpoint
```http
POST /api/templates/generate
```

### Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| templateType | string | Yes | Template type | `"email"` or `"sms"` |
| complianceType | string | Yes | Compliance type | `"BAS"`, `"FBT"`, `"IAS"`, `"Tax Filing"` |
| tone | string | No | Tone of the template | `"professional"`, `"urgent"`, `"friendly"` |
| customPrompt | string | No | Custom prompt for AI | `"Include specific tax year details"` |
| model | string | No | AI model to use | `"gpt-3.5-turbo"`, `"gpt-4"` |
| maxTokens | number | No | Maximum tokens | `4000` |
| temperature | number | No | AI creativity (0-2) | `0.7` |

### Request Examples

#### Professional Email Template
```json
{
  "templateType": "email",
  "complianceType": "BAS",
  "tone": "professional",
  "customPrompt": "Include specific details about GST and PAYG withholding"
}
```

#### Urgent SMS Template
```json
{
  "templateType": "sms",
  "complianceType": "FBT",
  "tone": "urgent",
  "customPrompt": "Emphasize the importance of timely filing"
}
```

### Response Structure
```typescript
interface AITemplateResponse {
  success: boolean;
  message: string;
  data: {
    template: string;
    templateType: string;
    complianceType: string;
    tone: string;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}
```

### Frontend Integration
```javascript
const useGenerateAITemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const generateTemplate = async (params) => {
    try {
      setLoading(true);
      setError(null);
      setGeneratedTemplate(null);

      const response = await api.post('/templates/generate', params);
      
      setGeneratedTemplate(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { generateTemplate, loading, error, generatedTemplate };
};

// Usage
const AITemplateGenerator = () => {
  const { generateTemplate, loading, error, generatedTemplate } = useGenerateAITemplate();
  const [params, setParams] = useState({
    templateType: 'email',
    complianceType: 'BAS',
    tone: 'professional',
    customPrompt: ''
  });

  const handleGenerate = async () => {
    try {
      await generateTemplate(params);
    } catch (err) {
      console.error('Template generation failed:', err);
    }
  };

  return (
    <div>
      <h2>AI Template Generator</h2>
      
      <div className="form-group">
        <label>Template Type:</label>
        <select 
          value={params.templateType}
          onChange={(e) => setParams({...params, templateType: e.target.value})}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Compliance Type:</label>
        <select 
          value={params.complianceType}
          onChange={(e) => setParams({...params, complianceType: e.target.value})}
        >
          <option value="BAS">BAS</option>
          <option value="FBT">FBT</option>
          <option value="IAS">IAS</option>
          <option value="Tax Filing">Tax Filing</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Tone:</label>
        <select 
          value={params.tone}
          onChange={(e) => setParams({...params, tone: e.target.value})}
        >
          <option value="professional">Professional</option>
          <option value="urgent">Urgent</option>
          <option value="friendly">Friendly</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Custom Prompt:</label>
        <textarea 
          value={params.customPrompt}
          onChange={(e) => setParams({...params, customPrompt: e.target.value})}
          placeholder="Optional custom instructions..."
        />
      </div>
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Template'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {generatedTemplate && (
        <div className="generated-template">
          <h3>Generated Template:</h3>
          <div className="template-content">
            <pre>{generatedTemplate.template}</pre>
          </div>
          <div className="template-meta">
            <p><strong>Type:</strong> {generatedTemplate.templateType}</p>
            <p><strong>Compliance:</strong> {generatedTemplate.complianceType}</p>
            <p><strong>Tone:</strong> {generatedTemplate.tone}</p>
            <p><strong>Model:</strong> {generatedTemplate.model}</p>
            <p><strong>Tokens Used:</strong> {generatedTemplate.usage.total_tokens}</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

## 6. Test Template

### Endpoint
```http
POST /api/templates/notification/{id}/test
```

### Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| companyId | number | Yes | Company ID to test with | `1` |
| channel | string | Yes | Test channel | `"sms"` or `"email"` |
| testData | object | Yes | Test data for template variables | See example below |

### Request Example
```json
{
  "companyId": 1,
  "channel": "email",
  "testData": {
    "companyName": "Test Company Ltd",
    "complianceType": "BAS",
    "daysLeft": 7,
    "date": "2024-03-31"
  }
}
```

### Response Structure
```typescript
interface TestTemplateResponse {
  success: boolean;
  message: string;
  data: {
    sent: boolean;
    channel: string;
    to: string;
    preview: string;
    subject?: string;
    twilioSid?: string;
    sendGridMessageId?: string;
    simulated?: boolean;
    fallbackReason?: string;
  };
}
```

### Frontend Integration
```javascript
const useTestTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const testTemplate = async (templateId, testData) => {
    try {
      setLoading(true);
      setError(null);
      setTestResult(null);

      const response = await api.post(`/templates/notification/${templateId}/test`, testData);
      
      setTestResult(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to test template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { testTemplate, loading, error, testResult };
};

// Usage
const TestTemplateModal = ({ templateId, onClose }) => {
  const { testTemplate, loading, error, testResult } = useTestTemplate();
  const [testData, setTestData] = useState({
    companyId: 1,
    channel: 'email',
    testData: {
      companyName: 'Test Company',
      complianceType: 'BAS',
      daysLeft: 7
    }
  });

  const handleTest = async () => {
    try {
      await testTemplate(templateId, testData);
    } catch (err) {
      console.error('Template test failed:', err);
    }
  };

  return (
    <div className="modal">
      <h3>Test Template</h3>
      
      <div className="form-group">
        <label>Channel:</label>
        <select 
          value={testData.channel}
          onChange={(e) => setTestData({...testData, channel: e.target.value})}
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Company Name:</label>
        <input 
          type="text"
          value={testData.testData.companyName}
          onChange={(e) => setTestData({
            ...testData, 
            testData: {...testData.testData, companyName: e.target.value}
          })}
        />
      </div>
      
      <div className="form-group">
        <label>Days Left:</label>
        <input 
          type="number"
          value={testData.testData.daysLeft}
          onChange={(e) => setTestData({
            ...testData, 
            testData: {...testData.testData, daysLeft: parseInt(e.target.value)}
          })}
        />
      </div>
      
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Testing...' : 'Send Test'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {testResult && (
        <div className="test-result">
          <h4>Test Result:</h4>
          <p><strong>Status:</strong> {testResult.sent ? 'Sent' : 'Failed'}</p>
          <p><strong>Channel:</strong> {testResult.channel}</p>
          <p><strong>To:</strong> {testResult.to}</p>
          <p><strong>Preview:</strong> {testResult.preview}</p>
          {testResult.simulated && (
            <p><strong>Note:</strong> This was a simulated send</p>
          )}
        </div>
      )}
      
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

## Complete React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const api = axios.create({
    baseURL: 'http://localhost:3333/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/templates/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, []);

  const createTemplate = async (templateData) => {
    try {
      const response = await api.post('/templates/notification', templateData);
      await fetchTemplates(); // Refresh list
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create template');
    }
  };

  const generateAITemplate = async (params) => {
    try {
      const response = await api.post('/templates/generate', params);
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to generate template');
    }
  };

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="template-manager">
      <h1>Template Manager</h1>
      
      {/* Statistics Dashboard */}
      {stats && (
        <div className="stats-dashboard">
          <div className="stat-card">
            <h3>Total Templates</h3>
            <p>{stats.totalTemplates}</p>
          </div>
          <div className="stat-card">
            <h3>Email Templates</h3>
            <p>{stats.emailTemplates}</p>
          </div>
          <div className="stat-card">
            <h3>SMS Templates</h3>
            <p>{stats.smsTemplates}</p>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => setActiveTab('all')}
        >
          All Templates
        </button>
        <button 
          className={activeTab === 'email' ? 'active' : ''} 
          onClick={() => setActiveTab('email')}
        >
          Email Templates
        </button>
        <button 
          className={activeTab === 'sms' ? 'active' : ''} 
          onClick={() => setActiveTab('sms')}
        >
          SMS Templates
        </button>
        <button 
          className={activeTab === 'ai' ? 'active' : ''} 
          onClick={() => setActiveTab('ai')}
        >
          AI Generator
        </button>
      </div>
      
      {/* Template List */}
      <div className="template-list">
        {templates.notificationTemplates
          .filter(template => activeTab === 'all' || template.type === activeTab)
          .map(template => (
            <div key={template.id} className="template-card">
              <h3>{template.name}</h3>
              <p><strong>Type:</strong> {template.type}</p>
              {template.subject && <p><strong>Subject:</strong> {template.subject}</p>}
              <p><strong>Body:</strong> {template.body}</p>
              <p><strong>Compliance Types:</strong> {template.notificationTypes.join(', ')}</p>
              <div className="template-actions">
                <button onClick={() => {/* Edit template */}}>Edit</button>
                <button onClick={() => {/* Test template */}}>Test</button>
                <button onClick={() => {/* Delete template */}}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TemplateManager;
```

## Error Handling

### Common Error Responses

```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Validation error",
  "error": "Template name must be unique"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Authentication required"
}

// 404 Not Found
{
  "success": false,
  "message": "Template not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Failed to create template",
  "error": "Database connection error"
}
```

### Error Handling Utility

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Validation Error: ${data.message}`;
      case 401:
        return 'Authentication required. Please log in again.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};
```

## Rate Limiting

The API implements rate limiting:
- **AI Generation**: 10 requests per minute
- **Template Operations**: 20 requests per minute
- **Template Retrieval**: 100 requests per minute

Handle rate limiting gracefully:

```javascript
const handleRateLimit = (error) => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    setTimeout(() => {
      // Retry the request
      retryRequest();
    }, waitTime);
    
    return `Rate limit exceeded. Retrying in ${Math.ceil(waitTime / 1000)} seconds...`;
  }
  return null;
};
```

This comprehensive guide provides all the parameters, examples, and integration code needed to fully integrate the template APIs into your frontend application.
