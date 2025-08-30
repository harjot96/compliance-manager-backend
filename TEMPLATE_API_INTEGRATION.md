# Template API Integration Guide

## Base Configuration
```javascript
const API_BASE_URL = 'http://localhost:3333/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});
```

## 1. Get All Templates
```http
GET /api/templates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notificationTemplates": [...],
    "aiTemplateExamples": [...],
    "summary": {
      "totalNotificationTemplates": 9,
      "emailTemplates": 3,
      "smsTemplates": 6
    }
  }
}
```

## 2. Get Templates by Type
```http
GET /api/templates/type/{type}
```

**Types:** `email`, `sms`, `ai-generated`

## 3. Get Template Statistics
```http
GET /api/templates/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTemplates": 9,
    "emailTemplates": 3,
    "smsTemplates": 6,
    "templatesByComplianceType": {"BAS": 9},
    "recentTemplates": [...]
  }
}
```

## 4. Create Notification Template
```http
POST /api/templates/notification
```

**Parameters:**
```json
{
  "type": "email|sms",
  "name": "Template Name",
  "subject": "Email Subject (required for email)",
  "body": "Template body content",
  "notificationTypes": ["BAS", "FBT"],
  "smsDays": [1, 7, 14],
  "emailDays": [1, 3, 7, 14]
}
```

## 5. Generate AI Template
```http
POST /api/templates/generate
```

**Parameters:**
```json
{
  "templateType": "email|sms",
  "complianceType": "BAS|FBT|IAS|Tax Filing",
  "tone": "professional|urgent|friendly",
  "customPrompt": "Optional custom prompt",
  "model": "gpt-3.5-turbo|gpt-4",
  "maxTokens": 4000,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "template": "Generated content...",
    "templateType": "email",
    "complianceType": "BAS",
    "tone": "professional",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 86,
      "completion_tokens": 160,
      "total_tokens": 246
    }
  }
}
```

## 6. Test Template
```http
POST /api/templates/notification/{id}/test
```

**Parameters:**
```json
{
  "companyId": 1,
  "channel": "sms|email",
  "testData": {
    "companyName": "Test Company",
    "complianceType": "BAS",
    "daysLeft": 7,
    "date": "2024-03-31"
  }
}
```

## React Integration Examples

### Hook for All Templates
```javascript
const useAllTemplates = () => {
  const [templates, setTemplates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data.data);
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
```

### Hook for AI Template Generation
```javascript
const useGenerateAITemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const generateTemplate = async (params) => {
    try {
      setLoading(true);
      const response = await api.post('/templates/generate', params);
      setGeneratedTemplate(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateTemplate, loading, error, generatedTemplate };
};
```

### Template Creation Hook
```javascript
const useCreateTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTemplate = async (templateData) => {
    try {
      setLoading(true);
      const response = await api.post('/templates/notification', templateData);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTemplate, loading, error };
};
```

## Complete Component Example
```jsx
const TemplateManager = () => {
  const { templates, loading, error } = useAllTemplates();
  const { generateTemplate, loading: generating } = useGenerateAITemplate();
  const { createTemplate, loading: creating } = useCreateTemplate();

  const handleGenerate = async () => {
    try {
      const result = await generateTemplate({
        templateType: 'email',
        complianceType: 'BAS',
        tone: 'professional'
      });
      console.log('Generated:', result.template);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleCreate = async () => {
    try {
      const result = await createTemplate({
        type: 'email',
        name: 'BAS Reminder',
        subject: 'BAS Due Soon',
        body: 'Dear {companyName}, your BAS is due in {daysLeft} days.',
        notificationTypes: ['BAS'],
        emailDays: [1, 7, 14]
      });
      console.log('Created:', result);
    } catch (err) {
      console.error('Creation failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Template Manager</h1>
      
      <div className="stats">
        <p>Total: {templates?.summary.totalNotificationTemplates}</p>
        <p>Email: {templates?.summary.emailTemplates}</p>
        <p>SMS: {templates?.summary.smsTemplates}</p>
      </div>

      <button onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate AI Template'}
      </button>

      <button onClick={handleCreate} disabled={creating}>
        {creating ? 'Creating...' : 'Create Template'}
      </button>

      <div className="templates">
        {templates?.notificationTemplates.map(template => (
          <div key={template.id} className="template-card">
            <h3>{template.name}</h3>
            <p>Type: {template.type}</p>
            <p>Subject: {template.subject || 'N/A'}</p>
            <p>Body: {template.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Error Handling
```javascript
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400: return `Validation Error: ${data.message}`;
      case 401: return 'Authentication required';
      case 404: return 'Resource not found';
      case 429: return 'Rate limit exceeded';
      case 500: return 'Server error';
      default: return data.message || 'Unexpected error';
    }
  }
  return error.message || 'Network error';
};
```

## Rate Limits
- AI Generation: 10 requests/minute
- Template Operations: 20 requests/minute
- Template Retrieval: 100 requests/minute

## Template Variables
- `{companyName}` - Company name
- `{complianceType}` - Compliance type
- `{daysLeft}` - Days until deadline
- `{date}` - Due date
- `{recipient}` - Recipient name
