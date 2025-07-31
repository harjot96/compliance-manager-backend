# Notification Testing API Documentation

This document describes the API endpoints for testing Twilio SMS and SendGrid email functionality.

## Base URL
```
http://localhost:3333/api/companies
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Get Test Status and Configuration

**GET** `/test/status`

Returns the current status of notification configurations and available test data.

**Response:**
```json
{
  "success": true,
  "data": {
    "twilio": {
      "configured": true,
      "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "fromNumber": "+1234567890",
      "authTokenConfigured": true
    },
    "sendGrid": {
      "configured": false,
      "fromEmail": null,
      "fromName": null,
      "apiKeyConfigured": false
    },
    "companies": [
      {
        "id": 1,
        "companyName": "Test Company",
        "email": "test@example.com",
        "mobileNumber": "+61412345678",
        "hasEmail": true,
        "hasPhone": true
      }
    ],
    "templates": [
      {
        "id": 1,
        "name": "SMS Reminder Template",
        "type": "sms",
        "subject": "",
        "body": "Hello {companyName}, your {complianceType} is due in {daysLeft} days."
      },
      {
        "id": 2,
        "name": "Email Reminder Template",
        "type": "email",
        "subject": "Compliance Reminder: {complianceType}",
        "body": "Dear {companyName},\n\nThis is a reminder that your {complianceType} is due in {daysLeft} days."
      }
    ],
    "serverPort": 3333
  }
}
```

### 2. Test SMS via Twilio

**POST** `/test/sms`

Send a test SMS message to a company.

**Request Body:**
```json
{
  "companyId": 1,
  "templateId": 1,
  "testData": {
    "companyName": "Test Company",
    "complianceType": "BAS",
    "daysLeft": 7
  }
}
```

**Parameters:**
- `companyId` (required): ID of the company to send SMS to
- `templateId` (optional): ID of the template to use
- `testData` (optional): Data to replace placeholders in template

**Response:**
```json
{
  "success": true,
  "message": "SMS sent via Twilio",
  "data": {
    "sent": true,
    "channel": "sms",
    "to": "+61412345678",
    "preview": "Hello Test Company, your BAS is due in 7 days.",
    "twilioSid": "SM1234567890abcdef",
    "company": {
      "id": 1,
      "companyName": "Test Company",
      "mobileNumber": "+61412345678"
    }
  }
}
```

### 3. Test Email via SendGrid

**POST** `/test/email`

Send a test email message to a company.

**Request Body:**
```json
{
  "companyId": 1,
  "templateId": 2,
  "testData": {
    "companyName": "Test Company",
    "complianceType": "BAS",
    "daysLeft": 7
  }
}
```

**Parameters:**
- `companyId` (required): ID of the company to send email to
- `templateId` (optional): ID of the template to use
- `testData` (optional): Data to replace placeholders in template

**Response:**
```json
{
  "success": true,
  "message": "Email sent via SendGrid",
  "data": {
    "sent": true,
    "channel": "email",
    "to": "test@example.com",
    "preview": "Dear Test Company,\n\nThis is a reminder that your BAS is due in 7 days.",
    "sendGridMessageId": "message_id_123456",
    "company": {
      "id": 1,
      "companyName": "Test Company",
      "email": "test@example.com"
    }
  }
}
```

### 4. Configure Notification Settings

**POST** `/test/notification-settings`

Configure Twilio or SendGrid settings.

**Request Body for Twilio:**
```json
{
  "type": "twilio",
  "config": {
    "accountSid": "ACf159a3a887b5ac5160a74c3f47df722b",
    "authToken": "your_twilio_auth_token",
    "fromNumber": "+12316748806"
  }
}
```

**Request Body for SendGrid:**
```json
{
  "type": "smtp",
  "config": {
    "apiKey": "your_sendgrid_api_key",
    "fromEmail": "your_verified_email@yourdomain.com",
    "fromName": "Your Company Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Twilio settings configured successfully",
  "data": {
    "id": 1,
    "type": "twilio",
    "accountSid": "ACf159a3a887b5ac5160a74c3f47df722b",
    "authToken": "your_twilio_auth_token",
    "fromNumber": "+12316748806",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### Missing Configuration
```json
{
  "success": false,
  "message": "Twilio settings not configured by admin."
}
```

### Invalid Request
```json
{
  "success": false,
  "message": "companyId is required"
}
```

### Company Not Found
```json
{
  "success": false,
  "message": "Company not found"
}
```

### Missing Contact Information
```json
{
  "success": false,
  "message": "Company does not have a phone number."
}
```

### Service Error
```json
{
  "success": false,
  "message": "Twilio SMS send failed",
  "error": "detailed_error_message"
}
```

## Frontend Integration Examples

### JavaScript/React Example

```javascript
// Get test status
const getTestStatus = async () => {
  try {
    const response = await fetch('http://localhost:3333/api/companies/test/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Test Status:', data);
    return data;
  } catch (error) {
    console.error('Error getting test status:', error);
  }
};

// Test SMS
const testSMS = async (companyId, templateId, testData) => {
  try {
    const response = await fetch('http://localhost:3333/api/companies/test/sms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyId,
        templateId,
        testData
      })
    });
    const data = await response.json();
    console.log('SMS Test Result:', data);
    return data;
  } catch (error) {
    console.error('Error testing SMS:', error);
  }
};

// Test Email
const testEmail = async (companyId, templateId, testData) => {
  try {
    const response = await fetch('http://localhost:3333/api/companies/test/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyId,
        templateId,
        testData
      })
    });
    const data = await response.json();
    console.log('Email Test Result:', data);
    return data;
  } catch (error) {
    console.error('Error testing Email:', error);
  }
};

// Configure settings
const configureSettings = async (type, config) => {
  try {
    const response = await fetch('http://localhost:3333/api/companies/test/notification-settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        config
      })
    });
    const data = await response.json();
    console.log('Settings Configuration Result:', data);
    return data;
  } catch (error) {
    console.error('Error configuring settings:', error);
  }
};
```

### cURL Examples

```bash
# Get test status
curl -X GET http://localhost:3333/api/companies/test/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test SMS
curl -X POST http://localhost:3333/api/companies/test/sms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "templateId": 1,
    "testData": {
      "companyName": "Test Company",
      "complianceType": "BAS"
    }
  }'

# Test Email
curl -X POST http://localhost:3333/api/companies/test/email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "templateId": 2,
    "testData": {
      "companyName": "Test Company",
      "complianceType": "BAS"
    }
  }'

# Configure Twilio Settings
curl -X POST http://localhost:3333/api/companies/test/notification-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "twilio",
    "config": {
              "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "authToken": "your_auth_token",
        "fromNumber": "+1234567890"
    }
  }'

# Configure SendGrid Settings
curl -X POST http://localhost:3333/api/companies/test/notification-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "smtp",
    "config": {
      "apiKey": "your_api_key",
      "fromEmail": "your_email@domain.com",
      "fromName": "Your Company"
    }
  }'
```

## Testing Workflow

1. **Check Status**: Use `/test/status` to see current configuration and available companies/templates
2. **Configure Settings**: Use `/test/notification-settings` to set up Twilio or SendGrid
3. **Test SMS**: Use `/test/sms` to send test SMS messages
4. **Test Email**: Use `/test/email` to send test email messages
5. **Monitor Results**: Check the response data for success/failure and message IDs

## Template Placeholders

Templates support dynamic placeholders that get replaced with test data:

- `{companyName}` - Company name
- `{complianceType}` - Type of compliance (BAS, FBT, IAS, etc.)
- `{daysLeft}` - Days remaining until deadline
- `{deadlineDate}` - Actual deadline date
- `{companyEmail}` - Company email address
- `{companyPhone}` - Company phone number

## Security Notes

- All endpoints require authentication
- API keys and tokens are stored securely
- Test data should not contain sensitive information
- Rate limiting is applied to prevent abuse
- Logs are maintained for debugging purposes 