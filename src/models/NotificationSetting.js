const db = require('../config/database');

class NotificationSetting {
  constructor(data) {
    this.id = data.id;
    this.type = data.type; // 'smtp' or 'twilio'
    this.config = data.config;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create({ type, config }) {
    const query = `
      INSERT INTO notification_settings (type, config)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [type, config]);
    return new NotificationSetting(result.rows[0]);
  }

  static async update(id, { config }) {
    const query = `
      UPDATE notification_settings
      SET config = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [config, id]);
    return result.rows.length ? new NotificationSetting(result.rows[0]) : null;
  }

  static async getByType(type) {
    const query = 'SELECT * FROM notification_settings WHERE type = $1 ORDER BY created_at DESC LIMIT 1';
    const result = await db.query(query, [type]);
    return result.rows.length ? new NotificationSetting(result.rows[0]) : null;
  }

  static async getAll() {
    const query = 'SELECT * FROM notification_settings ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows.map(row => new NotificationSetting(row));
  }

  static async delete(id) {
    const query = 'DELETE FROM notification_settings WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows.length ? new NotificationSetting(result.rows[0]) : null;
  }

  static async getById(id) {
    const query = 'SELECT * FROM notification_settings WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows.length ? new NotificationSetting(result.rows[0]) : null;
  }

  // Upsert by type (BAS, FBT, IAS, FED, etc.)
  static async upsertByType(type, setting) {
    // Remove type from config to avoid duplication
    const config = { ...setting };
    delete config.type;
    // Check if a setting for this type exists
    const existing = await NotificationSetting.getByType(type);
    if (existing) {
      // Update
      const query = `UPDATE notification_settings SET config = $1, updated_at = CURRENT_TIMESTAMP WHERE type = $2 RETURNING *`;
      const result = await db.query(query, [config, type]);
      return result.rows.length ? new NotificationSetting(result.rows[0]) : null;
    } else {
      // Insert
      const query = `INSERT INTO notification_settings (type, config) VALUES ($1, $2) RETURNING *`;
      const result = await db.query(query, [type, config]);
      return new NotificationSetting(result.rows[0]);
    }
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      config: this.config,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = NotificationSetting; 