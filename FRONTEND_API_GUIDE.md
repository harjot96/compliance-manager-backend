# 🚀 Frontend API Guide - Secure OpenAI System

## Overview

This guide provides all the API endpoints that your frontend can use to interact with the secure OpenAI system. **No API keys are needed from the frontend** - everything is managed securely by the admin.

## Base URL
```
https://compliance-manager-backend.onrender.com
```

---

## 🔐 Admin Management APIs (Super Admin Only)

### **1. Save OpenAI Settings**
**POST** `/api/openai-admin/settings`

Save or update OpenAI configuration (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key",
  "model": "gpt-3.5-turbo",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "OpenAI settings saved successfully",
  "data": {
    "id": 1,
    "model": "gpt-3.5-turbo",
    "maxTokens": 1000,
    "temperature": 0.7,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**JavaScript Example:**
```javascript
const saveOpenAISettings = async (apiKey, model = 'gpt-3.5-turbo', maxTokens = 1000, temperature = 0.7) => {
  try {
    const response = await fetch('/api/openai-admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        apiKey,
        model,
        maxTokens,
        temperature
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving OpenAI settings:', error);
    throw error;
  }
};

// Usage
await saveOpenAISettings('sk-your-api-key', 'gpt-4', 2000, 0.8);
```

---

### **2. Get OpenAI Settings**
**GET** `/api/openai-admin/settings`

Get current OpenAI configuration (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "OpenAI settings retrieved successfully",
  "data": {
    "id": 1,
    "model": "gpt-3.5-turbo",
    "maxTokens": 1000,
    "temperature": 0.7,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**JavaScript Example:**
```javascript
const getOpenAISettings = async () => {
  try {
    const response = await fetch('/api/openai-admin/settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting OpenAI settings:', error);
    throw error;
  }
};
```

---

### **3. Test API Key**
**POST** `/api/openai-admin/test-api-key`

Test if an OpenAI API key is valid (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key"
}
```

**Response:**
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

**JavaScript Example:**
```javascript
const testApiKey = async (apiKey) => {
  try {
    const response = await fetch('/api/openai-admin/test-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ apiKey })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error testing API key:', error);
    throw error;
  }
};

// Usage
const result = await testApiKey('sk-your-api-key');
if (result.data.isValid) {
  console.log('API key is valid!');
} else {
  console.log('API key is invalid:', result.data.error);
}
```

---

## 🤖 Public AI APIs (No API Key Required)

### **1. Chat Completion**
**POST** `/api/openai/chat`

Generate AI responses for any prompt.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Explain compliance management in simple terms",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "Compliance management is the process of ensuring that a business follows all relevant laws, regulations, and industry standards...",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 50,
      "total_tokens": 60
    },
    "finishReason": "stop"
  }
}
```

**JavaScript Example:**
```javascript
const chatCompletion = async (prompt, model = 'gpt-3.5-turbo', maxTokens = 500, temperature = 0.7) => {
  try {
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens,
        temperature
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
};

// Usage
const result = await chatCompletion('Explain BAS compliance');
console.log(result.data.response);
```

---

### **2. Generate Compliance Text**
**POST** `/api/openai/compliance-text`

Generate compliance-related text for notifications.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "complianceType": "BAS",
  "companyName": "ABC Company",
  "daysLeft": 5,
  "customPrompt": "Optional custom prompt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Compliance text generated successfully",
  "data": {
    "response": "Dear ABC Company,\n\nThis is a friendly reminder that your BAS (Business Activity Statement) is due in 5 days...",
    "complianceType": "BAS",
    "companyName": "ABC Company",
    "daysLeft": 5,
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 15,
      "completion_tokens": 80,
      "total_tokens": 95
    }
  }
}
```

**JavaScript Example:**
```javascript
const generateComplianceText = async (complianceType, companyName, daysLeft, customPrompt = null) => {
  try {
    const response = await fetch('/api/openai/compliance-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complianceType,
        companyName,
        daysLeft,
        customPrompt
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating compliance text:', error);
    throw error;
  }
};

// Usage
const result = await generateComplianceText('BAS', 'ABC Company', 5);
console.log(result.data.response);
```

---

### **3. Generate Templates**
**POST** `/api/openai/generate-template`

Generate email or SMS templates using AI.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "templateType": "email",
  "complianceType": "BAS",
  "tone": "professional",
  "customPrompt": "Optional custom prompt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "EMAIL template generated successfully",
  "data": {
    "template": "Subject: BAS Compliance Reminder\n\nDear [Company Name],\n\nYour BAS is due in [X] days...",
    "templateType": "email",
    "complianceType": "BAS",
    "tone": "professional",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 20,
      "completion_tokens": 150,
      "total_tokens": 170
    }
  }
}
```

**JavaScript Example:**
```javascript
const generateTemplate = async (templateType, complianceType, tone = 'professional', customPrompt = null) => {
  try {
    const response = await fetch('/api/openai/generate-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateType,
        complianceType,
        tone,
        customPrompt
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
};

// Usage - Generate email template
const emailTemplate = await generateTemplate('email', 'BAS', 'professional');
console.log(emailTemplate.data.template);

// Usage - Generate SMS template
const smsTemplate = await generateTemplate('sms', 'BAS', 'urgent');
console.log(smsTemplate.data.template);
```

---

### **4. Analyze Content**
**POST** `/api/openai/analyze-content`

Analyze compliance content and provide insights.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Your BAS is due in 5 days. Please submit on time.",
  "analysisType": "tone",
  "customPrompt": "Optional custom prompt"
}
```

**Analysis Types:**
- `compliance` - Analyze compliance relevance and effectiveness
- `tone` - Analyze tone appropriateness
- `effectiveness` - Analyze communication effectiveness

**Response:**
```json
{
  "success": true,
  "message": "Content analysis completed successfully",
  "data": {
    "analysis": "Tone Analysis:\n\n1. Overall tone: Professional and urgent\n2. Appropriateness: Very appropriate for compliance context\n3. Emotional impact: Creates urgency without being aggressive\n4. Suggestions: Consider adding specific deadline date",
    "analysisType": "tone",
    "content": "Your BAS is due in 5 days. Please submit on time.",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 25,
      "completion_tokens": 200,
      "total_tokens": 225
    }
  }
}
```

**JavaScript Example:**
```javascript
const analyzeContent = async (content, analysisType = 'compliance', customPrompt = null) => {
  try {
    const response = await fetch('/api/openai/analyze-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content,
        analysisType,
        customPrompt
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

// Usage
const analysis = await analyzeContent('Your BAS is due in 5 days', 'tone');
console.log(analysis.data.analysis);
```

---

## 🎯 Complete Frontend Integration Examples

### **React Component Example**
```jsx
import React, { useState } from 'react';

const AIComplianceGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({
    complianceType: 'BAS',
    companyName: '',
    daysLeft: 5
  });

  const generateComplianceText = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/openai/compliance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data.response);
      } else {
        setResult('Error: ' + data.message);
      }
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Compliance Text Generator</h2>
      
      <div>
        <label>Compliance Type:</label>
        <select 
          value={formData.complianceType}
          onChange={(e) => setFormData({...formData, complianceType: e.target.value})}
        >
          <option value="BAS">BAS</option>
          <option value="FBT">FBT</option>
          <option value="IAS">IAS</option>
        </select>
      </div>
      
      <div>
        <label>Company Name:</label>
        <input 
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
        />
      </div>
      
      <div>
        <label>Days Left:</label>
        <input 
          type="number"
          value={formData.daysLeft}
          onChange={(e) => setFormData({...formData, daysLeft: parseInt(e.target.value)})}
        />
      </div>
      
      <button onClick={generateComplianceText} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Text'}
      </button>
      
      {result && (
        <div>
          <h3>Generated Text:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default AIComplianceGenerator;
```

### **Vue.js Component Example**
```vue
<template>
  <div>
    <h2>AI Template Generator</h2>
    
    <div>
      <label>Template Type:</label>
      <select v-model="formData.templateType">
        <option value="email">Email</option>
        <option value="sms">SMS</option>
      </select>
    </div>
    
    <div>
      <label>Compliance Type:</label>
      <select v-model="formData.complianceType">
        <option value="BAS">BAS</option>
        <option value="FBT">FBT</option>
        <option value="IAS">IAS</option>
      </select>
    </div>
    
    <div>
      <label>Tone:</label>
      <select v-model="formData.tone">
        <option value="professional">Professional</option>
        <option value="urgent">Urgent</option>
        <option value="friendly">Friendly</option>
      </select>
    </div>
    
    <button @click="generateTemplate" :disabled="loading">
      {{ loading ? 'Generating...' : 'Generate Template' }}
    </button>
    
    <div v-if="result">
      <h3>Generated Template:</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      result: '',
      formData: {
        templateType: 'email',
        complianceType: 'BAS',
        tone: 'professional'
      }
    };
  },
  methods: {
    async generateTemplate() {
      this.loading = true;
      try {
        const response = await fetch('/api/openai/generate-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        
        const data = await response.json();
        if (data.success) {
          this.result = data.data.template;
        } else {
          this.result = 'Error: ' + data.message;
        }
      } catch (error) {
        this.result = 'Error: ' + error.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## 🚨 Error Handling

### **Common Error Responses**

**Invalid API Key (Admin):**
```json
{
  "success": false,
  "message": "Invalid OpenAI API key",
  "error": "Incorrect API key provided"
}
```

**Settings Not Configured:**
```json
{
  "success": false,
  "message": "OpenAI settings not configured. Please contact administrator."
}
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Compliance type and company name are required"
}
```

---

## 🎯 Best Practices

### **1. Error Handling**
```javascript
const handleAIRequest = async (apiCall) => {
  try {
    const result = await apiCall();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('AI request failed:', error);
    // Show user-friendly error message
    showError('AI service temporarily unavailable. Please try again later.');
  }
};
```

### **2. Loading States**
```javascript
const [loading, setLoading] = useState(false);

const generateText = async () => {
  setLoading(true);
  try {
    const result = await generateComplianceText('BAS', 'Company', 5);
    setResult(result.response);
  } finally {
    setLoading(false);
  }
};
```

### **3. Caching**
```javascript
const cache = new Map();

const generateWithCache = async (key, generator) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await generator();
  cache.set(key, result);
  return result;
};
```

---

## 🚀 Quick Start

1. **Admin Setup** (One-time):
   ```javascript
   // Save OpenAI settings
   await saveOpenAISettings('sk-your-api-key');
   ```

2. **Frontend Usage**:
   ```javascript
   // Generate compliance text
   const text = await generateComplianceText('BAS', 'ABC Company', 5);
   
   // Generate template
   const template = await generateTemplate('email', 'BAS', 'professional');
   
   // Chat completion
   const response = await chatCompletion('Explain compliance');
   ```

3. **Error Handling**:
   ```javascript
   try {
     const result = await generateComplianceText('BAS', 'Company', 5);
     console.log(result.response);
   } catch (error) {
     console.error('Error:', error.message);
   }
   ```

---

## 🎉 Ready to Use!

Your frontend can now use all these APIs without needing to handle API keys. The system is:

- ✅ **Secure** - API keys are encrypted and admin-managed
- ✅ **Simple** - No API key handling in frontend
- ✅ **Reliable** - Comprehensive error handling
- ✅ **Scalable** - Easy to extend and customize

**Start building amazing AI-powered compliance features!** 🚀 