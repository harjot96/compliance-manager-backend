/**
 * Company Data Isolation Middleware
 * Ensures that companies can only access their own data
 */

const { UploadLink } = require('../models/UploadLink');
const { MissingAttachmentConfig } = require('../models/MissingAttachmentConfig');

/**
 * Validate that an upload link belongs to the authenticated company
 */
const validateUploadLinkOwnership = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const companyId = req.company?.id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!linkId) {
      return res.status(400).json({
        success: false,
        message: 'Upload link ID required'
      });
    }

    // Check if the upload link belongs to this company
    const uploadLink = await UploadLink.findOne({ linkId });
    
    if (!uploadLink) {
      return res.status(404).json({
        success: false,
        message: 'Upload link not found'
      });
    }

    if (uploadLink.companyId !== companyId) {
      console.warn(`🚨 SECURITY: Company ${companyId} attempted to access upload link ${linkId} belonging to company ${uploadLink.companyId}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied: Upload link belongs to different company'
      });
    }

    // Add upload link to request for use in controller
    req.uploadLink = uploadLink;
    next();
  } catch (error) {
    console.error('❌ Error validating upload link ownership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate upload link ownership'
    });
  }
};

/**
 * Validate company data access for configuration endpoints
 */
const validateCompanyDataAccess = async (req, res, next) => {
  try {
    const companyId = req.company?.id;
    const { targetCompanyId } = req.params;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // If a target company ID is specified, ensure it matches the authenticated company
    if (targetCompanyId && parseInt(targetCompanyId) !== companyId) {
      console.warn(`🚨 SECURITY: Company ${companyId} attempted to access data for company ${targetCompanyId}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot access data for different company'
      });
    }

    // Log for audit trail
    console.log(`🔒 Data access validated: Company ${companyId} accessing own data`);
    next();
  } catch (error) {
    console.error('❌ Error validating company data access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate data access'
    });
  }
};

/**
 * Add company context to request for data isolation
 */
const addCompanyContext = (req, res, next) => {
  if (req.company?.id) {
    req.companyContext = {
      companyId: req.company.id,
      companyName: req.company.companyName || 'Unknown',
      role: req.company.role || 'company'
    };
    
    console.log(`🔒 Company context added: ${req.companyContext.companyName} (ID: ${req.companyContext.companyId})`);
  }
  
  next();
};

/**
 * Validate file access belongs to the requesting company
 */
const validateFileAccess = async (req, res, next) => {
  try {
    const { companyId, fileName } = req.params;
    const requestingCompanyId = req.company?.id;

    // Check if the requesting company matches the file's company
    if (parseInt(companyId) !== requestingCompanyId) {
      console.warn(`🚨 SECURITY: Company ${requestingCompanyId} attempted to access file for company ${companyId}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied: File belongs to different company'
      });
    }

    console.log(`🔒 File access validated: Company ${requestingCompanyId} accessing own file ${fileName}`);
    next();
  } catch (error) {
    console.error('❌ Error validating file access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate file access'
    });
  }
};

module.exports = {
  validateUploadLinkOwnership,
  validateCompanyDataAccess,
  addCompanyContext,
  validateFileAccess
};

