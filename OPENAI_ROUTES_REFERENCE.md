# OpenAI API Routes Reference

## ✅ **Correct URLs**

### **Base URL**
```
https://compliance-manager-backend.onrender.com
```

### **OpenAI Admin Routes**
```
GET  /api/openai-admin/settings          # Get OpenAI settings
POST /api/openai-admin/settings          # Save OpenAI settings
PUT  /api/openai-admin/settings/:id      # Update OpenAI settings
DELETE /api/openai-admin/settings/:id    # Delete OpenAI settings
POST /api/openai-admin/test-api-key      # Test OpenAI API key
```

### **Main OpenAI Routes**
```
GET  /api/openai/settings                # Get OpenAI settings
POST /api/openai/settings                # Save OpenAI settings
PUT  /api/openai/settings/:id            # Update OpenAI settings
DELETE /api/openai/settings/:id          # Delete OpenAI settings
POST /api/openai/test-api-key            # Test OpenAI API key
POST /api/openai/chat                    # Chat completion
POST /api/openai/compliance-text         # Generate compliance text
POST /api/openai/generate-template       # Generate templates
POST /api/openai/analyze-content         # Analyze content
```

## ❌ **Common Mistakes**

### **Wrong URLs (Don't Use These)**
```
❌ https://compliance-manager-backend.onrender.com/api/api/openai-admin/settings
❌ https://compliance-manager-backend.onrender.com/api/openai-admin/settings
❌ https://compliance-manager-backend.onrender.com/openai-admin/settings
```

### **Correct URLs (Use These)**
```
✅ https://compliance-manager-backend.onrender.com/api/openai-admin/settings
✅ https://compliance-manager-backend.onrender.com/api/openai/settings
```

## 🧪 **Test Commands**

### **Test Health Endpoint**
```bash
curl https://compliance-manager-backend.onrender.com/health
```

### **Test OpenAI Admin Settings**
```bash
curl https://compliance-manager-backend.onrender.com/api/openai-admin/settings
```

### **Test OpenAI Settings**
```bash
curl https://compliance-manager-backend.onrender.com/api/openai/settings
```

### **Test OpenAI API Key**
```bash
curl -X POST https://compliance-manager-backend.onrender.com/api/openai-admin/test-api-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-test1234567890abcdefghijklmnopqrstuvwxyz"}'
```

## 📋 **Available Endpoints**

### **Settings Management**
- `GET /api/openai-admin/settings` - Get OpenAI settings (Admin)
- `POST /api/openai-admin/settings` - Save OpenAI settings (Admin)
- `PUT /api/openai-admin/settings/:id` - Update OpenAI settings (Admin)
- `DELETE /api/openai-admin/settings/:id` - Delete OpenAI settings (Admin)
- `POST /api/openai-admin/test-api-key` - Test OpenAI API key (Admin)

### **Main OpenAI API**
- `GET /api/openai/settings` - Get OpenAI settings
- `POST /api/openai/settings` - Save OpenAI settings
- `PUT /api/openai/settings/:id` - Update OpenAI settings
- `DELETE /api/openai/settings/:id` - Delete OpenAI settings
- `POST /api/openai/test-api-key` - Test OpenAI API key
- `POST /api/openai/chat` - Chat completion
- `POST /api/openai/compliance-text` - Generate compliance text
- `POST /api/openai/generate-template` - Generate templates
- `POST /api/openai/analyze-content` - Analyze content

## 🔧 **Authentication**

All endpoints require JWT authentication:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  https://compliance-manager-backend.onrender.com/api/openai-admin/settings
```

## ✅ **Verification**

The routes are working correctly as verified by testing:
- ✅ Health endpoint: Working
- ✅ OpenAI admin settings: Working
- ✅ OpenAI admin test-api-key: Working
- ✅ Main OpenAI settings: Working

## 🎯 **Summary**

**Correct Base URL:** `https://compliance-manager-backend.onrender.com`  
**Correct Path:** `/api/openai-admin/settings`  
**Full URL:** `https://compliance-manager-backend.onrender.com/api/openai-admin/settings`

The routes are properly configured and working. Make sure to use the correct URL without any duplicate "api" segments. 