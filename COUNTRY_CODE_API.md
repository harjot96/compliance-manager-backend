# Country Code API Documentation

## Overview
The compliance management system now supports country codes for phone numbers in both signup and profile update operations.

## Database Changes
- Added `country_code` column to the `companies` table
- Default value: `+61` (Australia)
- Column type: `VARCHAR(5)`

## API Endpoints

### 1. Company Registration (Signup)

**Endpoint:** `POST /api/companies/register`

**Request Body:**
```json
{
  "companyName": "Example Company",
  "email": "company@example.com",
  "mobileNumber": "1234567890",
  "countryCode": "+61",
  "password": "SecurePass123!"
}
```

**Country Code Validation:**
- Must start with `+` followed by 1-4 digits
- Valid examples: `+1`, `+44`, `+61`, `+91`, `+86`
- Invalid examples: `61`, `+`, `++61`, `+0`, `+12345`
- If not provided, defaults to `+61`

**Response:**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "company": {
      "id": 1,
      "companyName": "Example Company",
      "email": "company@example.com",
      "mobileNumber": "1234567890",
      "countryCode": "+61",
      "role": "company",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 2. Profile Update

**Endpoint:** `PUT /api/companies/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "companyName": "Updated Company Name",
  "email": "updated@example.com",
  "mobileNumber": "9876543210",
  "countryCode": "+44"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "companyName": "Updated Company Name",
    "email": "updated@example.com",
    "mobileNumber": "9876543210",
    "countryCode": "+44",
    "role": "company",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Validation Rules

### Country Code Format
- **Pattern:** `^\+[1-9]\d{0,3}$`
- **Description:** Must start with `+` followed by a non-zero digit and up to 3 additional digits
- **Examples:**
  - ✅ `+1` (USA/Canada)
  - ✅ `+44` (UK)
  - ✅ `+61` (Australia)
  - ✅ `+91` (India)
  - ✅ `+86` (China)
  - ❌ `61` (missing +)
  - ❌ `+` (no digits)
  - ❌ `++61` (double +)
  - ❌ `+0` (starts with 0)
  - ❌ `+12345` (too many digits)

### Default Behavior
- If `countryCode` is not provided in the request, it defaults to `+61`
- This ensures backward compatibility with existing clients

## Migration

To add the country code column to existing databases, run:

```bash
npm run migrate
```

This will:
1. Add the `country_code` column to the `companies` table
2. Set the default value to `+61` for existing records
3. Ensure new records can specify their own country code

## Frontend Integration

### Signup Form
```javascript
const signupData = {
  companyName: "My Company",
  email: "company@example.com",
  mobileNumber: "1234567890",
  countryCode: "+1", // User selects from dropdown
  password: "SecurePass123!"
};

// Send to /api/companies/register
```

### Profile Update Form
```javascript
const profileData = {
  companyName: "Updated Company",
  email: "updated@example.com",
  mobileNumber: "9876543210",
  countryCode: "+44" // User can change country code
};

// Send to /api/companies/profile
```

### Country Code Dropdown Example
```html
<select name="countryCode" required>
  <option value="+1">🇺🇸 +1 (USA/Canada)</option>
  <option value="+44">🇬🇧 +44 (UK)</option>
  <option value="+61" selected>🇦🇺 +61 (Australia)</option>
  <option value="+91">🇮🇳 +91 (India)</option>
  <option value="+86">🇨🇳 +86 (China)</option>
  <!-- Add more countries as needed -->
</select>
``` 