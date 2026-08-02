/**
 * Bus Controller
 * Handles CRUD operations for university buses.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const busService = new SupabaseService('buses');

const getAllBuses = async (req, res, next) => {
  try {
    const buses = await busService.getAll();
    return sendSuccess(res, 'Buses fetched successfully', buses);
  } catch (error) {
    next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const bus = await busService.getById(req.params.id);
    if (!bus) return sendError(res, 'Bus not found', {}, 404);
    return sendSuccess(res, 'Bus details fetched successfully', bus);
  } catch (error) {
    next(error);
  }
};

const createBus = async (req, res, next) => {
  try {
    const newBus = await busService.create(req.body);
    return sendSuccess(res, 'Bus created successfully', newBus, 201);
  } catch (error) {
    next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const updated = await busService.update(req.params.id, req.body);
    return sendSuccess(res, 'Bus updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const deleted = await busService.delete(req.params.id);
    return sendSuccess(res, 'Bus deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};
