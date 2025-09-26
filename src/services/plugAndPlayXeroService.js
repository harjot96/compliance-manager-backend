// Plug and Play Xero Service
// Service layer for Xero integration business logic
// This service handles complex Xero operations and data processing

const axios = require('axios');
const crypto = require('crypto-js');
const XeroSettings = require('../models/PlugAndPlayXeroSettings');

class PlugAndPlayXeroService {
  constructor() {
    this.xeroApiBaseUrl = process.env.XERO_API_BASE_URL || 'https://api.xero.com';
    this.tokenEncryptionKey = process.env.XERO_TOKEN_ENCRYPTION_KEY || 'default-encryption-key-change-in-production-32-chars';
    this.rateLimitDelay = 100; // milliseconds between requests
    this.maxRetries = 3;
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

  // Rate limiting helper
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Retry helper with exponential backoff
  async retryWithBackoff(fn, maxRetries = this.maxRetries) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        // Check if it's a rate limit error
        if (error.response?.status === 429) {
          const delayMs = Math.pow(2, attempt) * 1000;
          console.log(`⚠️ Rate limited, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`);
          await this.delay(delayMs);
        } else if (error.response?.status >= 500) {
          // Server error, retry with backoff
          const delayMs = Math.pow(2, attempt) * 500;
          console.log(`⚠️ Server error, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`);
          await this.delay(delayMs);
        } else {
          // Client error, don't retry
          throw error;
        }
      }
    }
  }

  // Get valid access token for company
  async getValidAccessToken(companyId) {
    const settings = await XeroSettings.findByCompanyId(companyId);
    if (!settings || !settings.accessToken) {
      throw new Error('No Xero access token found for company');
    }

    const accessToken = this.decrypt(settings.accessToken);
    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    // Check if token is expired
    if (settings.isTokenExpired()) {
      console.log('🔄 Token expired, refreshing...');
      await this.refreshAccessToken(companyId);
      
      // Get the new token
      const refreshedSettings = await XeroSettings.findByCompanyId(companyId);
      return this.decrypt(refreshedSettings.accessToken);
    }

    return accessToken;
  }

  // Refresh access token
  async refreshAccessToken(companyId) {
    const settings = await XeroSettings.findByCompanyId(companyId);
    if (!settings || !settings.refreshToken) {
      throw new Error('No refresh token available');
    }

    const refreshToken = this.decrypt(settings.refreshToken);
    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    try {
      const tokenResponse = await axios.post('https://identity.xero.com/connect/token', 
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
        tokenExpiresAt: expiresAt,
        syncStatus: 'active',
        errorMessage: null
      });

      console.log('✅ Token refreshed successfully');
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        tokenType: 'Bearer'
      };
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Update sync status to error
      await settings.update({
        syncStatus: 'error',
        errorMessage: error.message
      });
      
      throw error;
    }
  }

  // Make authenticated request to Xero API
  async makeXeroRequest(endpoint, accessToken, tenantId, options = {}) {
    const { method = 'GET', data = null, params = {} } = options;
    
    const url = `${this.xeroApiBaseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params
    };

    if (data && method !== 'GET') {
      config.data = data;
    }

    // Apply rate limiting
    await this.delay(this.rateLimitDelay);

    return this.retryWithBackoff(() => axios(config));
  }

  // Get all invoices for a company
  async getInvoices(companyId, tenantId, options = {}) {
    const { page = 1, pageSize = 100, dateFrom, dateTo, status } = options;
    
    const accessToken = await this.getValidAccessToken(companyId);
    const params = { page, pageSize };
    
    if (dateFrom) params.fromDate = dateFrom;
    if (dateTo) params.toDate = dateTo;
    if (status) params.status = status;

    const response = await this.makeXeroRequest('/api.xro/2.0/Invoices', accessToken, tenantId, { params });
    return response.data;
  }

  // Get all contacts for a company
  async getContacts(companyId, tenantId, options = {}) {
    const { page = 1, pageSize = 100, searchTerm } = options;
    
    const accessToken = await this.getValidAccessToken(companyId);
    const params = { page, pageSize };
    
    if (searchTerm) params.where = `Name.Contains("${searchTerm}")`;

    const response = await this.makeXeroRequest('/api.xro/2.0/Contacts', accessToken, tenantId, { params });
    return response.data;
  }

  // Get chart of accounts
  async getAccounts(companyId, tenantId) {
    const accessToken = await this.getValidAccessToken(companyId);
    const response = await this.makeXeroRequest('/api.xro/2.0/Accounts', accessToken, tenantId);
    return response.data;
  }

  // Get bank transactions
  async getBankTransactions(companyId, tenantId, options = {}) {
    const { page = 1, pageSize = 100, dateFrom, dateTo, bankAccountId } = options;
    
    const accessToken = await this.getValidAccessToken(companyId);
    const params = { page, pageSize };
    
    if (dateFrom) params.fromDate = dateFrom;
    if (dateTo) params.toDate = dateTo;
    if (bankAccountId) params.bankAccountId = bankAccountId;

    const response = await this.makeXeroRequest('/api.xro/2.0/BankTransactions', accessToken, tenantId, { params });
    return response.data;
  }

  // Get organization details
  async getOrganization(companyId, tenantId) {
    const accessToken = await this.getValidAccessToken(companyId);
    const response = await this.makeXeroRequest('/api.xro/2.0/Organisation', accessToken, tenantId);
    return response.data;
  }

  // Get financial summary
  async getFinancialSummary(companyId, tenantId) {
    try {
      const [invoices, contacts] = await Promise.all([
        this.getInvoices(companyId, tenantId, { pageSize: 1000 }),
        this.getContacts(companyId, tenantId, { pageSize: 1000 })
      ]);

      const invoiceData = invoices.Invoices || [];
      const contactData = contacts.Contacts || [];
      
      let totalRevenue = 0;
      let paidRevenue = 0;
      let outstandingRevenue = 0;
      let overdueAmount = 0;

      invoiceData.forEach(invoice => {
        const total = parseFloat(invoice.Total) || 0;
        const amountPaid = parseFloat(invoice.AmountPaid) || 0;
        
        totalRevenue += total;
        paidRevenue += amountPaid;
        outstandingRevenue += (total - amountPaid);
        
        if (invoice.Status === 'OVERDUE') {
          overdueAmount += (total - amountPaid);
        }
      });

      // Calculate some basic metrics
      const avgInvoiceValue = invoiceData.length > 0 ? totalRevenue / invoiceData.length : 0;
      const paidPercentage = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0;

      return {
        totalRevenue: totalRevenue.toFixed(2),
        paidRevenue: paidRevenue.toFixed(2),
        outstandingRevenue: outstandingRevenue.toFixed(2),
        overdueAmount: overdueAmount.toFixed(2),
        netIncome: (totalRevenue * 0.9).toFixed(2), // Estimate
        totalExpenses: (totalRevenue * 0.1).toFixed(2), // Estimate
        invoiceCount: invoiceData.length,
        contactCount: contactData.length,
        avgInvoiceValue: avgInvoiceValue.toFixed(2),
        paidPercentage: paidPercentage.toFixed(1),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Financial summary error:', error);
      throw error;
    }
  }

  // Get dashboard data
  async getDashboardData(companyId, tenantId) {
    try {
      const [invoicesResponse, contactsResponse, accountsResponse, orgResponse] = await Promise.all([
        this.getInvoices(companyId, tenantId, { pageSize: 10 }),
        this.getContacts(companyId, tenantId, { pageSize: 10 }),
        this.getAccounts(companyId, tenantId),
        this.getOrganization(companyId, tenantId)
      ]);

      const invoices = invoicesResponse.Invoices || [];
      const contacts = contactsResponse.Contacts || [];
      const accounts = accountsResponse.Accounts || [];
      const organization = orgResponse.Organisation?.[0] || {};

      let totalAmount = 0;
      let paidInvoices = 0;
      let overdueInvoices = 0;
      let draftInvoices = 0;

      invoices.forEach(invoice => {
        const total = parseFloat(invoice.Total) || 0;
        const amountPaid = parseFloat(invoice.AmountPaid) || 0;
        
        totalAmount += total;
        if (amountPaid > 0) paidInvoices++;
        if (invoice.Status === 'OVERDUE') overdueInvoices++;
        if (invoice.Status === 'DRAFT') draftInvoices++;
      });

      // Get recent bank transactions
      let recentTransactions = [];
      try {
        const transactionsResponse = await this.getBankTransactions(companyId, tenantId, { pageSize: 10 });
        recentTransactions = transactionsResponse.BankTransactions || [];
      } catch (error) {
        console.log('⚠️ Could not fetch bank transactions:', error.message);
      }

      return {
        summary: {
          totalInvoices: invoices.length,
          totalContacts: contacts.length,
          totalTransactions: recentTransactions.length,
          totalAccounts: accounts.length,
          totalAmount: totalAmount.toFixed(2),
          paidInvoices,
          overdueInvoices,
          draftInvoices
        },
        recentInvoices: invoices.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
        recentTransactions: recentTransactions.slice(0, 5),
        accounts: accounts.slice(0, 10),
        organization,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Dashboard data error:', error);
      throw error;
    }
  }

  // Sync company data (background job)
  async syncCompanyData(companyId) {
    try {
      const settings = await XeroSettings.findByCompanyId(companyId);
      if (!settings || !settings.isConnected()) {
        throw new Error('Company not connected to Xero');
      }

      const tenants = settings.getTenantList();
      if (!tenants || tenants.length === 0) {
        throw new Error('No tenants available for sync');
      }

      // Update sync status
      await settings.update({
        syncStatus: 'active',
        errorMessage: null,
        lastSyncAt: new Date()
      });

      // Sync data for each tenant
      for (const tenant of tenants) {
        try {
          console.log(`🔄 Syncing data for tenant: ${tenant.name}`);
          
          // Get basic data to verify connection
          await this.getOrganization(companyId, tenant.id);
          
          // You can add more sync operations here
          // For example: sync invoices, contacts, etc.
          
          console.log(`✅ Sync completed for tenant: ${tenant.name}`);
        } catch (tenantError) {
          console.error(`❌ Sync failed for tenant ${tenant.name}:`, tenantError.message);
        }
      }

      console.log(`✅ Data sync completed for company ${companyId}`);
    } catch (error) {
      console.error(`❌ Sync failed for company ${companyId}:`, error);
      
      // Update sync status to error
      const settings = await XeroSettings.findByCompanyId(companyId);
      if (settings) {
        await settings.update({
          syncStatus: 'error',
          errorMessage: error.message
        });
      }
      
      throw error;
    }
  }

  // Bulk sync all active integrations
  async bulkSyncActiveIntegrations() {
    try {
      const activeIntegrations = await XeroSettings.findActiveIntegrations();
      console.log(`🔄 Starting bulk sync for ${activeIntegrations.length} integrations`);

      const results = {
        successful: 0,
        failed: 0,
        errors: []
      };

      for (const integration of activeIntegrations) {
        try {
          await this.syncCompanyData(integration.companyId);
          results.successful++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            companyId: integration.companyId,
            error: error.message
          });
        }
      }

      console.log(`✅ Bulk sync completed: ${results.successful} successful, ${results.failed} failed`);
      return results;
    } catch (error) {
      console.error('❌ Bulk sync failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(companyId) {
    try {
      const settings = await XeroSettings.findByCompanyId(companyId);
      if (!settings) {
        return {
          status: 'not_configured',
          message: 'Xero integration not configured'
        };
      }

      if (!settings.isConnected()) {
        return {
          status: 'disconnected',
          message: 'Xero not connected'
        };
      }

      // Test API connection
      const tenants = settings.getTenantList();
      if (tenants.length === 0) {
        return {
          status: 'no_tenants',
          message: 'No Xero organizations available'
        };
      }

      try {
        await this.getOrganization(companyId, tenants[0].id);
        return {
          status: 'healthy',
          message: 'Xero integration is working properly'
        };
      } catch (error) {
        return {
          status: 'api_error',
          message: `API error: ${error.message}`
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Get integration statistics
  async getIntegrationStats() {
    try {
      const [
        totalIntegrations,
        activeIntegrations,
        expiredTokens,
        errorIntegrations
      ] = await Promise.all([
        XeroSettings.count(),
        XeroSettings.count({ where: { isActive: true } }),
        XeroSettings.findExpiredTokens(),
        XeroSettings.count({ where: { syncStatus: 'error' } })
      ]);

      return {
        total: totalIntegrations,
        active: activeIntegrations,
        inactive: totalIntegrations - activeIntegrations,
        expiredTokens: expiredTokens.length,
        errors: errorIntegrations,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Stats error:', error);
      throw error;
    }
  }
}

module.exports = new PlugAndPlayXeroService();
