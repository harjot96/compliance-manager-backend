const axios = require('axios');
const crypto = require('crypto');
const CompanyCompliance = require('../models/CompanyCompliance');
const XeroSettings = require('../models/XeroSettings');

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
    // Check if user is super admin
    if (req.company.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admins cannot setup Xero accounts. Only regular companies can setup Xero integration.'
      });
    }

    // Company enrollment check disabled - Xero integration works independently
    const companyId = req.company.id;

    // Get company's Xero settings
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);
    if (!xeroSettings) {
      return res.status(400).json({
        success: false,
        message: 'Xero settings not configured for this company. Please configure Xero settings first.'
      });
    }

    const state = crypto.randomBytes(16).toString('hex');
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: xeroSettings.client_id,
      redirect_uri: xeroSettings.redirect_uri,
      scope: 'openid profile email accounting.transactions accounting.contacts accounting.settings offline_access',
      state: state
    });

    const authUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
    
    res.json({
      success: true,
      message: 'Authorization URL generated successfully',
      data: {
        authUrl,
        state
      }
    });
  } catch (error) {
    console.error('Build Auth URL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL',
      error: error.message
    });
  }
};

/**
 * Handle OAuth2 callback and exchange code for tokens
 */
const handleCallback = async (req, res, next) => {
  try {
    // Check if user is super admin
    if (req.company.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admins cannot setup Xero accounts. Only regular companies can setup Xero integration.'
      });
    }

    // Company enrollment check disabled - Xero integration works independently
    const companyId = req.company.id;

    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Get company's Xero settings
    const xeroSettings = await XeroSettings.getByCompanyId(companyId);
    if (!xeroSettings) {
      return res.status(400).json({
        success: false,
        message: 'Xero settings not configured for this company. Please configure Xero settings first.'
      });
    }

    // Exchange code for tokens
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: xeroSettings.redirect_uri
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

    // Get available tenants/organizations
    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const tenants = tenantsResponse.data;

    res.json({
      success: true,
      message: 'Xero authentication successful',
      data: {
        tokens,
        tenants,
        companyId: req.company.id
      }
    });

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete OAuth flow',
      error: error.message
    });
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
      'invoices', 
      'contacts', 
      'bank-transactions', 
      'accounts', 
      'items',
      'tax-rates',
      'tracking-categories',
      'organization'
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

    res.json({
      success: true,
      message: 'Xero settings retrieved successfully',
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

module.exports = {
  buildAuthUrl,
  handleCallback,
  getXeroData,
  refreshToken,
  getCompanyInfo,
  createXeroSettings,
  getXeroSettings,
  deleteXeroSettings,
  getAllXeroSettings
}; 