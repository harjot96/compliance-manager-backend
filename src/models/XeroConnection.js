const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class XeroConnection {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS xero_connections (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        tenant_id VARCHAR(255) NOT NULL,
        tenant_name VARCHAR(255) NOT NULL,
        access_token_encrypted TEXT NOT NULL,
        refresh_token_encrypted TEXT NOT NULL,
        access_token_expires_at TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(company_id, tenant_id)
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ Xero connections table created/verified');
    } catch (error) {
      console.error('❌ Error creating Xero connections table:', error);
      throw error;
    }
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  static encryptData(data) {
    const algorithm = 'aes-256-gcm';
    const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';
    
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt sensitive data
   */
  static decryptData(encryptedData) {
    try {
      const algorithm = 'aes-256-gcm';
      const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';
      const key = crypto.scryptSync(secretKey, 'salt', 32);
      
      const decipher = crypto.createDecipher(algorithm, key);
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('❌ Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Create or update Xero connection
   */
  static async saveConnection(connectionData) {
    try {
      const {
        companyId,
        tenantId,
        tenantName,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        createdBy
      } = connectionData;

      // Encrypt sensitive tokens
      const encryptedAccessToken = JSON.stringify(this.encryptData(accessToken));
      const encryptedRefreshToken = JSON.stringify(this.encryptData(refreshToken));

      const query = `
        INSERT INTO xero_connections (
          company_id, tenant_id, tenant_name, 
          access_token_encrypted, refresh_token_encrypted, 
          access_token_expires_at, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (company_id, tenant_id) DO UPDATE SET
          tenant_name = EXCLUDED.tenant_name,
          access_token_encrypted = EXCLUDED.access_token_encrypted,
          refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
          access_token_expires_at = EXCLUDED.access_token_expires_at,
          status = 'active',
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, company_id, tenant_id, tenant_name, status, created_at, updated_at;
      `;

      const values = [
        companyId,
        tenantId,
        tenantName,
        encryptedAccessToken,
        encryptedRefreshToken,
        accessTokenExpiresAt,
        createdBy
      ];

      const result = await pool.query(query, values);
      console.log('✅ Xero connection saved successfully');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error saving Xero connection:', error);
      throw error;
    }
  }

  /**
   * Get connection by ID with decrypted tokens
   */
  static async getConnectionById(id, companyId = null) {
    try {
      let query = `
        SELECT id, company_id, tenant_id, tenant_name, 
               access_token_encrypted, refresh_token_encrypted, 
               access_token_expires_at, status, created_at, updated_at
        FROM xero_connections
        WHERE id = $1
      `;
      let values = [id];

      if (companyId) {
        query += ' AND company_id = $2';
        values.push(companyId);
      }

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const connection = result.rows[0];

      // Decrypt tokens
      const accessTokenData = JSON.parse(connection.access_token_encrypted);
      const refreshTokenData = JSON.parse(connection.refresh_token_encrypted);

      return {
        id: connection.id,
        companyId: connection.company_id,
        tenantId: connection.tenant_id,
        tenantName: connection.tenant_name,
        accessToken: this.decryptData(accessTokenData),
        refreshToken: this.decryptData(refreshTokenData),
        accessTokenExpiresAt: connection.access_token_expires_at,
        status: connection.status,
        createdAt: connection.created_at,
        updatedAt: connection.updated_at
      };
    } catch (error) {
      console.error('❌ Error getting Xero connection:', error);
      throw error;
    }
  }

  /**
   * Get all connections for a company
   */
  static async getConnectionsByCompany(companyId) {
    try {
      const query = `
        SELECT id, tenant_id, tenant_name, status, created_at, updated_at
        FROM xero_connections
        WHERE company_id = $1
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query, [companyId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting company connections:', error);
      throw error;
    }
  }

  /**
   * Update connection status
   */
  static async updateConnectionStatus(id, status, companyId = null) {
    try {
      let query = `
        UPDATE xero_connections
        SET status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      let values = [id, status];

      if (companyId) {
        query += ' AND company_id = $3';
        values.push(companyId);
      }

      query += ' RETURNING id, status, updated_at';

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Connection not found');
      }

      console.log('✅ Xero connection status updated');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating connection status:', error);
      throw error;
    }
  }

  /**
   * Update access token (atomic update)
   */
  static async updateAccessToken(id, accessToken, refreshToken, expiresAt, companyId = null) {
    try {
      const encryptedAccessToken = JSON.stringify(this.encryptData(accessToken));
      const encryptedRefreshToken = JSON.stringify(this.encryptData(refreshToken));

      let query = `
        UPDATE xero_connections
        SET access_token_encrypted = $2, 
            refresh_token_encrypted = $3,
            access_token_expires_at = $4,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      let values = [id, encryptedAccessToken, encryptedRefreshToken, expiresAt];

      if (companyId) {
        query += ' AND company_id = $5';
        values.push(companyId);
      }

      query += ' RETURNING id, updated_at';

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Connection not found');
      }

      console.log('✅ Xero access token updated');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating access token:', error);
      throw error;
    }
  }

  /**
   * Delete connection
   */
  static async deleteConnection(id, companyId = null) {
    try {
      let query = 'DELETE FROM xero_connections WHERE id = $1';
      let values = [id];

      if (companyId) {
        query += ' AND company_id = $2';
        values.push(companyId);
      }

      query += ' RETURNING id';

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Connection not found');
      }

      console.log('✅ Xero connection deleted');
      return { id: result.rows[0].id };
    } catch (error) {
      console.error('❌ Error deleting Xero connection:', error);
      throw error;
    }
  }

  /**
   * Get all connections (admin only)
   */
  static async getAllConnections() {
    try {
      const query = `
        SELECT xc.id, xc.company_id, xc.tenant_id, xc.tenant_name, 
               xc.status, xc.created_at, xc.updated_at,
               c.company_name
        FROM xero_connections xc
        JOIN companies c ON xc.company_id = c.id
        ORDER BY xc.created_at DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting all connections:', error);
      throw error;
    }
  }
}

module.exports = XeroConnection; 