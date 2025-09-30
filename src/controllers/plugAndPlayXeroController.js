// Plug and Play Xero Controller
// Comprehensive controller for Xero integration with automatic token management
// This is a complete, self-contained Xero integration that can be easily integrated

const axios = require('axios');
const crypto = require('crypto-js');
const db = require('../config/database');

class PlugAndPlayXeroController {
  constructor() {
    this.xeroApiBaseUrl = process.env.XERO_API_BASE_URL || 'https://api.xero.com';
    this.tokenEncryptionKey = process.env.XERO_TOKEN_ENCRYPTION_KEY || 'default-encryption-key-change-in-production-32-chars';
    this.xeroAuthUrl = 'https://login.xero.com/identity/connect/authorize';
    this.xeroTokenUrl = 'https://identity.xero.com/connect/token';
  }

  // Encrypt sensitive data
  encrypt(text) {
    if (!text) return null;
    return crypto.AES.encrypt(text, this.tokenEncryptionKey).toString();
  }

  // Decrypt sensitive data
  decrypt(encryptedText) {
    if (!encryptedText) return null;
    try {
      const bytes = crypto.AES.decrypt(encryptedText, this.tokenEncryptionKey);
      return bytes.toString(crypto.enc.Utf8);
    } catch (error) {
      console.error('❌ Decryption error:', error);
      return null;
    }
  }

  // Generate OAuth state parameter
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Get Xero settings for company
  async getSettings(req, res) {
    try {
      const companyId = req.company.id;
      
      const result = await db.query(
        'SELECT id, company_id, client_id, client_secret, redirect_uri, created_at, updated_at FROM xero_settings WHERE company_id = $1',
        [companyId]
      );

      const settings = result.rows.length > 0 ? result.rows[0] : null;

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Xero settings not found for this company'
        });
      }

      // Get connection status
      const connectionStatus = await getConnectionStatusInternal(companyId);

      res.json({
        success: true,
        message: 'Xero settings retrieved successfully',
        data: {
          ...settings,
          ...connectionStatus
        }
      });
    } catch (error) {
      console.error('❌ Get settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve Xero settings',
        error: error.message
      });
    }
  }

  // Save Xero settings
  async saveSettings(req, res) {
    try {
      const companyId = req.company.id;
      const { clientId, clientSecret, redirectUri } = req.body;

      if (!clientId || !redirectUri) {
        return res.status(400).json({
          success: false,
          message: 'Client ID and Redirect URI are required'
        });
      }

      // Encrypt client secret if provided
      let encryptedClientSecret = null;
      if (clientSecret) {
        encryptedClientSecret = this.encrypt(clientSecret);
      }

      const [settings, created] = await XeroSettings.upsert({
        companyId,
        clientId,
        clientSecret: encryptedClientSecret,
        redirectUri,
        updatedAt: new Date()
      });

      res.json({
        success: true,
        message: created ? 'Xero settings created successfully' : 'Xero settings updated successfully',
        data: {
          id: settings.id,
          companyId: settings.companyId,
          clientId: settings.clientId,
          redirectUri: settings.redirectUri,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt
        }
      });
    } catch (error) {
      console.error('❌ Save settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save Xero settings',
        error: error.message
      });
    }
  }

  // Delete Xero settings
  async deleteSettings(req, res) {
    try {
      const companyId = req.company.id;

      const deleted = await XeroSettings.destroy({
        where: { companyId }
      });

      if (deleted === 0) {
        return res.status(404).json({
          success: false,
          message: 'Xero settings not found for this company'
        });
      }

      res.json({
        success: true,
        message: 'Xero settings deleted successfully',
        data: { companyId }
      });
    } catch (error) {
      console.error('❌ Delete settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete Xero settings',
        error: error.message
      });
    }
  }

  // Get connection status
  async getConnectionStatus(req, res) {
    try {
      const companyId = req.company.id;
      const status = await getConnectionStatusInternal(companyId);

      res.json({
        success: true,
        message: 'Connection status retrieved successfully',
        data: status
      });
    } catch (error) {
      console.error('❌ Get connection status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get connection status',
        error: error.message
      });
    }
  }

  // Generate OAuth authorization URL
  async getAuthUrl(req, res) {
    try {
      const companyId = req.company.id;
      const { redirect_uri, state } = req.query;
      
      console.log('🔧 getAuthUrl called with:', {
        companyId,
        redirect_uri,
        state: state ? `${state.substring(0, 8)}...` : 'NOT PROVIDED',
        queryParams: req.query
      });

      // Get company-specific Xero settings from database (same as existing Xero integration)
      const result = await db.query(
        'SELECT client_id, client_secret, redirect_uri FROM xero_settings WHERE company_id = $1',
        [companyId]
      );

      let clientId, clientSecret, redirectUri;

      if (result.rows.length > 0) {
        // Use company-specific settings (saved by admin)
        const settings = result.rows[0];
        clientId = settings.client_id;
        clientSecret = settings.client_secret;
        
        console.log('🔍 Found Xero settings in database');
        console.log('🔧 Client ID from database:', clientId ? `${clientId.substring(0, 8)}...` : 'NOT SET');
        console.log('🔧 Client Secret from database:', clientSecret ? 'SET' : 'NOT SET');
        
        // Validate client ID is properly set
        if (!clientId || clientId.trim() === '' || clientId === 'null' || clientId === 'undefined') {
          console.error('❌ Client ID is not properly configured:', clientId);
          return res.status(400).json({
            success: false,
            message: 'Xero Client ID is not configured. Please ask your administrator to configure Xero client credentials for your company.',
            error: 'CLIENT_ID_NOT_SET',
            details: 'The Xero Client ID is missing or invalid in the database settings.'
          });
        }
        
        // Validate client secret is properly set
        if (!clientSecret || clientSecret.trim() === '' || clientSecret === 'null' || clientSecret === 'undefined') {
          console.error('❌ Client Secret is not properly configured');
          return res.status(400).json({
            success: false,
            message: 'Xero Client Secret is not configured. Please ask your administrator to configure Xero client credentials for your company.',
            error: 'CLIENT_SECRET_NOT_SET',
            details: 'The Xero Client Secret is missing or invalid in the database settings.'
          });
        }
        
        // Override redirect URI based on environment (same logic as existing integration)
        const isDevelopment = process.env.NODE_ENV !== 'production';
        if (isDevelopment) {
          // For development, use production redirect URI since Xero app only has production URL registered
          redirectUri = 'https://compliance-manager-frontend.onrender.com/redirecturl';
          console.log('🔧 Development mode: Using production redirect URI (Xero app limitation)');
        } else {
          redirectUri = settings.redirect_uri || 'https://compliance-manager-frontend.onrender.com/redirecturl';
          console.log('🔧 Production mode: Using configured redirect URI');
        }
        
        console.log('✅ Using company-specific Xero credentials (saved by admin)');
        console.log('🔧 Client ID validated and ready for OAuth');
      } else {
        console.error('❌ No Xero settings found in database for company:', companyId);
        return res.status(400).json({
          success: false,
          message: 'Xero settings not found. Please ask your administrator to configure Xero client credentials for your company.',
          error: 'NO_XERO_SETTINGS',
          details: 'No Xero configuration found in database for this company.'
        });
      }

      const scopes = [
        'offline_access',
        'accounting.transactions',
        'accounting.contacts',
        'accounting.settings',
        'accounting.reports.read'
      ].join(' ');

      // Use the state parameter from frontend if provided, otherwise generate new one
      const oauthState = state && state.trim() !== '' ? state : this.generateState();
      
      console.log('🔧 OAuth state handling:', {
        frontendState: state ? `${state.substring(0, 8)}...` : 'NOT PROVIDED',
        finalState: `${oauthState.substring(0, 8)}...`,
        stateSource: state && state.trim() !== '' ? 'FRONTEND' : 'BACKEND_GENERATED'
      });
      
      // Store the state in database for validation during callback
      await db.query(
        'INSERT INTO xero_oauth_states (state, company_id, created_at) VALUES ($1, $2, NOW())',
        [oauthState, companyId]
      );
      console.log('✅ OAuth state stored in database for company:', companyId);
      
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirect_uri || redirectUri,
        scope: scopes,
        state: oauthState
      });

      const authUrl = `${this.xeroAuthUrl}?${params.toString()}`;

      res.json({
        success: true,
        message: 'Authorization URL generated successfully',
        data: {
          authUrl,
          state: params.get('state')
        }
      });
    } catch (error) {
      console.error('❌ Generate auth URL error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate authorization URL',
        error: error.message
      });
    }
  }

  // Handle OAuth callback
  async handleCallback(req, res) {
    try {
      const companyId = req.company.id;
      // Handle both GET (from Xero) and POST (from frontend) requests
      const { code, state, redirect_uri } = req.method === 'GET' ? req.query : req.body;
      
      console.log('🔧 handleCallback called with:', {
        method: req.method,
        companyId,
        code: code ? 'PRESENT' : 'MISSING',
        state: state ? `${state.substring(0, 8)}...` : 'MISSING',
        redirect_uri,
        source: req.method === 'GET' ? 'query' : 'body'
      });

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Authorization code is required'
        });
      }

      // Validate state parameter for OAuth security
      console.log('🔧 OAuth callback received:', {
        hasCode: !!code,
        hasState: !!state,
        stateValue: state ? `${state.substring(0, 8)}...` : 'MISSING',
        companyId: companyId
      });
      
      if (!state || state.trim() === '') {
        console.error('❌ OAuth state parameter missing or empty');
        return res.status(400).json({
          success: false,
          message: 'Invalid OAuth state parameter',
          error: 'INVALID_STATE'
        });
      }
      
      // Validate state against database
      console.log('🔧 Validating state in database:', state);
      const stateResult = await db.query(
        'SELECT company_id FROM xero_oauth_states WHERE state = $1 AND created_at > NOW() - INTERVAL \'10 minutes\'',
        [state]
      );
      
      console.log('🔧 State validation result:', {
        found: stateResult.rows.length > 0,
        rows: stateResult.rows
      });
      
      if (stateResult.rows.length === 0) {
        console.error('❌ Invalid or expired state');
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OAuth state',
          error: 'INVALID_STATE'
        });
      }
      
      // Verify the state belongs to the correct company
      const stateCompanyId = stateResult.rows[0].company_id;
      if (stateCompanyId !== companyId) {
        console.error('❌ State belongs to different company:', { stateCompanyId, requestCompanyId: companyId });
        return res.status(400).json({
          success: false,
          message: 'OAuth state mismatch',
          error: 'INVALID_STATE'
        });
      }
      
      console.log('✅ OAuth state validated for company:', companyId);

      // Get company-specific Xero settings from database (same as existing Xero integration)
      const settingsResult = await db.query(
        'SELECT client_id, client_secret, redirect_uri FROM xero_settings WHERE company_id = $1',
        [companyId]
      );

      if (settingsResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Xero settings not found. Please ask your administrator to configure Xero client credentials for your company.'
        });
      }

      const settings = settingsResult.rows[0];
      const clientId = settings.client_id;
      const clientSecret = settings.client_secret;
      
      if (!clientId || !clientSecret) {
        return res.status(400).json({
          success: false,
          message: 'Xero settings not configured. Please ask your administrator to configure Xero client credentials for your company.'
        });
      }

      // Exchange code for tokens
      const redirectUriForToken = redirect_uri || settings.redirect_uri;
      
      console.log('🔧 Token exchange parameters:', {
        grant_type: 'authorization_code',
        code: code ? 'PRESENT' : 'MISSING',
        redirect_uri: redirectUriForToken,
        client_id: clientId ? `${clientId.substring(0, 8)}...` : 'MISSING',
        client_secret: clientSecret ? 'SET' : 'MISSING',
        tokenUrl: this.xeroTokenUrl
      });
      
      const tokenResponse = await axios.post(this.xeroTokenUrl, 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUriForToken,
          client_id: clientId,
          client_secret: clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in, token_type } = tokenResponse.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Get tenant information
      const tenantsResponse = await axios.get(`${this.xeroApiBaseUrl}/connections`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      const tenants = tenantsResponse.data.map(tenant => ({
        id: tenant.tenantId,
        name: tenant.tenantName,
        organizationName: tenant.tenantName,
        tenantName: tenant.tenantName,
        tenantId: tenant.tenantId,
        shortCode: tenant.tenantType
      }));

      // Save tokens to database (same approach as existing Xero integration)
      await db.query(
        'UPDATE xero_settings SET access_token = $1, refresh_token = $2, token_expires_at = $3, tenant_id = $4, updated_at = CURRENT_TIMESTAMP WHERE company_id = $5',
        [
          this.encrypt(access_token),
          this.encrypt(refresh_token),
          expiresAt,
          tenants.length > 0 ? tenants[0].id : null,
          companyId
        ]
      );
      
      // Clean up the OAuth state (one-time use)
      await db.query('DELETE FROM xero_oauth_states WHERE state = $1', [state]);
      console.log('✅ OAuth state cleaned up after successful authorization');

      res.json({
        success: true,
        message: 'Xero authorization completed successfully',
        data: {
          tokens: {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            tokenType: token_type
          },
          tenants,
          companyId: companyId.toString()
        }
      });
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorCode = errorData?.error;
        const errorDescription = errorData?.error_description;
        
        console.error('❌ Xero OAuth error details:', {
          error: errorCode,
          description: errorDescription,
          fullResponse: errorData
        });
        
        let errorMessage = 'Invalid authorization code or configuration';
        
        if (errorCode === 'invalid_client') {
          errorMessage = 'Invalid Xero client credentials. Please check your Client ID and Client Secret configuration.';
        } else if (errorCode === 'invalid_grant') {
          errorMessage = 'Authorization code expired or invalid. Please try connecting to Xero again.';
        } else if (errorCode === 'invalid_redirect_uri') {
          errorMessage = 'Invalid redirect URI. Please check your Xero app configuration.';
        } else if (errorDescription) {
          errorMessage = errorDescription;
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          error: errorCode,
          details: errorDescription
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to complete Xero authorization',
        error: error.message
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken, companyId } = req.body;

      if (!refreshToken || !companyId) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token and company ID are required'
        });
      }

      const result = await this.refreshAccessTokenInternal(companyId);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh token',
        error: error.message
      });
    }
  }

  // Internal method to refresh access token
  async refreshAccessTokenInternal(companyId) {
    try {
      const settings = await XeroSettings.findOne({ where: { companyId } });
      if (!settings || !settings.refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshToken = this.decrypt(settings.refreshToken);
      if (!refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const tokenResponse = await axios.post(this.xeroTokenUrl, 
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: settings.clientId
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      await settings.update({
        accessToken: this.encrypt(access_token),
        refreshToken: this.encrypt(refresh_token),
        tokenExpiresAt: expiresAt
      });

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        tokenType: 'Bearer'
      };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      throw error;
    }
  }

  // Load Xero data
  async loadData(req, res) {
    try {
      const companyId = req.company.id;
      const { resourceType, tenantId, page = 1, pageSize = 50, filters, dateFrom, dateTo } = req.query;

      const settings = await XeroSettings.findOne({ where: { companyId } });
      if (!settings || !settings.accessToken) {
        return res.status(401).json({
          success: false,
          message: 'Xero not connected. Please connect your Xero account first.',
          action: 'connect_required'
        });
      }

      const accessToken = this.decrypt(settings.accessToken);
      if (!accessToken) {
        return res.status(401).json({
          success: false,
          message: 'Invalid access token. Please reconnect your Xero account.',
          action: 'reconnect_required'
        });
      }

      // Check if token needs refresh
      if (settings.tokenExpiresAt && new Date() >= new Date(settings.tokenExpiresAt)) {
        await this.refreshAccessTokenInternal(companyId);
        // Reload settings after refresh
        const refreshedSettings = await XeroSettings.findOne({ where: { companyId } });
        const newAccessToken = this.decrypt(refreshedSettings.accessToken);
        
        const data = await this.fetchXeroData(resourceType, newAccessToken, tenantId, {
          page, pageSize, filters, dateFrom, dateTo
        });

        return res.json({
          success: true,
          message: `${resourceType} retrieved successfully`,
          data: data,
          tokenRefreshed: true
        });
      }

      const data = await this.fetchXeroData(resourceType, accessToken, tenantId, {
        page, pageSize, filters, dateFrom, dateTo
      });

      res.json({
        success: true,
        message: `${resourceType} retrieved successfully`,
        data: data
      });
    } catch (error) {
      console.error(`❌ Load ${req.query.resourceType} error:`, error);
      
      if (error.response?.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Xero authorization expired. Please reconnect your account.',
          action: 'reconnect_required'
        });
      }

      res.status(500).json({
        success: false,
        message: `Failed to load ${req.query.resourceType}`,
        error: error.message
      });
    }
  }

  // Fetch data from Xero API
  async fetchXeroData(resourceType, accessToken, tenantId, options = {}) {
    const { page = 1, pageSize = 50, filters, dateFrom, dateTo } = options;

    let endpoint;
    const params = new URLSearchParams();

    switch (resourceType) {
      case 'invoices':
        endpoint = '/api.xro/2.0/Invoices';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'contacts':
        endpoint = '/api.xro/2.0/Contacts';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'accounts':
        endpoint = '/api.xro/2.0/Accounts';
        break;
      case 'bank-transactions':
        endpoint = '/api.xro/2.0/BankTransactions';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'organization':
        endpoint = '/api.xro/2.0/Organisation';
        break;
      case 'items':
        endpoint = '/api.xro/2.0/Items';
        break;
      case 'tax-rates':
        endpoint = '/api.xro/2.0/TaxRates';
        break;
      case 'tracking-categories':
        endpoint = '/api.xro/2.0/TrackingCategories';
        break;
      case 'purchase-orders':
        endpoint = '/api.xro/2.0/PurchaseOrders';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'receipts':
        endpoint = '/api.xro/2.0/Receipts';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'credit-notes':
        endpoint = '/api.xro/2.0/CreditNotes';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'manual-journals':
        endpoint = '/api.xro/2.0/ManualJournals';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'prepayments':
        endpoint = '/api.xro/2.0/Prepayments';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'overpayments':
        endpoint = '/api.xro/2.0/Overpayments';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'quotes':
        endpoint = '/api.xro/2.0/Quotes';
        params.append('page', page);
        if (pageSize) params.append('pageSize', Math.min(pageSize, 100));
        break;
      case 'financial-summary':
        return await this.getFinancialSummary(accessToken, tenantId);
      case 'dashboard-data':
        return await this.getDashboardData(accessToken, tenantId);
      default:
        throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    if (dateFrom) params.append('fromDate', dateFrom);
    if (dateTo) params.append('toDate', dateTo);

    const url = `${this.xeroApiBaseUrl}${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
        'Accept': 'application/json'
      }
    });

    return response.data;
  }

  // Get financial summary
  async getFinancialSummary(accessToken, tenantId) {
    try {
      // Get invoices for financial summary
      const invoicesResponse = await axios.get(`${this.xeroApiBaseUrl}/api.xro/2.0/Invoices`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
          'Accept': 'application/json'
        }
      });

      const invoices = invoicesResponse.data.Invoices || [];
      
      let totalRevenue = 0;
      let paidRevenue = 0;
      let outstandingRevenue = 0;

      invoices.forEach(invoice => {
        const total = parseFloat(invoice.Total) || 0;
        const amountPaid = parseFloat(invoice.AmountPaid) || 0;
        
        totalRevenue += total;
        paidRevenue += amountPaid;
        outstandingRevenue += (total - amountPaid);
      });

      return {
        totalRevenue: totalRevenue.toFixed(2),
        paidRevenue: paidRevenue.toFixed(2),
        outstandingRevenue: outstandingRevenue.toFixed(2),
        netIncome: (totalRevenue * 0.9).toFixed(2), // Estimate
        totalExpenses: (totalRevenue * 0.1).toFixed(2), // Estimate
        invoiceCount: invoices.length,
        transactionCount: 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Financial summary error:', error);
      throw error;
    }
  }

  // Get dashboard data
  async getDashboardData(accessToken, tenantId) {
    try {
      const [invoicesResponse, contactsResponse, accountsResponse, orgResponse] = await Promise.all([
        axios.get(`${this.xeroApiBaseUrl}/api.xro/2.0/Invoices?pageSize=10`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Xero-tenant-id': tenantId,
            'Accept': 'application/json'
          }
        }),
        axios.get(`${this.xeroApiBaseUrl}/api.xro/2.0/Contacts?pageSize=10`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Xero-tenant-id': tenantId,
            'Accept': 'application/json'
          }
        }),
        axios.get(`${this.xeroApiBaseUrl}/api.xro/2.0/Accounts`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Xero-tenant-id': tenantId,
            'Accept': 'application/json'
          }
        }),
        axios.get(`${this.xeroApiBaseUrl}/api.xro/2.0/Organisation`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Xero-tenant-id': tenantId,
            'Accept': 'application/json'
          }
        })
      ]);

      const invoices = invoicesResponse.data.Invoices || [];
      const contacts = contactsResponse.data.Contacts || [];
      const accounts = accountsResponse.data.Accounts || [];
      const organization = orgResponse.data.Organisation?.[0] || {};

      let totalAmount = 0;
      let paidInvoices = 0;
      let overdueInvoices = 0;

      invoices.forEach(invoice => {
        const total = parseFloat(invoice.Total) || 0;
        const amountPaid = parseFloat(invoice.AmountPaid) || 0;
        
        totalAmount += total;
        if (amountPaid > 0) paidInvoices++;
        if (invoice.Status === 'OVERDUE') overdueInvoices++;
      });

      return {
        summary: {
          totalInvoices: invoices.length,
          totalContacts: contacts.length,
          totalTransactions: 0,
          totalAccounts: accounts.length,
          totalAmount: totalAmount.toFixed(2),
          paidInvoices,
          overdueInvoices
        },
        recentInvoices: invoices.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
        recentTransactions: [],
        accounts: accounts.slice(0, 10),
        organization
      };
    } catch (error) {
      console.error('❌ Dashboard data error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(req, res) {
    try {
      const companyId = req.company.id;
      const status = await getConnectionStatusInternal(companyId);
      
      res.json({
        success: true,
        message: 'Xero integration health check passed',
        data: {
          status: status.connected ? 'healthy' : 'disconnected',
          connected: status.connected,
          lastChecked: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Health check error:', error);
      res.status(500).json({
        success: false,
        message: 'Xero integration health check failed',
        error: error.message
      });
    }
  }

  // Demo data for testing
  async getDemoData(req, res) {
    try {
      const { resourceType } = req.params;

      const demoData = {
        invoices: {
          Invoices: [
            {
              InvoiceID: 'demo-invoice-1',
              InvoiceNumber: 'INV-001',
              Contact: {
                ContactID: 'demo-contact-1',
                Name: 'Demo Customer',
                EmailAddress: 'demo@customer.com'
              },
              Date: '2024-01-01',
              DueDate: '2024-01-15',
              Status: 'AUTHORISED',
              LineAmountTypes: 'Exclusive',
              LineItems: [
                {
                  Description: 'Demo Product',
                  Quantity: 1,
                  UnitAmount: 100.00,
                  LineAmount: 100.00
                }
              ],
              SubTotal: 100.00,
              TotalTax: 10.00,
              Total: 110.00,
              AmountPaid: 0,
              AmountDue: 110.00
            }
          ]
        },
        contacts: {
          Contacts: [
            {
              ContactID: 'demo-contact-1',
              ContactNumber: 'C-001',
              ContactStatus: 'ACTIVE',
              Name: 'Demo Customer',
              FirstName: 'Demo',
              LastName: 'Customer',
              EmailAddress: 'demo@customer.com',
              AccountsReceivable: {
                Outstanding: 110.00,
                Overdue: 0
              }
            }
          ]
        },
        accounts: {
          Accounts: [
            {
              AccountID: 'demo-account-1',
              Code: '200',
              Name: 'Sales',
              Type: 'REVENUE',
              Status: 'ACTIVE',
              Description: 'Sales revenue account'
            }
          ]
        },
        organization: {
          Organisation: [
            {
              OrganisationID: 'demo-org-1',
              LegalName: 'Demo Organization Ltd',
              Name: 'Demo Organization',
              OrganisationEntityType: 'COMPANY',
              BaseCurrency: 'AUD',
              CountryCode: 'AU',
              OrganisationStatus: 'ACTIVE'
            }
          ]
        }
      };

      const data = demoData[resourceType];
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Demo data not available for ${resourceType}`
        });
      }

      res.json({
        success: true,
        message: `Demo ${resourceType} data retrieved successfully`,
        data: data
      });
    } catch (error) {
      console.error(`❌ Demo data error:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to load demo data',
        error: error.message
      });
    }
  }

  // Super Admin: Auto-link Xero settings to all companies
  async autoLinkToAllCompanies(req, res) {
    try {
      // Check if user is super admin
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Super admin privileges required.'
        });
      }

      const { clientId, clientSecret, redirectUri } = req.body;

      if (!clientId || !clientSecret || !redirectUri) {
        return res.status(400).json({
          success: false,
          message: 'Client ID, Client Secret, and Redirect URI are required'
        });
      }

      // Get all companies
      const companiesResult = await db.query('SELECT id, name FROM companies WHERE is_active = true');
      const companies = companiesResult.rows;

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Encrypt client secret
      const encryptedClientSecret = this.encrypt(clientSecret);

      // Apply settings to all companies
      for (const company of companies) {
        try {
          // Check if settings already exist
          const existingResult = await db.query(
            'SELECT id FROM xero_settings WHERE company_id = $1',
            [company.id]
          );

          if (existingResult.rows.length > 0) {
            // Update existing settings
            await db.query(
              'UPDATE xero_settings SET client_id = $1, client_secret = $2, redirect_uri = $3, updated_at = CURRENT_TIMESTAMP WHERE company_id = $4',
              [clientId, encryptedClientSecret, redirectUri, company.id]
            );
          } else {
            // Create new settings
            await db.query(
              'INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
              [company.id, clientId, encryptedClientSecret, redirectUri]
            );
          }
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            companyId: company.id,
            companyName: company.name,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        message: `Xero settings applied to ${successCount} companies successfully`,
        data: {
          totalCompanies: companies.length,
          successCount,
          errorCount,
          errors: errors.length > 0 ? errors : undefined
        }
      });

    } catch (error) {
      console.error('❌ Auto-link to all companies error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to auto-link Xero settings to all companies',
        error: error.message
      });
    }
  }

  // Super Admin: Get Xero settings status for all companies
  async getAllCompaniesXeroStatus(req, res) {
    try {
      // Check if user is super admin
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Super admin privileges required.'
        });
      }

      const result = await db.query(`
        SELECT 
          c.id,
          c.name,
          c.created_at,
          xs.client_id,
          xs.redirect_uri,
          xs.access_token,
          xs.refresh_token,
          xs.token_expires_at,
          xs.tenant_id,
          xs.created_at as xero_created_at,
          xs.updated_at as xero_updated_at,
          CASE 
            WHEN xs.client_id IS NOT NULL AND xs.redirect_uri IS NOT NULL THEN true 
            ELSE false 
          END as has_credentials,
          CASE 
            WHEN xs.access_token IS NOT NULL AND xs.refresh_token IS NOT NULL 
                 AND (xs.token_expires_at IS NULL OR xs.token_expires_at > NOW()) THEN true 
            ELSE false 
          END as has_valid_tokens
        FROM companies c
        LEFT JOIN xero_settings xs ON c.id = xs.company_id
        WHERE c.is_active = true
        ORDER BY c.name
      `);

      const companies = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        xeroSettings: {
          hasSettings: !!row.client_id,
          hasCredentials: row.has_credentials,
          hasValidTokens: row.has_valid_tokens,
          isConnected: row.has_credentials && row.has_valid_tokens,
          tenantId: row.tenant_id,
          lastUpdated: row.xero_updated_at,
          createdAt: row.xero_created_at
        }
      }));

      const stats = {
        totalCompanies: companies.length,
        withSettings: companies.filter(c => c.xeroSettings.hasSettings).length,
        withCredentials: companies.filter(c => c.xeroSettings.hasCredentials).length,
        connected: companies.filter(c => c.xeroSettings.isConnected).length,
        withoutSettings: companies.filter(c => !c.xeroSettings.hasSettings).length
      };

      res.json({
        success: true,
        message: 'Xero settings status retrieved successfully',
        data: {
          companies,
          stats
        }
      });

    } catch (error) {
      console.error('❌ Get all companies Xero status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get Xero settings status for all companies',
        error: error.message
      });
    }
  }

  // Auto-link Xero settings to a new company (called when company is created)
  async autoLinkToNewCompany(companyId, defaultSettings = null) {
    try {
      // Check if settings already exist for this company
      const existingResult = await db.query(
        'SELECT id FROM xero_settings WHERE company_id = $1',
        [companyId]
      );

      if (existingResult.rows.length > 0) {
        console.log(`✅ Xero settings already exist for company ${companyId}`);
        return { success: true, message: 'Settings already exist' };
      }

      // Get default settings from the first company that has Xero settings
      let settingsToUse = defaultSettings;
      
      if (!settingsToUse) {
        const defaultResult = await db.query(`
          SELECT client_id, client_secret, redirect_uri 
          FROM xero_settings 
          WHERE client_id IS NOT NULL AND client_secret IS NOT NULL 
          ORDER BY created_at ASC 
          LIMIT 1
        `);
        
        if (defaultResult.rows.length > 0) {
          settingsToUse = defaultResult.rows[0];
        }
      }

      if (settingsToUse && settingsToUse.client_id && settingsToUse.client_secret) {
        // Create new settings for the company
        await db.query(
          'INSERT INTO xero_settings (company_id, client_id, client_secret, redirect_uri, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
          [companyId, settingsToUse.client_id, settingsToUse.client_secret, settingsToUse.redirect_uri]
        );

        console.log(`✅ Auto-linked Xero settings to new company ${companyId}`);
        return { success: true, message: 'Settings auto-linked successfully' };
      } else {
        console.log(`⚠️ No default Xero settings found to auto-link to company ${companyId}`);
        return { success: false, message: 'No default settings available' };
      }

    } catch (error) {
      console.error(`❌ Failed to auto-link Xero settings to company ${companyId}:`, error);
      return { success: false, message: error.message };
    }
  }

}

// Internal function to get connection status
async function getConnectionStatusInternal(companyId) {
  try {
    const result = await db.query(
      'SELECT client_id, client_secret, redirect_uri, access_token, refresh_token, token_expires_at, tenant_id, organization_name, tenant_data, updated_at FROM xero_settings WHERE company_id = $1',
      [companyId]
    );
    
    const settings = result.rows.length > 0 ? result.rows[0] : null;
    
    if (!settings) {
      return {
        connected: false,
        hasCredentials: false,
        needsOAuth: true,
        connectionStatus: 'not_configured',
        message: 'Xero integration not configured',
        tenants: []
      };
    }

    const hasCredentials = !!(settings.client_id && settings.redirect_uri);
    const hasValidTokens = !!(settings.access_token && settings.refresh_token);
    
    // Check if tokens are expired
    let tokensValid = false;
    if (settings.access_token && settings.token_expires_at) {
      tokensValid = new Date() < new Date(settings.token_expires_at);
    }
    
    const connected = hasCredentials && hasValidTokens && tokensValid;

    // Parse tenant data if available
    let tenants = [];
    let organizationName = settings.organization_name;
    
    if (settings.tenant_id) {
      // Try to extract organization name from tenant_data if organization_name is not set
      if (!organizationName && settings.tenant_data) {
        try {
          const tenantData = JSON.parse(settings.tenant_data);
          if (tenantData && tenantData.length > 0) {
            organizationName = tenantData[0].organisationName || tenantData[0].tenantName;
          }
        } catch (e) {
          console.log('Failed to parse tenant_data:', e.message);
        }
      }
      
      tenants = [{
        id: settings.tenant_id,
        name: organizationName || 'Organization',
        organizationName: organizationName || 'Organization'
      }];
    }

    return {
      connected,
      hasCredentials,
      hasValidTokens: tokensValid,
      needsOAuth: hasCredentials && (!hasValidTokens || !tokensValid),
      connectionStatus: connected ? 'connected' : (hasCredentials ? 'disconnected' : 'not_configured'),
      message: connected ? 'Xero connected successfully' : 
               hasCredentials ? 'Not connected to Xero' : 'Xero integration not configured',
      tenants,
      lastConnected: settings.updated_at,
      tokenExpiresAt: settings.token_expires_at
    };
  } catch (error) {
    console.error('❌ Connection status error:', error);
    return {
      connected: false,
      hasCredentials: false,
      needsOAuth: true,
      connectionStatus: 'error',
      message: 'Error checking connection status',
      tenants: []
    };
  }
}

module.exports = new PlugAndPlayXeroController();
