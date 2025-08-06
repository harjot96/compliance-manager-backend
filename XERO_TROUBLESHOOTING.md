# Xero Authorization Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to start Xero authorization" Error

**Symptoms:**
- Frontend shows "Failed to start Xero authorization"
- OAuth2.0 flow doesn't open
- No redirect to Xero login page

**Possible Causes and Solutions:**

#### A. Missing Xero Settings
**Error Code:** `XERO_SETTINGS_MISSING`

**Solution:**
1. Configure Xero settings first:
   ```javascript
   // Frontend should call this endpoint
   POST /api/xero/settings
   {
     "clientId": "your-xero-client-id",
     "clientSecret": "your-xero-client-secret", 
     "redirectUri": "https://your-domain.com/api/xero/callback"
   }
   ```

2. Check if settings exist:
   ```javascript
   GET /api/xero/settings
   ```

#### B. Authentication Issues
**Error Code:** `401 Unauthorized`

**Solution:**
1. Ensure user is logged in and has valid JWT token
2. Include Authorization header:
   ```javascript
   headers: {
     'Authorization': 'Bearer your-jwt-token'
   }
   ```

#### C. Super Admin Restriction
**Error Code:** `SUPER_ADMIN_RESTRICTED`

**Solution:**
- Only regular companies can setup Xero integration
- Super admins cannot connect Xero accounts
- Use a regular company account instead

#### D. Database Issues
**Error Code:** `500 Internal Server Error`

**Solution:**
1. Ensure `xero_oauth_states` table exists:
   ```bash
   npm run migrate
   ```

2. Check database connection

### 2. Frontend Implementation Guide

#### Step-by-Step Flow:

```javascript
// 1. User Login
const loginResponse = await axios.post('/api/companies/login', {
  email: 'user@example.com',
  password: 'password'
});
const token = loginResponse.data.data.token;

// 2. Check Xero Settings
try {
  const settingsResponse = await axios.get('/api/xero/settings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Settings exist, proceed to authorization
} catch (error) {
  if (error.response?.data?.errorCode === 'XERO_SETTINGS_MISSING') {
    // Show settings configuration form
    showXeroSettingsForm();
  }
}

// 3. Configure Xero Settings (if needed)
const configResponse = await axios.post('/api/xero/settings', {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://your-domain.com/api/xero/callback'
}, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 4. Start Xero Authorization
const authResponse = await axios.get('/api/xero/login', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 5. Redirect to Xero
if (authResponse.data.success) {
  const authUrl = authResponse.data.data.authUrl;
  // Option 1: Redirect in same window
  window.location.href = authUrl;
  
  // Option 2: Open in new window
  window.open(authUrl, '_blank', 'width=800,height=600');
  
  // Option 3: Use popup
  const popup = window.open(authUrl, 'xero-auth', 'width=800,height=600');
}
```

### 3. Error Handling

#### Frontend Error Handling:

```javascript
try {
  const response = await axios.get('/api/xero/login', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.data.success) {
    // Handle success
    redirectToXero(response.data.data.authUrl);
  }
} catch (error) {
  const errorData = error.response?.data;
  
  switch (errorData?.errorCode) {
    case 'XERO_SETTINGS_MISSING':
      showXeroSettingsForm();
      break;
      
    case 'SUPER_ADMIN_RESTRICTED':
      showError('Only regular companies can connect Xero accounts');
      break;
      
    case '401':
      redirectToLogin();
      break;
      
    default:
      showError(errorData?.message || 'Failed to start Xero authorization');
  }
}
```

### 4. Testing the Flow

#### Backend Testing:
```bash
# Test the complete flow
node debug-xero-auth.js
```

#### Frontend Testing:
1. Open browser developer tools
2. Check Network tab for API calls
3. Check Console for errors
4. Verify JWT token is valid
5. Test with real Xero credentials

### 5. Common Frontend Mistakes

1. **Missing Authorization Header**
   ```javascript
   // ❌ Wrong
   axios.get('/api/xero/login')
   
   // ✅ Correct
   axios.get('/api/xero/login', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

2. **Not Handling Errors**
   ```javascript
   // ❌ Wrong
   const response = await axios.get('/api/xero/login');
   
   // ✅ Correct
   try {
     const response = await axios.get('/api/xero/login');
   } catch (error) {
     handleError(error);
   }
   ```

3. **Wrong Redirect URI**
   ```javascript
   // ❌ Wrong - localhost won't work in production
   redirectUri: 'http://localhost:3000/api/xero/callback'
   
   // ✅ Correct
   redirectUri: 'https://your-production-domain.com/api/xero/callback'
   ```

### 6. Production Checklist

- [ ] Use HTTPS URLs for redirect URIs
- [ ] Configure real Xero app credentials
- [ ] Set up proper CORS headers
- [ ] Handle all error cases
- [ ] Test with real Xero account
- [ ] Monitor server logs for errors

### 7. Debug Commands

```bash
# Check server health
curl http://localhost:3333/health

# Test Xero callback
curl -X POST http://localhost:3333/api/xero/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"test","state":"test"}'

# Check database tables
npm run migrate
```

### 8. Getting Help

If you're still experiencing issues:

1. Check server logs for detailed error messages
2. Verify all API endpoints are working
3. Test with the provided debug scripts
4. Ensure database migrations have run
5. Check Xero app configuration in Xero Developer portal 