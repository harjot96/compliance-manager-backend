const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'compliance_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,
  min: 2,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  acquireTimeoutMillis: 10000,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
});

class OpenAISetting {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS openai_settings (
        id SERIAL PRIMARY KEY,
        api_key_encrypted TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ OpenAI settings table created/verified');
    } catch (error) {
      console.error('❌ Error creating OpenAI settings table:', error);
      throw error;
    }
  }

  /**
   * Add missing columns to existing table
   */
  static async addMissingColumns() {
    // No additional columns needed for simplified schema
    console.log('✅ OpenAI settings table schema is up to date');
  }

  /**
   * Encrypt API key using AES-256-GCM
   */
  static encryptApiKey(apiKey) {
    const algorithm = 'aes-256-gcm';
    const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';
    
    // Ensure the secret key is 32 bytes
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return encrypted data with IV and auth tag
    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt API key
   */
  static decryptApiKey(encryptedData) {
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
      console.error('❌ Error decrypting API key:', error);
      
      // Check if it's an encryption key mismatch
      if (error.message.includes('Unsupported state or unable to authenticate data')) {
        console.error('🔑 Encryption key mismatch detected. This usually means:');
        console.error('   1. ENCRYPTION_KEY environment variable is not set in production');
        console.error('   2. The API key was encrypted with a different key');
        console.error('   3. The environment variable changed between encryption and decryption');
        
        throw new Error('Encryption key mismatch. Please reconfigure OpenAI settings with a new API key.');
      }
      
      throw new Error('Failed to decrypt API key');
    }
  }

  /**
   * Save OpenAI settings
   */
  static async saveSettings(settings) {
    try {
      const { apiKey, createdBy } = settings;
      
      if (!apiKey) {
        throw new Error('API key is required');
      }

      // Encrypt the API key
      const encryptedData = this.encryptApiKey(apiKey);
      
      // Store encrypted data as JSON
      const encryptedJson = JSON.stringify(encryptedData);
      
      const query = `
        INSERT INTO openai_settings (api_key_encrypted, created_by)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET
          api_key_encrypted = EXCLUDED.api_key_encrypted,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, is_active, created_at, updated_at;
      `;
      
      const values = [encryptedJson, createdBy];
      const result = await pool.query(query, values);
      
      console.log('✅ OpenAI settings saved successfully');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error saving OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Get OpenAI settings
   */
  static async getSettings(retryCount = 0) {
    const maxRetries = 3;
    
    try {
      const query = `
        SELECT id, api_key_encrypted, is_active, created_at, updated_at
        FROM openai_settings
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 1;
      `;
      
      const result = await pool.query(query);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const settings = result.rows[0];
      
      // Decrypt the API key
      const encryptedData = JSON.parse(settings.api_key_encrypted);
      const decryptedApiKey = this.decryptApiKey(encryptedData);
      
      return {
        id: settings.id,
        apiKey: decryptedApiKey,
        isActive: settings.is_active,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at
      };
    } catch (error) {
      console.error(`❌ Error getting OpenAI settings (attempt ${retryCount + 1}):`, error);
      
      // Retry on connection errors
      if ((error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'EADDRNOTAVAIL') && retryCount < maxRetries) {
        console.log(`🔄 Retrying OpenAI settings fetch (attempt ${retryCount + 2}/${maxRetries + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return this.getSettings(retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Update OpenAI settings
   */
  static async updateSettings(id, settings) {
    try {
      const { apiKey } = settings;
      
      if (!apiKey) {
        throw new Error('API key is required for update');
      }

      const encryptedData = this.encryptApiKey(apiKey);
      const encryptedJson = JSON.stringify(encryptedData);
      
      const query = `
        UPDATE openai_settings
        SET 
          api_key_encrypted = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, is_active, updated_at;
      `;
      
      const values = [id, encryptedJson];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('OpenAI settings not found');
      }
      
      console.log('✅ OpenAI settings updated successfully');
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Delete OpenAI settings
   */
  static async deleteSettings(id) {
    try {
      const query = `
        DELETE FROM openai_settings
        WHERE id = $1
        RETURNING id;
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('OpenAI settings not found');
      }
      
      console.log('✅ OpenAI settings deleted successfully');
      return { id: result.rows[0].id };
    } catch (error) {
      console.error('❌ Error deleting OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Clear all OpenAI settings (for encryption key reset)
   */
  static async clearAllSettings() {
    try {
      const query = `
        DELETE FROM openai_settings
        RETURNING id;
      `;
      
      const result = await pool.query(query);
      
      console.log(`✅ Cleared ${result.rows.length} OpenAI settings`);
      return { clearedCount: result.rows.length };
    } catch (error) {
      console.error('❌ Error clearing OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Get all OpenAI settings (for admin)
   */
  static async getAllSettings() {
    try {
      const query = `
        SELECT id, is_active, created_by, created_at, updated_at
        FROM openai_settings
        ORDER BY created_at DESC;
      `;
      
      const result = await pool.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        isActive: row.is_active,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('❌ Error getting all OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Test OpenAI API key
   */
  static async testApiKey(apiKey) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey });
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      });
      
      return {
        success: true,
        message: 'API key is valid',
        model: completion.choices[0]?.message?.content
      };
    } catch (error) {
      // Handle specific OpenAI errors
      if (error.status === 429) {
        return {
          success: false,
          message: 'API key is valid but quota exceeded',
          error: 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.',
          errorType: 'quota_exceeded'
        };
      } else if (error.status === 401) {
        return {
          success: false,
          message: 'Invalid API key',
          error: 'The API key provided is invalid or has been revoked.',
          errorType: 'invalid_key'
        };
      } else if (error.status === 400) {
        return {
          success: false,
          message: 'API key error',
          error: error.message,
          errorType: 'bad_request'
        };
      } else if (error.status === 500) {
        return {
          success: false,
          message: 'OpenAI server error',
          error: 'OpenAI servers are experiencing issues. Please try again later.',
          errorType: 'server_error'
        };
      } else {
        return {
          success: false,
          message: 'API key test failed',
          error: error.message,
          errorType: 'unknown_error'
        };
      }
    }
  }
}

module.exports = OpenAISetting; 