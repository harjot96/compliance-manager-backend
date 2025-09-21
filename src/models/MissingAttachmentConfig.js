const db = require('../config/database');

class MissingAttachmentConfig {
  static db = db;
  
  constructor(data) {
    this.id = data.id;
    this.companyId = data.company_id;
    this.gstThreshold = parseFloat(data.gst_threshold);
    this.enabled = data.enabled;
    this.smsEnabled = data.sms_enabled;
    this.emailEnabled = data.email_enabled;
    this.phoneNumber = data.phone_number;
    this.emailAddress = data.email_address;
    this.linkExpiryDays = data.link_expiry_days;
    this.maxDailyNotifications = data.max_daily_notifications;
    this.notificationFrequency = data.notification_frequency;
    this.lastProcessedAt = data.last_processed_at;
    this.totalNotificationsSent = data.total_notifications_sent;
    this.totalTransactionsProcessed = data.total_transactions_processed;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create or update configuration
  static async findOrCreate(options) {
    const { where, defaults } = options;
    
    try {
      // Try to find existing config
      const existing = await this.findOne(where);
      if (existing) {
        return [existing, false]; // [instance, created]
      }
      
      // Create new config
      const created = await this.create({ ...where, ...defaults });
      return [created, true]; // [instance, created]
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      throw error;
    }
  }

  // Create a new config
  static async create(configData) {
    const {
      companyId,
      gstThreshold = 82.50,
      enabled = true,
      smsEnabled = true,
      emailEnabled = false,
      phoneNumber,
      emailAddress,
      linkExpiryDays = 7,
      maxDailyNotifications = 50,
      notificationFrequency = 'immediate'
    } = configData;

    const query = `
      INSERT INTO missing_attachment_configs (
        company_id, gst_threshold, enabled, sms_enabled, email_enabled,
        phone_number, email_address, link_expiry_days, max_daily_notifications,
        notification_frequency, total_notifications_sent, total_transactions_processed,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 0, NOW(), NOW())
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, [
        companyId, gstThreshold, enabled, smsEnabled, emailEnabled,
        phoneNumber, emailAddress, linkExpiryDays, maxDailyNotifications,
        notificationFrequency
      ]);
      return new MissingAttachmentConfig(result.rows[0]);
    } catch (error) {
      console.error('Error creating missing attachment config:', error);
      throw error;
    }
  }

  // Find config by criteria
  static async findOne(where) {
    let query = 'SELECT * FROM missing_attachment_configs WHERE ';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(where)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      conditions.push(`${dbKey} = $${paramIndex++}`);
      values.push(value);
    }

    query += conditions.join(' AND ');

    try {
      const result = await this.db.query(query, values);
      return result.rows[0] ? new MissingAttachmentConfig(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding missing attachment config:', error);
      throw error;
    }
  }

  // Find all configs with criteria
  static async findAll(options = {}) {
    let query = 'SELECT * FROM missing_attachment_configs';
    const values = [];
    let paramIndex = 1;

    if (options.where && Object.keys(options.where).length > 0) {
      const conditions = [];
      for (const [key, value] of Object.entries(options.where)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        conditions.push(`${dbKey} = $${paramIndex++}`);
        values.push(value);
      }
      query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
      const result = await this.db.query(query, values);
      return result.rows.map(row => new MissingAttachmentConfig(row));
    } catch (error) {
      console.error('Error finding missing attachment configs:', error);
      throw error;
    }
  }

  // Update config
  async update(updates) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build SET clause
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      setClause.push(`${dbKey} = $${paramIndex++}`);
      values.push(value);
    }

    // Add WHERE clause for this instance
    values.push(this.id);
    const whereClause = `id = $${paramIndex}`;

    const query = `
      UPDATE missing_attachment_configs 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE ${whereClause}
      RETURNING *
    `;

    try {
      const result = await this.constructor.db.query(query, values);
      if (result.rows[0]) {
        // Update this instance with new data
        Object.assign(this, new MissingAttachmentConfig(result.rows[0]));
      }
      return this;
    } catch (error) {
      console.error('Error updating missing attachment config:', error);
      throw error;
    }
  }
}

module.exports = { MissingAttachmentConfig };
