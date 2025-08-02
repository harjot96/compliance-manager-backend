# Minimal OpenAI API - API Key Only

## 🎯 **What We Collect: ONLY the OpenAI API Key**

### **Database Storage**
```sql
CREATE TABLE openai_settings (
  id SERIAL PRIMARY KEY,
  api_key_encrypted TEXT NOT NULL,    -- ONLY this is stored
  is_active BOOLEAN DEFAULT true,     -- System field
  created_by INTEGER,                 -- System field
  created_at TIMESTAMP,               -- System field
  updated_at TIMESTAMP                -- System field
);
```

### **What We DON'T Collect:**
- ❌ Model name
- ❌ Max tokens
- ❌ Temperature
- ❌ Any other configuration parameters
- ❌ User preferences
- ❌ Usage statistics
- ❌ Personal data

---

## 📡 **API Endpoints**

### **1. Save OpenAI Settings**
**POST** `/api/openai/settings`

**Request Body (ONLY API Key):**
```json
{
  "apiKey": "sk-your-openai-api-key-here"
}
```

**Response:**
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

### **2. Get OpenAI Settings**
**GET** `/api/openai/settings`

**Response:**
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

### **3. Test API Key**
**POST** `/api/openai/test-api-key`

**Request Body:**
```json
{
  "apiKey": "sk-your-openai-api-key-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "API key is valid",
  "data": {
    "isValid": true,
    "error": null
  }
}
```

---

## 🔒 **Security & Privacy**

### **Data Encryption**
- ✅ API key is encrypted using AES-256-GCM
- ✅ Encryption key stored in environment variables
- ✅ No plain text storage

### **Data Minimization**
- ✅ Only essential data (API key) is stored
- ✅ No tracking or analytics
- ✅ No personal information collected
- ✅ No usage patterns stored

### **Access Control**
- ✅ Admin-only access to settings
- ✅ JWT authentication required
- ✅ API key validation before storage

---

## 🚀 **Frontend Integration**

### **Minimal JavaScript Example**
```javascript
// Only collect API key
async function saveOpenAISettings(apiKey) {
  const response = await fetch('/api/openai/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ apiKey }) // ONLY this
  });
  
  return response.json();
}

// Test API key
async function testApiKey(apiKey) {
  const response = await fetch('/api/openai/test-api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ apiKey }) // ONLY this
  });
  
  return response.json();
}
```

### **Minimal React Component**
```jsx
import React, { useState } from 'react';

const OpenAISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveOpenAISettings(apiKey); // ONLY API key
      alert('Settings saved!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>OpenAI Settings</h2>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter OpenAI API Key"
      />
      <button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save API Key'}
      </button>
    </div>
  );
};
```

---

## ✅ **Verification Checklist**

- ✅ **Only API key is collected**
- ✅ **No model parameters stored**
- ✅ **No token limits stored**
- ✅ **No temperature settings stored**
- ✅ **No user preferences stored**
- ✅ **No usage analytics stored**
- ✅ **No personal data collected**
- ✅ **API key is encrypted**
- ✅ **Minimal database footprint**
- ✅ **Simple validation (sk- prefix only)**

---

## 🎯 **Summary**

**What we collect:** OpenAI API key only  
**What we store:** Encrypted API key + system metadata  
**What we don't collect:** Everything else  

The system is designed to be **minimal, secure, and privacy-focused**. Only the essential OpenAI API key is collected and stored, with no additional data collection or tracking. 