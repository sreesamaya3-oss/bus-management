/**
 * Input Validation Middleware
 * Checks express-validator results and responds with a standardized 400 error if validation fails.
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Validates request input and formats validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation error',
      { details: errors.array().map(err => ({ field: err.path || err.param, message: err.msg })) },
      400
    );
  }
  next();
};

module.exports = validate;
