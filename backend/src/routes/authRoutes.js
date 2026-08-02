/**
 * Authentication Routes
 * Mounted at: /api/auth
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public route: Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

// Public / Admin route: Register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'driver', 'parent', 'student']).withMessage('Invalid user role')
  ],
  validate,
  authController.register
);

// Protected route: Get Current User Profile
router.get('/me', authenticate, authController.getMe);

module.exports = router;
