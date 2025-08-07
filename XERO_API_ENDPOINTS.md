# Xero API Endpoints for Frontend

## 🚀 Base URL
```
Production: https://compliance-manager-backend.onrender.com
Development: http://localhost:3333
```

## 📋 Complete API Endpoints List

### 1. **Xero Settings Management**

#### 1.1 Create/Update Xero Settings
```http
POST /api/xero/settings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientId": "YOUR_XERO_CLIENT_ID",
  "clientSecret": "YOUR_XERO_CLIENT_SECRET",
  "redirectUri": "https://compliance-manager-frontend.onrender.com/redirecturl"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Xero settings saved successfully",
  "data": {
    "id": 1,
    "companyId": 7,
    "clientId": "YOUR_XERO_CLIENT_ID",
    "redirectUri": "https://compliance-manager-frontend.onrender.com/redirecturl",
    "createdAt": "2025-08-07T18:00:00.000Z",
    "updatedAt": "2025-08-07T18:00:00.000Z"
  }
}
```

#### 1.2 Get Xero Settings
```http
GET /api/xero/settings
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Xero settings retrieved successfully",
  "data": {
    "id": 1,
    "companyId": 7,
    "clientId": "YOUR_XERO_CLIENT_ID",
    "redirectUri": "https://compliance-manager-frontend.onrender.com/redirecturl",
    "createdAt": "2025-08-07T18:00:00.000Z",
    "updatedAt": "2025-08-07T18:00:00.000Z"
  }
}
```

#### 1.3 Delete Xero Settings
```http
DELETE /api/xero/settings
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Xero settings deleted successfully",
  "data": {
    "id": 1,
    "companyId": 7
  }
}
```

### 2. **Xero OAuth Flow**

#### 2.1 Start Xero Authorization
```http
GET /api/xero/login
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authorization URL generated successfully",
  "data": {
    "authUrl": "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=https://compliance-manager-frontend.onrender.com/redirecturl&scope=openid%20profile%20email%20accounting.transactions%20accounting.contacts%20accounting.settings%20offline_access&state=abc123def456",
    "state": "abc123def456"
  }
}
```

**Frontend Action:** Redirect user to `data.authUrl`

#### 2.2 OAuth Callback (Handled by Backend)
```http
GET /api/xero/callback?code=<AUTHORIZATION_CODE>&state=<STATE>
```

**Backend Action:** 
- Exchanges code for tokens
- Stores tokens in database
- Redirects to frontend with result

**Frontend Route to Handle:** `/redirecturl`

### 3. **Xero Data Access**

#### 3.1 Get Xero Data (Invoices, Contacts, etc.)
```http
POST /api/xero/data/:resourceType
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Resource Types Available:**
- `invoices` - Get invoices
- `contacts` - Get contacts
- `bank-transactions` - Get bank transactions
- `accounts` - Get chart of accounts
- `items` - Get items
- `tax-rates` - Get tax rates
- `tracking-categories` - Get tracking categories
- `organization` - Get organization details

**Request Body:**
```json
{
  "accessToken": "YOUR_XERO_ACCESS_TOKEN",
  "tenantId": "YOUR_XERO_TENANT_ID"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "invoices retrieved successfully",
  "data": {
    "Invoices": [
      {
        "InvoiceID": "12345678-1234-1234-1234-123456789012",
        "InvoiceNumber": "INV-001",
        "Contact": {
          "ContactID": "12345678-1234-1234-1234-123456789012",
          "Name": "Test Customer"
        },
        "Date": "2025-08-07",
        "DueDate": "2025-08-21",
        "Status": "AUTHORISED",
        "LineAmountTypes": "Exclusive",
        "LineItems": [
          {
            "Description": "Test Item",
            "Quantity": 1,
            "UnitAmount": 100.00,
            "LineAmount": 100.00
          }
        ],
        "SubTotal": 100.00,
        "TotalTax": 10.00,
        "Total": 110.00
      }
    ]
  }
}
```

### 4. **Token Management**

#### 4.1 Refresh Access Token
```http
POST /api/xero/refresh-token
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN",
  "companyId": 7
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "NEW_ACCESS_TOKEN",
    "refreshToken": "NEW_REFRESH_TOKEN",
    "expiresIn": 1800,
    "tokenType": "Bearer"
  }
}
```

### 5. **Company Information**

#### 5.1 Get Company Info
```http
GET /api/xero/company-info
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Company information retrieved successfully",
  "data": {
    "id": 7,
    "companyName": "Test Company",
    "email": "test@example.com",
    "role": "company",
    "isEnrolled": true,
    "enrollmentStatus": {
      "isEnrolled": true,
      "message": "Xero integration is now independent of compliance enrollment"
    },
    "compliance": {
      "basFrequency": "Quarterly",
      "nextBasDue": "2025-10-28",
      "fbtApplicable": false,
      "iasRequired": true,
      "iasFrequency": "Monthly",
      "nextIasDue": "2025-09-21",
      "financialYearEnd": "2025-06-30"
    }
  }
}
```

## 🔄 Frontend Implementation Flow

### Step 1: Configure Xero Settings
```javascript
// 1. Set up Xero credentials
const configureXero = async () => {
  const response = await fetch('/api/xero/settings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientId: 'YOUR_XERO_CLIENT_ID',
      clientSecret: 'YOUR_XERO_CLIENT_SECRET',
      redirectUri: 'https://compliance-manager-frontend.onrender.com/redirecturl'
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('Xero settings configured successfully');
  }
};
```

### Step 2: Start OAuth Flow
```javascript
// 2. Start Xero authorization
const startXeroAuth = async () => {
  const response = await fetch('/api/xero/login', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  if (result.success) {
    // Redirect user to Xero authorization page
    window.location.href = result.data.authUrl;
  }
};
```

### Step 3: Handle OAuth Callback
```javascript
// 3. Handle OAuth callback (in your /redirecturl route)
const XeroCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const success = searchParams.get('success');
    const companyId = searchParams.get('companyId');
    const tenants = searchParams.get('tenants');
    const error = searchParams.get('error');
    const errorDetails = searchParams.get('errorDetails');
    
    if (success === 'true') {
      // OAuth successful
      console.log('Xero connected successfully!');
      console.log('Company ID:', companyId);
      console.log('Tenants:', JSON.parse(tenants));
      
      // Store tenant information for future API calls
      localStorage.setItem('xeroTenants', tenants);
      
      navigate('/xero-success');
    } else {
      // OAuth failed
      console.error('Xero connection failed:', error);
      console.error('Details:', errorDetails);
      
      navigate('/xero-error', { 
        state: { error, errorDetails } 
      });
    }
  }, [searchParams, navigate]);
  
  return <div>Processing Xero authorization...</div>;
};
```

### Step 4: Access Xero Data
```javascript
// 4. Get Xero data
const getXeroData = async (resourceType) => {
  // Get stored tokens (you'll need to implement token storage/retrieval)
  const accessToken = localStorage.getItem('xeroAccessToken');
  const tenantId = JSON.parse(localStorage.getItem('xeroTenants'))[0].id;
  
  const response = await fetch(`/api/xero/data/${resourceType}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accessToken,
      tenantId
    })
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
};

// Usage examples:
const invoices = await getXeroData('invoices');
const contacts = await getXeroData('contacts');
const accounts = await getXeroData('accounts');
```

## 🚨 Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication failed. Please reconnect your Xero account.",
  "error": "Invalid access token"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Client ID, Client Secret, and Redirect URI are required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Super admins cannot setup Xero accounts. Only regular companies can setup Xero integration.",
  "errorCode": "SUPER_ADMIN_RESTRICTED"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Xero settings not found for this company"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to generate authorization URL",
  "error": "Database connection error"
}
```

## 🔐 Authentication Requirements

All endpoints (except `/api/xero/callback`) require:
```http
Authorization: Bearer <JWT_TOKEN>
```

## 📝 Required Frontend Routes

1. **`/xero-settings`** - Configure Xero credentials
2. **`/xero-connect`** - Start OAuth flow
3. **`/redirecturl`** - Handle OAuth callback
4. **`/xero-success`** - OAuth success page
5. **`/xero-error`** - OAuth error page
6. **`/xero-data`** - Display Xero data

## ✅ Testing Checklist

- [ ] Configure Xero settings
- [ ] Start OAuth flow
- [ ] Handle callback redirect
- [ ] Store tokens securely
- [ ] Access Xero data
- [ ] Handle token refresh
- [ ] Error handling
- [ ] User feedback

Your backend is ready to handle all these API calls! 🚀 