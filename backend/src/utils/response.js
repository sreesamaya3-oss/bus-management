/**
 * Standardized API Response Helper Functions
 * Ensures consistent API structure across all endpoints.
 */

/**
 * Sends a standard success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object|Array} data - Payload data
 * @param {number} statusCode - HTTP Status Code (default: 200)
 */
const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standard error response
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {Object|Array|string} error - Detailed error payload or object
 * @param {number} statusCode - HTTP Status Code (default: 500)
 */
const sendError = (res, message = 'Internal Server Error', error = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === 'string' ? { details: error } : error
  });
};

module.exports = {
  sendSuccess,
  sendError
};
