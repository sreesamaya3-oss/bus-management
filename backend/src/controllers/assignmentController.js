/**
 * Student Bus Assignment Controller
 * Handles CRUD operations for student-to-bus assignments (`student_bus_assignment`).
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const assignmentService = new SupabaseService('student_bus_assignment');

const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAll();
    return sendSuccess(res, 'Student bus assignments fetched successfully', assignments);
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getById(req.params.id);
    if (!assignment) return sendError(res, 'Bus assignment record not found', {}, 404);
    return sendSuccess(res, 'Bus assignment record fetched successfully', assignment);
  } catch (error) {
    next(error);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    const newAssignment = await assignmentService.create(req.body);
    return sendSuccess(res, 'Bus assignment created successfully', newAssignment, 201);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const updated = await assignmentService.update(req.params.id, req.body);
    return sendSuccess(res, 'Bus assignment updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const deleted = await assignmentService.delete(req.params.id);
    return sendSuccess(res, 'Bus assignment deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
