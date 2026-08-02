/**
 * Centralized Error Handling Middleware
 * Captures 404 unhandled routes and uncaught application runtime errors.
 */

const { sendError } = require('../utils/response');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found - ${req.originalUrl}`, { method: req.method }, 404);
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, {
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
