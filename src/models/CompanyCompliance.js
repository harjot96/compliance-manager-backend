const db = require('../config/database');

class CompanyCompliance {
  constructor(data) {
    this.id = data.id;
    this.companyId = data.company_id;
    this.basFrequency = data.bas_frequency;
    this.nextBasDue = data.next_bas_due;
    this.fbtApplicable = data.fbt_applicable;
    this.nextFbtDue = data.next_fbt_due;
    this.iasRequired = data.ias_required;
    this.iasFrequency = data.ias_frequency;
    this.nextIasDue = data.next_ias_due;
    this.financialYearEnd = data.financial_year_end;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(companyId, details) {
    const { basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd } = details;
    const query = `
      INSERT INTO company_compliance (company_id, bas_frequency, next_bas_due, fbt_applicable, next_fbt_due, ias_required, ias_frequency, next_ias_due, financial_year_end)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await db.query(query, [companyId, basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd]);
    return new CompanyCompliance(result.rows[0]);
  }

  static async update(companyId, details) {
    const { basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd } = details;
    const query = `
      UPDATE company_compliance
      SET bas_frequency = $1, next_bas_due = $2, fbt_applicable = $3, next_fbt_due = $4, ias_required = $5, ias_frequency = $6, next_ias_due = $7, financial_year_end = $8, updated_at = CURRENT_TIMESTAMP
      WHERE company_id = $9
      RETURNING *
    `;
    const result = await db.query(query, [basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd, companyId]);
    return result.rows.length ? new CompanyCompliance(result.rows[0]) : null;
  }

  static async getByCompanyId(companyId) {
    const query = 'SELECT * FROM company_compliance WHERE company_id = $1';
    const result = await db.query(query, [companyId]);
    return result.rows.length ? new CompanyCompliance(result.rows[0]) : null;
  }

  toJSON() {
    return {
      id: this.id,
      companyId: this.companyId,
      basFrequency: this.basFrequency,
      nextBasDue: this.nextBasDue,
      fbtApplicable: this.fbtApplicable,
      nextFbtDue: this.nextFbtDue,
      iasRequired: this.iasRequired,
      iasFrequency: this.iasFrequency,
      nextIasDue: this.nextIasDue,
      financialYearEnd: this.financialYearEnd,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = CompanyCompliance; 