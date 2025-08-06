# Xero API Integration Guide

This guide provides comprehensive documentation for integrating with the Xero API based on the [official Xero API documentation](https://developer.xero.com/documentation/api/accounting/requests-and-responses).

## 🔐 Authentication & Authorization

### Prerequisites
- Company must be enrolled with compliance details
- Valid JWT token required for all requests
- Xero OAuth2 connection must be established

### Base URL
```
http://localhost:3333/api/xero
```

## 📋 Company Information

### Get Company Info
```http
GET /api/xero/company-info
Authorization: Bearer <jwt_token>
```

**Response (Enrolled Company):**
```json
{
  "success": true,
  "message": "Company information retrieved successfully",
  "data": {
    "id": 17,
    "companyName": "Test Company for Xero",
    "email": "xero-test@example.com",
    "role": "company",
    "isEnrolled": true,
    "enrollmentStatus": {
      "isEnrolled": true,
      "message": "Company is enrolled and can setup Xero integration"
    },
    "compliance": {
      "basFrequency": "Quarterly",
      "nextBasDue": "2024-12-30T18:30:00.000Z",
      "fbtApplicable": true,
      "nextFbtDue": "2024-12-30T18:30:00.000Z",
      "iasRequired": true,
      "iasFrequency": "Monthly",
      "nextIasDue": "2024-12-30T18:30:00.000Z",
      "financialYearEnd": "2024-06-29T18:30:00.000Z"
    }
  }
}
```

## 🔗 OAuth2 Flow

### 1. Get Authorization URL
```http
GET /api/xero/login
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Authorization URL generated successfully",
  "data": {
    "authUrl": "https://login.xero.com/identity/connect/authorize?...",
    "state": "fdf4230414f9d81fe05944ac0d642977"
  }
}
```

### 2. Handle OAuth Callback
```http
GET /api/xero/callback?code=<auth_code>&state=<state>
Authorization: Bearer <jwt_token>
```

## 📊 Data Access Endpoints

All data endpoints follow this pattern:
```http
GET /api/xero/:connectionId/:resourceType
Authorization: Bearer <jwt_token>
```

### Query Parameters
- `where` - Filter conditions (Xero WHERE syntax)
- `order` - Sort order (e.g., "Date DESC")
- `page` - Page number (default: 1)
- `pageSize` - Items per page (max: 100)
- `modifiedSince` - ISO date for incremental sync
- `statuses` - Comma-separated status values
- `contactIDs` - Comma-separated contact IDs
- `includeArchived` - Include archived items (true/false)
- `fromDate` - Start date for reports
- `toDate` - End date for reports
- `periods` - Number of periods for reports
- `timeframe` - Timeframe for reports

### Available Resource Types

#### 1. Invoices
```http
GET /api/xero/:connectionId/invoices
```

**Additional Parameters:**
- `statuses` - DRAFT, SUBMITTED, AUTHORISED, DELETED, VOIDED, PAID
- `contactIDs` - Filter by specific contacts

**Response:**
```json
{
  "success": true,
  "message": "invoices retrieved successfully",
  "data": {
    "invoices": [...],
    "pagination": {
      "page": 1,
      "pageSize": 100,
      "pageCount": 5,
      "itemCount": 450
    },
    "dateTime": "2024-01-15T10:30:00Z",
    "status": "OK",
    "connection": {
      "id": 1,
      "tenantId": "xxx",
      "tenantName": "My Company",
      "status": "active"
    }
  }
}
```

#### 2. Contacts
```http
GET /api/xero/:connectionId/contacts
```

**Additional Parameters:**
- `includeArchived` - Include archived contacts

#### 3. Bank Transactions
```http
GET /api/xero/:connectionId/bank-transactions
```

#### 4. Accounts
```http
GET /api/xero/:connectionId/accounts
```

#### 5. Items
```http
GET /api/xero/:connectionId/items
```

#### 6. Tax Rates
```http
GET /api/xero/:connectionId/tax-rates
```

#### 7. Tracking Categories
```http
GET /api/xero/:connectionId/tracking-categories
```

#### 8. Organization Details
```http
GET /api/xero/:connectionId/organization
```

#### 9. Financial Summary
```http
GET /api/xero/:connectionId/financial-summary
```

**Additional Parameters:**
- `fromDate` - Start date (YYYY-MM-DD)
- `toDate` - End date (YYYY-MM-DD)
- `periods` - Number of periods
- `timeframe` - MONTH, QUARTER, YEAR

## 🔄 Connection Management

### Get Connections
```http
GET /api/xero/connections
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Xero connections retrieved successfully",
  "data": {
    "connections": [
      {
        "id": 1,
        "tenantId": "xxx",
        "tenantName": "My Company",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "enrollmentStatus": {
      "isEnrolled": true,
      "message": "Company is enrolled and can setup Xero integration"
    }
  }
}
```

### Delete Connection
```http
DELETE /api/xero/connections/:id
Authorization: Bearer <jwt_token>
```

## ⚠️ Error Handling

### Common Error Responses

#### 401 - Authentication Failed
```json
{
  "success": false,
  "message": "Authentication failed. Please reconnect your Xero account.",
  "error": "Authentication failed"
}
```

#### 403 - Insufficient Permissions
```json
{
  "success": false,
  "message": "Insufficient permissions for this operation.",
  "error": "Insufficient permissions"
}
```

#### 404 - Resource Not Found
```json
{
  "success": false,
  "message": "Resource not found.",
  "error": "Resource not found"
}
```

#### 429 - Rate Limited
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "error": "Rate limit exceeded"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve Xero data",
  "error": "Internal server error"
}
```

## 🔧 Frontend Integration Examples

### JavaScript/TypeScript

```typescript
interface XeroApiClient {
  baseUrl: string;
  token: string;
}

class XeroApiClient {
  constructor(private baseUrl: string, private token: string) {}

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Get company info
  async getCompanyInfo() {
    return this.request('/company-info');
  }

  // Get Xero login URL
  async getLoginUrl() {
    return this.request('/login');
  }

  // Get connections
  async getConnections() {
    return this.request('/connections');
  }

  // Get invoices with filtering
  async getInvoices(connectionId: string, options: {
    page?: number;
    pageSize?: number;
    where?: string;
    order?: string;
    statuses?: string[];
    contactIDs?: string[];
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return this.request(`/${connectionId}/invoices?${params.toString()}`);
  }

  // Get financial summary
  async getFinancialSummary(connectionId: string, options: {
    fromDate?: string;
    toDate?: string;
    periods?: number;
    timeframe?: string;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/${connectionId}/financial-summary?${params.toString()}`);
  }
}

// Usage
const xeroClient = new XeroApiClient('http://localhost:3333/api/xero', 'your-jwt-token');

// Check enrollment
const companyInfo = await xeroClient.getCompanyInfo();
if (companyInfo.data.isEnrolled) {
  // Get Xero login URL
  const loginData = await xeroClient.getLoginUrl();
  window.location.href = loginData.data.authUrl;
}

// Get invoices
const invoices = await xeroClient.getInvoices('connection-id', {
  page: 1,
  pageSize: 50,
  statuses: ['AUTHORISED', 'PAID'],
  order: 'Date DESC'
});
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface UseXeroApi {
  baseUrl: string;
  token: string;
}

export function useXeroApi({ baseUrl, token }: UseXeroApi) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    request
  };
}
```

## 🚀 Environment Setup

### Required Environment Variables
```env
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret
XERO_REDIRECT_URI=http://localhost:3333/api/xero/callback
XERO_WEBHOOK_SIGNING_KEY_URL=https://your-webhook-key-url.com/key
JWT_SECRET=your_jwt_secret
```

### Database Tables
- `xero_connections` - Store OAuth connections
- `xero_sync_cursors` - Track sync progress
- `xero_webhook_events` - Store webhook events
- `company_compliance` - Company enrollment data

## 📚 Additional Resources

- [Xero API Documentation](https://developer.xero.com/documentation/api/accounting/requests-and-responses)
- [Xero OAuth2 Guide](https://developer.xero.com/documentation/oauth2/auth-flow)
- [Xero Webhooks](https://developer.xero.com/documentation/webhooks/overview)
- [Xero Rate Limits](https://developer.xero.com/documentation/oauth2/limits) 