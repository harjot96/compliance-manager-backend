# OpenAI API Error Handling Guide

## 🚨 **Common OpenAI API Errors**

### **1. Quota Exceeded (429)**
**Error:** `"429 You exceeded your current quota, please check your plan and billing details"`

**Cause:** Your OpenAI API key has reached its usage limit or billing quota.

**Solution:**
- Check your OpenAI billing dashboard
- Upgrade your plan if needed
- Wait for quota reset (usually monthly)
- Use a different API key with available quota

**API Response:**
```json
{
  "success": false,
  "message": "API key is valid but quota exceeded",
  "data": {
    "isValid": false,
    "error": "You exceeded your current quota, please check your plan and billing details...",
    "errorType": "quota_exceeded",
    "suggestion": "Please check your OpenAI billing and upgrade your plan if needed."
  }
}
```

### **2. Invalid API Key (401)**
**Error:** `"401 Invalid API key"`

**Cause:** The API key is invalid, revoked, or doesn't start with "sk-".

**Solution:**
- Generate a new API key from OpenAI dashboard
- Ensure the key starts with "sk-"
- Check if the key has been revoked

**API Response:**
```json
{
  "success": false,
  "message": "Invalid API key",
  "data": {
    "isValid": false,
    "error": "The API key provided is invalid or has been revoked.",
    "errorType": "invalid_key",
    "suggestion": "Please check your API key and ensure it starts with 'sk-'."
  }
}
```

### **3. Bad Request (400)**
**Error:** `"400 Bad request"`

**Cause:** Invalid request format or parameters.

**Solution:**
- Check request body format
- Ensure all required fields are provided
- Validate API key format

### **4. Server Error (500)**
**Error:** `"500 OpenAI server error"`

**Cause:** OpenAI servers are experiencing issues.

**Solution:**
- Wait and try again later
- Check OpenAI status page
- Contact OpenAI support if persistent

---

## 🚀 **Frontend Error Handling**

### **JavaScript Error Handler**
```javascript
async function testApiKey(apiKey) {
  try {
    const response = await fetch('/api/openai/test-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ apiKey })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        isValid: true,
        message: 'API key is valid'
      };
    } else {
      // Handle specific error types
      switch (data.data.errorType) {
        case 'quota_exceeded':
          return {
            isValid: false,
            message: 'Quota exceeded',
            error: data.data.error,
            suggestion: data.data.suggestion,
            action: 'upgrade_plan'
          };
          
        case 'invalid_key':
          return {
            isValid: false,
            message: 'Invalid API key',
            error: data.data.error,
            suggestion: data.data.suggestion,
            action: 'check_key'
          };
          
        default:
          return {
            isValid: false,
            message: 'API key test failed',
            error: data.data.error
          };
      }
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Network error',
      error: error.message
    };
  }
}
```

### **React Component with Error Handling**
```jsx
import React, { useState } from 'react';

const OpenAISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestKey = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const testResult = await testApiKey(apiKey);
      setResult(testResult);
    } catch (error) {
      setResult({
        isValid: false,
        message: 'Test failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (result) => {
    if (!result || result.isValid) return null;

    return (
      <div className={`alert ${getAlertClass(result.action)}`}>
        <h4>{result.message}</h4>
        <p>{result.error}</p>
        {result.suggestion && (
          <p><strong>Suggestion:</strong> {result.suggestion}</p>
        )}
        {result.action === 'upgrade_plan' && (
          <a 
            href="https://platform.openai.com/account/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-warning"
          >
            Check OpenAI Billing
          </a>
        )}
        {result.action === 'check_key' && (
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-info"
          >
            Generate New API Key
          </a>
        )}
      </div>
    );
  };

  const getAlertClass = (action) => {
    switch (action) {
      case 'upgrade_plan':
        return 'alert-warning';
      case 'check_key':
        return 'alert-danger';
      default:
        return 'alert-info';
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
      
      <button 
        onClick={handleTestKey} 
        disabled={!apiKey || loading}
        className="btn btn-primary"
      >
        {loading ? 'Testing...' : 'Test API Key'}
      </button>
      
      {result && (
        <div className="mt-3">
          {result.isValid ? (
            <div className="alert alert-success">
              <h4>✅ API Key is Valid</h4>
              <p>Your OpenAI API key is working correctly.</p>
            </div>
          ) : (
            renderError(result)
          )}
        </div>
      )}
    </div>
  );
};

export default OpenAISettings;
```

---

## 🔧 **Troubleshooting Steps**

### **For Quota Exceeded:**
1. **Check OpenAI Dashboard:**
   - Visit https://platform.openai.com/account/billing
   - Check your current usage and limits
   - Upgrade your plan if needed

2. **Check Usage Limits:**
   - Free tier: $5 credit per month
   - Pay-as-you-go: Based on usage
   - Team/Enterprise: Higher limits

3. **Alternative Solutions:**
   - Use a different API key
   - Wait for monthly reset
   - Contact OpenAI support

### **For Invalid API Key:**
1. **Generate New Key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Ensure it starts with "sk-"

2. **Check Key Format:**
   - Must start with "sk-"
   - Should be 51 characters long
   - No spaces or special characters

3. **Verify Key Status:**
   - Check if key is active
   - Ensure it hasn't been revoked
   - Check organization settings

---

## 📊 **Error Response Format**

All error responses follow this format:
```json
{
  "success": false,
  "message": "Human-readable message",
  "data": {
    "isValid": false,
    "error": "Detailed error message",
    "errorType": "error_category",
    "suggestion": "Actionable suggestion"
  }
}
```

**Error Types:**
- `quota_exceeded` - Usage limit reached
- `invalid_key` - API key is invalid
- `bad_request` - Invalid request format
- `server_error` - OpenAI server issues
- `unknown_error` - Other errors

---

## ✅ **Best Practices**

1. **Always handle errors gracefully**
2. **Provide clear user feedback**
3. **Include actionable suggestions**
4. **Log errors for debugging**
5. **Implement retry logic for transient errors**
6. **Show appropriate UI based on error type** 