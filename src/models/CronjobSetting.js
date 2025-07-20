const db = require('../config/database');

class CronjobSetting {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.durationDays = data.duration_days;
    this.enabled = data.enabled;
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

  static async create({ type, durationDays, enabled }) {
    const result = await db.query(
      `INSERT INTO cronjob_settings (type, duration_days, enabled)
       VALUES ($1, $2, $3) RETURNING *`,
      [type, durationDays, enabled]
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
}

module.exports = CronjobSetting; 