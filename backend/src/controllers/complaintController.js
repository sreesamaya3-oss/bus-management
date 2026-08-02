/**
 * Complaint Controller
 * Handles CRUD operations for complaints.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const complaintService = new SupabaseService('complaints');

const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getAll();
    return sendSuccess(res, 'Complaints fetched successfully', complaints);
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getById(req.params.id);
    if (!complaint) return sendError(res, 'Complaint not found', {}, 404);
    return sendSuccess(res, 'Complaint details fetched successfully', complaint);
  } catch (error) {
    next(error);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const newComplaint = await complaintService.create({
      ...req.body,
      user_id: req.user ? req.user.id : req.body.user_id
    });
    return sendSuccess(res, 'Complaint created successfully', newComplaint, 201);
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const updated = await complaintService.update(req.params.id, req.body);
    return sendSuccess(res, 'Complaint updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const deleted = await complaintService.delete(req.params.id);
    return sendSuccess(res, 'Complaint deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
