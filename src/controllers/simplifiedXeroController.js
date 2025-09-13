const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/database');

/**
 * Get simplified Xero connection status
 * GET /api/xero/simplified/status
 */
const getSimplifiedXeroStatus = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    console.log(`🔍 Getting simplified Xero status for company ${companyId}`);

    // Check if company has Xero connection
    const result = await db.query(
      `SELECT 
        access_token, 
        refresh_token, 
        token_expires_at, 
        tenants, 
        selected_tenant_id,
        connected_at
       FROM xero_settings 
       WHERE company_id = $1 AND access_token IS NOT NULL`,
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          isConnected: false,
          connectionStatus: 'disconnected',
          message: 'Not connected to Xero',
          tenants: [],
          selectedTenant: null
        }
      });
    }

    const xeroSettings = result.rows[0];
    const tenants = xeroSettings.tenants || [];
    const selectedTenant = tenants.find(t => t.id === xeroSettings.selected_tenant_id) || null;

    // Check if token is expired
    const isTokenExpired = xeroSettings.token_expires_at && new Date(xeroSettings.token_expires_at) <= new Date();
    
    if (isTokenExpired) {
      console.log(`⏰ Token expired for company ${companyId}, attempting refresh...`);
      try {
        await refreshXeroToken(companyId);
        // Re-fetch the updated settings
        const updatedResult = await db.query(
          `SELECT access_token, refresh_token, token_expires_at, tenants, selected_tenant_id
           FROM xero_settings WHERE company_id = $1`,
          [companyId]
        );
        if (updatedResult.rows.length > 0) {
          const updatedSettings = updatedResult.rows[0];
          const updatedTenants = updatedSettings.tenants || [];
          const updatedSelectedTenant = updatedTenants.find(t => t.id === updatedSettings.selected_tenant_id) || null;
          
          return res.json({
            success: true,
            data: {
              isConnected: true,
              connectionStatus: 'connected',
              message: 'Successfully connected to Xero',
              tenants: updatedTenants,
              selectedTenant: updatedSelectedTenant
            }
          });
        }
      } catch (refreshError) {
        console.error(`❌ Token refresh failed for company ${companyId}:`, refreshError);
        // Clear expired tokens
        await clearExpiredTokens(companyId);
        return res.json({
          success: true,
          data: {
            isConnected: false,
            connectionStatus: 'disconnected',
            message: 'Xero connection expired. Please reconnect.',
            tenants: [],
            selectedTenant: null
          }
        });
      }
    }

    res.json({
      success: true,
      data: {
        isConnected: true,
        connectionStatus: 'connected',
        message: 'Successfully connected to Xero',
        tenants: tenants,
        selectedTenant: selectedTenant
      }
    });

  } catch (error) {
    console.error('❌ Error getting simplified Xero status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Xero connection status',
      message: error.message
    });
  }
};

/**
 * Start simplified Xero connection (one-click)
 * GET /api/xero/simplified/connect
 */
const startSimplifiedXeroConnection = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    console.log(`🚀 Starting simplified Xero connection for company ${companyId}`);

    // Generate secure state
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store OAuth state
    await db.query(
      `INSERT INTO xero_oauth_states (state, company_id, created_at, expires_at) 
       VALUES ($1, $2, NOW(), NOW() + INTERVAL '5 minutes')`,
      [state, companyId]
    );

    // Use master Xero app credentials
    const masterClientId = process.env.XERO_MASTER_CLIENT_ID;
    const masterRedirectUri = process.env.XERO_MASTER_REDIRECT_URI || 'https://compliance-manager-frontend.onrender.com/redirecturl';
    const scopes = process.env.XERO_SCOPES || 'offline_access accounting.transactions accounting.contacts accounting.settings';

    if (!masterClientId) {
      throw new Error('Master Xero client ID not configured');
    }

    // Build authorization URL
    const authUrl = `https://login.xero.com/identity/connect/authorize?` +
      `response_type=code&` +
      `client_id=${masterClientId}&` +
      `redirect_uri=${encodeURIComponent(masterRedirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${state}`;

    console.log(`✅ Generated simplified Xero auth URL for company ${companyId}`);
    console.log(`🔗 Auth URL: ${authUrl}`);

    res.json({
      success: true,
      data: {
        authUrl: authUrl,
        state: state
      }
    });

  } catch (error) {
    console.error('❌ Error starting simplified Xero connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start Xero connection',
      message: error.message
    });
  }
};

/**
 * Handle simplified Xero callback
 * POST /api/xero/simplified/callback
 */
const handleSimplifiedXeroCallback = async (req, res) => {
  try {
    const { code, state } = req.body;
    const companyId = req.user.companyId;
    
    console.log(`🔄 Handling simplified Xero callback for company ${companyId}`);

    if (!code || !state) {
      return res.status(400).json({
        success: false,
        error: 'Missing code or state parameter',
        message: 'Invalid OAuth callback'
      });
    }

    // Validate OAuth state
    const stateResult = await db.query(
      `SELECT company_id FROM xero_oauth_states 
       WHERE state = $1 AND company_id = $2 AND expires_at > NOW()`,
      [state, companyId]
    );

    if (stateResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OAuth state',
        message: 'OAuth state validation failed'
      });
    }

    // Clean up used state
    await db.query(`DELETE FROM xero_oauth_states WHERE state = $1`, [state]);

    // Exchange code for tokens using master app
    const masterClientId = process.env.XERO_MASTER_CLIENT_ID;
    const masterClientSecret = process.env.XERO_MASTER_CLIENT_SECRET;
    const masterRedirectUri = process.env.XERO_MASTER_REDIRECT_URI || 'https://compliance-manager-frontend.onrender.com/redirecturl';

    if (!masterClientId || !masterClientSecret) {
      throw new Error('Master Xero app credentials not configured');
    }

    const tokenResponse = await axios.post('https://identity.xero.com/connect/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: masterRedirectUri
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${masterClientId}:${masterClientSecret}`).toString('base64')}`
        }
      }
    );

    const tokens = tokenResponse.data;
    console.log(`✅ Token exchange successful for company ${companyId}`);

    // Get Xero tenants
    const tenantsResponse = await axios.get('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      }
    });

    const tenants = tenantsResponse.data.map(tenant => ({
      id: tenant.tenantId,
      name: tenant.tenantName,
      organizationName: tenant.tenantName
    }));

    // Auto-select best tenant (non-demo, or first available)
    const nonDemoTenant = tenants.find(t => 
      !t.name.toLowerCase().includes('demo') && 
      !t.name.toLowerCase().includes('test')
    );
    const selectedTenant = nonDemoTenant || tenants[0];

    // Store connection
    const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    
    await db.query(`
      INSERT INTO xero_settings 
      (company_id, access_token, refresh_token, token_expires_at, tenants, selected_tenant_id, connected_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (company_id) 
      DO UPDATE SET 
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        token_expires_at = EXCLUDED.token_expires_at,
        tenants = EXCLUDED.tenants,
        selected_tenant_id = EXCLUDED.selected_tenant_id,
        updated_at = NOW()
    `, [
      companyId,
      tokens.access_token,
      tokens.refresh_token,
      tokenExpiresAt,
      JSON.stringify(tenants),
      selectedTenant?.id
    ]);

    console.log(`✅ Simplified Xero connection stored for company ${companyId}`);

    res.json({
      success: true,
      data: {
        isConnected: true,
        connectionStatus: 'connected',
        message: 'Successfully connected to Xero',
        tenants: tenants,
        selectedTenant: selectedTenant
      }
    });

  } catch (error) {
    console.error('❌ Error handling simplified Xero callback:', error);
    
    let errorMessage = 'Failed to complete Xero connection';
    if (error.response?.status === 400) {
      errorMessage = 'Invalid authorization code';
    } else if (error.response?.status === 401) {
      errorMessage = 'Xero authorization failed';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      message: error.message
    });
  }
};

/**
 * Disconnect from simplified Xero
 * DELETE /api/xero/simplified/disconnect
 */
const disconnectSimplifiedXero = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    console.log(`🔌 Disconnecting simplified Xero for company ${companyId}`);

    // Clear Xero connection
    await db.query(
      `UPDATE xero_settings 
       SET access_token = NULL, refresh_token = NULL, token_expires_at = NULL, 
           tenants = NULL, selected_tenant_id = NULL, updated_at = NOW()
       WHERE company_id = $1`,
      [companyId]
    );

    console.log(`✅ Simplified Xero disconnected for company ${companyId}`);

    res.json({
      success: true,
      message: 'Successfully disconnected from Xero'
    });

  } catch (error) {
    console.error('❌ Error disconnecting simplified Xero:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect from Xero',
      message: error.message
    });
  }
};

/**
 * Get simplified Xero data
 * GET /api/xero/simplified/data/{resourceType}
 */
const getSimplifiedXeroData = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { resourceType } = req.params;
    const { tenantId } = req.query;
    
    console.log(`📊 Getting simplified Xero data for company ${companyId}:`, { resourceType, tenantId });

    // Get Xero connection
    const result = await db.query(
      `SELECT access_token, refresh_token, token_expires_at, tenants, selected_tenant_id
       FROM xero_settings 
       WHERE company_id = $1 AND access_token IS NOT NULL`,
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Xero connection not found',
        message: 'Please connect to Xero first'
      });
    }

    const xeroSettings = result.rows[0];
    let accessToken = xeroSettings.access_token;
    let selectedTenantId = tenantId || xeroSettings.selected_tenant_id;

    // Check if token is expired and refresh if needed
    const isTokenExpired = xeroSettings.token_expires_at && new Date(xeroSettings.token_expires_at) <= new Date();
    if (isTokenExpired) {
      console.log(`⏰ Token expired for company ${companyId}, refreshing...`);
      try {
        await refreshXeroToken(companyId);
        // Re-fetch the updated token
        const updatedResult = await db.query(
          `SELECT access_token FROM xero_settings WHERE company_id = $1`,
          [companyId]
        );
        if (updatedResult.rows.length > 0) {
          accessToken = updatedResult.rows[0].access_token;
        }
      } catch (refreshError) {
        console.error(`❌ Token refresh failed for company ${companyId}:`, refreshError);
        await clearExpiredTokens(companyId);
        return res.status(401).json({
          success: false,
          error: 'Xero authorization expired',
          message: 'Please reconnect to Xero',
          action: 'reconnect_required'
        });
      }
    }

    if (!selectedTenantId) {
      return res.status(400).json({
        success: false,
        error: 'No organization selected',
        message: 'Please select an organization first'
      });
    }

    // Get data from Xero API
    const data = await getXeroDataByType(accessToken, selectedTenantId, resourceType);

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('❌ Error getting simplified Xero data:', error);
    
    if (error.response?.status === 401) {
      // Token expired, clear it
      await clearExpiredTokens(req.user.companyId);
      return res.status(401).json({
        success: false,
        error: 'Xero authorization expired',
        message: 'Please reconnect to Xero',
        action: 'reconnect_required'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get Xero data',
      message: error.message
    });
  }
};

/**
 * Select simplified Xero tenant
 * POST /api/xero/simplified/select-tenant
 */
const selectSimplifiedXeroTenant = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { tenantId } = req.body;
    
    console.log(`🏢 Selecting simplified Xero tenant for company ${companyId}:`, tenantId);

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
        message: 'Please provide a valid tenant ID'
      });
    }

    // Update selected tenant
    await db.query(
      `UPDATE xero_settings 
       SET selected_tenant_id = $1, updated_at = NOW()
       WHERE company_id = $2`,
      [tenantId, companyId]
    );

    console.log(`✅ Simplified Xero tenant selected for company ${companyId}:`, tenantId);

    res.json({
      success: true,
      message: 'Tenant selected successfully'
    });

  } catch (error) {
    console.error('❌ Error selecting simplified Xero tenant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to select tenant',
      message: error.message
    });
  }
};

// Helper function to get Xero data by type
const getXeroDataByType = async (accessToken, tenantId, resourceType) => {
  const baseUrl = 'https://api.xero.com';
  let endpoint = '';

  switch (resourceType) {
    case 'invoices':
      endpoint = '/api.xro/2.0/Invoices';
      break;
    case 'contacts':
      endpoint = '/api.xro/2.0/Contacts';
      break;
    case 'bank-transactions':
      endpoint = '/api.xro/2.0/BankTransactions';
      break;
    case 'accounts':
      endpoint = '/api.xro/2.0/Accounts';
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
    case 'organization':
      endpoint = '/api.xro/2.0/Organisation';
      break;
    case 'purchase-orders':
      endpoint = '/api.xro/2.0/PurchaseOrders';
      break;
    case 'receipts':
      endpoint = '/api.xro/2.0/Receipts';
      break;
    case 'credit-notes':
      endpoint = '/api.xro/2.0/CreditNotes';
      break;
    case 'manual-journals':
      endpoint = '/api.xro/2.0/ManualJournals';
      break;
    case 'prepayments':
      endpoint = '/api.xro/2.0/Prepayments';
      break;
    case 'overpayments':
      endpoint = '/api.xro/2.0/Overpayments';
      break;
    case 'quotes':
      endpoint = '/api.xro/2.0/Quotes';
      break;
    case 'reports':
      endpoint = '/api.xro/2.0/Reports';
      break;
    default:
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }

  const response = await axios.get(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Xero-tenant-id': tenantId,
      'Accept': 'application/json'
    }
  });

  return response.data;
};

// Helper functions (imported from main xeroController)
const refreshXeroToken = async (companyId) => {
  // This function should be imported from the main xeroController
  // For now, we'll implement a basic version
  const result = await db.query(
    `SELECT refresh_token FROM xero_settings WHERE company_id = $1`,
    [companyId]
  );

  if (result.rows.length === 0) {
    throw new Error('No refresh token found');
  }

  const refreshToken = result.rows[0].refresh_token;
  const masterClientId = process.env.XERO_MASTER_CLIENT_ID;
  const masterClientSecret = process.env.XERO_MASTER_CLIENT_SECRET;

  const tokenResponse = await axios.post('https://identity.xero.com/connect/token', 
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${masterClientId}:${masterClientSecret}`).toString('base64')}`
      }
    }
  );

  const tokens = tokenResponse.data;
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await db.query(
    `UPDATE xero_settings 
     SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = NOW()
     WHERE company_id = $4`,
    [tokens.access_token, tokens.refresh_token, tokenExpiresAt, companyId]
  );

  return tokens;
};

const clearExpiredTokens = async (companyId) => {
  await db.query(
    `UPDATE xero_settings 
     SET access_token = NULL, refresh_token = NULL, token_expires_at = NULL, updated_at = NOW()
     WHERE company_id = $1`,
    [companyId]
  );
};

module.exports = {
  getSimplifiedXeroStatus,
  startSimplifiedXeroConnection,
  handleSimplifiedXeroCallback,
  disconnectSimplifiedXero,
  getSimplifiedXeroData,
  selectSimplifiedXeroTenant
};
