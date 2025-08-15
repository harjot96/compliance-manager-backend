# 📊 Xero API 401 Error Troubleshooting Guide

## ❌ **The Problem:**
You're getting a 401 Unauthorized error when calling Xero reports:
```
Request URL: http://localhost:3333/api/xero/reports?reportID=BalanceSheet&tenantId=7a513ee2-adb4-44be-b7ae-0f3ee60e7efc
Status Code: 401 Unauthorized
Message: "Failed to get report"
```

## 🔧 **Step-by-Step Troubleshooting:**

### **1. Test Xero Connection Status**
```bash
# Test with your JWT token
node test-xero-reports.js YOUR_JWT_TOKEN
```

### **2. Check Xero Settings**
1. Verify Xero is connected for your company
2. Check if access tokens are valid
3. Ensure tokens haven't expired

### **3. Verify Tenant ID**
- ✅ **Tenant ID**: `7a513ee2-adb4-44be-b7ae-0f3ee60e7efc`
- ✅ **Report ID**: `BalanceSheet`
- ✅ **Endpoint**: `/api/xero/reports`

### **4. Check Xero Authentication**
1. Go to your Xero account
2. Verify the organization is still accessible
3. Check if permissions have changed

### **5. Re-authenticate with Xero**
If tokens have expired, you'll need to re-authenticate:
1. Go to your application's Xero connection page
2. Click "Connect to Xero" or "Reconnect"
3. Follow the OAuth flow again

## 🧪 **Testing Scripts:**

### **Test Xero Reports:**
```bash
node test-xero-reports.js YOUR_JWT_TOKEN
```

### **Test Connection Status:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3333/api/xero/connection-status
```

### **Test Xero Settings:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3333/api/xero/settings
```

## 📱 **Frontend Usage:**

### **Get Xero Reports:**
```javascript
const getXeroReports = async (reportID, tenantId) => {
  const response = await fetch(`http://localhost:3333/api/xero/reports?reportID=${reportID}&tenantId=${tenantId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error(`Xero reports failed: ${response.status}`);
  }
  
  return await response.json();
};

// Usage
const reports = await getXeroReports('BalanceSheet', '7a513ee2-adb4-44be-b7ae-0f3ee60e7efc');
```

### **Check Connection Status:**
```javascript
const checkXeroConnection = async () => {
  const response = await fetch('http://localhost:3333/api/xero/connection-status', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
};
```

## 🔒 **Common Causes & Solutions:**

| Problem | Solution |
|---------|----------|
| **Expired tokens** | Re-authenticate with Xero |
| **Invalid tenant ID** | Get correct tenant ID from Xero |
| **Missing permissions** | Check Xero app permissions |
| **Organization access lost** | Re-connect to Xero organization |
| **Token revoked** | Generate new tokens via OAuth |

## 🎯 **Quick Fix Steps:**

1. **Test connection status** to see if Xero is connected
2. **Check if tokens are expired** in the response
3. **Re-authenticate** if tokens are invalid
4. **Verify tenant ID** is correct
5. **Test the reports endpoint** again

## 📊 **Expected Response:**

### **Success Response:**
```json
{
  "success": true,
  "message": "Report retrieved successfully",
  "data": {
    "Reports": [
      {
        "ReportID": "BalanceSheet",
        "ReportName": "Balance Sheet",
        "ReportType": "BalanceSheet",
        "ReportTitles": ["Balance Sheet"],
        "ReportDate": "2024-01-15",
        "UpdatedDateUTC": "2024-01-15T10:30:00Z",
        "Rows": [...]
      }
    ]
  }
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Failed to get report",
  "error": "Request failed with status code 401"
}
```

## 🔧 **Fixed Issues:**

✅ **Reports endpoint now supports tenantId parameter**
✅ **Uses same tenant selection logic as other endpoints**
✅ **Better error handling for authentication issues**

## 📞 **Need Help?**

1. **Check Xero Status**: https://status.xero.com/
2. **Xero API Documentation**: https://developer.xero.com/documentation/
3. **Xero Support**: https://www.xero.com/support/

**Follow these steps to resolve your Xero 401 error!** 🔧
