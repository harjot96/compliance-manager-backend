const Company = require('../models/Company');
const { generateToken } = require('../utils/jwt');

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

module.exports = {
  register,
  login,
  updateComplianceDetails,
  updateProfile,
  registerSuperAdmin, // Export new function
  getAllCompanies // Export getAllCompanies
};

