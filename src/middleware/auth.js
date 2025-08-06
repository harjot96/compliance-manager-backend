const { verifyToken } = require('../utils/jwt');
const Company = require('../models/Company');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔍 DEBUG: authMiddleware called');
    console.log('🔍 DEBUG: Authorization header:', req.header('Authorization'));
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔍 DEBUG: Extracted token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('🔍 DEBUG: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log('🔍 DEBUG: Verifying token...');
    const decoded = verifyToken(token);
    console.log('🔍 DEBUG: Token decoded, id:', decoded.id);
    
    const company = await Company.findById(decoded.id);
    console.log('🔍 DEBUG: Company found:', company ? 'yes' : 'no');
    
    if (!company) {
      console.log('🔍 DEBUG: Company not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Company not found.'
      });
    }

    console.log('🔍 DEBUG: Setting req.company:', company.id, company.role);
    req.company = company;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to check for superadmin role
const isSuperAdmin = (req, res, next) => {
  if (req.company && req.company.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Super Admins only.'
  });
};

// Middleware to require superadmin role (for route protection)
const requireSuperAdmin = (req, res, next) => {
  console.log('DEBUG requireSuperAdmin - req.company:', req.company);
  console.log('DEBUG requireSuperAdmin - req.company.role:', req.company?.role);
  if (req.company && req.company.role === 'superadmin') {
    console.log('DEBUG requireSuperAdmin - Access granted');
    return next();
  }
  console.log('DEBUG requireSuperAdmin - Access denied');
  return res.status(403).json({
    success: false,
    message: 'Unauthorized: Super Admins only.'
  });
};

module.exports = authMiddleware;
module.exports.isSuperAdmin = isSuperAdmin;
module.exports.requireSuperAdmin = requireSuperAdmin;
