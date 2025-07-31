const db = require('../config/database');

class NotificationTemplate {
  constructor(data) {
    this.id = data.id;
    this.type = data.type; // 'email' or 'sms'
    this.name = data.name;
    this.subject = data.subject;
    this.body = data.body;
    this.notificationTypes = data.notification_types || [];
    this.smsDays = data.sms_days || [];
    this.emailDays = data.email_days || [];
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create({ type, name, subject, body, notificationTypes, smsDays, emailDays }) {
    const query = `
      INSERT INTO notification_templates (type, name, subject, body, notification_types, sms_days, email_days)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await db.query(query, [
      type, 
      name, 
      subject, 
      body, 
      JSON.stringify(notificationTypes || []),
      JSON.stringify(smsDays || []),
      JSON.stringify(emailDays || [])
    ]);
    return new NotificationTemplate(result.rows[0]);
  }

  static async update(id, { type, name, subject, body, notificationTypes, smsDays, emailDays }) {
    const query = `
      UPDATE notification_templates
      SET type = $1, name = $2, subject = $3, body = $4, notification_types = $5, sms_days = $6, email_days = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const result = await db.query(query, [
      type, 
      name, 
      subject, 
      body, 
      JSON.stringify(notificationTypes || []),
      JSON.stringify(smsDays || []),
      JSON.stringify(emailDays || []),
      id
    ]);
    return result.rows.length ? new NotificationTemplate(result.rows[0]) : null;
  }

  static async getById(id) {
    const query = 'SELECT * FROM notification_templates WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows.length ? new NotificationTemplate(result.rows[0]) : null;
  }

  static async getAll() {
    const query = 'SELECT * FROM notification_templates ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows.map(row => new NotificationTemplate(row));
  }

  static async delete(id) {
    const query = 'DELETE FROM notification_templates WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows.length ? new NotificationTemplate(result.rows[0]) : null;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      subject: this.subject,
      body: this.body,
      notificationTypes: this.notificationTypes,
      smsDays: this.smsDays,
      emailDays: this.emailDays,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = NotificationTemplate; 