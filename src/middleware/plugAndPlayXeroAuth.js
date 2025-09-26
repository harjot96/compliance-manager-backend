// Plug and Play Xero Authentication Middleware
// Middleware for handling Xero-specific authentication and authorization

const XeroSettings = require('../models/PlugAndPlayXeroSettings');

class PlugAndPlayXeroAuth {
  // Middleware to check if user has Xero integration configured
  static requireXeroSettings(req, res, next) {
    const { companyId } = req;

    XeroSettings.findByCompanyId(companyId)
      .then(settings => {
        if (!settings) {
          return res.status(404).json({
            success: false,
            message: 'Xero integration not configured for this company',
            action: 'configure_required'
          });
        }

        req.xeroSettings = settings;
        next();
      })
      .catch(error => {
        console.error('❌ Xero settings check error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to check Xero settings',
          error: error.message
        });
      });
  }

  // Middleware to check if user has valid Xero connection
  static requireXeroConnection(req, res, next) {
    const { companyId } = req;

    XeroSettings.findByCompanyId(companyId)
      .then(settings => {
        if (!settings) {
          return res.status(404).json({
            success: false,
            message: 'Xero integration not configured',
            action: 'configure_required'
          });
        }

        if (!settings.isConnected()) {
          return res.status(401).json({
            success: false,
            message: 'Xero not connected. Please connect your Xero account.',
            action: 'connect_required',
            needsOAuth: !settings.hasValidTokens()
          });
        }

        req.xeroSettings = settings;
        next();
      })
      .catch(error => {
        console.error('❌ Xero connection check error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to check Xero connection',
          error: error.message
        });
      });
  }

  // Middleware to check if user has specific Xero permissions
  static requireXeroPermissions(permissions = []) {
    return (req, res, next) => {
      const { companyId } = req;

      XeroSettings.findByCompanyId(companyId)
        .then(settings => {
          if (!settings || !settings.isConnected()) {
            return res.status(401).json({
              success: false,
              message: 'Xero connection required',
              action: 'connect_required'
            });
          }

          // Check if user has required permissions
          // This is a basic implementation - you might want to store permissions in the settings
          const userPermissions = settings.scopes ? JSON.parse(settings.scopes) : [];
          
          const hasPermission = permissions.every(permission => 
            userPermissions.includes(permission)
          );

          if (!hasPermission) {
            return res.status(403).json({
              success: false,
              message: 'Insufficient Xero permissions',
              required: permissions,
              current: userPermissions
            });
          }

          req.xeroSettings = settings;
          next();
        })
        .catch(error => {
          console.error('❌ Xero permissions check error:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to check Xero permissions',
            error: error.message
          });
        });
    };
  }

  // Middleware to validate tenant access
  static validateTenantAccess(req, res, next) {
    const { companyId } = req;
    const { tenantId } = req.params;

    XeroSettings.findByCompanyId(companyId)
      .then(settings => {
        if (!settings || !settings.isConnected()) {
          return res.status(401).json({
            success: false,
            message: 'Xero connection required'
          });
        }

        const tenants = settings.getTenantList();
        const hasAccess = tenants.some(tenant => tenant.id === tenantId);

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied to this Xero organization',
            availableTenants: tenants.map(t => ({ id: t.id, name: t.name }))
          });
        }

        req.xeroSettings = settings;
        req.tenantId = tenantId;
        next();
      })
      .catch(error => {
        console.error('❌ Tenant access validation error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to validate tenant access',
          error: error.message
        });
      });
  }

  // Middleware to auto-refresh expired tokens
  static autoRefreshTokens(req, res, next) {
    const { companyId } = req;

    XeroSettings.findByCompanyId(companyId)
      .then(async settings => {
        if (!settings || !settings.accessToken) {
          return next();
        }

        // Check if token is expired or will expire soon (within 5 minutes)
        const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
        const isExpiredSoon = settings.tokenExpiresAt && new Date(settings.tokenExpiresAt) <= fiveMinutesFromNow;

        if (isExpiredSoon && settings.refreshToken) {
          try {
            console.log('🔄 Auto-refreshing Xero token...');
            
            // Import the service here to avoid circular dependency
            const XeroService = require('../services/plugAndPlayXeroService');
            await XeroService.refreshAccessToken(companyId);
            
            console.log('✅ Token auto-refreshed successfully');
          } catch (error) {
            console.error('❌ Auto token refresh failed:', error);
            // Continue with the request - let it handle the error
          }
        }

        next();
      })
      .catch(error => {
        console.error('❌ Auto refresh check error:', error);
        next(); // Continue with the request
      });
  }

  // Middleware to rate limit Xero API calls
  static rateLimitXeroCalls(maxRequests = 60, windowMs = 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      const { companyId } = req;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old requests
      for (const [key, timestamp] of requests.entries()) {
        if (timestamp < windowStart) {
          requests.delete(key);
        }
      }

      // Count requests for this company
      const companyRequests = Array.from(requests.entries())
        .filter(([key]) => key.startsWith(`${companyId}:`))
        .length;

      if (companyRequests >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many Xero API requests. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Add this request
      const requestId = `${companyId}:${now}:${Math.random()}`;
      requests.set(requestId, now);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - companyRequests - 1),
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      });

      next();
    };
  }

  // Middleware to log Xero API calls
  static logXeroCalls(req, res, next) {
    const startTime = Date.now();
    const { companyId } = req;
    const { method, url, params } = req;

    // Log the request
    console.log(`🔐 Xero API Request: ${method} ${url}`, {
      companyId,
      params,
      timestamp: new Date().toISOString()
    });

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function(data) {
      const duration = Date.now() - startTime;
      
      console.log(`✅ Xero API Response: ${method} ${url}`, {
        companyId,
        status: res.statusCode,
        duration: `${duration}ms`,
        success: data?.success,
        timestamp: new Date().toISOString()
      });

      return originalJson.call(this, data);
    };

    next();
  }

  // Middleware to validate Xero data requests
  static validateDataRequest(req, res, next) {
    const { resourceType } = req.params;
    const { page, pageSize, tenantId } = req.query;

    // Validate resource type
    const validResourceTypes = [
      'invoices', 'contacts', 'accounts', 'bank-transactions',
      'organization', 'items', 'tax-rates', 'tracking-categories',
      'purchase-orders', 'receipts', 'credit-notes', 'manual-journals',
      'prepayments', 'overpayments', 'quotes', 'financial-summary',
      'dashboard-data'
    ];

    if (!validResourceTypes.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type',
        validTypes: validResourceTypes
      });
    }

    // Validate pagination parameters
    if (page && (isNaN(page) || parseInt(page) < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Page must be a positive integer'
      });
    }

    if (pageSize && (isNaN(pageSize) || parseInt(pageSize) < 1 || parseInt(pageSize) > 500)) {
      return res.status(400).json({
        success: false,
        message: 'Page size must be between 1 and 500'
      });
    }

    // Validate tenant ID format (UUID)
    if (tenantId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tenant ID format'
      });
    }

    next();
  }
}

module.exports = PlugAndPlayXeroAuth;
