const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Company {
  static db = db;
  constructor(data) {
    this.id = data.id;
    this.companyName = data.company_name;
    this.email = data.email;
    this.mobileNumber = data.mobile_number;
    this.passwordHash = data.password_hash;
    this.basFrequency = data.bas_frequency;
    this.nextBasDue = data.next_bas_due;
    this.fbtApplicable = data.fbt_applicable;
    this.nextFbtDue = data.next_fbt_due;
    this.iasRequired = data.ias_required;
    this.iasFrequency = data.ias_frequency;
    this.nextIasDue = data.next_ias_due;
    this.financialYearEnd = data.financial_year_end;
    this.role = data.role; // Add role property
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new company
  static async create(companyData) {
    const { companyName, email, mobileNumber, password, role, basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd } = companyData;
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO companies (company_name, email, mobile_number, password_hash, role, bas_frequency, next_bas_due, fbt_applicable, next_fbt_due, ias_required, ias_frequency, next_ias_due, financial_year_end)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const result = await db.query(query, [companyName, email, mobileNumber, passwordHash, role || 'company', basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd]);
    return new Company(result.rows[0]);
  }

  // Find company by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM companies WHERE email = $1 AND is_active = TRUE';
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Company(result.rows[0]);
  }

  // Find company by ID
  static async findById(id) {
    const query = 'SELECT * FROM companies WHERE id = $1 AND is_active = TRUE';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Company(result.rows[0]);
  }

  // Update company compliance details
  static async updateComplianceDetails(id, complianceData) {
    const { basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd } = complianceData;
    
    const query = `
      UPDATE companies 
      SET bas_frequency = $1, next_bas_due = $2, fbt_applicable = $3, next_fbt_due = $4, ias_required = $5, ias_frequency = $6, next_ias_due = $7, financial_year_end = $8
      WHERE id = $9 AND is_active = TRUE
      RETURNING *
    `;
    
    const result = await db.query(query, [basFrequency, nextBasDue, fbtApplicable, nextFbtDue, iasRequired, iasFrequency, nextIasDue, financialYearEnd, id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Company(result.rows[0]);
  }

  // Update company profile
  static async updateProfile(id, profileData) {
    const { companyName, email, mobileNumber } = profileData;
    
    const query = `
      UPDATE companies 
      SET company_name = $1, email = $2, mobile_number = $3
      WHERE id = $4 AND is_active = TRUE
      RETURNING *
    `;
    
    const result = await db.query(query, [companyName, email, mobileNumber, id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Company(result.rows[0]);
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  // Get all companies (excluding superadmins) with pagination
  static async getAll({ limit = 10, offset = 0 } = {}) {
    const query = "SELECT * FROM companies WHERE role != 'superadmin' ORDER BY created_at DESC LIMIT $1 OFFSET $2";
    const result = await db.query(query, [limit, offset]);
    return result.rows.map(row => new Company(row));
  }

  // Convert to JSON (exclude sensitive data)
  toJSON() {
    return {
      id: this.id,
      companyName: this.companyName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      basFrequency: this.basFrequency,
      nextBasDue: this.nextBasDue,
      fbtApplicable: this.fbtApplicable,
      nextFbtDue: this.nextFbtDue,
      iasRequired: this.iasRequired,
      iasFrequency: this.iasFrequency,
      nextIasDue: this.nextIasDue,
      financialYearEnd: this.financialYearEnd,
      role: this.role, // Add role to output
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Company;
