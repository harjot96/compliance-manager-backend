# 🤖 OpenAI API Documentation

## Overview

This API provides OpenAI functionality where the frontend provides the API key and all prompts. The backend acts as a proxy to OpenAI services.

## Base URL
```
https://compliance-manager-backend.onrender.com/api/openai
```

## Authentication
No authentication required - API keys are provided by the frontend in the request body.

---

## 📝 API Endpoints

### 1. Chat Completion
**POST** `/api/openai/chat`

General chat completion with OpenAI.

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key",
  "prompt": "Your prompt here",
  "model": "gpt-3.5-turbo",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "data": {
    "response": "AI generated response...",
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

**Example:**
```bash
curl -X POST https://compliance-manager-backend.onrender.com/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-your-api-key",
    "prompt": "Explain compliance management in simple terms",
    "model": "gpt-3.5-turbo",
    "maxTokens": 200
  }'
```

---

### 2. Generate Compliance Text
**POST** `/api/openai/compliance-text`

Generate compliance-related text for notifications.

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key",
  "complianceType": "BAS",
  "companyName": "ABC Company",
  "daysLeft": 5,
  "customPrompt": "Optional custom prompt",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Compliance text generated successfully",
  "data": {
    "response": "Generated compliance reminder text...",
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

**Example:**
```bash
curl -X POST https://compliance-manager-backend.onrender.com/api/openai/compliance-text \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-your-api-key",
    "complianceType": "BAS",
    "companyName": "ABC Company",
    "daysLeft": 5
  }'
```

---

### 3. Generate Templates
**POST** `/api/openai/generate-template`

Generate email or SMS templates using AI.

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key",
  "templateType": "email",
  "complianceType": "BAS",
  "tone": "professional",
  "customPrompt": "Optional custom prompt",
  "model": "gpt-3.5-turbo",
  "maxTokens": 300,
  "temperature": 0.7
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

**Example:**
```bash
curl -X POST https://compliance-manager-backend.onrender.com/api/openai/generate-template \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-your-api-key",
    "templateType": "sms",
    "complianceType": "BAS",
    "tone": "urgent"
  }'
```

---

### 4. Analyze Content
**POST** `/api/openai/analyze-content`

Analyze compliance content and provide insights.

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key",
  "content": "Your compliance content to analyze",
  "analysisType": "compliance",
  "customPrompt": "Optional custom prompt",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.3
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
    "analysis": "Detailed analysis of the content...",
    "analysisType": "compliance",
    "content": "Original content",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 25,
      "completion_tokens": 200,
      "total_tokens": 225
    }
  }
}
```

**Example:**
```bash
curl -X POST https://compliance-manager-backend.onrender.com/api/openai/analyze-content \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-your-api-key",
    "content": "Your BAS is due in 5 days. Please submit on time.",
    "analysisType": "tone"
  }'
```

---

## 🔧 Parameters

### Common Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `apiKey` | string | ✅ | - | OpenAI API key (must start with 'sk-') |
| `model` | string | ❌ | gpt-3.5-turbo | OpenAI model to use |
| `maxTokens` | number | ❌ | 1000 | Maximum tokens in response |
| `temperature` | number | ❌ | 0.7 | Response creativity (0-1) |

### Template Generation Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `templateType` | string | ✅ | - | 'email' or 'sms' |
| `complianceType` | string | ✅ | - | Type of compliance |
| `tone` | string | ❌ | professional | Tone of the template |

### Content Analysis Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `analysisType` | string | ❌ | compliance | 'compliance', 'tone', or 'effectiveness' |
| `content` | string | ✅ | - | Content to analyze |

---

## 🚨 Error Handling

### Common Error Responses

**Invalid API Key:**
```json
{
  "success": false,
  "message": "Invalid OpenAI API key"
}
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
```

**Missing Required Fields:**
```json
{
  "success": false,
  "message": "API key and prompt are required"
}
```

**Invalid Request:**
```json
{
  "success": false,
  "message": "Invalid request. Please check your prompt and parameters."
}
```

---

## 🎯 Use Cases

### 1. Dynamic Template Generation
Generate compliance templates on-the-fly based on specific requirements.

### 2. Content Optimization
Analyze existing compliance communications and get improvement suggestions.

### 3. Personalized Reminders
Create personalized compliance reminders for different companies and compliance types.

### 4. Multi-language Support
Generate compliance content in different languages by specifying in the prompt.

---

## 🔒 Security Notes

1. **API Key Validation**: All API keys are validated to start with 'sk-'
2. **No Storage**: API keys are not stored on the server
3. **Rate Limiting**: Standard rate limiting applies to all endpoints
4. **Error Handling**: Comprehensive error handling for OpenAI-specific errors

---

## 📋 Frontend Integration

### JavaScript Example
```javascript
// Generate compliance text
const generateComplianceText = async (apiKey, complianceType, companyName) => {
  try {
    const response = await fetch('/api/openai/compliance-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        complianceType: complianceType,
        companyName: companyName,
        daysLeft: 5
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Generate email template
const generateEmailTemplate = async (apiKey, complianceType) => {
  try {
    const response = await fetch('/api/openai/generate-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey,
        templateType: 'email',
        complianceType: complianceType,
        tone: 'professional'
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🚀 Getting Started

1. **Install Dependencies**: The OpenAI package is already included
2. **Deploy**: The API is ready for deployment
3. **Test**: Use the provided examples to test the endpoints
4. **Integrate**: Use the frontend integration examples

**Your OpenAI API is now ready to use!** 🎉 