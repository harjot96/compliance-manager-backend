const { verifyToken } = require('../utils/jwt');
const Company = require('../models/Company');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    const company = await Company.findById(decoded.id);
    
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Company not found.'
      });
    }

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
  if (req.company && req.company.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Unauthorized: Super Admins only.'
  });
};

module.exports = authMiddleware;
module.exports.isSuperAdmin = isSuperAdmin;
module.exports.requireSuperAdmin = requireSuperAdmin;
