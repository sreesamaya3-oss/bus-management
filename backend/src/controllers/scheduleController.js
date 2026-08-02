/**
 * Schedule Controller
 * Handles CRUD operations for driver schedules (`driver_schedule`).
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const scheduleService = new SupabaseService('driver_schedule');

const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAll();
    return sendSuccess(res, 'Driver schedules fetched successfully', schedules);
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await scheduleService.getById(req.params.id);
    if (!schedule) return sendError(res, 'Schedule entry not found', {}, 404);
    return sendSuccess(res, 'Schedule entry fetched successfully', schedule);
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const newSchedule = await scheduleService.create(req.body);
    return sendSuccess(res, 'Schedule entry created successfully', newSchedule, 201);
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const updated = await scheduleService.update(req.params.id, req.body);
    return sendSuccess(res, 'Schedule entry updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const deleted = await scheduleService.delete(req.params.id);
    return sendSuccess(res, 'Schedule entry deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
