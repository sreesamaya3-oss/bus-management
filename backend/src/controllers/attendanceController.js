/**
 * Attendance Controller
 * Handles CRUD operations for daily student bus attendance.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const attendanceService = new SupabaseService('attendance');

const getAllAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAll();
    return sendSuccess(res, 'Attendance records fetched successfully', attendance);
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (req, res, next) => {
  try {
    const record = await attendanceService.getById(req.params.id);
    if (!record) return sendError(res, 'Attendance record not found', {}, 404);
    return sendSuccess(res, 'Attendance record fetched successfully', record);
  } catch (error) {
    next(error);
  }
};

const createAttendance = async (req, res, next) => {
  try {
    const newRecord = await attendanceService.create(req.body);
    return sendSuccess(res, 'Attendance record created successfully', newRecord, 201);
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const updated = await attendanceService.update(req.params.id, req.body);
    return sendSuccess(res, 'Attendance record updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const deleted = await attendanceService.delete(req.params.id);
    return sendSuccess(res, 'Attendance record deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
};
