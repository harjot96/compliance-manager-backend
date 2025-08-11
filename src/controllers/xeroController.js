const axios = require('axios');
const crypto = require('crypto');
const CompanyCompliance = require('../models/CompanyCompliance');
const XeroSettings = require('../models/XeroSettings');
const db = require('../config/database');
const { getFrontendCallbackUrl, getFrontendRedirectUrl } = require('../config/environment');

/**
 * Clear expired Xero tokens for a company
 */
const clearExpiredTokens = async (companyId) => {
  try {
    console.log(`🧹 Clearing expired tokens for company ${companyId}`);
    await db.query(
      'UPDATE xero_settings SET access_token = NULL, refresh_token = NULL, token_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE company_id = $1',
      [companyId]
    );
    console.log(`✅ Cleared expired tokens for company ${companyId}`);
  } catch (error) {
    console.error(`❌ Failed to clear expired tokens for company ${companyId}:`, error);
  }
};

/**
 * Check if company is enrolled (has compliance details)
 * NOTE: This check has been disabled - Xero integration now works independently
 */
const isCompanyEnrolled = async (companyId) => {
  // Disabled compliance requirement - Xero integration works independently
  return true;
};

/**
 * Build OAuth2 authorization URL
 */
const buildAuthUrl = async (req, res, next) => {
  try {
    console.log('🔍 Building Xero Auth URL for company:', req.company.id);
    
    // Check if user is super admin
    if (req.company.role === 'admin') {
      console.log('❌ Super admin cannot setup Xero accounts');
      return res.status(403).json({
        success: false,
        message: 'Super admins cannot setup Xero accounts. Only regular companies can setup Xero integration.',
        errorCode: 'SUPER_ADMIN_RESTRICTED',
        action: 'use_regular_company',
        details: {
          currentRole: req.company.role,
          allowedRoles: ['company']
        }
      });
    }

    // Company enrollment check disabled - Xero integration works independently
    const companyId = req.company.id;

    // Get company's Xero settings
    console.log('🔍 Getting Xero settings for company:', companyId);
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);
    if (!xeroSettings) {
      console.log('❌ Xero settings not configured for company:', companyId);
      return res.status(400).json({
        success: false,
        message: 'Xero settings not configured for this company. Please configure Xero settings first.',
        errorCode: 'XERO_SETTINGS_MISSING',
        action: 'configure_settings',
        details: {
          requiredFields: ['clientId', 'clientSecret', 'redirectUri'],
          endpoint: '/api/xero/settings',
          method: 'POST'
        }
      });
    }

    console.log('🔍 Xero settings found, generating state...');
    
    // Clean up expired states first
    await cleanupExpiredStates();
    
    // Generate new state
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store the state in the database with timestamp
    console.log('🔍 Storing state in database:', state);
    await db.query(
      'INSERT INTO xero_oauth_states (state, company_id, created_at) VALUES ($1, $2, NOW())',
      [state, companyId]
    );
    console.log('✅ State stored successfully');
    
    // Use the correct redirect URI based on environment
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: xeroSettings.client_id,
      redirect_uri: getFrontendRedirectUrl(),
      scope: 'openid profile email accounting.transactions accounting.contacts accounting.settings offline_access',
      state: state
    });

    const authUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
    console.log('✅ Authorization URL generated successfully');
    
    res.json({
      success: true,
      message: 'Authorization URL generated successfully',
      data: {
        authUrl,
        state
      }
    });
  } catch (error) {
    console.error('❌ Build Auth URL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL',
      error: error.message
    });
  }
};

/**
 * Clean up expired OAuth states (run periodically)
 */
const cleanupExpiredStates = async () => {
  try {
    const result = await db.query('DELETE FROM xero_oauth_states WHERE created_at <= NOW() - INTERVAL \'5 minutes\'');
    console.log('🧹 Cleaned up expired OAuth states:', result.rowCount);
  } catch (error) {
    console.error('❌ Failed to cleanup expired states:', error);
  }
};

/**
 * Create and store a state for the OAuth flow
 */
const createXeroAuthState = async (req, res) => {
  try {
    const companyId = req.company.id;
    
    // Clean up expired states first
    await cleanupExpiredStates();
    
    // Create new state
    const state = crypto.randomBytes(16).toString('hex');
    await db.query(
      'INSERT INTO xero_oauth_states (state, company_id, created_at) VALUES ($1, $2, NOW())',
      [state, companyId]
    );
    
    console.log('✅ Created new OAuth state for company:', companyId);
    res.json({ success: true, state });
  } catch (error) {
    console.error('❌ Failed to create OAuth state:', error);
    res.status(500).json({ success: false, message: 'Failed to create state', error: error.message });
  }
};

/**
 * Get OAuth state information
 */
const getXeroAuthState = async (req, res) => {
  try {
    const { state } = req.params;
    const companyId = req.company.id;
    
    const result = await db.query(
      'SELECT * FROM xero_oauth_states WHERE state = $1 AND company_id = $2',
      [state, companyId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'State not found or expired'
      });
    }
    
    res.json({
      success: true,
      data: {
        state: result.rows[0].state,
        companyId: result.rows[0].company_id,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get state', error: error.message });
  }
};

/**
 * Handle OAuth2 callback and exchange code for tokens
 */
const handleCallback = async (req, res, next) => {
  try {
    console.log('🔍 Xero Callback Debug - Request method:', req.method);
    console.log('🔍 Xero Callback Debug - Request body:', req.body);
    console.log('🔍 Xero Callback Debug - Query params:', req.query);
    
    // Handle both GET (query params) and POST (body) requests
    const { code, state } = req.method === 'GET' ? req.query : req.body;
    if (!code || !state) {
      console.log('❌ Missing code or state:', { code: !!code, state: !!state });
      
      // FIXED: ALWAYS REDIRECT, NEVER JSON
      console.log('❌ Missing code or state, redirecting with error');
      const errorMessage = 'Code and state are required for OAuth callback';
      const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('Missing authorization parameters')}`;
      return res.redirect(frontendUrl);
    }

    console.log('🔍 Looking up company by state:', state);
    // 1. Lookup company by state with timestamp check
    const result = await db.query(
      'SELECT company_id, created_at FROM xero_oauth_states WHERE state = $1 AND created_at > NOW() - INTERVAL \'5 minutes\'', 
      [state]
    );
    console.log('🔍 State lookup result:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('❌ Invalid or expired state');
      
      // Clean up expired states
      await db.query('DELETE FROM xero_oauth_states WHERE created_at <= NOW() - INTERVAL \'5 minutes\'');
      console.log('🧹 Cleaned up expired OAuth states');
      
      // FIXED: ALWAYS REDIRECT, NEVER JSON
      console.log('❌ Invalid or expired state, redirecting with error');
      const errorMessage = 'Invalid or expired state';
      const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('The authorization state token is invalid or has expired')}`;
      return res.redirect(frontendUrl);
    }
    const companyId = result.rows[0].company_id;
    console.log('🔍 Found company ID:', companyId);

    // Note: We'll delete the state after processing to ensure we can look it up in error cases

    // 3. Get Xero settings for this company
    console.log('🔍 Getting Xero settings for company:', companyId);
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);
    console.log('🔍 Xero settings found:', !!xeroSettings);
    if (!xeroSettings) {
      console.log('❌ Xero settings not configured for company:', companyId);
      const errorMessage = 'Xero settings not configured for this company.';
      const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('Please configure Xero settings first')}`;
      return res.redirect(frontendUrl);
    }

    // 4. Exchange code for tokens
    console.log('🔍 Exchanging code for tokens...');
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: xeroSettings.redirect_uri
    });

    console.log('🔍 Token exchange params:', {
      grant_type: 'authorization_code',
      code: code ? 'present' : 'missing',
      redirect_uri: xeroSettings.redirect_uri
    });

    let response;
    try {
      response = await axios.post('https://identity.xero.com/connect/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${xeroSettings.client_id}:${xeroSettings.client_secret}`).toString('base64')}`
        }
      });

      console.log('🔍 Token exchange successful');
    } catch (error) {
      console.error('❌ Token exchange failed:', error.response?.data || error.message);
      
      // Handle specific OAuth errors - ALWAYS REDIRECT, NEVER JSON
      if (error.response?.data?.error === 'invalid_grant') {
        console.log('❌ Authorization code expired or invalid');
        const errorMessage = 'Authorization code has expired. Please try connecting to Xero again.';
        const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('The authorization code has expired. You need to start a new authorization flow.')}`;
        return res.redirect(frontendUrl);
      }
      
      if (error.response?.data?.error === 'invalid_client') {
        console.log('❌ Invalid client credentials');
        const errorMessage = 'Invalid Xero client credentials. Please check your Client ID and Client Secret.';
        const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('The Client ID or Client Secret is incorrect.')}`;
        return res.redirect(frontendUrl);
      }
      
      if (error.response?.data?.error === 'invalid_redirect_uri') {
        console.log('❌ Invalid redirect URI');
        const errorMessage = 'Invalid redirect URI. Please check your Xero app configuration.';
        const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent('The redirect URI does not match what is configured in your Xero app.')}`;
        return res.redirect(frontendUrl);
      }
      
      // Generic error - ALWAYS REDIRECT
      const errorMessage = 'Failed to exchange authorization code for tokens';
      const errorDetails = error.response?.data?.error_description || error.message || 'Token exchange failed';
      const frontendUrl = `${getFrontendCallbackUrl()}?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent(errorDetails)}`;
      return res.redirect(frontendUrl);
    }
    
    const tokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type
    };

    // 5. Get available tenants/organizations
    console.log('🔍 Getting available tenants...');
    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const tenants = tenantsResponse.data;
    console.log('🔍 Found tenants:', tenants.length);

    console.log('✅ Xero callback completed successfully');
    
    // Store tokens in database for future use
    try {
      await db.query(
        'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
        [
          tokens.accessToken,
          tokens.refreshToken,
          new Date(Date.now() + tokens.expiresIn * 1000),
          companyId
        ]
      );
      console.log('✅ Tokens stored in database');
    } catch (dbError) {
      console.error('⚠️ Failed to store tokens in database:', dbError.message);
      // Continue anyway - tokens are still valid
    }
    
    // Delete the state (one-time use) - now safe to delete
    await db.query('DELETE FROM xero_oauth_states WHERE state = $1', [state]);
    console.log('🔍 Deleted state from database');
    
    // FIXED: Redirect to frontend with success parameters
    console.log('✅ OAuth completed successfully, redirecting to frontend');
    const frontendUrl = `${getFrontendCallbackUrl()}?success=true&companyId=${companyId}&tenants=${encodeURIComponent(JSON.stringify(tenants))}`;
    res.redirect(frontendUrl);
  } catch (error) {
    console.error('❌ OAuth Callback Error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    // Handle both GET and POST requests for state extraction
    const { code, state } = req.method === 'GET' ? req.query : req.body;
    console.error('❌ Request body:', req.body);
    console.error('❌ Request query:', req.query);
    console.error('❌ State from request:', state);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to complete OAuth flow';
    if (error.response?.status === 400) {
      errorMessage = 'Invalid authorization code or redirect URI';
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid client credentials';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied by Xero';
    }
    
    // FIXED: Try to get the redirect URI from the state lookup
    let redirectUrl = null;
    try {
      if (state) {
        const stateResult = await db.query('SELECT company_id FROM xero_oauth_states WHERE state = $1', [state]);
        if (stateResult.rows.length > 0) {
          const companyId = stateResult.rows[0].company_id;
          const xeroSettings = await XeroSettings.getByCompanyId(companyId);
          if (xeroSettings) {
            redirectUrl = new URL(getFrontendRedirectUrl());
          }
        }
      }
    } catch (redirectError) {
      console.error('⚠️ Failed to get redirect URL for error:', redirectError.message);
    }
    
    // FIXED: Redirect to frontend with error parameters
    console.log('❌ OAuth failed, redirecting to frontend with error');
    const frontendUrl = `http://localhost:3001/xero-callback?success=false&error=${encodeURIComponent(errorMessage)}&errorDetails=${encodeURIComponent(error.message)}`;
    res.redirect(frontendUrl);
  }
};

/**
 * Get Xero data (invoices, contacts, etc.)
 */
const getXeroData = async (req, res, next) => {
  try {
    const { resourceType } = req.params;
    const { accessToken, tenantId } = req.body;

    if (!accessToken || !tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Access token and tenant ID are required'
      });
    }

    // Validate resource type
    const validResourceTypes = [
      'Invoices', 
      'Contacts', 
      'BankTransactions', 
      'Accounts', 
      'Items',
      'TaxRates',
      'TrackingCategories',
      'Organisations'
    ];
    
    if (!validResourceTypes.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type',
        error: `Resource type must be one of: ${validResourceTypes.join(', ')}`
      });
    }

    // Make API request to Xero
    const response = await axios.get(`https://api.xero.com/api.xro/2.0/${resourceType}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      message: `${resourceType} retrieved successfully`,
      data: response.data
    });

  } catch (error) {
    console.error('Get Xero Data Error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please reconnect your Xero account.',
        error: error.message
      });
    }
    
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this operation.',
        error: error.message
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get Xero data',
      error: error.message
    });
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken, companyId } = req.body;

    if (!refreshToken || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token and company ID are required'
      });
    }

    // Get company's Xero settings
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);
    if (!xeroSettings) {
      return res.status(400).json({
        success: false,
        message: 'Xero settings not configured for this company'
      });
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await axios.post('https://identity.xero.com/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${xeroSettings.client_id}:${xeroSettings.client_secret}`).toString('base64')}`
      }
    });

    const tokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type
    };

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });

  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
};

/**
 * Get company information for Xero integration
 */
const getCompanyInfo = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const isEnrolled = await isCompanyEnrolled(companyId);

    const companyData = {
      id: req.company.id,
      companyName: req.company.companyName,
      email: req.company.email,
      role: req.company.role,
      isEnrolled,
      enrollmentStatus: {
        isEnrolled,
        message: 'Xero integration is now independent of compliance enrollment'
      }
    };

    // If enrolled, get compliance details
    if (isEnrolled) {
      try {
        const compliance = await CompanyCompliance.getByCompanyId(companyId);
        if (compliance) {
          companyData.compliance = {
            basFrequency: compliance.basFrequency,
            nextBasDue: compliance.nextBasDue,
            fbtApplicable: compliance.fbtApplicable,
            nextFbtDue: compliance.nextFbtDue,
            iasRequired: compliance.iasRequired,
            iasFrequency: compliance.iasFrequency,
            nextIasDue: compliance.nextIasDue,
            financialYearEnd: compliance.financialYearEnd
          };
        }
      } catch (error) {
        console.error('Error fetching compliance details:', error);
      }
    }

    res.json({
      success: true,
      message: 'Company information retrieved successfully',
      data: companyData
    });
  } catch (error) {
    console.error('Get Company Info Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve company information',
      error: error.message
    });
  }
};

/**
 * Create or update Xero settings for a company
 */
const createXeroSettings = async (req, res, next) => {
  try {
    console.log('🔍 DEBUG: createXeroSettings called');
    console.log('🔍 DEBUG: req.body:', req.body);
    
    const companyId = req.company.id;
    const { clientId, clientSecret, redirectUri } = req.body;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(400).json({
        success: false,
        message: 'Client ID, Client Secret, and Redirect URI are required'
      });
    }

    // Validate redirect URI format
    try {
      new URL(redirectUri);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid redirect URI format'
      });
    }

    const settings = await XeroSettings.createSettings(companyId, {
      clientId,
      clientSecret,
      redirectUri
    });

    res.json({
      success: true,
      message: 'Xero settings saved successfully',
      data: {
        id: settings.id,
        companyId: settings.company_id,
        clientId: settings.client_id,
        redirectUri: settings.redirect_uri,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at
      }
    });

  } catch (error) {
    console.error('Create Xero Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Xero settings',
      error: error.message
    });
  }
};

/**
 * Get Xero settings for a company
 */
const getXeroSettings = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    // Check if we have valid tokens and if they're not expired
    let isConnected = false;
    let connectionStatus = 'not_configured';
    let tenants = [];

    if (settings.access_token && settings.refresh_token) {
      const now = new Date();
      const tokenExpiresAt = settings.token_expires_at ? new Date(settings.token_expires_at) : null;
      
      if (tokenExpiresAt && tokenExpiresAt > now) {
        // Token is still valid
        isConnected = true;
        connectionStatus = 'connected';
        
        // Try to get tenants to verify connection is working
        try {
          const tenantsResponse = await axios.get('https://api.xero.com/connections', {
            headers: {
              'Authorization': `Bearer ${settings.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Use tenant names from connections response and ensure proper ID mapping
          const tenantsWithDetails = tenantsResponse.data.map((connection) => {
            return {
              id: connection.tenantId, // Use tenantId as the ID for API calls
              connectionId: connection.id, // Keep connection ID for reference
              name: connection.tenantName || 'Unknown Organization',
              organizationName: connection.tenantName || 'Unknown Organization',
              tenantName: connection.tenantName || 'Unknown Organization',
              tenantId: connection.tenantId // Ensure tenantId is available
            };
          });
          
          tenants = tenantsWithDetails;
        } catch (error) {
          console.log('⚠️ Token validation failed, will need refresh:', error.message);
          connectionStatus = 'token_expired';
        }
      } else {
        // Token is expired, try to refresh
        try {
          const refreshResponse = await refreshXeroToken(settings.refresh_token, settings.client_id, settings.client_secret);
          if (refreshResponse.success) {
            // Update tokens in database
            await db.query(
              'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
              [
                refreshResponse.accessToken,
                refreshResponse.refreshToken,
                new Date(Date.now() + refreshResponse.expiresIn * 1000),
                companyId
              ]
            );
            isConnected = true;
            connectionStatus = 'connected';
            
            // Get tenants with new token
            const tenantsResponse = await axios.get('https://api.xero.com/connections', {
              headers: {
                'Authorization': `Bearer ${refreshResponse.accessToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            // Use tenant names from connections response and ensure proper ID mapping
            const tenantsWithDetails = tenantsResponse.data.map((connection) => {
              return {
                id: connection.tenantId, // Use tenantId as the ID for API calls
                connectionId: connection.id, // Keep connection ID for reference
                name: connection.tenantName || 'Unknown Organization',
                organizationName: connection.tenantName || 'Unknown Organization',
                tenantName: connection.tenantName || 'Unknown Organization',
                tenantId: connection.tenantId // Ensure tenantId is available
              };
            });
            
            tenants = tenantsWithDetails;
          } else {
            connectionStatus = 'refresh_failed';
          }
        } catch (refreshError) {
          console.log('⚠️ Token refresh failed:', refreshError.message);
          connectionStatus = 'refresh_failed';
        }
      }
    }

    res.json({
      success: true,
      message: 'Xero settings retrieved successfully',
      data: {
        id: settings.id,
        companyId: settings.company_id,
        clientId: settings.client_id,
        redirectUri: settings.redirect_uri,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at,
        isConnected,
        connectionStatus,
        tenants,
        hasValidTokens: !!(settings.access_token && settings.refresh_token)
      }
    });

  } catch (error) {
    console.error('Get Xero Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Xero settings',
      error: error.message
    });
  }
};

/**
 * Delete Xero settings for a company
 */
const deleteXeroSettings = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.deleteSettings(companyId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    res.json({
      success: true,
      message: 'Xero settings deleted successfully',
      data: {
        id: settings.id,
        companyId: settings.company_id
      }
    });

  } catch (error) {
    console.error('Delete Xero Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Xero settings',
      error: error.message
    });
  }
};

/**
 * Get all Xero settings (admin only)
 */
const getAllXeroSettings = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.company.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const settings = await XeroSettings.getAllSettings();

    res.json({
      success: true,
      message: 'All Xero settings retrieved successfully',
      data: settings.map(setting => ({
        id: setting.id,
        companyId: setting.company_id,
        companyName: setting.company_name,
        email: setting.email,
        clientId: setting.client_id,
        redirectUri: setting.redirect_uri,
        createdAt: setting.created_at,
        updatedAt: setting.updated_at
      }))
    });

  } catch (error) {
    console.error('Get All Xero Settings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all Xero settings',
      error: error.message
    });
  }
};

/**
 * Get comprehensive dashboard data for Xero
 */
const getDashboardData = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    // Get access token and refresh token
    const accessToken = xeroSettings.access_token;
    const refreshToken = xeroSettings.refresh_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get tenant ID from query parameter or use first available tenant
    let tenantId = req.query.tenantId;
    
    if (!tenantId) {
      // Get the first tenant from connections if no tenant ID provided
      try {
        const connectionsResponse = await axios.get('https://api.xero.com/connections', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (connectionsResponse.data && connectionsResponse.data.length > 0) {
          tenantId = connectionsResponse.data[0].tenantId;
          console.log('🔍 Using first available tenant:', tenantId);
        } else {
          return res.status(400).json({
            success: false,
            message: 'No Xero organizations found. Please check your Xero account.'
          });
        }
      } catch (error) {
        console.error('Error getting Xero connections:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to get Xero organizations. Please reconnect to Xero.'
        });
      }
    } else {
      console.log('🔍 Using provided tenant ID:', tenantId);
    }

    // Fetch multiple data types in parallel
    const [invoices, contacts, bankTransactions, accounts, organization] = await Promise.all([
      fetchXeroData(accessToken, tenantId, 'Invoices', { page: 1, pageSize: 10 }),
      fetchXeroData(accessToken, tenantId, 'Contacts', { page: 1, pageSize: 10 }),
      fetchXeroData(accessToken, tenantId, 'BankTransactions', { page: 1, pageSize: 10 }),
      fetchXeroData(accessToken, tenantId, 'Accounts', { page: 1, pageSize: 50 }),
      fetchXeroData(accessToken, tenantId, 'Organisations', {})
    ]);

    // Calculate summary statistics
    const totalInvoices = invoices.invoices?.length || 0;
    const totalContacts = contacts.contacts?.length || 0;
    const totalTransactions = bankTransactions.bankTransactions?.length || 0;
    const totalAccounts = accounts.accounts?.length || 0;

    // Calculate financial summary
    const totalAmount = invoices.invoices?.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.total) || 0);
    }, 0) || 0;

    const paidInvoices = invoices.invoices?.filter(invoice => invoice.status === 'PAID').length || 0;
    const overdueInvoices = invoices.invoices?.filter(invoice => invoice.status === 'AUTHORISED').length || 0;

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        summary: {
          totalInvoices,
          totalContacts,
          totalTransactions,
          totalAccounts,
          totalAmount: totalAmount.toFixed(2),
          paidInvoices,
          overdueInvoices
        },
        recentInvoices: invoices.invoices || [],
        recentContacts: contacts.contacts || [],
        recentTransactions: bankTransactions.bankTransactions || [],
        accounts: accounts.accounts || [],
        organization: organization.organizations?.[0] || {}
      }
    });

  } catch (error) {
    console.error('Dashboard Data Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      error: error.message
    });
  }
};

/**
 * Get financial summary
 */
const getFinancialSummary = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get tenant ID from query parameter or use first available tenant
    let tenantId = req.query.tenantId;
    
    if (!tenantId) {
      // Get the first tenant from connections if no tenant ID provided
      try {
        const connectionsResponse = await axios.get('https://api.xero.com/connections', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (connectionsResponse.data && connectionsResponse.data.length > 0) {
          tenantId = connectionsResponse.data[0].tenantId;
          console.log('🔍 Using first available tenant for financial summary:', tenantId);
        } else {
          return res.status(400).json({
            success: false,
            message: 'No Xero organizations found. Please check your Xero account.'
          });
        }
      } catch (error) {
        console.error('Error getting Xero connections:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to get Xero organizations. Please reconnect to Xero.'
        });
      }
    } else {
      console.log('🔍 Using provided tenant ID for financial summary:', tenantId);
    }

    // Fetch invoices and bank transactions
    const [invoices, bankTransactions] = await Promise.all([
      fetchXeroData(accessToken, tenantId, 'Invoices', { page: 1, pageSize: 100 }),
      fetchXeroData(accessToken, tenantId, 'BankTransactions', { page: 1, pageSize: 100 })
    ]);

    // Calculate financial metrics
    const totalRevenue = invoices.invoices?.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.total) || 0);
    }, 0) || 0;

    const paidRevenue = invoices.invoices?.filter(invoice => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + (parseFloat(invoice.total) || 0), 0) || 0;

    const outstandingRevenue = totalRevenue - paidRevenue;

    const totalExpenses = bankTransactions.bankTransactions?.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.total) || 0);
    }, 0) || 0;

    const netIncome = paidRevenue - totalExpenses;

    res.json({
      success: true,
      message: 'Financial summary retrieved successfully',
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        paidRevenue: paidRevenue.toFixed(2),
        outstandingRevenue: outstandingRevenue.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        netIncome: netIncome.toFixed(2),
        invoiceCount: invoices.invoices?.length || 0,
        transactionCount: bankTransactions.bankTransactions?.length || 0
      }
    });

  } catch (error) {
    console.error('Financial Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve financial summary',
      error: error.message
    });
  }
};

/**
 * Get all invoices
 */
const getAllInvoices = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    if (!settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50 } = req.query;

    // Get the first tenant (assuming single organization for now)
    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const invoices = await fetchXeroData(settings.access_token, tenantId, 'Invoices', { 
      page: parseInt(page), 
      pageSize: parseInt(pageSize) 
    });

    res.json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices
    });

  } catch (error) {
    console.error('Get All Invoices Error:', error);
    
    // Handle specific error types
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized - Clearing expired tokens for company:', companyId);
      await clearExpiredTokens(companyId);
      return res.status(401).json({
        success: false,
        message: 'Xero authorization expired. Tokens have been cleared. Please reconnect to Xero.',
        error: 'Authorization required',
        action: 'reconnect_required'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoices',
      error: error.message
    });
  }
};

/**
 * Get all contacts
 */
const getAllContacts = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    if (!settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50 } = req.query;

    // Get the first tenant (assuming single organization for now)
    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const contacts = await fetchXeroData(settings.access_token, tenantId, 'Contacts', { 
      page: parseInt(page), 
      pageSize: parseInt(pageSize) 
    });

    res.json({
      success: true,
      message: 'Contacts retrieved successfully',
      data: contacts
    });

  } catch (error) {
    console.error('Get All Contacts Error:', error);
    
    // Handle specific error types
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized - Clearing expired tokens for company:', companyId);
      await clearExpiredTokens(companyId);
      return res.status(401).json({
        success: false,
        message: 'Xero authorization expired. Tokens have been cleared. Please reconnect to Xero.',
        error: 'Authorization required',
        action: 'reconnect_required'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts',
      error: error.message
    });
  }
};

/**
 * Get all bank transactions
 */
const getAllBankTransactions = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const { page = 1, pageSize = 50 } = req.query;

    const bankTransactions = await fetchXeroData(accessToken, tenantId, 'BankTransactions', { 
      page: parseInt(page), 
      pageSize: parseInt(pageSize) 
    });

    res.json({
      success: true,
      message: 'Bank transactions retrieved successfully',
      data: bankTransactions
    });

  } catch (error) {
    console.error('Get All Bank Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bank transactions',
      error: error.message
    });
  }
};

/**
 * Get all accounts
 */
const getAllAccounts = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const accounts = await fetchXeroData(accessToken, tenantId, 'Accounts', {});

    res.json({
      success: true,
      message: 'Accounts retrieved successfully',
      data: accounts
    });

  } catch (error) {
    console.error('Get All Accounts Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve accounts',
      error: error.message
    });
  }
};

/**
 * Get all items
 */
const getAllItems = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const items = await fetchXeroData(accessToken, tenantId, 'Items', {});

    res.json({
      success: true,
      message: 'Items retrieved successfully',
      data: items
    });

  } catch (error) {
    console.error('Get All Items Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve items',
      error: error.message
    });
  }
};

/**
 * Get all tax rates
 */
const getAllTaxRates = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const taxRates = await fetchXeroData(accessToken, tenantId, 'TaxRates', {});

    res.json({
      success: true,
      message: 'Tax rates retrieved successfully',
      data: taxRates
    });

  } catch (error) {
    console.error('Get All Tax Rates Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tax rates',
      error: error.message
    });
  }
};

/**
 * Get all tracking categories
 */
const getAllTrackingCategories = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const trackingCategories = await fetchXeroData(accessToken, tenantId, 'TrackingCategories', {});

    res.json({
      success: true,
      message: 'Tracking categories retrieved successfully',
      data: trackingCategories
    });

  } catch (error) {
    console.error('Get All Tracking Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tracking categories',
      error: error.message
    });
  }
};

/**
 * Get Xero connection status
 */
const getConnectionStatus = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings) {
      return res.json({
        success: true,
        data: {
          isConnected: false,
          connectionStatus: 'not_configured',
          message: 'Xero settings not configured'
        }
      });
    }

    // Check if we have valid tokens
    if (!settings.access_token || !settings.refresh_token) {
      return res.json({
        success: true,
        data: {
          isConnected: false,
          connectionStatus: 'not_authorized',
          message: 'Xero not authorized'
        }
      });
    }

    // Check if token is expired
    const now = new Date();
    const tokenExpiresAt = settings.token_expires_at ? new Date(settings.token_expires_at) : null;
    
    if (tokenExpiresAt && tokenExpiresAt <= now) {
      // Token is expired, try to refresh
      try {
        const refreshResponse = await refreshXeroToken(settings.refresh_token, settings.client_id, settings.client_secret);
        if (refreshResponse.success) {
          // Update tokens in database
          await db.query(
            'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
            [
              refreshResponse.accessToken,
              refreshResponse.refreshToken,
              new Date(Date.now() + refreshResponse.expiresIn * 1000),
              companyId
            ]
          );
          
          // Get tenants with new token
          const tenantsResponse = await axios.get('https://api.xero.com/connections', {
            headers: {
              'Authorization': `Bearer ${refreshResponse.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Add tenant names to the response and ensure proper ID mapping
          const tenantsWithNames = tenantsResponse.data.map((connection) => ({
            id: connection.tenantId, // Use tenantId as the ID for API calls
            connectionId: connection.id, // Keep connection ID for reference
            name: connection.tenantName || 'Unknown Organization',
            organizationName: connection.tenantName || 'Unknown Organization',
            tenantName: connection.tenantName || 'Unknown Organization',
            tenantId: connection.tenantId // Ensure tenantId is available
          }));
          
          return res.json({
            success: true,
            data: {
              isConnected: true,
              connectionStatus: 'connected',
              message: 'Xero connected successfully',
              tenants: tenantsWithNames,
              tokenRefreshed: true
            }
          });
        } else {
          console.log('❌ Token refresh failed - Clearing expired tokens for company:', companyId);
          await clearExpiredTokens(companyId);
          return res.json({
            success: true,
            data: {
              isConnected: false,
              connectionStatus: 'refresh_failed',
              message: 'Token refresh failed. Tokens have been cleared. Please reconnect to Xero.',
              action: 'reconnect_required'
            }
          });
        }
      } catch (refreshError) {
        console.log('❌ Token refresh error - Clearing expired tokens for company:', companyId);
        await clearExpiredTokens(companyId);
        return res.json({
          success: true,
          data: {
            isConnected: false,
            connectionStatus: 'refresh_failed',
            message: 'Token refresh failed. Tokens have been cleared. Please reconnect to Xero.',
            action: 'reconnect_required'
          }
        });
      }
    }

    // Token is still valid, verify connection
    try {
      const tenantsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${settings.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Add tenant names to the response and ensure proper ID mapping
      const tenantsWithNames = tenantsResponse.data.map((connection) => ({
        id: connection.tenantId, // Use tenantId as the ID for API calls
        connectionId: connection.id, // Keep connection ID for reference
        name: connection.tenantName || 'Unknown Organization',
        organizationName: connection.tenantName || 'Unknown Organization',
        tenantName: connection.tenantName || 'Unknown Organization',
        tenantId: connection.tenantId // Ensure tenantId is available
      }));
      
      return res.json({
        success: true,
        data: {
          isConnected: true,
          connectionStatus: 'connected',
          message: 'Xero connected successfully',
          tenants: tenantsWithNames,
          tokenRefreshed: false
        }
      });
    } catch (error) {
      console.log('❌ Connection verification failed - Clearing expired tokens for company:', companyId);
      await clearExpiredTokens(companyId);
      return res.json({
        success: true,
        data: {
          isConnected: false,
          connectionStatus: 'connection_failed',
          message: 'Connection verification failed. Tokens have been cleared. Please reconnect to Xero.',
          action: 'reconnect_required'
        }
      });
    }

  } catch (error) {
    console.error('Get Connection Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get connection status',
      error: error.message
    });
  }
};

/**
 * Get organization details
 */
const getOrganizationDetails = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);

    if (!xeroSettings) {
      return res.status(404).json({
        success: false,
        message: 'Xero settings not found for this company'
      });
    }

    const accessToken = xeroSettings.access_token;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'No access token found. Please reconnect to Xero.'
      });
    }

    // Get the first tenant from connections
    let tenantId;
    try {
      const connectionsResponse = await axios.get('https://api.xero.com/connections', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (connectionsResponse.data && connectionsResponse.data.length > 0) {
        tenantId = connectionsResponse.data[0].tenantId;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No Xero organizations found. Please check your Xero account.'
        });
      }
    } catch (error) {
      console.error('Error getting Xero connections:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to get Xero organizations. Please reconnect to Xero.'
      });
    }

    const organization = await fetchXeroData(accessToken, tenantId, 'Organisations', {});

    res.json({
      success: true,
      message: 'Organization details retrieved successfully',
      data: organization
    });

  } catch (error) {
    console.error('Get Organization Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve organization details',
      error: error.message
    });
  }
};

/**
 * Get all purchase orders
 */
const getAllPurchaseOrders = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'PurchaseOrders', params);

    res.json({
      success: true,
      message: 'Purchase orders retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Purchase Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get purchase orders',
      error: error.message
    });
  }
};

/**
 * Get all receipts
 */
const getAllReceipts = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'Receipts', params);

    res.json({
      success: true,
      message: 'Receipts retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Receipts Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipts',
      error: error.message
    });
  }
};

/**
 * Get all credit notes
 */
const getAllCreditNotes = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'CreditNotes', params);

    res.json({
      success: true,
      message: 'Credit notes retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Credit Notes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit notes',
      error: error.message
    });
  }
};

/**
 * Get all manual journals
 */
const getAllManualJournals = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'ManualJournals', params);

    res.json({
      success: true,
      message: 'Manual journals retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Manual Journals Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get manual journals',
      error: error.message
    });
  }
};

/**
 * Get all prepayments
 */
const getAllPrepayments = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'Prepayments', params);

    res.json({
      success: true,
      message: 'Prepayments retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Prepayments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prepayments',
      error: error.message
    });
  }
};

/**
 * Get all overpayments
 */
const getAllOverpayments = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'Overpayments', params);

    res.json({
      success: true,
      message: 'Overpayments retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Overpayments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get overpayments',
      error: error.message
    });
  }
};

/**
 * Get all quotes
 */
const getAllQuotes = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { page = 1, pageSize = 50, status } = req.query;
    const params = { page, pageSize };
    if (status) params.status = status;

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, 'Quotes', params);

    res.json({
      success: true,
      message: 'Quotes retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Quotes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quotes',
      error: error.message
    });
  }
};

/**
 * Get all reports
 */
const getAllReports = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    const settings = await XeroSettings.getByCompanyId(companyId);

    if (!settings || !settings.access_token) {
      return res.status(400).json({
        success: false,
        message: 'Xero not connected. Please connect to Xero first.'
      });
    }

    const { reportID } = req.query;
    if (!reportID) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (tenantsResponse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No organizations found'
      });
    }

    const tenantId = tenantsResponse.data[0].tenantId;
    const data = await fetchXeroData(settings.access_token, tenantId, `Reports/${reportID}`);

    res.json({
      success: true,
      message: 'Report retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report',
      error: error.message
    });
  }
};

/**
 * Helper function to refresh Xero access token
 */
const refreshXeroToken = async (refreshToken, clientId, clientSecret) => {
  try {
    console.log('🔄 Refreshing Xero access token...');
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await axios.post('https://identity.xero.com/connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }
    });

    console.log('✅ Token refresh successful');
    
    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type
    };
  } catch (error) {
    console.error('❌ Token refresh failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Helper function to fetch Xero data
 */
const fetchXeroData = async (accessToken, tenantId, resourceType, params = {}) => {
  const baseUrl = 'https://api.xero.com/api.xro/2.0';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Xero-tenant-id': tenantId,
    'Accept': 'application/json'
  };

  let url = `${baseUrl}/${resourceType}`;
  
  // Add query parameters
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    url += `?${queryParams.toString()}`;
  }

  console.log(`🔍 Fetching Xero data: ${url}`);

  try {
    const response = await axios.get(url, { headers });
    console.log(`✅ Xero data fetched successfully: ${resourceType}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching Xero data (${resourceType}):`, error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  buildAuthUrl,
  handleCallback,
  getXeroData,
  refreshToken,
  getCompanyInfo,
  createXeroSettings,
  getXeroSettings,
  deleteXeroSettings,
  getAllXeroSettings,
  createXeroAuthState,
  getXeroAuthState,
  getConnectionStatus,
  getDashboardData,
  getFinancialSummary,
  getAllInvoices,
  getAllContacts,
  getAllBankTransactions,
  getAllAccounts,
  getAllItems,
  getAllTaxRates,
  getAllTrackingCategories,
  getOrganizationDetails,
  getAllPurchaseOrders,
  getAllReceipts,
  getAllCreditNotes,
  getAllManualJournals,
  getAllPrepayments,
  getAllOverpayments,
  getAllQuotes,
  getAllReports
}; 