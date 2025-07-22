const Joi = require('joi');
const ComplianceDeadlines = require('../models/ComplianceDeadlines');

const deadlineSchema = Joi.object({
  bas: Joi.object({
    monthly: Joi.string().required(),
    quarterly: Joi.object({
      q1: Joi.string().required(),
      q2: Joi.string().required(),
      q3: Joi.string().required(),
      q4: Joi.string().required()
    }).required()
  }).required(),
  annual: Joi.object({
    standard: Joi.string().required(),
    noTaxReturn: Joi.string().required()
  }).required(),
  ias: Joi.object({
    monthly: Joi.string().required(),
    quarterly: Joi.object({
      q1: Joi.string().required(),
      q2: Joi.string().required(),
      q3: Joi.string().required(),
      q4: Joi.string().required()
    }).required()
  }).required(),
  fbt: Joi.object({
    annual: Joi.object({
      selfLodgement: Joi.string().required(),
      taxAgentElectronic: Joi.string().required()
    }).required()
  }).required()
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
    const { error } = deadlineSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const updated = await ComplianceDeadlines.update(req.body);
    res.json({ success: true, message: 'Deadlines updated! All clients now see the new due‑dates.', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDeadlines, updateDeadlines }; 