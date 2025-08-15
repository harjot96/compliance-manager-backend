# 🔍 OpenAI API 401 Error Troubleshooting Guide

## ❌ **The Problem:**
You're getting a 401 Unauthorized error when calling the OpenAI API:
```
Request URL: https://api.openai.com/v1/chat/completions
Request Method: POST
Status Code: 401 Unauthorized
```

## 🔧 **Step-by-Step Troubleshooting:**

### **1. Check Your API Key**
```bash
# Test your API key directly
node test-openai-api-direct.js YOUR_API_KEY
```

### **2. Verify API Key Format**
- ✅ Must start with `sk-`
- ✅ Should be around 50+ characters long
- ✅ No spaces or special characters

### **3. Check API Key Status**
1. Go to: **https://platform.openai.com/account/api-keys**
2. Verify your key is listed and active
3. Check if it has been revoked or deleted

### **4. Verify Account Status**
1. Go to: **https://platform.openai.com/account**
2. Ensure your account is active
3. Check if billing is set up

### **5. Check Billing**
1. Go to: **https://platform.openai.com/account/billing**
2. Add a payment method if needed
3. Choose a plan (Pay-as-you-go is fine)

### **6. Generate New API Key**
1. Go to: **https://platform.openai.com/account/api-keys**
2. Click "Create new secret key"
3. Give it a name (e.g., "Compliance Manager")
4. Copy the new key

### **7. Test the New Key**
```bash
# Test the new API key
node test-openai-api-direct.js sk-your-new-api-key-here
```

### **8. Save to Backend**
```bash
# Get your JWT token first, then save the new key
node test-any-user-access.js YOUR_JWT_TOKEN
```

## 🧪 **Testing Scripts:**

### **Test API Key Directly:**
```bash
node test-openai-api-direct.js YOUR_API_KEY
```

### **Test Backend API Key:**
```bash
node test-get-api-key.js YOUR_JWT_TOKEN
```

### **Test Any User Access:**
```bash
node test-any-user-access.js YOUR_JWT_TOKEN
```

## 📱 **Frontend Usage:**

### **Get API Key from Backend:**
```javascript
const getApiKey = async () => {
  const response = await fetch('http://localhost:3333/api/openai-admin/api-key', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.data.apiKey; // Use this immediately
};
```

### **Use API Key for OpenAI Call:**
```javascript
const apiKey = await getApiKey();
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

## 🔒 **Security Best Practices:**

1. **Never store API keys** in frontend code
2. **Use keys immediately** and discard them
3. **Rotate keys regularly** for security
4. **Monitor usage** to prevent abuse

## 🎯 **Common Solutions:**

| Problem | Solution |
|---------|----------|
| Invalid API key | Generate new key from OpenAI |
| Revoked key | Create new key and update backend |
| No billing | Add payment method to OpenAI account |
| Rate limited | Upgrade plan or wait for reset |
| Wrong key format | Ensure key starts with `sk-` |

## 📞 **Need Help?**

1. **Check OpenAI Status**: https://status.openai.com/
2. **OpenAI Documentation**: https://platform.openai.com/docs/
3. **OpenAI Support**: https://help.openai.com/

**Follow these steps to resolve your 401 error!** 🔧
