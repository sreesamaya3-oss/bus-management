/**
 * Supabase Client Configuration
 * Initializes and exports a single reusable Supabase client instance.
 * Avoids duplicate client creations across the application.
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.warn('[SUPABASE] Initializing Supabase client without valid credentials. Database calls will fail until credentials are provided in .env');
}

// Create single Supabase client instance
const supabase = createClient(
  config.supabaseUrl || 'https://placeholder.supabase.co',
  config.supabaseAnonKey || 'placeholder-key'
);

module.exports = supabase;
