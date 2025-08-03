const axios = require('axios');
const crypto = require('crypto');
const XeroConnection = require('../models/XeroConnection');

class XeroService {
  constructor() {
    this.clientId = process.env.XERO_CLIENT_ID;
    this.clientSecret = process.env.XERO_CLIENT_SECRET;
    this.redirectUri = process.env.XERO_REDIRECT_URI;
    this.webhookSigningKey = process.env.XERO_WEBHOOK_SIGNING_KEY;
    this.baseUrl = 'https://api.xero.com/api.xro/2.0';
    this.authUrl = 'https://login.xero.com/identity/connect/authorize';
    this.tokenUrl = 'https://identity.xero.com/connect/token';
    
    // Rate limiting
    this.requestQueue = [];
    this.maxConcurrency = 5;
    this.activeRequests = 0;
  }

  /**
   * Build OAuth2 authorization URL
   */
  buildAuthUrl(state = null) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'openid profile email accounting.transactions accounting.contacts accounting.settings offline_access',
      state: state || crypto.randomBytes(16).toString('hex')
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code) {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      });

      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
        }
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('❌ Error exchanging code for tokens:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });

      const response = await axios.post(this.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
        }
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type
      };
    } catch (error) {
      console.error('❌ Error refreshing access token:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get valid access token with auto-refresh
   */
  async getValidAccessToken(connectionId) {
    try {
      const connection = await XeroConnection.getConnectionById(connectionId);
      if (!connection) {
        throw new Error('Connection not found');
      }

      // Check if token is expired (with 5 minute buffer)
      const expiresAt = new Date(connection.accessTokenExpiresAt);
      const now = new Date();
      const bufferTime = 5 * 60 * 1000; // 5 minutes

      if (now.getTime() + bufferTime >= expiresAt.getTime()) {
        console.log('🔄 Refreshing expired access token');
        
        const newTokens = await this.refreshAccessToken(connection.refreshToken);
        const newExpiresAt = new Date(now.getTime() + (newTokens.expiresIn * 1000));

        // Atomic update
        await XeroConnection.updateAccessToken(
          connectionId,
          newTokens.accessToken,
          newTokens.refreshToken,
          newExpiresAt
        );

        return newTokens.accessToken;
      }

      return connection.accessToken;
    } catch (error) {
      if (error.message.includes('invalid_grant')) {
        // Mark connection as expired
        await XeroConnection.updateConnectionStatus(connectionId, 'expired');
        throw new Error('Access token expired and refresh failed');
      }
      throw error;
    }
  }

  /**
   * Create Axios instance with authentication
   */
  async createAuthenticatedClient(connectionId) {
    const accessToken = await this.getValidAccessToken(connectionId);
    const connection = await XeroConnection.getConnectionById(connectionId);

    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': connection.tenantId,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * Rate-limited request wrapper
   */
  async makeRequest(connectionId, requestFn) {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        if (this.activeRequests >= this.maxConcurrency) {
          // Wait for a slot to become available
          setTimeout(executeRequest, 100);
          return;
        }

        this.activeRequests++;

        try {
          const client = await this.createAuthenticatedClient(connectionId);
          const result = await requestFn(client);
          resolve(result);
        } catch (error) {
          // Handle rate limiting and retries
          if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 60;
            console.log(`⏳ Rate limited, retrying after ${retryAfter} seconds`);
            setTimeout(() => {
              this.activeRequests--;
              this.makeRequest(connectionId, requestFn).then(resolve).catch(reject);
            }, retryAfter * 1000);
            return;
          }

          if (error.response?.status >= 500) {
            console.log('🔄 Server error, retrying in 5 seconds');
            setTimeout(() => {
              this.activeRequests--;
              this.makeRequest(connectionId, requestFn).then(resolve).catch(reject);
            }, 5000);
            return;
          }

          reject(error);
        } finally {
          this.activeRequests--;
        }
      };

      executeRequest();
    });
  }

  /**
   * Get Xero tenants/organizations
   */
  async getTenants(connectionId) {
    return this.makeRequest(connectionId, async (client) => {
      const response = await client.get('/connections');
      return response.data;
    });
  }

  /**
   * Get invoices with pagination and filtering
   */
  async getInvoices(connectionId, options = {}) {
    return this.makeRequest(connectionId, async (client) => {
      const {
        where = '',
        order = '',
        page = 1,
        pageSize = 100,
        modifiedSince = null
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: Math.min(pageSize, 100).toString() // Cap at 100
      });

      if (where) params.append('where', where);
      if (order) params.append('order', order);
      if (modifiedSince) {
        params.append('modifiedAfter', new Date(modifiedSince).toISOString());
      }

      const response = await client.get(`/invoices?${params.toString()}`);
      return response.data;
    });
  }

  /**
   * Get contacts with pagination and filtering
   */
  async getContacts(connectionId, options = {}) {
    return this.makeRequest(connectionId, async (client) => {
      const {
        where = '',
        order = '',
        page = 1,
        pageSize = 100,
        modifiedSince = null
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: Math.min(pageSize, 100).toString()
      });

      if (where) params.append('where', where);
      if (order) params.append('order', order);
      if (modifiedSince) {
        params.append('modifiedAfter', new Date(modifiedSince).toISOString());
      }

      const response = await client.get(`/contacts?${params.toString()}`);
      return response.data;
    });
  }

  /**
   * Get bank transactions with pagination and filtering
   */
  async getBankTransactions(connectionId, options = {}) {
    return this.makeRequest(connectionId, async (client) => {
      const {
        where = '',
        order = '',
        page = 1,
        pageSize = 100,
        modifiedSince = null
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: Math.min(pageSize, 100).toString()
      });

      if (where) params.append('where', where);
      if (order) params.append('order', order);
      if (modifiedSince) {
        params.append('modifiedAfter', new Date(modifiedSince).toISOString());
      }

      const response = await client.get(`/banktransactions?${params.toString()}`);
      return response.data;
    });
  }

  /**
   * Get accounts
   */
  async getAccounts(connectionId, options = {}) {
    return this.makeRequest(connectionId, async (client) => {
      const {
        where = '',
        order = '',
        page = 1,
        pageSize = 100
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: Math.min(pageSize, 100).toString()
      });

      if (where) params.append('where', where);
      if (order) params.append('order', order);

      const response = await client.get(`/accounts?${params.toString()}`);
      return response.data;
    });
  }

  /**
   * Get items
   */
  async getItems(connectionId, options = {}) {
    return this.makeRequest(connectionId, async (client) => {
      const {
        where = '',
        order = '',
        page = 1,
        pageSize = 100
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: Math.min(pageSize, 100).toString()
      });

      if (where) params.append('where', where);
      if (order) params.append('order', order);

      const response = await client.get(`/items?${params.toString()}`);
      return response.data;
    });
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSigningKey)
        .update(payload)
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('❌ Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Parse webhook payload
   */
  parseWebhookPayload(payload) {
    try {
      const data = JSON.parse(payload);
      
      if (!data.events || !Array.isArray(data.events)) {
        throw new Error('Invalid webhook payload format');
      }

      return data.events.map(event => ({
        eventId: event.eventId,
        eventType: event.eventType,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        eventDate: new Date(event.eventDate),
        payload: event
      }));
    } catch (error) {
      console.error('❌ Error parsing webhook payload:', error);
      throw new Error('Invalid webhook payload');
    }
  }
}

module.exports = new XeroService(); 