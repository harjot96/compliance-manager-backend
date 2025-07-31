# Compliance Management System - Backend

A Node.js/Express backend for compliance management with notification support for Twilio SMS and SendGrid email.

## Features

- **Company Management**: CRUD operations for companies
- **Compliance Deadlines**: Track and manage compliance deadlines
- **Notification System**: 
  - Twilio SMS notifications
  - SendGrid email notifications
  - Template-based messaging
- **Testing Endpoints**: Comprehensive testing API for notifications

## Notification Types Supported

### Twilio SMS
```json
{
  "type": "twilio",
  "config": {
    "accountSid": "your_twilio_account_sid",
    "authToken": "your_twilio_auth_token",
    "fromNumber": "+1234567890"
  }
}
```

### SendGrid Email
```json
{
  "type": "sendgrid",
  "config": {
    "apiKey": "your_sendgrid_api_key",
    "fromEmail": "your-verified-email@domain.com",
    "fromName": "Your Company Name"
  }
}
```

**Note**: You can also use `"type": "smtp"` for SendGrid configuration - both work!

## API Endpoints

### Notification Testing
- `POST /api/companies/test/sms` - Test SMS sending
- `POST /api/companies/test/email` - Test email sending
- `POST /api/companies/test/notification-settings` - Configure notification settings
- `GET /api/companies/test/status` - Get current configuration status

### Notification Templates
- `POST /api/companies/templates` - Create notification template
- `GET /api/companies/templates` - Get all templates
- `POST /api/companies/templates/:id/test` - Test template

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
# Database
DATABASE_URL=your_database_url

# JWT
JWT_SECRET=your_jwt_secret

# Admin Token
ADMIN_TOKEN=your_admin_token

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=your_twilio_phone_number

# SendGrid (optional)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_email
SENDGRID_FROM_NAME=your_company_name
```

3. Run the server:
```bash
npm run dev
```

## Testing

Use the provided test scripts:
- `test-notifications.js` - Simple notification testing
- `tests/notification-testing.js` - Comprehensive test suite

## Security

- All sensitive data is stored in environment variables
- JWT authentication for API endpoints
- Input validation for all requests
- Error handling for failed notifications

## License

MIT 