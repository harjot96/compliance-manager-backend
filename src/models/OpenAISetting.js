const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class OpenAISetting {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS openai_settings (
        id SERIAL PRIMARY KEY,
        api_key_encrypted TEXT NOT NULL,
        model VARCHAR(50) DEFAULT 'gpt-3.5-turbo',
        max_tokens INTEGER DEFAULT 1000,
        temperature DECIMAL(3,2) DEFAULT 0.7,
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
      throw new Error('Failed to decrypt API key');
    }
  }

  /**
   * Save OpenAI settings
   */
  static async saveSettings(settings) {
    try {
      const { apiKey, model = 'gpt-3.5-turbo', maxTokens = 1000, temperature = 0.7, createdBy } = settings;
      
      if (!apiKey) {
        throw new Error('API key is required');
      }

      // Encrypt the API key
      const encryptedData = this.encryptApiKey(apiKey);
      
      // Store encrypted data as JSON
      const encryptedJson = JSON.stringify(encryptedData);
      
      const query = `
        INSERT INTO openai_settings (api_key_encrypted, model, max_tokens, temperature, created_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          api_key_encrypted = EXCLUDED.api_key_encrypted,
          model = EXCLUDED.model,
          max_tokens = EXCLUDED.max_tokens,
          temperature = EXCLUDED.temperature,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, model, max_tokens, temperature, is_active, created_at, updated_at;
      `;
      
      const values = [encryptedJson, model, maxTokens, temperature, createdBy];
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
  static async getSettings() {
    try {
      const query = `
        SELECT id, api_key_encrypted, model, max_tokens, temperature, is_active, created_at, updated_at
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
        model: settings.model,
        maxTokens: settings.max_tokens,
        temperature: settings.temperature,
        isActive: settings.is_active,
        createdAt: settings.created_at,
        updatedAt: settings.updated_at
      };
    } catch (error) {
      console.error('❌ Error getting OpenAI settings:', error);
      throw error;
    }
  }

  /**
   * Update OpenAI settings
   */
  static async updateSettings(id, settings) {
    try {
      const { apiKey, model, maxTokens, temperature } = settings;
      
      let encryptedJson = null;
      if (apiKey) {
        const encryptedData = this.encryptApiKey(apiKey);
        encryptedJson = JSON.stringify(encryptedData);
      }
      
      const query = `
        UPDATE openai_settings
        SET 
          ${apiKey ? 'api_key_encrypted = $2,' : ''}
          model = COALESCE($3, model),
          max_tokens = COALESCE($4, max_tokens),
          temperature = COALESCE($5, temperature),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, model, max_tokens, temperature, is_active, updated_at;
      `;
      
      const values = apiKey 
        ? [id, encryptedJson, model, maxTokens, temperature]
        : [id, model, maxTokens, temperature];
      
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
   * Get all OpenAI settings (for admin)
   */
  static async getAllSettings() {
    try {
      const query = `
        SELECT id, model, max_tokens, temperature, is_active, created_by, created_at, updated_at
        FROM openai_settings
        ORDER BY created_at DESC;
      `;
      
      const result = await pool.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        model: row.model,
        maxTokens: row.max_tokens,
        temperature: row.temperature,
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
      return {
        success: false,
        message: 'API key is invalid',
        error: error.message
      };
    }
  }
}

module.exports = OpenAISetting; 