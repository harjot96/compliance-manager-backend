# Xero Integration - Simplified Implementation

This document describes the simplified Xero OAuth2 integration based on the official Xero Node.js OAuth2 React app example.

## Overview

The Xero integration has been simplified to follow the basic OAuth2 authorization code flow without complex database storage or advanced features. This implementation focuses on:

- Basic OAuth2 authentication
- Role-based access control
- Independent operation (no compliance enrollment required)
- Simple token management
- Direct API calls

## API Endpoints

### Xero Settings Management

#### `POST /api/xero/settings`
Create or update Xero settings for a company.

**Request Body:**
```json
{
  "clientId": "your_xero_client_id",
  "clientSecret": "your_xero_client_secret", 
  "redirectUri": "https://your-app.com/api/xero/callback"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Xero settings saved successfully",
  "data": {
    "id": 1,
    "companyId": 123,
    "clientId": "your_xero_client_id",
    "redirectUri": "https://your-app.com/api/xero/callback",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `GET /api/xero/settings`
Get Xero settings for the authenticated company.

**Response:**
```json
{
  "success": true,
  "message": "Xero settings retrieved successfully",
  "data": {
    "id": 1,
    "companyId": 123,
    "clientId": "your_xero_client_id",
    "redirectUri": "https://your-app.com/api/xero/callback",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `DELETE /api/xero/settings`
Delete Xero settings for the authenticated company.

#### `GET /api/xero/settings/all`
Get all Xero settings (admin only).

### Authentication

#### `GET /api/xero/login`
Builds the OAuth2 authorization URL for Xero login.

**Requirements:**
- User must be authenticated
- User cannot be a super admin
- Company must have Xero settings configured

**Response:**
```json
{
  "success": true,
  "message": "Authorization URL generated successfully",
  "data": {
    "authUrl": "https://login.xero.com/identity/connect/authorize?...",
    "state": "random-state-string"
  }
}
```

#### `GET /api/xero/callback`
Handles the OAuth2 callback and exchanges authorization code for tokens.

**Requirements:**
- User must be authenticated
- User cannot be a super admin
- Valid authorization code from Xero

**Response:**
```json
{
  "success": true,
  "message": "Xero authentication successful",
  "data": {
    "tokens": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600,
      "tokenType": "Bearer"
    },
    "tenants": [
      {
        "id": "tenant_id",
        "name": "Organization Name"
      }
    ],
    "companyId": "company_id"
  }
}
```

### Company Information

#### `GET /api/xero/company-info`
Gets company information and enrollment status.

**Response:**
```json
{
  "success": true,
  "message": "Company information retrieved successfully",
  "data": {
    "id": "company_id",
    "companyName": "Company Name",
    "email": "company@email.com",
    "role": "company",
    "isEnrolled": true,
    "enrollmentStatus": {
      "isEnrolled": true,
      "message": "Company is enrolled and can setup Xero integration"
    },
    "compliance": {
      "basFrequency": "monthly",
      "nextBasDue": "2024-01-28",
      "fbtApplicable": true,
      "nextFbtDue": "2024-03-21",
      "iasRequired": true,
      "iasFrequency": "quarterly",
      "nextIasDue": "2024-03-31",
      "financialYearEnd": "2024-06-30"
    }
  }
}
```

### Token Management

#### `POST /api/xero/refresh-token`
Refreshes an expired access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here",
  "companyId": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

### Data Access

#### `POST /api/xero/data/:resourceType`
Gets Xero data for a specific resource type.

**Parameters:**
- `resourceType`: One of `invoices`, `contacts`, `bank-transactions`, `accounts`, `items`, `tax-rates`, `tracking-categories`, `organization`

**Request Body:**
```json
{
  "accessToken": "access_token_here",
  "tenantId": "tenant_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "invoices retrieved successfully",
  "data": {
    "invoices": [...],
    "pagination": {...}
  }
}
```

## Company-Specific Xero Settings

Each company can now store their own Xero credentials in the database. This allows for multi-tenant Xero integration where each company has their own Xero app credentials.

### Database Schema

The `xero_settings` table stores company-specific Xero credentials:

```sql
CREATE TABLE xero_settings (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  client_id VARCHAR(255) NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  redirect_uri VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Setting Up Xero Credentials

Companies must configure their Xero settings before using the integration:

1. **Get Xero App Credentials** from Xero Developer Portal
2. **Save Settings** using the API
3. **Use Integration** with company-specific credentials

## Security Features

1. **Role-based Access Control:**
   - Super admins cannot setup Xero accounts
   - Only enrolled companies can access Xero integration

2. **Independent Operation:**
   - Xero integration works independently of compliance enrollment
   - No compliance details required to use Xero integration

3. **OAuth2 Security:**
   - State parameter for CSRF protection
   - Proper token exchange flow
   - Secure token refresh mechanism

## Error Handling

The implementation includes comprehensive error handling for:

- **401 Unauthorized:** Invalid or expired tokens
- **403 Forbidden:** Insufficient permissions or enrollment requirements
- **404 Not Found:** Resources not found
- **429 Too Many Requests:** Rate limiting
- **500 Internal Server Error:** Server-side errors

## Usage Flow

1. **Company configures Xero settings** using `/api/xero/settings`
2. **Frontend calls `/api/xero/login`** to get authorization URL
3. **User redirects to Xero** using the authorization URL
4. **Xero redirects back** to your callback URL with authorization code
5. **Frontend calls `/api/xero/callback`** with the authorization code
6. **Backend exchanges code for tokens** using company-specific credentials
7. **Frontend stores tokens** and uses them for API calls
8. **Frontend calls `/api/xero/data/:resourceType`** with tokens to get data
9. **When tokens expire**, frontend calls `/api/xero/refresh-token` with companyId to refresh

**Note:** No compliance enrollment is required. Xero integration works independently.

## Testing

Use the `test-xero-enrollment.js` file to test the enrollment restrictions:

```bash
node test-xero-enrollment.js
```

This will test that:
- Super admins are blocked from Xero setup
- Unenrolled companies are blocked from Xero setup
- Enrolled companies can access Xero setup
- All users can view company information 