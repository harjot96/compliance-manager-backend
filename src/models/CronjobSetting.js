const db = require('../config/database');

class CronjobSetting {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.durationDays = data.duration_days;
    this.enabled = data.enabled;
    this.smsEnabled = data.sms_enabled;
    this.smsDays = data.sms_days;
    this.emailEnabled = data.email_enabled;
    this.emailDays = data.email_days;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM cronjob_settings ORDER BY id');
    return result.rows.map(row => new CronjobSetting(row));
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM cronjob_settings WHERE id = $1', [id]);
    return result.rows.length ? new CronjobSetting(result.rows[0]) : null;
  }

  static async create({ type, durationDays, enabled, smsEnabled, smsDays, emailEnabled, emailDays }) {
    const result = await db.query(
      `INSERT INTO cronjob_settings (type, duration_days, enabled, sms_enabled, sms_days, email_enabled, email_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, durationDays, enabled, smsEnabled, smsDays, emailEnabled, emailDays]
    );
    return new CronjobSetting(result.rows[0]);
  }

  static async update(id, { type, durationDays, enabled }) {
    const result = await db.query(
      `UPDATE cronjob_settings
       SET type = $1, duration_days = $2, enabled = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [type, durationDays, enabled, id]
    );
    return result.rows.length ? new CronjobSetting(result.rows[0]) : null;
  }

  // Upsert by type (update if exists, insert if not)
  static async upsertByType({ type, durationDays, enabled, smsEnabled, smsDays, emailEnabled, emailDays }) {
    // First check if a setting with this type exists
    const existing = await db.query('SELECT * FROM cronjob_settings WHERE type = $1', [type]);
    
    if (existing.rows.length > 0) {
      // Update existing setting
      const result = await db.query(
        `UPDATE cronjob_settings
         SET duration_days = $1, enabled = $2, sms_enabled = $3, sms_days = $4, email_enabled = $5, email_days = $6, updated_at = CURRENT_TIMESTAMP
         WHERE type = $7 RETURNING *`,
        [durationDays, enabled, smsEnabled, smsDays, emailEnabled, emailDays, type]
      );
      return new CronjobSetting(result.rows[0]);
    } else {
      // Insert new setting
      const result = await db.query(
        `INSERT INTO cronjob_settings (type, duration_days, enabled, sms_enabled, sms_days, email_enabled, email_days)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [type, durationDays, enabled, smsEnabled, smsDays, emailEnabled, emailDays]
      );
      return new CronjobSetting(result.rows[0]);
    }
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      durationDays: this.durationDays,
      enabled: this.enabled,
      smsEnabled: this.smsEnabled,
      smsDays: this.smsDays,
      emailEnabled: this.emailEnabled,
      emailDays: this.emailDays,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = CronjobSetting; 