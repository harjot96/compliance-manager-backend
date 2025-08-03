const XeroService = require('../services/XeroService');
const XeroConnection = require('../models/XeroConnection');
const XeroSyncCursor = require('../models/XeroSyncCursor');
const XeroWebhookEvent = require('../models/XeroWebhookEvent');
const Joi = require('joi');

/**
 * Build OAuth2 authorization URL
 */
const buildAuthUrl = async (req, res, next) => {
  try {
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = XeroService.buildAuthUrl(state);
    
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
 * Handle OAuth2 callback and create connections
 */
const handleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const { tenantIds } = req.body; // Array of selected tenant IDs

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange code for tokens
    const tokens = await XeroService.exchangeCodeForTokens(code);
    
    // Get available tenants
    const tempConnection = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + (tokens.expiresIn * 1000))
    };

    // Create temporary client to get tenants
    const client = axios.create({
      baseURL: XeroService.baseUrl,
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const tenantsResponse = await client.get('/connections');
    const availableTenants = tenantsResponse.data;

    // If no specific tenants selected, use all available
    const selectedTenants = tenantIds && tenantIds.length > 0 
      ? availableTenants.filter(t => tenantIds.includes(t.id))
      : availableTenants;

    // Create connections for selected tenants
    const connections = [];
    for (const tenant of selectedTenants) {
      const connection = await XeroConnection.saveConnection({
        companyId: req.user.companyId || req.user.id,
        tenantId: tenant.id,
        tenantName: tenant.name,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiresAt: new Date(Date.now() + (tokens.expiresIn * 1000)),
        createdBy: req.user.id
      });
      connections.push(connection);
    }

    res.json({
      success: true,
      message: 'Xero connections created successfully',
      data: {
        connections,
        totalCreated: connections.length
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
 * Get Xero connections (role-based)
 */
const getConnections = async (req, res, next) => {
  try {
    let connections;

    if (req.user.role === 'admin') {
      // Super admin can see all connections
      connections = await XeroConnection.getAllConnections();
    } else {
      // Companies can only see their own connections
      connections = await XeroConnection.getConnectionsByCompany(req.user.companyId || req.user.id);
    }

    res.json({
      success: true,
      message: 'Xero connections retrieved successfully',
      data: connections
    });

  } catch (error) {
    console.error('Get Connections Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Xero connections',
      error: error.message
    });
  }
};

/**
 * Get Xero data with role-based access
 */
const getXeroData = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const { resourceType } = req.params;
    const { where, order, page = 1, pageSize = 100, modifiedSince } = req.query;

    // Validate resource type
    const validResourceTypes = ['invoices', 'contacts', 'bank-transactions', 'accounts', 'items'];
    if (!validResourceTypes.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type',
        error: `Resource type must be one of: ${validResourceTypes.join(', ')}`
      });
    }

    // Check access permissions
    const connection = await XeroConnection.getConnectionById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Role-based access control
    if (req.user.role !== 'admin' && connection.companyId !== (req.user.companyId || req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get data based on resource type
    let data;
    const options = {
      where: where || '',
      order: order || '',
      page: parseInt(page),
      pageSize: Math.min(parseInt(pageSize), 100),
      modifiedSince: modifiedSince ? new Date(modifiedSince) : null
    };

    switch (resourceType) {
      case 'invoices':
        data = await XeroService.getInvoices(connectionId, options);
        break;
      case 'contacts':
        data = await XeroService.getContacts(connectionId, options);
        break;
      case 'bank-transactions':
        data = await XeroService.getBankTransactions(connectionId, options);
        break;
      case 'accounts':
        data = await XeroService.getAccounts(connectionId, options);
        break;
      case 'items':
        data = await XeroService.getItems(connectionId, options);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid resource type'
        });
    }

    res.json({
      success: true,
      message: `${resourceType} retrieved successfully`,
      data: {
        items: data[resourceType] || [],
        pagination: {
          page: options.page,
          pageSize: options.pageSize,
          total: data.pagination?.total || 0
        },
        connection: {
          id: connection.id,
          tenantName: connection.tenantName,
          status: connection.status
        }
      }
    });

  } catch (error) {
    console.error('Get Xero Data Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Xero data',
      error: error.message
    });
  }
};

/**
 * Delete Xero connection (role-based)
 */
const deleteConnection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if connection exists and user has access
    const connection = await XeroConnection.getConnectionById(id);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Role-based access control
    if (req.user.role !== 'admin' && connection.companyId !== (req.user.companyId || req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await XeroConnection.deleteConnection(id);
    
    res.json({
      success: true,
      message: 'Xero connection deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Delete Connection Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Xero connection',
      error: error.message
    });
  }
};

/**
 * Handle Xero webhook
 */
const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-xero-signature'];
    const payload = JSON.stringify(req.body);

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    // Verify webhook signature
    if (!(await XeroService.verifyWebhookSignature(payload, signature))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Parse webhook events
    const events = XeroService.parseWebhookPayload(payload);

    // Save events to database
    const savedEvents = [];
    for (const event of events) {
      // Find connection by tenant ID (you might need to adjust this based on your webhook setup)
      const connections = await XeroConnection.getConnectionsByCompany(req.user.companyId || req.user.id);
      const connection = connections.find(c => c.tenantId === event.payload.tenantId);

      if (connection) {
        const savedEvent = await XeroWebhookEvent.saveEvent({
          connectionId: connection.id,
          eventId: event.eventId,
          eventType: event.eventType,
          resourceType: event.resourceType,
          resourceId: event.resourceId,
          eventDate: event.eventDate,
          payload: event.payload
        });

        if (savedEvent) {
          savedEvents.push(savedEvent);
        }
      }
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        eventsReceived: events.length,
        eventsSaved: savedEvents.length
      }
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
};

/**
 * Get sync cursors (role-based)
 */
const getSyncCursors = async (req, res, next) => {
  try {
    const { connectionId } = req.params;

    // Check access permissions
    const connection = await XeroConnection.getConnectionById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Role-based access control
    if (req.user.role !== 'admin' && connection.companyId !== (req.user.companyId || req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const cursors = await XeroSyncCursor.getCursorsByConnection(connectionId);

    res.json({
      success: true,
      message: 'Sync cursors retrieved successfully',
      data: cursors
    });

  } catch (error) {
    console.error('Get Sync Cursors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sync cursors',
      error: error.message
    });
  }
};

/**
 * Reset sync cursor (role-based)
 */
const resetSyncCursor = async (req, res, next) => {
  try {
    const { connectionId, resourceType } = req.params;

    // Check access permissions
    const connection = await XeroConnection.getConnectionById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Role-based access control
    if (req.user.role !== 'admin' && connection.companyId !== (req.user.companyId || req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const cursor = await XeroSyncCursor.resetCursor(connectionId, resourceType);

    res.json({
      success: true,
      message: 'Sync cursor reset successfully',
      data: cursor
    });

  } catch (error) {
    console.error('Reset Sync Cursor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset sync cursor',
      error: error.message
    });
  }
};

/**
 * Get webhook events (role-based)
 */
const getWebhookEvents = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const { limit = 50 } = req.query;

    // Check access permissions
    const connection = await XeroConnection.getConnectionById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Role-based access control
    if (req.user.role !== 'admin' && connection.companyId !== (req.user.companyId || req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const events = await XeroWebhookEvent.getEventsByConnection(connectionId, parseInt(limit));

    res.json({
      success: true,
      message: 'Webhook events retrieved successfully',
      data: events
    });

  } catch (error) {
    console.error('Get Webhook Events Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get webhook events',
      error: error.message
    });
  }
};

module.exports = {
  buildAuthUrl,
  handleCallback,
  getConnections,
  getXeroData,
  deleteConnection,
  handleWebhook,
  getSyncCursors,
  resetSyncCursor,
  getWebhookEvents
}; 