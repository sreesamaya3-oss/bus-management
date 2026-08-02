/**
 * Authentication & Authorization Middleware
 * Protects endpoints using JWT tokens and role-based permissions.
 */

const { verifyToken } = require('../utils/helpers');
const { sendError } = require('../utils/response');

/**
 * Authenticates requests by verifying JWT Bearer Token in Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. Authorization token missing or malformed.', {}, 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', {}, 401);
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication failed. Token has expired.', { code: 'TOKEN_EXPIRED' }, 401);
    }
    return sendError(res, 'Invalid token. Authentication failed.', { details: error.message }, 401);
  }
};

/**
 * Authorizes user access based on role permissions
 * @param {...string} allowedRoles - Permitted user roles (e.g. 'admin', 'driver', 'parent', 'student')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', {}, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Forbidden. Access restricted to roles: ${allowedRoles.join(', ')}`,
        { userRole: req.user.role },
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
