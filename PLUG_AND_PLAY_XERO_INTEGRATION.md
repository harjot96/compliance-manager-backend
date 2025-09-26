# Plug and Play Xero Integration - Complete Backend Package

This is a complete, self-contained Xero integration backend package that can be easily integrated into any Node.js/Express application.

## 🚀 Quick Setup

### 1. Copy Files to Your Backend

Copy these files to your backend project:

```
backend/src/
├── controllers/
│   └── plugAndPlayXeroController.js      # Main controller
├── routes/
│   └── plugAndPlayXeroRoutes.js          # Route definitions
├── models/
│   └── PlugAndPlayXeroSettings.js        # Database model
├── services/
│   └── plugAndPlayXeroService.js         # Business logic
└── middleware/
    └── plugAndPlayXeroAuth.js            # Authentication middleware
```

### 2. Install Dependencies

```bash
npm install axios crypto-js sequelize
```

### 3. Database Migration

Create the database table:

```sql
CREATE TABLE plug_and_play_xero_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  client_secret TEXT,
  redirect_uri VARCHAR(500) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at DATETIME,
  tenants JSON,
  last_sync_at DATETIME,
  sync_status ENUM('active', 'paused', 'error', 'never_synced') DEFAULT 'never_synced',
  error_message TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_company_xero_settings (company_id),
  INDEX idx_xero_client_id (client_id),
  INDEX idx_xero_active (is_active),
  INDEX idx_xero_sync_status (sync_status),
  INDEX idx_xero_created_at (created_at)
);
```

### 4. Environment Variables

Add to your `.env` file:

```env
# Xero Integration
XERO_CLIENT_ID=your_xero_client_id
XERO_CLIENT_SECRET=your_xero_client_secret
XERO_REDIRECT_URI=https://yourdomain.com/api/xero/callback
XERO_API_BASE_URL=https://api.xero.com
XERO_TOKEN_ENCRYPTION_KEY=your_32_character_encryption_key_here
```

### 5. Register Routes

In your main server file:

```javascript
const express = require('express');
const plugAndPlayXeroRoutes = require('./src/routes/plugAndPlayXeroRoutes');

const app = express();

// Register Xero routes
app.use('/api/xero', plugAndPlayXeroRoutes);

// Root level callback (for OAuth redirects)
app.get('/xero-callback', (req, res) => {
  // Handle OAuth callback redirect
  const { success, error, companyId } = req.query;
  
  if (success === 'true') {
    res.redirect(`https://yourdomain.com/xero-success?companyId=${companyId}`);
  } else {
    res.redirect(`https://yourdomain.com/xero-error?error=${encodeURIComponent(error)}`);
  }
});
```

### 6. Update Model Associations

In your models index file:

```javascript
// models/index.js
const PlugAndPlayXeroSettings = require('./PlugAndPlayXeroSettings');

// Set up associations
PlugAndPlayXeroSettings.associate(models);
```

## 🔧 Configuration

### Environment Setup

```javascript
// config/xero.js
module.exports = {
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUri: process.env.XERO_REDIRECT_URI,
  apiBaseUrl: process.env.XERO_API_BASE_URL || 'https://api.xero.com',
  tokenEncryptionKey: process.env.XERO_TOKEN_ENCRYPTION_KEY,
  scopes: [
    'offline_access',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings',
    'accounting.reports.read'
  ],
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
};
```

## 📚 API Endpoints

### Settings Management

```http
# Save Xero settings
POST /api/xero/settings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "clientId": "your_xero_client_id",
  "clientSecret": "your_xero_client_secret",
  "redirectUri": "https://yourdomain.com/api/xero/callback"
}

# Get Xero settings
GET /api/xero/settings
Authorization: Bearer <JWT_TOKEN>

# Delete Xero settings
DELETE /api/xero/settings
Authorization: Bearer <JWT_TOKEN>
```

### OAuth Flow

```http
# Get OAuth authorization URL
GET /api/xero/connect?redirect_uri=...&state=...
Authorization: Bearer <JWT_TOKEN>

# Handle OAuth callback
POST /api/xero/oauth-callback
Content-Type: application/json

{
  "code": "authorization_code",
  "state": "state_parameter",
  "redirect_uri": "https://yourdomain.com/api/xero/callback"
}

# Refresh access token
POST /api/xero/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token",
  "companyId": 123
}
```

### Data Access

```http
# Get invoices
GET /api/xero/invoices?page=1&pageSize=50&tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get contacts
GET /api/xero/contacts?page=1&pageSize=50&tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get accounts
GET /api/xero/accounts?tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get bank transactions
GET /api/xero/bank-transactions?page=1&pageSize=50&tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get organization details
GET /api/xero/organization?tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get financial summary
GET /api/xero/financial-summary?tenantId=...
Authorization: Bearer <JWT_TOKEN>

# Get dashboard data
GET /api/xero/dashboard-data?tenantId=...
Authorization: Bearer <JWT_TOKEN>
```

### Additional Resources

```http
# Items, tax rates, tracking categories, etc.
GET /api/xero/items?tenantId=...
GET /api/xero/tax-rates?tenantId=...
GET /api/xero/tracking-categories?tenantId=...
GET /api/xero/purchase-orders?tenantId=...
GET /api/xero/receipts?tenantId=...
GET /api/xero/credit-notes?tenantId=...
GET /api/xero/manual-journals?tenantId=...
GET /api/xero/prepayments?tenantId=...
GET /api/xero/overpayments?tenantId=...
GET /api/xero/quotes?tenantId=...
```

### Connection Status

```http
# Get connection status
GET /api/xero/status
Authorization: Bearer <JWT_TOKEN>

# Health check
GET /api/xero/health
Authorization: Bearer <JWT_TOKEN>
```

### Demo Data (for testing)

```http
# Get demo data
GET /api/xero/demo/invoices
GET /api/xero/demo/contacts
GET /api/xero/demo/accounts
GET /api/xero/demo/organization
```

## 🔐 Security Features

### Token Encryption

All sensitive data (access tokens, refresh tokens, client secrets) are encrypted using AES encryption before storing in the database.

### Rate Limiting

Built-in rate limiting prevents API abuse:

```javascript
// Apply rate limiting middleware
const rateLimit = require('express-rate-limit');

const xeroRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many Xero API requests, please try again later.'
});

app.use('/api/xero', xeroRateLimit);
```

### Company Isolation

All operations are automatically scoped to the authenticated company:

```javascript
// Middleware ensures company isolation
app.use('/api/xero', companyIsolation);
```

### Automatic Token Refresh

Tokens are automatically refreshed when they expire:

```javascript
// Apply auto-refresh middleware
app.use('/api/xero', PlugAndPlayXeroAuth.autoRefreshTokens);
```

## 🛠️ Advanced Usage

### Custom Middleware

```javascript
const PlugAndPlayXeroAuth = require('./src/middleware/plugAndPlayXeroAuth');

// Require Xero connection for specific routes
app.get('/api/xero/sensitive-data', 
  PlugAndPlayXeroAuth.requireXeroConnection,
  yourController
);

// Validate tenant access
app.get('/api/xero/tenant/:tenantId/data',
  PlugAndPlayXeroAuth.validateTenantAccess,
  yourController
);

// Rate limit Xero calls
app.use('/api/xero', 
  PlugAndPlayXeroAuth.rateLimitXeroCalls(60, 60000) // 60 requests per minute
);
```

### Service Layer Usage

```javascript
const XeroService = require('./src/services/plugAndPlayXeroService');

// Get financial summary
const summary = await XeroService.getFinancialSummary(companyId, tenantId);

// Sync company data
await XeroService.syncCompanyData(companyId);

// Bulk sync all integrations
const results = await XeroService.bulkSyncActiveIntegrations();

// Get integration statistics
const stats = await XeroService.getIntegrationStats();
```

### Background Jobs

```javascript
// Set up periodic sync job
const cron = require('node-cron');

// Sync all active integrations every hour
cron.schedule('0 * * * *', async () => {
  try {
    const results = await XeroService.bulkSyncActiveIntegrations();
    console.log(`Sync completed: ${results.successful} successful, ${results.failed} failed`);
  } catch (error) {
    console.error('Bulk sync failed:', error);
  }
});

// Clean up expired tokens daily
cron.schedule('0 2 * * *', async () => {
  try {
    const expiredTokens = await XeroSettings.findExpiredTokens();
    console.log(`Found ${expiredTokens.length} expired tokens`);
    // Handle expired tokens as needed
  } catch (error) {
    console.error('Token cleanup failed:', error);
  }
});
```

## 🧪 Testing

### Unit Tests

```javascript
// tests/plugAndPlayXeroController.test.js
const request = require('supertest');
const app = require('../app');

describe('Plug and Play Xero Controller', () => {
  test('should get connection status', async () => {
    const response = await request(app)
      .get('/api/xero/status')
      .set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('should save settings', async () => {
    const settings = {
      clientId: 'test_client_id',
      redirectUri: 'https://test.com/callback'
    };

    const response = await request(app)
      .post('/api/xero/settings')
      .set('Authorization', 'Bearer valid_token')
      .send(settings);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Integration Tests

```javascript
// tests/xeroIntegration.test.js
describe('Xero Integration', () => {
  test('should complete OAuth flow', async () => {
    // Test OAuth authorization URL generation
    const authResponse = await request(app)
      .get('/api/xero/connect')
      .set('Authorization', 'Bearer valid_token');
    
    expect(authResponse.status).toBe(200);
    expect(authResponse.body.data.authUrl).toContain('login.xero.com');
  });

  test('should load invoices', async () => {
    const response = await request(app)
      .get('/api/xero/invoices')
      .set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## 📊 Monitoring

### Health Checks

```javascript
// routes/health.js
app.get('/api/health/xero', async (req, res) => {
  try {
    const stats = await XeroService.getIntegrationStats();
    
    res.json({
      status: 'healthy',
      xero: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

### Logging

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/xero-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/xero-combined.log' }),
  ],
});

module.exports = logger;
```

## 🚀 Deployment

### Production Checklist

- [ ] Set secure encryption keys (32+ characters)
- [ ] Configure proper CORS settings
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Test OAuth flow end-to-end
- [ ] Verify token encryption/decryption
- [ ] Test company isolation
- [ ] Set up error handling
- [ ] Configure backup strategies

### Environment Variables (Production)

```env
NODE_ENV=production
XERO_CLIENT_ID=your_production_client_id
XERO_CLIENT_SECRET=your_production_client_secret
XERO_REDIRECT_URI=https://yourdomain.com/api/xero/callback
XERO_TOKEN_ENCRYPTION_KEY=your_secure_32_character_key_here
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
```

## 🔧 Customization

### Custom Scopes

```javascript
// Customize scopes based on your needs
const customScopes = [
  'offline_access',
  'accounting.transactions',
  'accounting.contacts',
  'accounting.settings',
  'accounting.reports.read',
  'accounting.payroll.employees'
];

// Update in controller
const params = new URLSearchParams({
  response_type: 'code',
  client_id: settings.clientId,
  redirect_uri: redirectUri,
  scope: customScopes.join(' '),
  state: state
});
```

### Custom Data Processing

```javascript
// services/customXeroProcessor.js
class CustomXeroProcessor {
  static processInvoices(invoices) {
    return invoices.map(invoice => ({
      ...invoice,
      formattedTotal: `$${invoice.Total.toFixed(2)}`,
      daysOverdue: this.calculateDaysOverdue(invoice.DueDate),
      statusColor: this.getStatusColor(invoice.Status)
    }));
  }

  static calculateDaysOverdue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.max(0, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
  }

  static getStatusColor(status) {
    const colors = {
      'AUTHORISED': 'green',
      'PAID': 'blue',
      'OVERDUE': 'red',
      'DRAFT': 'gray'
    };
    return colors[status] || 'default';
  }
}
```

## 🆘 Troubleshooting

### Common Issues

1. **OAuth Callback Issues**
   - Verify redirect URI matches exactly in Xero app settings
   - Check CORS settings
   - Ensure backend is accessible from Xero

2. **Token Management Issues**
   - Verify encryption key is set correctly
   - Check token expiration handling
   - Ensure refresh token is stored securely

3. **API Rate Limiting**
   - Implement proper rate limiting
   - Add retry logic with exponential backoff
   - Monitor API usage

4. **Database Issues**
   - Verify database connection
   - Check table structure matches model
   - Ensure proper indexing

### Debug Mode

```javascript
// Enable debug logging
process.env.XERO_DEBUG = 'true';

// In your Xero service
if (process.env.XERO_DEBUG) {
  console.log('Xero API Request:', {
    url: requestUrl,
    method: requestMethod,
    headers: requestHeaders,
  });
}
```

## 📞 Support

For backend integration issues:

1. Check server logs for errors
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check database connectivity
5. Verify Xero app configuration
6. Test OAuth flow step by step

---

**Ready to integrate Xero into your backend?** Follow the Quick Setup steps above and customize the configuration to fit your needs!

This plug-and-play package provides everything you need for a complete Xero integration with minimal setup and maximum security.
