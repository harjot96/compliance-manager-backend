# Xero Environment Variables Setup

## 🔧 **Add These to Your .env File**

```bash
# Xero OAuth2 Configuration
XERO_CLIENT_ID=your-xero-client-id-here
XERO_CLIENT_SECRET=your-xero-client-secret-here
XERO_REDIRECT_URI=https://compliance-manager-backend.onrender.com/api/xero/callback
XERO_WEBHOOK_SIGNING_KEY_URL=https://your-domain.com/webhook-signing-key
```

## 📋 **Where to Get These Values**

### **1. XERO_CLIENT_ID & XERO_CLIENT_SECRET**
1. Go to [Xero Developer Portal](https://developer.xero.com/)
2. Create a new app or use existing app
3. Copy the **Client ID** and **Client Secret**

### **2. XERO_REDIRECT_URI**
- **For Production**: `https://compliance-manager-backend.onrender.com/api/xero/callback`
- **For Development**: `http://localhost:5000/api/xero/callback`

### **3. XERO_WEBHOOK_SIGNING_KEY_URL**
1. Create a secure endpoint that returns your webhook signing key
2. The URL should return the key in JSON format: `{"key": "your-signing-key"}`
3. Example: `https://your-domain.com/webhook-signing-key`

## ✅ **Complete .env Example**

```bash
# Database
DATABASE_URL=your-database-url

# JWT
JWT_SECRET=your-jwt-secret

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Xero OAuth2 Configuration
XERO_CLIENT_ID=your-xero-client-id-here
XERO_CLIENT_SECRET=your-xero-client-secret-here
XERO_REDIRECT_URI=https://compliance-manager-backend.onrender.com/api/xero/callback
XERO_WEBHOOK_SIGNING_KEY_URL=https://your-domain.com/webhook-signing-key
```

## 🚀 **After Adding to .env**

1. **Restart your server** to load the new environment variables
2. **Test the Xero integration** using the endpoints
3. **The Xero functionality will be fully available**

## 📡 **Available Xero Endpoints**

Once configured, these endpoints will work:

- `GET /api/xero/login` - Start OAuth2 flow
- `GET /api/xero/callback` - Handle OAuth2 callback
- `GET /api/xero/connections` - Get Xero connections
- `GET /api/xero/:connectionId/invoices` - Get invoices
- `GET /api/xero/:connectionId/contacts` - Get contacts
- `GET /api/xero/:connectionId/bank-transactions` - Get bank transactions
- `POST /api/xero/webhook` - Handle webhooks

## ✅ **Verification**

After adding the environment variables, test with:

```bash
# Test health endpoint
curl https://compliance-manager-backend.onrender.com/health

# Test Xero login (will redirect to Xero)
curl https://compliance-manager-backend.onrender.com/api/xero/login
``` 