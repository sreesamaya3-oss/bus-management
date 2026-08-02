/**
 * Stop Controller
 * Handles CRUD operations for bus pickup/drop stops.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const stopService = new SupabaseService('stops');

const getAllStops = async (req, res, next) => {
  try {
    const stops = await stopService.getAll();
    return sendSuccess(res, 'Stops fetched successfully', stops);
  } catch (error) {
    next(error);
  }
};

const getStopById = async (req, res, next) => {
  try {
    const stop = await stopService.getById(req.params.id);
    if (!stop) return sendError(res, 'Stop not found', {}, 404);
    return sendSuccess(res, 'Stop details fetched successfully', stop);
  } catch (error) {
    next(error);
  }
};

const createStop = async (req, res, next) => {
  try {
    const newStop = await stopService.create(req.body);
    return sendSuccess(res, 'Stop created successfully', newStop, 201);
  } catch (error) {
    next(error);
  }
};

const updateStop = async (req, res, next) => {
  try {
    const updated = await stopService.update(req.params.id, req.body);
    return sendSuccess(res, 'Stop updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteStop = async (req, res, next) => {
  try {
    const deleted = await stopService.delete(req.params.id);
    return sendSuccess(res, 'Stop deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop
};
