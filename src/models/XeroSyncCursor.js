const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class XeroSyncCursor {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS xero_sync_cursors (
        id SERIAL PRIMARY KEY,
        connection_id INTEGER NOT NULL REFERENCES xero_connections(id) ON DELETE CASCADE,
        resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('invoices', 'contacts', 'bank-transactions', 'accounts', 'items')),
        last_modified_since TIMESTAMP,
        last_page_number INTEGER DEFAULT 1,
        last_page_size INTEGER DEFAULT 100,
        has_more BOOLEAN DEFAULT true,
        last_sync_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(connection_id, resource_type)
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ Xero sync cursors table created/verified');
    } catch (error) {
      console.error('❌ Error creating Xero sync cursors table:', error);
      throw error;
    }
  }

  /**
   * Get or create cursor for a resource
   */
  static async getOrCreateCursor(connectionId, resourceType) {
    try {
      const query = `
        INSERT INTO xero_sync_cursors (connection_id, resource_type)
        VALUES ($1, $2)
        ON CONFLICT (connection_id, resource_type) DO UPDATE SET
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, connection_id, resource_type, last_modified_since, 
                  last_page_number, last_page_size, has_more, last_sync_at
      `;

      const result = await pool.query(query, [connectionId, resourceType]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error getting/creating cursor:', error);
      throw error;
    }
  }

  /**
   * Update cursor after sync
   */
  static async updateCursor(connectionId, resourceType, updateData) {
    try {
      const {
        lastModifiedSince,
        lastPageNumber,
        lastPageSize,
        hasMore
      } = updateData;

      const query = `
        UPDATE xero_sync_cursors
        SET last_modified_since = $3,
            last_page_number = $4,
            last_page_size = $5,
            has_more = $6,
            last_sync_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE connection_id = $1 AND resource_type = $2
        RETURNING id, last_modified_since, last_page_number, last_page_size, 
                  has_more, last_sync_at, updated_at
      `;

      const values = [
        connectionId,
        resourceType,
        lastModifiedSince,
        lastPageNumber || 1,
        lastPageSize || 100,
        hasMore !== undefined ? hasMore : true
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Cursor not found');
      }

      console.log('✅ Xero sync cursor updated');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating cursor:', error);
      throw error;
    }
  }

  /**
   * Get cursor for a specific resource
   */
  static async getCursor(connectionId, resourceType) {
    try {
      const query = `
        SELECT id, connection_id, resource_type, last_modified_since,
               last_page_number, last_page_size, has_more, last_sync_at
        FROM xero_sync_cursors
        WHERE connection_id = $1 AND resource_type = $2
      `;

      const result = await pool.query(query, [connectionId, resourceType]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error getting cursor:', error);
      throw error;
    }
  }

  /**
   * Get all cursors for a connection
   */
  static async getCursorsByConnection(connectionId) {
    try {
      const query = `
        SELECT id, resource_type, last_modified_since, last_page_number,
               last_page_size, has_more, last_sync_at, updated_at
        FROM xero_sync_cursors
        WHERE connection_id = $1
        ORDER BY resource_type
      `;

      const result = await pool.query(query, [connectionId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting connection cursors:', error);
      throw error;
    }
  }

  /**
   * Reset cursor for a resource
   */
  static async resetCursor(connectionId, resourceType) {
    try {
      const query = `
        UPDATE xero_sync_cursors
        SET last_modified_since = NULL,
            last_page_number = 1,
            last_page_size = 100,
            has_more = true,
            last_sync_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE connection_id = $1 AND resource_type = $2
        RETURNING id, resource_type, last_modified_since, last_page_number
      `;

      const result = await pool.query(query, [connectionId, resourceType]);

      if (result.rows.length === 0) {
        throw new Error('Cursor not found');
      }

      console.log('✅ Xero sync cursor reset');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error resetting cursor:', error);
      throw error;
    }
  }

  /**
   * Delete cursor
   */
  static async deleteCursor(connectionId, resourceType) {
    try {
      const query = `
        DELETE FROM xero_sync_cursors
        WHERE connection_id = $1 AND resource_type = $2
        RETURNING id
      `;

      const result = await pool.query(query, [connectionId, resourceType]);

      if (result.rows.length === 0) {
        throw new Error('Cursor not found');
      }

      console.log('✅ Xero sync cursor deleted');
      return { id: result.rows[0].id };
    } catch (error) {
      console.error('❌ Error deleting cursor:', error);
      throw error;
    }
  }

  /**
   * Get all cursors (admin only)
   */
  static async getAllCursors() {
    try {
      const query = `
        SELECT xsc.id, xsc.connection_id, xsc.resource_type, 
               xsc.last_modified_since, xsc.last_page_number,
               xsc.last_page_size, xsc.has_more, xsc.last_sync_at,
               xc.tenant_name, c.company_name
        FROM xero_sync_cursors xsc
        JOIN xero_connections xc ON xsc.connection_id = xc.id
        JOIN companies c ON xc.company_id = c.id
        ORDER BY xsc.last_sync_at DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting all cursors:', error);
      throw error;
    }
  }

  /**
   * Get cursors that need syncing (for background jobs)
   */
  static async getCursorsForSync(hoursAgo = 6) {
    try {
      const query = `
        SELECT xsc.id, xsc.connection_id, xsc.resource_type,
               xsc.last_modified_since, xsc.last_page_number,
               xsc.last_page_size, xsc.has_more, xsc.last_sync_at,
               xc.tenant_id, xc.tenant_name
        FROM xero_sync_cursors xsc
        JOIN xero_connections xc ON xsc.connection_id = xc.id
        WHERE xc.status = 'active'
        AND (xsc.last_sync_at IS NULL 
             OR xsc.last_sync_at < NOW() - INTERVAL '${hoursAgo} hours')
        ORDER BY xsc.last_sync_at ASC NULLS FIRST
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting cursors for sync:', error);
      throw error;
    }
  }
}

module.exports = XeroSyncCursor; 