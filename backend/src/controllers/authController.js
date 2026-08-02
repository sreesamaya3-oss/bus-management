/**
 * Authentication Controller
 * Handles user login, registration, and user profile retrieval.
 */

const supabase = require('../config/supabase');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Login user and issue JWT token
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', {}, 400);
    }

    // Query user by email from Supabase users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      return sendError(res, 'Database error while logging in', { details: error.message }, 500);
    }

    if (!users || users.length === 0) {
      return sendError(res, 'Invalid credentials', {}, 401);
    }

    const user = users[0];

    // Verify password hash
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', {}, 401);
    }

    // Prepare JWT payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = generateToken(tokenPayload);

    // Remove password hash from response
    delete user.password;

    return sendSuccess(res, 'Login successful', {
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (existingUsers && existingUsers.length > 0) {
      return sendError(res, 'User with this email already exists', {}, 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user record
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role: role || 'student',
          phone: phone || null,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      return sendError(res, 'Failed to create user', { details: error.message }, 500);
    }

    const user = newUser[0];
    delete user.password;

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return sendSuccess(res, 'User registered successfully', { token, user }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return sendError(res, 'User profile not found', {}, 404);
    }

    return sendSuccess(res, 'User profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getMe
};
