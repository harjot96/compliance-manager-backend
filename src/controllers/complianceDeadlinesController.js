const Joi = require('joi');
const ComplianceDeadlines = require('../models/ComplianceDeadlines');

const datePattern = /^\d{2} [A-Z][a-z]{2} \d{4}$/; // DD MMM YYYY

const deadlineSchema = Joi.object({
  bas: Joi.object({
    monthly: Joi.string().optional(),
    quarterly: Joi.object({
      q1: Joi.string().pattern(datePattern).optional(),
      q2: Joi.string().pattern(datePattern).optional(),
      q3: Joi.string().pattern(datePattern).optional(),
      q4: Joi.string().pattern(datePattern).optional()
    }).optional()
  }).optional(),
  annual: Joi.object({
    standard: Joi.string().optional(),
    noTaxReturn: Joi.string().allow('').optional() // Allow empty string
  }).optional(),
  ias: Joi.object({
    monthly: Joi.string().optional(),
    quarterly: Joi.object({
      q1: Joi.string().pattern(datePattern).optional(),
      q2: Joi.string().pattern(datePattern).optional(),
      q3: Joi.string().pattern(datePattern).optional(),
      q4: Joi.string().pattern(datePattern).optional()
    }).optional()
  }).optional(),
  fbt: Joi.object({
    annual: Joi.object({
      selfLodgement: Joi.string().optional(),
      taxAgentElectronic: Joi.string().optional()
    }).optional()
  }).optional()
});

const getDeadlines = async (req, res, next) => {
  try {
    const deadlines = await ComplianceDeadlines.get();
    res.json({ success: true, data: deadlines });
  } catch (error) {
    next(error);
  }
};

const updateDeadlines = async (req, res, next) => {
  try {
    // Accept partial updates: merge with existing
    const existing = await ComplianceDeadlines.get() || {};
    const merged = { ...existing, ...req.body };
    // Deep merge for nested objects
    if (existing.bas && req.body.bas) merged.bas = { ...existing.bas, ...req.body.bas };
    if (existing.ias && req.body.ias) merged.ias = { ...existing.ias, ...req.body.ias };
    if (existing.bas?.quarterly && req.body.bas?.quarterly) merged.bas.quarterly = { ...existing.bas.quarterly, ...req.body.bas.quarterly };
    if (existing.ias?.quarterly && req.body.ias?.quarterly) merged.ias.quarterly = { ...existing.ias.quarterly, ...req.body.ias.quarterly };
    if (existing.annual && req.body.annual) merged.annual = { ...existing.annual, ...req.body.annual };
    if (existing.fbt && req.body.fbt) merged.fbt = { ...existing.fbt, ...req.body.fbt };
    if (existing.fbt?.annual && req.body.fbt?.annual) merged.fbt.annual = { ...existing.fbt.annual, ...req.body.fbt.annual };
    // Remove old keys from quarterly if present
    if (merged.bas?.quarterly) {
      delete merged.bas.quarterly.q1;
      delete merged.bas.quarterly.q2;
      delete merged.bas.quarterly.q3;
      delete merged.bas.quarterly.q4;
    }
    if (merged.ias?.quarterly) {
      delete merged.ias.quarterly.q1;
      delete merged.ias.quarterly.q2;
      delete merged.ias.quarterly.q3;
      delete merged.ias.quarterly.q4;
    }
    // Validate merged
    const { error } = deadlineSchema.validate(merged);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const updated = await ComplianceDeadlines.update(merged);
    res.json({ success: true, message: 'Deadlines updated! All clients now see the new due‑dates.', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDeadlines, updateDeadlines }; 