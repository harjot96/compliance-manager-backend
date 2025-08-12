# Redirect URL Fix - No Localhost in Production

## Problem
The live server was returning localhost URLs in redirects:
```
http://localhost:3001/redirecturl?code=0fZ_cCUUqjF79iTg5qBp4Hna7dDIKc_jNWxJSwJrv_s&scope=...
```

This happens because:
1. Redirect URIs were stored in the database with localhost URLs from development
2. The Xero controller was using stored redirect URIs instead of environment-based ones
3. No validation was in place to prevent localhost URLs in production

## Solution Implemented

### 1. Environment-Based Redirect URIs
Updated `src/config/environment.js` to:
- Use environment-based redirect URIs instead of stored ones
- Validate that production URLs don't contain localhost
- Provide fallback production URLs if localhost is detected

### 2. Xero Controller Updates
Modified `src/controllers/xeroController.js` to:
- Use `getFrontendRedirectUrl()` instead of stored `xeroSettings.redirect_uri`
- Add validation to prevent localhost URLs in production
- Log redirect URIs for debugging

### 3. Server Validation
Updated `src/server.js` to:
- Validate production URLs on startup
- Exit with error if localhost URLs are found in production
- Enhanced CORS to block localhost origins in production

### 4. Database Fix Script
Created `fix-redirect-uris.js` to:
- Update existing redirect URIs in database
- Ensure all companies use environment-appropriate URLs
- Validate the fix was successful

## Files Modified

### Core Changes
- `src/config/environment.js` - Environment validation and URL generation
- `src/controllers/xeroController.js` - Use environment-based redirect URIs
- `src/server.js` - Startup validation and CORS restrictions
- `src/routes/xeroRoutes.js` - Added new endpoint for updating redirect URIs

### New Files
- `validate-redirect-urls.js` - Validation script
- `fix-redirect-uris.js` - Database fix script
- `REDIRECT_URL_FIX.md` - This documentation

## How to Fix the Issue

### Option 1: Run the Fix Script (Recommended)
```bash
# Fix all redirect URIs in the database
node fix-redirect-uris.js

# Or force update in development
node fix-redirect-uris.js --force
```

### Option 2: Use the API Endpoint
```bash
# Call the admin endpoint to update all redirect URIs
curl -X POST http://your-api-url/api/xero/settings/update-redirect-uris \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Option 3: Manual Database Update
```sql
-- Update all redirect URIs to production URL
UPDATE xero_settings 
SET redirect_uri = 'https://compliance-manager-frontend.onrender.com/redirecturl',
    updated_at = CURRENT_TIMESTAMP
WHERE redirect_uri LIKE '%localhost%';
```

## Validation

### Check Current Configuration
```bash
# Validate redirect URLs
node validate-redirect-urls.js

# Test with production environment
NODE_ENV=production node validate-redirect-urls.js
```

### Expected Output in Production
```
✅ SUCCESS: Production URLs are properly configured
   No localhost URLs found in production environment

🌐 Current URL Configuration:
   Frontend URL: https://compliance-manager-frontend.onrender.com
   Callback URL: https://compliance-manager-frontend.onrender.com/xero-callback
   Redirect URL: https://compliance-manager-frontend.onrender.com/redirecturl
```

## Environment Variables

### Required for Production
```bash
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com  # Optional, has fallback
```

### Development (Default)
```bash
NODE_ENV=development  # or not set
# Uses localhost:3001 by default
```

## Xero Developer Portal Configuration

### Production URLs
Make sure your Xero app has these redirect URIs:
- `https://compliance-manager-frontend.onrender.com/redirecturl`
- `https://compliance-manager-frontend.onrender.com/xero-callback`

### Remove Localhost URLs
Remove any localhost URLs from your Xero app configuration:
- ❌ `http://localhost:3001/redirecturl`
- ❌ `http://localhost:3001/xero-callback`

## Testing

### Development Testing
```bash
# Start server in development mode
NODE_ENV=development npm start

# Test OAuth flow
# Should redirect to localhost URLs (expected)
```

### Production Testing
```bash
# Start server in production mode
NODE_ENV=production npm start

# Test OAuth flow
# Should redirect to production URLs only
```

## Error Handling

### Production Validation Errors
If you see this error:
```
❌ ERROR: Production callback URL contains localhost. This is not allowed.
```

Solutions:
1. Set `NODE_ENV=production`
2. Set `FRONTEND_URL` to your production domain
3. Run the fix script to update database
4. Update Xero Developer Portal configuration

### CORS Errors
If you see CORS errors in production:
```
❌ CORS blocked localhost origin in production
```

This is expected and indicates the fix is working. Ensure your frontend is using production URLs.

## Monitoring

### Logs to Watch
- `🔍 Using redirect URI:` - Shows which redirect URI is being used
- `🔍 Environment:` - Shows current environment
- `✅ Production URLs validated successfully` - Confirms validation passed

### Health Checks
The server will exit with error code 1 if localhost URLs are detected in production, preventing unsafe deployment.

## Rollback

If you need to rollback:
1. Revert the changes to `src/controllers/xeroController.js`
2. Remove the validation from `src/server.js`
3. Update database redirect URIs back to localhost if needed

## Summary

This fix ensures that:
- ✅ No localhost URLs are used in production
- ✅ Environment-based redirect URIs are always used
- ✅ Server validates URLs on startup
- ✅ CORS blocks localhost origins in production
- ✅ Database can be updated to match environment
- ✅ Comprehensive validation and testing tools

The issue should be resolved after deploying these changes and running the fix script.
