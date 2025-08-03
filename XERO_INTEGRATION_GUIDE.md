# Xero Integration Guide

## 🎯 **Overview**

This Xero integration provides complete OAuth2 authentication, role-based access control, and comprehensive API functionality for both super admin and normal companies.

## 🏗️ **Architecture**

### **Database Models**
- **XeroConnection**: Stores encrypted OAuth tokens per tenant/organization
- **XeroSyncCursor**: Tracks sync state with If-Modified-Since and paging
- **XeroWebhookEvent**: Stores webhook events for processing

### **Role-Based Access Control**
- **Super Admin**: Can access all connections and data across all companies
- **Companies**: Can only access their own connections and data

## 🔐 **OAuth2 Authentication Flow**

### **1. Initiate OAuth2 Login**
```http
GET /api/xero/login
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Authorization URL generated successfully",
  "data": {
    "authUrl": "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=...",
    "state": "random-state-string"
  }
}
```

### **2. Handle OAuth2 Callback**
```http
GET /api/xero/callback?code=<auth-code>&state=<state>
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "tenantIds": ["tenant-id-1", "tenant-id-2"] // Optional, selects specific tenants
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xero connections created successfully",
  "data": {
    "connections": [
      {
        "id": 1,
        "tenantId": "tenant-id-1",
        "tenantName": "My Company",
        "status": "active"
      }
    ],
    "totalCreated": 1
  }
}
```

## 📊 **Data Access APIs**

### **Get Invoices**
```http
GET /api/xero/:connectionId/invoices?page=1&pageSize=100&where=Status=="AUTHORISED"&order=Date DESC&modifiedSince=2024-01-01T00:00:00Z
Authorization: Bearer <jwt-token>
```

### **Get Contacts**
```http
GET /api/xero/:connectionId/contacts?page=1&pageSize=100&where=IsArchived==false&order=Name ASC
Authorization: Bearer <jwt-token>
```

### **Get Bank Transactions**
```http
GET /api/xero/:connectionId/bank-transactions?page=1&pageSize=100&modifiedSince=2024-01-01T00:00:00Z
Authorization: Bearer <jwt-token>
```

### **Get Accounts**
```http
GET /api/xero/:connectionId/accounts?page=1&pageSize=100&where=Type=="REVENUE"
Authorization: Bearer <jwt-token>
```

### **Get Items**
```http
GET /api/xero/:connectionId/items?page=1&pageSize=100&order=Name ASC
Authorization: Bearer <jwt-token>
```

## 🔄 **Sync Management**

### **Get Sync Cursors**
```http
GET /api/xero/:connectionId/sync-cursors
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sync cursors retrieved successfully",
  "data": [
    {
      "id": 1,
      "resourceType": "invoices",
      "lastModifiedSince": "2024-01-01T00:00:00Z",
      "lastPageNumber": 1,
      "lastPageSize": 100,
      "hasMore": true,
      "lastSyncAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### **Reset Sync Cursor**
```http
POST /api/xero/:connectionId/sync-cursors/:resourceType/reset
Authorization: Bearer <jwt-token>
```

## 🔗 **Connection Management**

### **Get Connections (Role-Based)**
```http
GET /api/xero/connections
Authorization: Bearer <jwt-token>
```

**Super Admin Response:**
```json
{
  "success": true,
  "message": "Xero connections retrieved successfully",
  "data": [
    {
      "id": 1,
      "companyId": 1,
      "tenantId": "tenant-id-1",
      "tenantName": "Company A",
      "status": "active",
      "companyName": "Company A"
    }
  ]
}
```

**Company Response:**
```json
{
  "success": true,
  "message": "Xero connections retrieved successfully",
  "data": [
    {
      "id": 1,
      "tenantId": "tenant-id-1",
      "tenantName": "My Company",
      "status": "active"
    }
  ]
}
```

### **Delete Connection**
```http
DELETE /api/xero/connections/:id
Authorization: Bearer <jwt-token>
```

## 📡 **Webhook Handling**

### **Webhook Endpoint**
```http
POST /api/xero/webhook
X-Xero-Signature: <hmac-signature>
Content-Type: application/json

{
  "events": [
    {
      "eventId": "event-id-1",
      "eventType": "CREATE",
      "resourceType": "invoices",
      "resourceId": "invoice-id-1",
      "eventDate": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### **Get Webhook Events**
```http
GET /api/xero/:connectionId/webhook-events?limit=50
Authorization: Bearer <jwt-token>
```

## 🚀 **Frontend Integration**

### **React Component Example**
```jsx
import React, { useState, useEffect } from 'react';

const XeroIntegration = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get connections
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/xero/connections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setConnections(data.data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initiate OAuth2 login
  const handleXeroLogin = async () => {
    try {
      const response = await fetch('/api/xero/login', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.authUrl;
      }
    } catch (error) {
      console.error('Error initiating Xero login:', error);
    }
  };

  // Get Xero data
  const fetchXeroData = async (connectionId, resourceType) => {
    try {
      const response = await fetch(`/api/xero/${connectionId}/${resourceType}?page=1&pageSize=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching Xero data:', error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="xero-integration">
      <h2>Xero Integration</h2>
      
      <button onClick={handleXeroLogin} className="btn btn-primary">
        Connect Xero Account
      </button>
      
      {loading ? (
        <div>Loading connections...</div>
      ) : (
        <div className="connections-list">
          {connections.map(connection => (
            <div key={connection.id} className="connection-item">
              <h3>{connection.tenantName}</h3>
              <p>Status: {connection.status}</p>
              <button 
                onClick={() => fetchXeroData(connection.id, 'invoices')}
                className="btn btn-secondary"
              >
                Get Invoices
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default XeroIntegration;
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```bash
# Xero OAuth2 Configuration
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret
XERO_REDIRECT_URI=https://your-domain.com/api/xero/callback
XERO_WEBHOOK_SIGNING_KEY=your-webhook-signing-key

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# JWT Secret
JWT_SECRET=your-jwt-secret
```

## 🛡️ **Security Features**

### **1. Token Encryption**
- All OAuth tokens are encrypted using AES-256-GCM
- Encryption key stored in environment variables
- No plain text storage of sensitive data

### **2. Role-Based Access Control**
- Super admin can access all data
- Companies can only access their own data
- Proper authorization checks on all endpoints

### **3. Webhook Security**
- HMAC-SHA256 signature verification
- Prevents unauthorized webhook calls
- Secure webhook processing

### **4. Rate Limiting**
- Maximum 5 concurrent requests
- Automatic retry on 429/5xx errors
- Exponential backoff for failed requests

## 📈 **Performance Features**

### **1. Incremental Sync**
- If-Modified-Since support for efficient syncing
- Cursor-based pagination
- Background sync every 6-12 hours

### **2. Caching & Optimization**
- High page sizes where allowed (up to 100)
- Efficient database queries
- Connection pooling

### **3. Error Handling**
- Graceful handling of expired tokens
- Automatic token refresh
- Comprehensive error logging

## 🔄 **Background Sync**

### **Sync Job Configuration**
```javascript
// Run every 6 hours
const syncInterval = 6 * 60 * 60 * 1000;

setInterval(async () => {
  const cursors = await XeroSyncCursor.getCursorsForSync(6);
  
  for (const cursor of cursors) {
    // Process sync for each cursor
    await processSync(cursor);
  }
}, syncInterval);
```

## 📊 **Monitoring & Logging**

### **Structured Logging**
```javascript
console.log('Xero API Call', {
  connectionId: 1,
  resourceType: 'invoices',
  correlationId: 'xero-correlation-id',
  timestamp: new Date().toISOString()
});
```

### **Health Checks**
```http
GET /health
```

## ✅ **Testing**

### **Test OAuth2 Flow**
```bash
# 1. Get authorization URL
curl -H "Authorization: Bearer <jwt-token>" \
  https://your-domain.com/api/xero/login

# 2. Complete OAuth2 flow in browser
# 3. Handle callback with tenant selection
```

### **Test Data Access**
```bash
# Get invoices
curl -H "Authorization: Bearer <jwt-token>" \
  "https://your-domain.com/api/xero/1/invoices?page=1&pageSize=10"
```

## 🎯 **Summary**

This Xero integration provides:

✅ **Complete OAuth2 authentication**  
✅ **Role-based access control**  
✅ **Encrypted token storage**  
✅ **Incremental sync with cursors**  
✅ **Webhook processing**  
✅ **Rate limiting and error handling**  
✅ **Background sync capabilities**  
✅ **Comprehensive API coverage**  

The system is designed to be secure, scalable, and maintainable for both super admin and company users. 