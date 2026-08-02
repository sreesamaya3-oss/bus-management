/**
 * Environment Configuration & Validation
 * Loads environment variables from .env file using dotenv.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root of backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_ckcet_bus_system',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

/**
 * Validates that essential environment variables are set.
 * Prints warnings if Supabase credentials are missing.
 */
const validateEnv = () => {
  const missing = [];
  if (!config.supabaseUrl) missing.push('SUPABASE_URL');
  if (!config.supabaseAnonKey) missing.push('SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    console.warn(`[WARNING] Missing environment variables: ${missing.join(', ')}.`);
    console.warn(`[WARNING] Please update backend/.env with your Supabase credentials.`);
  }
};

validateEnv();

module.exports = config;
