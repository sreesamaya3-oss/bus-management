/**
 * Reusable Supabase Data Service
 * Provides helper CRUD methods for database tables to avoid repeating logic.
 */

const supabase = require('../config/supabase');

class SupabaseService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Fetch all records from table with optional filter and select columns
   */
  async getAll(select = '*', filters = {}) {
    let query = supabase.from(this.tableName).select(select);

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        query = query.eq(key, filters[key]);
      }
    });

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Fetch a single record by primary ID
   */
  async getById(id, select = '*') {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(select)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Insert a new record into table
   */
  async create(record) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([record])
      .select();

    if (error) throw new Error(error.message);
    return data ? data[0] : null;
  }

  /**
   * Update an existing record by ID
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data ? data[0] : null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data ? data[0] : null;
  }
}

module.exports = SupabaseService;
