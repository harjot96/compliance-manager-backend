const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class XeroWebhookEvent {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS xero_webhook_events (
        id SERIAL PRIMARY KEY,
        connection_id INTEGER NOT NULL REFERENCES xero_connections(id) ON DELETE CASCADE,
        event_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        resource_id VARCHAR(255) NOT NULL,
        event_date TIMESTAMP NOT NULL,
        payload JSONB NOT NULL,
        processed BOOLEAN DEFAULT false,
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id)
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ Xero webhook events table created/verified');
    } catch (error) {
      console.error('❌ Error creating Xero webhook events table:', error);
      throw error;
    }
  }

  /**
   * Save webhook event
   */
  static async saveEvent(eventData) {
    try {
      const {
        connectionId,
        eventId,
        eventType,
        resourceType,
        resourceId,
        eventDate,
        payload
      } = eventData;

      const query = `
        INSERT INTO xero_webhook_events (
          connection_id, event_id, event_type, resource_type,
          resource_id, event_date, payload
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (event_id) DO NOTHING
        RETURNING id, event_id, event_type, resource_type, created_at
      `;

      const values = [
        connectionId,
        eventId,
        eventType,
        resourceType,
        resourceId,
        eventDate,
        JSON.stringify(payload)
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        console.log('⚠️ Webhook event already exists:', eventId);
        return null;
      }

      console.log('✅ Xero webhook event saved');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error saving webhook event:', error);
      throw error;
    }
  }

  /**
   * Get unprocessed events
   */
  static async getUnprocessedEvents(limit = 100) {
    try {
      const query = `
        SELECT id, connection_id, event_id, event_type, resource_type,
               resource_id, event_date, payload, created_at
        FROM xero_webhook_events
        WHERE processed = false
        ORDER BY created_at ASC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting unprocessed events:', error);
      throw error;
    }
  }

  /**
   * Mark event as processed
   */
  static async markAsProcessed(eventId) {
    try {
      const query = `
        UPDATE xero_webhook_events
        SET processed = true, processed_at = CURRENT_TIMESTAMP
        WHERE event_id = $1
        RETURNING id, event_id, processed_at
      `;

      const result = await pool.query(query, [eventId]);

      if (result.rows.length === 0) {
        throw new Error('Event not found');
      }

      console.log('✅ Webhook event marked as processed');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error marking event as processed:', error);
      throw error;
    }
  }

  /**
   * Get events by connection
   */
  static async getEventsByConnection(connectionId, limit = 50) {
    try {
      const query = `
        SELECT id, event_id, event_type, resource_type, resource_id,
               event_date, processed, created_at
        FROM xero_webhook_events
        WHERE connection_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await pool.query(query, [connectionId, limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting connection events:', error);
      throw error;
    }
  }

  /**
   * Get events by resource type
   */
  static async getEventsByResourceType(connectionId, resourceType, limit = 50) {
    try {
      const query = `
        SELECT id, event_id, event_type, resource_id, event_date,
               processed, created_at
        FROM xero_webhook_events
        WHERE connection_id = $1 AND resource_type = $2
        ORDER BY created_at DESC
        LIMIT $3
      `;

      const result = await pool.query(query, [connectionId, resourceType, limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting resource type events:', error);
      throw error;
    }
  }

  /**
   * Get all events (admin only)
   */
  static async getAllEvents(limit = 100) {
    try {
      const query = `
        SELECT xwe.id, xwe.event_id, xwe.event_type, xwe.resource_type,
               xwe.resource_id, xwe.event_date, xwe.processed, xwe.created_at,
               xc.tenant_name, c.company_name
        FROM xero_webhook_events xwe
        JOIN xero_connections xc ON xwe.connection_id = xc.id
        JOIN companies c ON xc.company_id = c.id
        ORDER BY xwe.created_at DESC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting all events:', error);
      throw error;
    }
  }

  /**
   * Delete old processed events
   */
  static async deleteOldProcessedEvents(daysOld = 30) {
    try {
      const query = `
        DELETE FROM xero_webhook_events
        WHERE processed = true
        AND created_at < NOW() - INTERVAL '${daysOld} days'
        RETURNING COUNT(*) as deleted_count
      `;

      const result = await pool.query(query);
      const deletedCount = parseInt(result.rows[0].deleted_count);

      console.log(`✅ Deleted ${deletedCount} old processed webhook events`);
      return { deletedCount };
    } catch (error) {
      console.error('❌ Error deleting old events:', error);
      throw error;
    }
  }

  /**
   * Get event statistics
   */
  static async getEventStatistics(connectionId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_events,
          COUNT(CASE WHEN processed = true THEN 1 END) as processed_events,
          COUNT(CASE WHEN processed = false THEN 1 END) as unprocessed_events,
          COUNT(CASE WHEN event_type = 'CREATE' THEN 1 END) as create_events,
          COUNT(CASE WHEN event_type = 'UPDATE' THEN 1 END) as update_events,
          COUNT(CASE WHEN event_type = 'DELETE' THEN 1 END) as delete_events
        FROM xero_webhook_events
      `;

      let values = [];

      if (connectionId) {
        query += ' WHERE connection_id = $1';
        values.push(connectionId);
      }

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error getting event statistics:', error);
      throw error;
    }
  }
}

module.exports = XeroWebhookEvent; 