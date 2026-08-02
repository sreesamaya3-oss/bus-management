/**
 * Server Initialization Entry Point
 * Starts HTTP server on configured port and listens for incoming client connections.
 */

const app = require('./app');
const config = require('./config/env');

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CKCET Smart Bus Management Backend Server Started`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL] Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
});
