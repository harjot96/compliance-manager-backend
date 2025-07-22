const db = require('../config/database');

class ComplianceDeadlines {
  static async get() {
    const result = await db.query('SELECT * FROM compliance_deadlines LIMIT 1');
    return result.rows.length ? result.rows[0].deadlines : null;
  }

  static async update(deadlines) {
    const result = await db.query(
      `UPDATE compliance_deadlines SET deadlines = $1, updated_at = CURRENT_TIMESTAMP RETURNING *`,
      [deadlines]
    );
    return result.rows.length ? result.rows[0].deadlines : null;
  }
}

module.exports = ComplianceDeadlines; 