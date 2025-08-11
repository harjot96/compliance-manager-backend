# Xero Developer Console Setup for Localhost Development

## 🚨 Current Issue: Invalid Client Error

Your OAuth flow is working perfectly, but Xero is rejecting the client credentials with `invalid_client` error. This means the Xero Developer Console settings need to be updated.

## 🔧 Step-by-Step Fix

### 1. Access Xero Developer Console
- Go to: https://developer.xero.com/app/manage
- Sign in with your Xero account

### 2. Find Your App
- Look for the app with Client ID: `E57D7FD5C2C34B0FAD6A27C37D234008`
- Click on the app to edit its settings

### 3. Update Redirect URIs
**Add this redirect URI to your app:**
```
http://localhost:3001/redirecturl
```

**Steps:**
1. In the app settings, find "Redirect URIs" section
2. Click "Add Redirect URI"
3. Enter: `http://localhost:3001/redirecturl`
4. Save the changes

### 4. Verify App Mode
- Make sure your app is in **"Development"** mode (not Production)
- Development apps allow localhost redirect URIs

### 5. Regenerate Client Secret (if needed)
If the client secret doesn't match:
1. Go to "Credentials" section
2. Click "Regenerate Client Secret"
3. Copy the new client secret
4. Update your database with the new secret

### 6. Update Database (if client secret changed)
If you regenerated the client secret, update your database:

```sql
UPDATE xero_settings 
SET client_secret = 'NEW_CLIENT_SECRET_HERE', 
    updated_at = CURRENT_TIMESTAMP 
WHERE company_id = 7;
```

## 🔍 Verification Checklist

- [ ] App Client ID matches: `E57D7FD5C2C34B0FAD6A27C37D234008`
- [ ] Client Secret is correct (ends with: `3f6b`)
- [ ] Redirect URI added: `http://localhost:3001/redirecturl`
- [ ] App is in Development mode
- [ ] App has required scopes enabled

## 🧪 Test the Fix

After updating the Xero Developer Console:

1. **Restart your backend server** (if needed)
2. **Test OAuth flow again** from your frontend
3. **Check the logs** for successful token exchange

## 📋 Expected Success Flow

1. ✅ Frontend redirects to Xero login
2. ✅ User authorizes the app
3. ✅ Xero redirects to: `http://localhost:3001/redirecturl?code=REAL_CODE&state=STATE`
4. ✅ Frontend forwards to backend: `http://localhost:3333/api/xero/callback?code=REAL_CODE&state=STATE`
5. ✅ Backend exchanges code for tokens successfully
6. ✅ Backend returns JSON response with tokens and tenants

## 🚀 Your OAuth Flow is Almost Complete!

The good news is:
- ✅ OAuth URL generation is working
- ✅ State management is working
- ✅ Callback handling is working
- ✅ You're getting real authorization codes from Xero
- ❌ Only the token exchange needs fixing (client credentials issue)

Once you update the Xero Developer Console settings, your OAuth integration will be fully functional!

## 🔗 Quick Links

- **Xero Developer Console**: https://developer.xero.com/app/manage
- **Xero OAuth Documentation**: https://developer.xero.com/documentation/oauth2/auth-flow
- **Your App Client ID**: `E57D7FD5C2C34B0FAD6A27C37D234008`
- **Your Redirect URI**: `http://localhost:3001/redirecturl`
