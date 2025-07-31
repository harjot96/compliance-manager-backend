# Notification Testing Guide

This guide explains how to test both Twilio SMS and SendGrid email functionality in the compliance management system.

## Overview

The system now supports both SMS (via Twilio) and email (via SendGrid) notifications. Testing functionality has been implemented for both services.

## Prerequisites

### 1. Environment Variables

Set up the following environment variables in your `.env` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
SENDGRID_FROM_NAME=your_sender_name

# API Configuration
API_BASE_URL=http://localhost:3000
ADMIN_TOKEN=your_admin_jwt_token
```

### 2. Dependencies

The following packages are required:

```bash
npm install @sendgrid/mail
npm install axios --save-dev  # For advanced testing
```

## Testing Methods

### Method 1: Using the Simple Test Script

The `test-notifications.js` script provides a simple way to test both services:

```bash
# Test SMS functionality only
node test-notifications.js sms

# Test email functionality only
node test-notifications.js email

# Create test templates
node test-notifications.js templates

# Configure notification settings
node test-notifications.js settings

# Run all tests
node test-notifications.js all

# Show help
node test-notifications.js help
```

### Method 2: Using the Advanced Test Suite

The `tests/notification-testing.js` file provides more comprehensive testing with axios:

```bash
# Install axios if not already installed
npm install axios

# Run the advanced test suite
node tests/notification-testing.js
```

### Method 3: Direct API Testing

You can test the endpoints directly using curl or any HTTP client:

#### Test SMS via Twilio

```bash
curl -X POST http://localhost:3000/api/companies/templates/1/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "companyId": 1,
    "channel": "sms",
    "testData": {
      "companyName": "Test Company",
      "complianceType": "BAS"
    }
  }'
```

#### Test Email via SendGrid

```bash
curl -X POST http://localhost:3000/api/companies/templates/1/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "companyId": 1,
    "channel": "email",
    "testData": {
      "companyName": "Test Company",
      "complianceType": "BAS"
    }
  }'
```

## API Endpoints

### Template Testing Endpoint

**POST** `/api/companies/templates/:id/test`

**Request Body:**
```json
{
  "companyId": 1,
  "channel": "sms|email",
  "testData": {
    "companyName": "Test Company",
    "complianceType": "BAS",
    "daysLeft": 7
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent via Twilio" | "Email sent via SendGrid",
  "data": {
    "sent": true,
    "channel": "sms" | "email",
    "to": "phone_number" | "email_address",
    "preview": "message_content",
    "twilioSid": "SM1234567890abcdef", // For SMS
    "sendGridMessageId": "message_id" // For email
  }
}
```

### Notification Settings Endpoint

**POST** `/api/companies/notification-settings`

**Request Body for Twilio:**
```json
{
  "type": "twilio",
  "config": {
    "accountSid": "your_account_sid",
    "authToken": "your_auth_token",
    "fromNumber": "your_twilio_number"
  }
}
```

**Request Body for SendGrid:**
```json
{
  "type": "smtp",
  "config": {
    "apiKey": "your_sendgrid_api_key",
    "fromEmail": "your_verified_email",
    "fromName": "your_sender_name"
  }
}
```

## Template Creation

### SMS Template

```json
{
  "type": "sms",
  "name": "SMS Reminder Template",
  "subject": "",
  "body": "Hello {companyName}, your {complianceType} is due in {daysLeft} days.",
  "notificationTypes": ["BAS", "FBT"],
  "smsDays": [1, 7, 14],
  "emailDays": []
}
```

### Email Template

```json
{
  "type": "email",
  "name": "Email Reminder Template",
  "subject": "Compliance Reminder: {complianceType}",
  "body": "Dear {companyName},\n\nThis is a reminder that your {complianceType} is due in {daysLeft} days.\n\nPlease ensure all required documentation is prepared and submitted on time.\n\nBest regards,\nCompliance Management Team",
  "notificationTypes": ["BAS", "FBT", "IAS"],
  "smsDays": [],
  "emailDays": [1, 3, 7, 14]
}
```

## Error Handling

### Common Error Responses

**Missing Configuration:**
```json
{
  "success": false,
  "message": "Twilio settings not configured by admin." | "SendGrid settings not configured by admin."
}
```

**Invalid Channel:**
```json
{
  "success": false,
  "message": "companyId and valid channel (sms/email) are required"
}
```

**Missing Contact Information:**
```json
{
  "success": false,
  "message": "Company does not have a phone number." | "Company does not have an email address."
}
```

**Service Errors:**
```json
{
  "success": false,
  "message": "Twilio SMS send failed" | "SendGrid email send failed",
  "error": "detailed_error_message"
}
```

## Testing Checklist

### Before Testing

- [ ] Environment variables are set correctly
- [ ] SendGrid API key is valid and has proper permissions
- [ ] Twilio credentials are valid and account has credits
- [ ] SendGrid sender email is verified
- [ ] Company has valid email address (for email testing)
- [ ] Company has valid phone number (for SMS testing)
- [ ] Template exists and has proper content
- [ ] Admin token is valid and has proper permissions

### Test Scenarios

#### SMS Testing
- [ ] Test with valid phone number
- [ ] Test with invalid phone number
- [ ] Test with missing Twilio configuration
- [ ] Test with template placeholders
- [ ] Verify SMS is received on target device

#### Email Testing
- [ ] Test with valid email address
- [ ] Test with invalid email address
- [ ] Test with missing SendGrid configuration
- [ ] Test with template placeholders
- [ ] Verify email is received in inbox
- [ ] Check spam folder if email not received

#### Template Testing
- [ ] Test SMS template creation
- [ ] Test email template creation
- [ ] Test template updates
- [ ] Test template deletion
- [ ] Test template retrieval

## Troubleshooting

### SMS Not Sending
1. Check Twilio credentials in environment variables
2. Verify Twilio account has credits
3. Ensure phone number is in correct format (+1234567890)
4. Check Twilio logs for detailed error messages

### Email Not Sending
1. Check SendGrid API key is valid
2. Verify sender email is verified in SendGrid
3. Check SendGrid activity logs
4. Ensure recipient email is valid
5. Check spam folder

### Configuration Issues
1. Verify notification settings are saved in database
2. Check environment variables are loaded correctly
3. Ensure admin token has proper permissions
4. Verify API endpoints are accessible

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use `.env` files for local development
3. **Token Security**: Admin tokens should be rotated regularly
4. **Rate Limiting**: Be aware of Twilio and SendGrid rate limits
5. **Data Privacy**: Ensure test data doesn't contain sensitive information

## Monitoring

### Twilio Monitoring
- Monitor SMS delivery status
- Track API usage and costs
- Set up alerts for failed deliveries

### SendGrid Monitoring
- Monitor email delivery rates
- Track bounce and spam reports
- Set up alerts for delivery issues

## Support

For issues with:
- **Twilio**: Check [Twilio Support](https://support.twilio.com/)
- **SendGrid**: Check [SendGrid Support](https://support.sendgrid.com/)
- **Application**: Check application logs and error messages 