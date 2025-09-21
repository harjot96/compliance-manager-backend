const db = require('../config/database');

class UploadLink {
  static db = db;
  
  constructor(data) {
    this.id = data.id;
    this.linkId = data.link_id;
    this.token = data.token;
    this.transactionId = data.transaction_id;
    this.companyId = data.company_id;
    this.tenantId = data.tenant_id;
    this.transactionType = data.transaction_type;
    this.phoneNumber = data.phone_number;
    this.expiresAt = data.expires_at;
    this.used = data.used;
    this.usedAt = data.used_at;
    this.fileUrl = data.file_url;
    this.fileName = data.file_name;
    this.fileSize = data.file_size;
    this.smsSid = data.sms_sid;
    this.smsStatus = data.sms_status;
    this.resolved = data.resolved;
    this.resolvedAt = data.resolved_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new upload link
  static async create(linkData) {
    const {
      linkId,
      token,
      transactionId,
      companyId,
      tenantId,
      transactionType = 'Invoice',
      phoneNumber,
      expiresAt,
      used = false
    } = linkData;

    const query = `
      INSERT INTO upload_links (
        link_id, token, transaction_id, company_id, tenant_id, 
        transaction_type, phone_number, expires_at, used, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, [
        linkId, token, transactionId, companyId, tenantId,
        transactionType, phoneNumber, expiresAt, used
      ]);
      return new UploadLink(result.rows[0]);
    } catch (error) {
      console.error('Error creating upload link:', error);
      throw error;
    }
  }

  // Find upload link by linkId and token
  static async findOne(where) {
    let query = 'SELECT * FROM upload_links WHERE ';
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (where.linkId) {
      conditions.push(`link_id = $${paramIndex++}`);
      values.push(where.linkId);
    }
    
    if (where.token) {
      conditions.push(`token = $${paramIndex++}`);
      values.push(where.token);
    }
    
    if (where.used !== undefined) {
      conditions.push(`used = $${paramIndex++}`);
      values.push(where.used);
    }
    
    if (where.expiresAt && where.expiresAt.$gt) {
      conditions.push(`expires_at > $${paramIndex++}`);
      values.push(where.expiresAt.$gt);
    }

    query += conditions.join(' AND ');

    try {
      const result = await this.db.query(query, values);
      return result.rows[0] ? new UploadLink(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding upload link:', error);
      throw error;
    }
  }

  // Update upload link
  static async update(updates, where) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build SET clause
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      setClause.push(`${dbKey} = $${paramIndex++}`);
      values.push(value);
    }

    // Build WHERE clause
    const whereClause = [];
    for (const [key, value] of Object.entries(where)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      whereClause.push(`${dbKey} = $${paramIndex++}`);
      values.push(value);
    }

    const query = `
      UPDATE upload_links 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE ${whereClause.join(' AND ')}
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, values);
      return result.rows.map(row => new UploadLink(row));
    } catch (error) {
      console.error('Error updating upload link:', error);
      throw error;
    }
  }

  // Find and count all upload links with pagination
  static async findAndCountAll(options = {}) {
    const { where = {}, limit, offset, order = [['created_at', 'DESC']] } = options;
    
    let whereClause = '';
    let values = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (Object.keys(where).length > 0) {
      const conditions = [];
      for (const [key, value] of Object.entries(where)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (typeof value === 'object' && value.$gt) {
          conditions.push(`${dbKey} > $${paramIndex++}`);
          values.push(value.$gt);
        } else if (typeof value === 'object' && value.$lt) {
          conditions.push(`${dbKey} < $${paramIndex++}`);
          values.push(value.$lt);
        } else {
          conditions.push(`${dbKey} = $${paramIndex++}`);
          values.push(value);
        }
      }
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Count query
    const countQuery = `SELECT COUNT(*) FROM upload_links ${whereClause}`;
    const countResult = await this.db.query(countQuery, values);
    const count = parseInt(countResult.rows[0].count);

    // Data query
    let dataQuery = `SELECT * FROM upload_links ${whereClause}`;
    
    // Add ORDER BY
    if (order && order.length > 0) {
      const orderClause = order.map(([field, direction]) => {
        const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbField} ${direction}`;
      }).join(', ');
      dataQuery += ` ORDER BY ${orderClause}`;
    }

    // Add LIMIT and OFFSET
    if (limit) {
      dataQuery += ` LIMIT $${paramIndex++}`;
      values.push(limit);
    }
    if (offset) {
      dataQuery += ` OFFSET $${paramIndex++}`;
      values.push(offset);
    }

    try {
      const dataResult = await this.db.query(dataQuery, values);
      const rows = dataResult.rows.map(row => new UploadLink(row));
      
      return { count, rows };
    } catch (error) {
      console.error('Error finding upload links:', error);
      throw error;
    }
  }

  // Count upload links
  static async count(where = {}) {
    let whereClause = '';
    let values = [];
    let paramIndex = 1;

    if (Object.keys(where).length > 0) {
      const conditions = [];
      for (const [key, value] of Object.entries(where)) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (typeof value === 'object' && value.$gte) {
          conditions.push(`${dbKey} >= $${paramIndex++}`);
          values.push(value.$gte);
        } else if (typeof value === 'object' && value.$lt) {
          conditions.push(`${dbKey} < $${paramIndex++}`);
          values.push(value.$lt);
        } else {
          conditions.push(`${dbKey} = $${paramIndex++}`);
          values.push(value);
        }
      }
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const query = `SELECT COUNT(*) FROM upload_links ${whereClause}`;

    try {
      const result = await this.db.query(query, values);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error counting upload links:', error);
      throw error;
    }
  }
}

module.exports = { UploadLink };
