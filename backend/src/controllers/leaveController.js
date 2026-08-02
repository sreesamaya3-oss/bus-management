/**
 * Leave Controller
 * Handles CRUD operations for student bus leave requests.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const leaveService = new SupabaseService('leave_requests');

const getAllLeaveRequests = async (req, res, next) => {
  try {
    const leaves = await leaveService.getAll();
    return sendSuccess(res, 'Leave requests fetched successfully', leaves);
  } catch (error) {
    next(error);
  }
};

const getLeaveRequestById = async (req, res, next) => {
  try {
    const leave = await leaveService.getById(req.params.id);
    if (!leave) return sendError(res, 'Leave request not found', {}, 404);
    return sendSuccess(res, 'Leave request details fetched successfully', leave);
  } catch (error) {
    next(error);
  }
};

const createLeaveRequest = async (req, res, next) => {
  try {
    const newLeave = await leaveService.create({
      ...req.body,
      user_id: req.user ? req.user.id : req.body.user_id
    });
    return sendSuccess(res, 'Leave request created successfully', newLeave, 201);
  } catch (error) {
    next(error);
  }
};

const updateLeaveRequest = async (req, res, next) => {
  try {
    const updated = await leaveService.update(req.params.id, req.body);
    return sendSuccess(res, 'Leave request updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteLeaveRequest = async (req, res, next) => {
  try {
    const deleted = await leaveService.delete(req.params.id);
    return sendSuccess(res, 'Leave request deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest
};
