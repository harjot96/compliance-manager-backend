# 🔐 Secure OpenAI System - Admin-Managed API Keys

## Overview

This system provides a **secure, encrypted storage** for OpenAI API keys that are managed by the super admin. The API keys are encrypted using AES-256-GCM encryption and stored in the database, ensuring maximum security.

## 🔒 Security Features

### **1. Encrypted Storage**
- ✅ **AES-256-GCM Encryption**: API keys are encrypted before storage
- ✅ **Environment-based Key**: Uses `ENCRYPTION_KEY` environment variable
- ✅ **No Plain Text**: API keys are never stored in plain text
- ✅ **Secure Decryption**: Keys are only decrypted when needed

### **2. Admin-Only Access**
- ✅ **Super Admin Control**: Only super admins can manage API keys
- ✅ **Validation**: API keys are validated before saving
- ✅ **Testing**: Keys are tested for validity before storage

### **3. Database Security**
- ✅ **Encrypted Column**: `api_key_encrypted` stores encrypted data
- ✅ **JSON Storage**: Encrypted data includes IV and auth tag
- ✅ **Audit Trail**: Tracks who created/updated settings

## 📊 Database Schema

### **openai_settings Table**
```sql
CREATE TABLE openai_settings (
  id SERIAL PRIMARY KEY,
  api_key_encrypted TEXT NOT NULL,        -- Encrypted API key
  model VARCHAR(50) DEFAULT 'gpt-3.5-turbo',
  max_tokens INTEGER DEFAULT 1000,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER,                     -- Admin who created
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### **Admin Management Endpoints**

#### **1. Save OpenAI Settings**
```bash
POST /api/openai-admin/settings
Authorization: Bearer <admin-token>
Content-Type: application/json

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

#### **2. Get OpenAI Settings**
```bash
GET /api/openai-admin/settings
Authorization: Bearer <admin-token>
```

#### **3. Get All Settings (Admin)**
```bash
GET /api/openai-admin/settings/all
Authorization: Bearer <admin-token>
```

#### **4. Update OpenAI Settings**
```bash
PUT /api/openai-admin/settings/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "apiKey": "sk-new-openai-api-key",
  "model": "gpt-4",
  "maxTokens": 2000
}
```

#### **5. Delete OpenAI Settings**
```bash
DELETE /api/openai-admin/settings/1
Authorization: Bearer <admin-token>
```

#### **6. Test API Key**
```bash
POST /api/openai-admin/test-api-key
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "apiKey": "sk-your-openai-api-key"
}
```

### **Public AI Endpoints** (No API key required from frontend)

#### **1. Chat Completion**
```bash
POST /api/openai/chat
Content-Type: application/json

{
  "prompt": "Explain compliance management",
  "model": "gpt-3.5-turbo",
  "maxTokens": 500,
  "temperature": 0.7
}
```

#### **2. Generate Compliance Text**
```bash
POST /api/openai/compliance-text
Content-Type: application/json

{
  "complianceType": "BAS",
  "companyName": "ABC Company",
  "daysLeft": 5,
  "customPrompt": "Optional custom prompt"
}
```

#### **3. Generate Templates**
```bash
POST /api/openai/generate-template
Content-Type: application/json

{
  "templateType": "email",
  "complianceType": "BAS",
  "tone": "professional"
}
```

#### **4. Analyze Content**
```bash
POST /api/openai/analyze-content
Content-Type: application/json

{
  "content": "Your BAS is due in 5 days",
  "analysisType": "tone"
}
```

## 🔐 Encryption Details

### **Encryption Process**
1. **Key Derivation**: Uses `ENCRYPTION_KEY` environment variable
2. **AES-256-GCM**: Military-grade encryption algorithm
3. **Random IV**: Each encryption uses a unique initialization vector
4. **Auth Tag**: Ensures data integrity and authenticity
5. **JSON Storage**: Stores encrypted data with metadata

### **Environment Variables**
```bash
# Required for encryption
ENCRYPTION_KEY=your-secret-encryption-key-32-chars-long

# Optional OpenAI settings
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7
```

## 🚀 Setup Instructions

### **1. Environment Setup**
```bash
# Add to your .env file
ENCRYPTION_KEY=your-secret-encryption-key-32-chars-long
```

### **2. Database Migration**
```bash
# Run migrations to create the table
npm run migrate
```

### **3. Admin Configuration**
```bash
# Save OpenAI settings (Admin only)
curl -X POST https://your-api.com/api/openai-admin/settings \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "sk-your-openai-api-key",
    "model": "gpt-3.5-turbo",
    "maxTokens": 1000,
    "temperature": 0.7
  }'
```

### **4. Test Configuration**
```bash
# Test the API key
curl -X POST https://your-api.com/api/openai-admin/test-api-key \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-your-openai-api-key"}'
```

## 📋 Frontend Integration

### **JavaScript Examples**

#### **Admin Functions**
```javascript
// Save OpenAI settings (Admin only)
const saveOpenAISettings = async (apiKey, model, maxTokens, temperature) => {
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
    console.error('Error:', error);
  }
};

// Test API key
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
    console.error('Error:', error);
  }
};
```

#### **Public AI Functions**
```javascript
// Generate compliance text (No API key needed)
const generateComplianceText = async (complianceType, companyName, daysLeft) => {
  try {
    const response = await fetch('/api/openai/compliance-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complianceType,
        companyName,
        daysLeft
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Generate email template
const generateEmailTemplate = async (complianceType, tone) => {
  try {
    const response = await fetch('/api/openai/generate-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateType: 'email',
        complianceType,
        tone
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🛡️ Security Best Practices

### **1. Environment Variables**
- ✅ Use strong, unique encryption keys
- ✅ Never commit `.env` files to version control
- ✅ Rotate encryption keys periodically

### **2. API Key Management**
- ✅ Only super admins can manage API keys
- ✅ Validate API keys before saving
- ✅ Test API keys for functionality
- ✅ Monitor API usage and costs

### **3. Database Security**
- ✅ Use encrypted connections (SSL/TLS)
- ✅ Regular database backups
- ✅ Monitor database access logs
- ✅ Implement connection pooling

### **4. Application Security**
- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization
- ✅ Error handling without exposing sensitive data
- ✅ Regular security audits

## 🔍 Monitoring and Logging

### **Logging**
- ✅ API key validation attempts
- ✅ Encryption/decryption operations
- ✅ Admin actions (create, update, delete)
- ✅ Error tracking and alerting

### **Monitoring**
- ✅ OpenAI API usage and costs
- ✅ Database performance
- ✅ Application health checks
- ✅ Security event monitoring

## 🎯 Benefits

### **1. Security**
- ✅ **No API Key Exposure**: Frontend never sees API keys
- ✅ **Encrypted Storage**: Database-level security
- ✅ **Admin Control**: Centralized key management

### **2. Simplicity**
- ✅ **No Frontend Changes**: Existing code works unchanged
- ✅ **Automatic Key Management**: No manual key handling
- ✅ **Seamless Integration**: Drop-in replacement

### **3. Scalability**
- ✅ **Multiple Environments**: Different keys per environment
- ✅ **Key Rotation**: Easy key updates
- ✅ **Usage Tracking**: Monitor and optimize costs

## 🚀 Deployment Checklist

- [ ] Set `ENCRYPTION_KEY` environment variable
- [ ] Run database migrations
- [ ] Configure admin authentication
- [ ] Test API key validation
- [ ] Verify encryption/decryption
- [ ] Test all AI endpoints
- [ ] Monitor initial usage
- [ ] Set up logging and monitoring

## 🎉 Success!

Your OpenAI system is now **secure, encrypted, and admin-managed**! 

- ✅ **API keys are encrypted** and stored securely
- ✅ **Only admins can manage** API keys
- ✅ **Frontend doesn't need** API keys
- ✅ **All AI functionality** works seamlessly
- ✅ **Maximum security** with minimum complexity

**Your system is production-ready and secure!** 🔐🚀 