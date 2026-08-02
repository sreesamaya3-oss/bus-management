/**
 * Express Application Configuration
 * Sets up security headers, CORS, body parsers, logging, routes, and centralized error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./routes/index');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/response');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// HTTP Request Logger
app.use(morgan('dev'));

// Express Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Endpoints
app.get('/', (req, res) => {
  return sendSuccess(res, 'CKCET Smart Bus Management System API Server is Running', {
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  return sendSuccess(res, 'CKCET Smart Bus Management API Base Endpoint', {
    available_modules: [
      '/api/auth',
      '/api/students',
      '/api/parents',
      '/api/drivers',
      '/api/admins',
      '/api/buses',
      '/api/routes',
      '/api/stops',
      '/api/attendance',
      '/api/complaints',
      '/api/leave-requests',
      '/api/notifications',
      '/api/schedule',
      '/api/assignments'
    ]
  });
});

// Mount Central API Routes
app.use('/api', apiRoutes);

// Catch-all 404 Route Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
