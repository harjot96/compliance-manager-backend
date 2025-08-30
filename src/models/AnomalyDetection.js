const { pool } = require('../config/database');
const crypto = require('crypto');

class AnomalyDetection {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS anomaly_detection_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        training_data JSONB NOT NULL,
        parameters JSONB NOT NULL,
        model_state JSONB,
        threshold DECIMAL(10,4) DEFAULT 0.5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );
    `;
    
    try {
      await pool.query(query);
      console.log('✅ Anomaly detection models table created or already exists');
      
      // Add threshold column if it doesn't exist
      await this.addThresholdColumn();
    } catch (error) {
      console.error('❌ Error creating anomaly detection models table:', error);
      throw error;
    }
  }

  static async addThresholdColumn() {
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'anomaly_detection_models' 
      AND column_name = 'threshold'
    `;
    
    try {
      const result = await pool.query(checkQuery);
      if (result.rows.length === 0) {
        const addQuery = `
          ALTER TABLE anomaly_detection_models 
          ADD COLUMN threshold DECIMAL(10,4) DEFAULT 0.5
        `;
        await pool.query(addQuery);
        console.log('✅ Added threshold column to anomaly_detection_models table');
      }
    } catch (error) {
      console.error('❌ Error adding threshold column:', error);
      throw error;
    }
  }

  static async saveModel(name, description, trainingData, parameters, modelState = null) {
    const query = `
      INSERT INTO anomaly_detection_models (name, description, training_data, parameters, model_state)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    try {
      // Convert objects to JSON strings for PostgreSQL JSONB columns
      const trainingDataJson = JSON.stringify(trainingData);
      const parametersJson = JSON.stringify(parameters);
      const modelStateJson = modelState ? JSON.stringify(modelState) : null;
      
      const result = await pool.query(query, [name, description, trainingDataJson, parametersJson, modelStateJson]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error saving anomaly detection model:', error);
      throw error;
    }
  }

  static async getActiveModel() {
    const query = `
      SELECT * FROM anomaly_detection_models 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error getting active anomaly detection model:', error);
      throw error;
    }
  }

  static async getModelById(id) {
    const query = `
      SELECT * FROM anomaly_detection_models 
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error getting anomaly detection model by ID:', error);
      throw error;
    }
  }

  static async getAllModels() {
    const query = `
      SELECT id, name, description, created_at, updated_at, is_active 
      FROM anomaly_detection_models 
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error getting all anomaly detection models:', error);
      throw error;
    }
  }

  static async updateModelState(id, modelState) {
    const query = `
      UPDATE anomaly_detection_models 
      SET model_state = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      // Convert modelState to JSON string for PostgreSQL JSONB column
      const modelStateJson = modelState ? JSON.stringify(modelState) : null;
      const result = await pool.query(query, [id, modelStateJson]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error updating anomaly detection model state:', error);
      throw error;
    }
  }

  static async deactivateModel(id) {
    const query = `
      UPDATE anomaly_detection_models 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error deactivating anomaly detection model:', error);
      throw error;
    }
  }

  static async activateModel(id) {
    // First deactivate all models
    await pool.query('UPDATE anomaly_detection_models SET is_active = false');
    
    // Then activate the specified model
    const query = `
      UPDATE anomaly_detection_models 
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error activating anomaly detection model:', error);
      throw error;
    }
  }

  static async deleteModel(id) {
    const query = `
      DELETE FROM anomaly_detection_models 
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error deleting anomaly detection model:', error);
      throw error;
    }
  }
}

module.exports = AnomalyDetection;
