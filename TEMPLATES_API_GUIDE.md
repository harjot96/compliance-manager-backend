# Templates API Guide

This guide documents all the template-related API endpoints available in the compliance management system.

## Base URL
```
http://localhost:3333/api
```

## Overview

The system provides two types of templates:

1. **Notification Templates** - Stored templates for email and SMS notifications
2. **AI-Generated Templates** - On-demand templates generated using OpenAI

## API Endpoints

### 1. Comprehensive Templates API

#### Get All Templates
```http
GET /api/templates
```

**Response:**
```json
{
  "success": true,
  "message": "All templates retrieved successfully",
  "data": {
    "notificationTemplates": [...],
    "aiTemplateExamples": [...],
    "summary": {
      "totalNotificationTemplates": 9,
      "totalAiExamples": 2,
      "emailTemplates": 3,
      "smsTemplates": 6
    }
  }
}
```

#### Get Templates by Type
```http
GET /api/templates/type/{type}
```

**Types:**
- `email` - Email notification templates
- `sms` - SMS notification templates  
- `ai-generated` - AI template generation examples

**Example:**
```bash
curl -X GET http://localhost:3333/api/templates/type/email
```

#### Get Template Statistics
```http
GET /api/templates/stats
```

**Response:**
```json
{
  "success": true,
  "message": "Template statistics retrieved successfully",
  "data": {
    "totalTemplates": 9,
    "emailTemplates": 3,
    "smsTemplates": 6,
    "templatesByComplianceType": {
      "BAS": 9
    },
    "recentTemplates": [...]
  }
}
```

### 2. Notification Templates API

#### Get All Notification Templates
```http
GET /api/templates/notification
```

#### Get Notification Template by ID
```http
GET /api/templates/notification/{id}
```

#### Create Notification Template
```http
POST /api/templates/notification
```

**Request Body:**
```json
{
  "type": "email|sms",
  "name": "Template Name",
  "subject": "Email Subject (required for email)",
  "body": "Template body content",
  "notificationTypes": ["BAS", "FBT"],
  "smsDays": [1, 7, 14],
  "emailDays": [1, 3, 7, 14]
}
```

#### Update Notification Template
```http
PUT /api/templates/notification/{id}
```

#### Delete Notification Template
```http
DELETE /api/templates/notification/{id}
```

#### Test Notification Template
```http
POST /api/templates/notification/{id}/test
```

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

### 3. AI Template Generation API

#### Generate Email/SMS Template
```http
POST /api/templates/generate
```

**Request Body:**
```json
{
  "templateType": "email|sms",
  "complianceType": "BAS|FBT|IAS|Tax Filing",
  "tone": "professional|urgent|friendly",
  "customPrompt": "Optional custom prompt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "EMAIL template generated successfully",
  "data": {
    "template": "Generated template content",
    "templateType": "email",
    "complianceType": "FBT",
    "tone": "professional",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 86,
      "completion_tokens": 160,
      "total_tokens": 246
    }
  }
}
```

#### Generate Compliance Text
```http
POST /api/templates/generate-compliance-text
```

**Request Body:**
```json
{
  "complianceType": "BAS",
  "companyName": "Test Company",
  "daysLeft": 30,
  "customPrompt": "Optional custom prompt"
}
```

### 4. Legacy Company Templates API

The following endpoints are still available for backward compatibility:

```http
GET /api/companies/templates
GET /api/companies/templates/{id}
POST /api/companies/templates
PUT /api/companies/templates/{id}
DELETE /api/companies/templates/{id}
POST /api/companies/templates/{id}/test
```

## Template Types

### Email Templates
- **Purpose**: Professional email notifications
- **Required Fields**: `type`, `name`, `subject`, `body`
- **Optional Fields**: `notificationTypes`, `emailDays`
- **Example**: Compliance reminders, deadline notifications

### SMS Templates
- **Purpose**: Concise SMS notifications
- **Required Fields**: `type`, `name`, `body`
- **Optional Fields**: `notificationTypes`, `smsDays`
- **Example**: Urgent reminders, quick notifications

### AI-Generated Templates
- **Purpose**: On-demand template generation
- **Types**: Email and SMS
- **Features**: Customizable tone, compliance type, and content
- **Example**: Dynamic templates based on specific requirements

## Compliance Types

The system supports various compliance types:
- **BAS** - Business Activity Statement
- **FBT** - Fringe Benefits Tax
- **IAS** - Instalment Activity Statement
- **Tax Filing** - General tax filing

## Template Variables

Templates support the following variables:
- `{companyName}` - Company name
- `{complianceType}` - Type of compliance
- `{daysLeft}` - Days until deadline
- `{date}` - Due date
- `{recipient}` - Recipient name

## Usage Examples

### Get All Templates
```bash
curl -X GET http://localhost:3333/api/templates
```

### Generate AI Email Template
```bash
curl -X POST http://localhost:3333/api/templates/generate \
  -H "Content-Type: application/json" \
  -d '{
    "templateType": "email",
    "complianceType": "BAS",
    "tone": "professional"
  }'
```

### Create Notification Template
```bash
curl -X POST http://localhost:3333/api/templates/notification \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "name": "BAS Reminder",
    "subject": "BAS Due Soon",
    "body": "Dear {companyName}, your BAS is due in {daysLeft} days.",
    "notificationTypes": ["BAS"],
    "emailDays": [1, 7, 14]
  }'
```

### Get Template Statistics
```bash
curl -X GET http://localhost:3333/api/templates/stats
```

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Specific error message"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Template not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to retrieve templates",
  "error": "Error details"
}
```

## Best Practices

1. **Use AI Generation** for one-off or custom templates
2. **Store Notification Templates** for frequently used templates
3. **Test Templates** before using them in production
4. **Use Appropriate Tones** for different compliance types
5. **Include Required Variables** in template content
6. **Monitor Template Usage** via statistics endpoint

## Rate Limits

- AI template generation: 10 requests per minute
- Template retrieval: 100 requests per minute
- Template creation/update: 20 requests per minute

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```bash
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```
