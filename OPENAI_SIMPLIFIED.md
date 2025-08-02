# OpenAI Settings Simplified

## Overview
The OpenAI settings system has been simplified to only store and manage the API key. All other configuration parameters (model, max_tokens, temperature) are now handled with default values in the application code.

## Changes Made

### 1. Database Schema
- **Removed columns**: `model`, `max_tokens`, `temperature`
- **Kept columns**: `id`, `api_key_encrypted`, `is_active`, `created_by`, `created_at`, `updated_at`

### 2. Model Updates (`src/models/OpenAISetting.js`)
- Simplified `saveSettings()` to only accept `apiKey` and `createdBy`
- Updated `getSettings()` to return only API key and metadata
- Simplified `updateSettings()` to only update API key
- Removed references to model, maxTokens, and temperature fields

### 3. Controller Updates (`src/controllers/openaiSettingController.js`)
- Updated validation to only require `apiKey`
- Removed validation for model, maxTokens, and temperature
- Simplified response data to exclude removed fields

### 4. OpenAI Controller Updates (`src/controllers/openaiController.js`)
- Added default values for model (`gpt-3.5-turbo`), maxTokens (`1000`), and temperature (`0.7`)
- Removed references to stored settings for these parameters
- All OpenAI API calls now use request body parameters or defaults

## API Endpoints

### Save OpenAI Settings
```http
POST /api/openai/settings
Content-Type: application/json

{
  "apiKey": "sk-your-openai-api-key-here"
}
```

### Get OpenAI Settings
```http
GET /api/openai/settings
```

Response:
```json
{
  "success": true,
  "message": "OpenAI settings retrieved successfully",
  "data": {
    "id": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update OpenAI Settings
```http
PUT /api/openai/settings/:id
Content-Type: application/json

{
  "apiKey": "sk-your-new-openai-api-key-here"
}
```

### Test API Key
```http
POST /api/openai/test-api-key
Content-Type: application/json

{
  "apiKey": "sk-your-openai-api-key-here"
}
```

## OpenAI API Usage

When making OpenAI API calls, you can now specify parameters directly in the request:

### Chat Completion
```http
POST /api/openai/chat
Content-Type: application/json

{
  "prompt": "Your prompt here",
  "model": "gpt-4",           // Optional, defaults to gpt-3.5-turbo
  "maxTokens": 2000,          // Optional, defaults to 1000
  "temperature": 0.8          // Optional, defaults to 0.7
}
```

### Generate Compliance Text
```http
POST /api/openai/generate-compliance-text
Content-Type: application/json

{
  "complianceType": "BAS",
  "companyName": "Test Company",
  "daysLeft": 30,
  "model": "gpt-4",           // Optional
  "maxTokens": 1500,          // Optional
  "temperature": 0.5          // Optional
}
```

## Migration

To update existing databases, run the migration:

```bash
node src/utils/migrate.js runAllMigrations
```

This will remove the unused columns from the `openai_settings` table.

## Benefits

1. **Simplified Configuration**: Only one critical piece of information (API key) needs to be managed
2. **Flexibility**: Model parameters can be specified per request
3. **Reduced Complexity**: Less database storage and simpler validation
4. **Better Security**: Only the essential API key is stored and encrypted
5. **Easier Maintenance**: Fewer fields to manage and validate

## Default Values

- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: `1000`
- **Temperature**: `0.7`

These defaults provide a good balance of performance and creativity for most compliance-related tasks. 