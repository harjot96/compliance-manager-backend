# 🔧 Frontend API Configuration Fix

## 🚨 **Problem Identified**

The frontend is making API requests to `/api/xero/settings` but receiving HTML instead of JSON. This happens because:

1. **Frontend URL**: `https://compliance-manager-frontend.onrender.com`
2. **Backend URL**: `https://compliance-manager-backend.onrender.com`
3. **Issue**: Frontend is making relative API calls that hit the frontend server instead of the backend

## ✅ **Solution**

The frontend needs to be configured to make API requests to the correct backend URL.

### **Frontend Environment Configuration**

The frontend should have an environment variable or configuration that points to the backend:

**For Production:**
```env
VITE_API_URL=https://compliance-manager-backend.onrender.com/api
```

**For Development:**
```env
VITE_API_URL=http://localhost:3333/api
```

### **Frontend Code Changes**

Instead of using relative URLs like:
```javascript
// ❌ WRONG - This hits the frontend server
fetch('/api/xero/settings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

Use the configured base URL:
```javascript
// ✅ CORRECT - This hits the backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://compliance-manager-backend.onrender.com/api';

fetch(`${API_BASE_URL}/xero/settings`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### **Quick Test to Verify Fix**

You can test if the fix works by manually making the request to the correct URL:

```javascript
// Test in browser console on the frontend
const token = 'your-jwt-token-here';
fetch('https://compliance-manager-backend.onrender.com/api/xero/settings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## 🔍 **Root Cause Analysis**

1. **Separate Deployments**: Frontend and backend are deployed as separate services
2. **Relative URLs**: Frontend code uses relative API paths (`/api/...`)
3. **Missing Proxy**: No proxy configuration to redirect API calls to backend
4. **Environment Config**: Frontend not configured with backend URL

## 📋 **Implementation Steps**

### Step 1: Update Frontend Environment Variables
Add to frontend deployment environment:
```
VITE_API_URL=https://compliance-manager-backend.onrender.com/api
```

### Step 2: Update Frontend API Service
Create or update an API service file:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://compliance-manager-backend.onrender.com/api';

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  },

  async post(endpoint, data, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }
};
```

### Step 3: Update Xero Settings API Calls
```javascript
// Instead of: fetch('/api/xero/settings', ...)
// Use:
import { apiClient } from './services/api';

const loadXeroSettings = async (token) => {
  try {
    const response = await apiClient.get('/xero/settings', {
      'Authorization': `Bearer ${token}`
    });
    return response;
  } catch (error) {
    console.error('Failed to load Xero settings:', error);
    throw error;
  }
};
```

## 🧪 **Verification**

After implementing the fix:

1. **Check Network Tab**: API requests should go to `compliance-manager-backend.onrender.com`
2. **No HTML Responses**: Should receive JSON responses
3. **Proper Error Handling**: 401/404 errors instead of HTML parsing errors

## 🚀 **Quick Fix for Immediate Testing**

If you need an immediate fix for testing, you can temporarily hardcode the backend URL in the frontend:

```javascript
// Temporary fix - replace relative URLs with absolute URLs
const BACKEND_URL = 'https://compliance-manager-backend.onrender.com';

// Update all API calls from:
fetch('/api/xero/settings', ...)
// To:
fetch(`${BACKEND_URL}/api/xero/settings`, ...)
```

This fix should resolve the `Unexpected token '<'` JSON parsing error immediately.

