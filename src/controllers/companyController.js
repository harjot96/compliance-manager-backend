const Company = require('../models/Company');
const CompanyCompliance = require('../models/CompanyCompliance');
const { generateToken } = require('../utils/jwt');
const { complianceDetailsSchema } = require('../utils/validation');

// Register new company
const register = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    const token = generateToken({ id: company.id });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        company: company.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register new super admin
const registerSuperAdmin = async (req, res, next) => {
  try {
    const company = await Company.create({ ...req.body, role: 'superadmin' });
    const token = generateToken({ id: company.id });

    res.status(201).json({
      success: true,
      message: 'Super Admin registered successfully',
      data: {
        company: company.toJSON(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login company
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findByEmail(email);

    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await company.verifyPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken({ id: company.id });
    console.log(company);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        company: company.toJSON(),
        token,
        superadmin: company.role === 'superadmin', // Add superadmin flag
        role: company.role // Add role to response
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update compliance details
const updateComplianceDetails = async (req, res, next) => {
  try {
    const updatedCompany = await Company.updateComplianceDetails(req.company.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Compliance details updated successfully',
      data: updatedCompany.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const updatedCompany = await Company.updateProfile(req.company.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedCompany.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Create or update compliance details for the authenticated company
const upsertComplianceDetails = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = complianceDetailsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    // Check if compliance record exists
    let compliance = await CompanyCompliance.getByCompanyId(req.company.id);
    if (compliance) {
      compliance = await CompanyCompliance.update(req.company.id, req.body);
    } else {
      compliance = await CompanyCompliance.create(req.company.id, req.body);
    }
    res.status(200).json({
      success: true,
      message: 'Compliance details saved',
      data: compliance.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Get compliance details for the authenticated company
const getComplianceDetails = async (req, res, next) => {
  try {
    const compliance = await CompanyCompliance.getByCompanyId(req.company.id);
    if (!compliance) {
      return res.status(404).json({ success: false, message: 'Compliance details not found' });
    }
    res.json({ success: true, data: compliance.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Get all companies (Super Admin only, paginated)
const getAllCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Get total count (excluding superadmins)
    const countResult = await Company.db.query("SELECT COUNT(*) FROM companies WHERE role != 'superadmin'");
    const total = parseInt(countResult.rows[0].count, 10);

    // Get paginated companies
    const companies = await Company.getAll({ limit, offset });

    res.status(200).json({
      success: true,
      data: companies.map(company => company.toJSON()),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all companies (no pagination, excluding superadmins)
const getAllCompaniesNoPagination = async (req, res, next) => {
  try {
    const companies = await Company.getAllNoPagination();
    res.status(200).json({
      success: true,
      data: companies.map(company => company.toJSON())
    });
  } catch (error) {
    next(error);
  }
};

// Get compliance details for any company (Super Admin only)
const getComplianceDetailsByCompanyId = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const compliance = await CompanyCompliance.getByCompanyId(companyId);
    if (!compliance) {
      return res.status(404).json({ success: false, message: 'Compliance details not found' });
    }
    res.json({ success: true, data: compliance.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Edit any company (Super Admin)
const editCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { isActive, ...profileFields } = req.body;
    let updatedCompany = null;
    // If isActive is provided, update it first
    if (typeof isActive === 'boolean') {
      updatedCompany = await Company.setActiveStatus(companyId, isActive);
      if (!updatedCompany) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }
    }
    // Update profile fields (includeInactive = true for super admin)
    updatedCompany = await Company.updateProfile(companyId, profileFields, true);
    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Activate or deactivate a company (Super Admin)
const setCompanyActiveStatus = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    const updatedCompany = await Company.setActiveStatus(companyId, isActive);
    if (!updatedCompany) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({
      success: true,
      message: `Company has been ${isActive ? 'activated' : 'deactivated'}`,
      data: updatedCompany.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// Get company information by ID (Super Admin)
const getCompanyById = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId, true); // includeInactive = true
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    const compliance = await CompanyCompliance.getByCompanyId(companyId);
    res.status(200).json({
      success: true,
      data: {
        company: company.toJSON(),
        compliance: compliance ? compliance.toJSON() : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  updateComplianceDetails,
  updateProfile,
  registerSuperAdmin, // Export new function
  getAllCompanies, // Export getAllCompanies
  upsertComplianceDetails, // Export new upsert function
  getComplianceDetails, // Export new get function
  getComplianceDetailsByCompanyId, // Export superadmin function
  editCompany, // Export edit company
  setCompanyActiveStatus, // Export activate/deactivate
  getCompanyById, // Export new getCompanyById
  getAllCompaniesNoPagination,
};

