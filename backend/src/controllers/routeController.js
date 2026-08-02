/**
 * Route Controller
 * Handles CRUD operations for bus routes.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const routeService = new SupabaseService('routes');

const getAllRoutes = async (req, res, next) => {
  try {
    const routes = await routeService.getAll();
    return sendSuccess(res, 'Routes fetched successfully', routes);
  } catch (error) {
    next(error);
  }
};

const getRouteById = async (req, res, next) => {
  try {
    const route = await routeService.getById(req.params.id);
    if (!route) return sendError(res, 'Route not found', {}, 404);
    return sendSuccess(res, 'Route fetched successfully', route);
  } catch (error) {
    next(error);
  }
};

const createRoute = async (req, res, next) => {
  try {
    const newRoute = await routeService.create(req.body);
    return sendSuccess(res, 'Route created successfully', newRoute, 201);
  } catch (error) {
    next(error);
  }
};

const updateRoute = async (req, res, next) => {
  try {
    const updated = await routeService.update(req.params.id, req.body);
    return sendSuccess(res, 'Route updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteRoute = async (req, res, next) => {
  try {
    const deleted = await routeService.delete(req.params.id);
    return sendSuccess(res, 'Route deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
