/**
 * Parent Controller
 * Handles parent profiles, child attendance monitoring, bus details, and live route tracking API placeholder.
 */

const SupabaseService = require('../services/supabaseService');
const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const parentService = new SupabaseService('parents');

/**
 * Get all parents
 * GET /api/parents
 */
const getAllParents = async (req, res, next) => {
  try {
    const parents = await parentService.getAll();
    return sendSuccess(res, 'Parents fetched successfully', parents);
  } catch (error) {
    next(error);
  }
};

/**
 * Get parent by ID
 * GET /api/parents/:id
 */
const getParentById = async (req, res, next) => {
  try {
    const parent = await parentService.getById(req.params.id);
    if (!parent) {
      return sendError(res, 'Parent profile not found', {}, 404);
    }
    return sendSuccess(res, 'Parent profile fetched successfully', parent);
  } catch (error) {
    next(error);
  }
};

/**
 * Create parent profile
 * POST /api/parents
 */
const createParent = async (req, res, next) => {
  try {
    const newParent = await parentService.create(req.body);
    return sendSuccess(res, 'Parent profile created successfully', newParent, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update parent profile
 * PUT /api/parents/:id
 */
const updateParent = async (req, res, next) => {
  try {
    const updated = await parentService.update(req.params.id, req.body);
    return sendSuccess(res, 'Parent profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parent profile
 * DELETE /api/parents/:id
 */
const deleteParent = async (req, res, next) => {
  try {
    const deleted = await parentService.delete(req.params.id);
    return sendSuccess(res, 'Parent profile deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

/**
 * View Child Attendance
 * GET /api/parents/me/child-attendance
 */
const getChildAttendance = async (req, res, next) => {
  try {
    // 1. Get parent details
    const { data: parent } = await supabase
      .from('parents')
      .select('student_id')
      .eq('user_id', req.user.id)
      .single();

    const studentId = parent ? parent.student_id : req.query.student_id;

    if (!studentId) {
      return sendError(res, 'No associated student found for this parent account.', {}, 400);
    }

    // 2. Query attendance for child
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Child attendance records fetched successfully', attendance || []);
  } catch (error) {
    next(error);
  }
};

/**
 * View Child Bus Details
 * GET /api/parents/me/child-bus
 */
const getChildBusDetails = async (req, res, next) => {
  try {
    // Get parent & student info
    const { data: parent } = await supabase
      .from('parents')
      .select('student_id')
      .eq('user_id', req.user.id)
      .single();

    const studentId = parent ? parent.student_id : req.query.student_id;

    if (!studentId) {
      return sendError(res, 'No associated student found for this parent account.', {}, 400);
    }

    // Get student's assigned bus
    const { data: student } = await supabase
      .from('students')
      .select('bus_id, stop_id, route_id')
      .eq('id', studentId)
      .single();

    if (!student || !student.bus_id) {
      return sendError(res, 'No bus assigned to student yet.', {}, 404);
    }

    // Get bus details
    const { data: bus, error: busErr } = await supabase
      .from('buses')
      .select('*')
      .eq('id', student.bus_id)
      .single();

    if (busErr) throw new Error(busErr.message);

    return sendSuccess(res, 'Child bus details fetched successfully', {
      student_assignment: student,
      bus_details: bus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * View Live Route Information (API Placeholder)
 * GET /api/parents/me/live-route
 */
const getLiveRouteInfo = async (req, res, next) => {
  try {
    const busId = req.query.bus_id || '1';

    // Mock / placeholder response for real-time GPS tracking connection
    const liveTrackingData = {
      bus_id: busId,
      status: 'In Transit',
      speed_kmh: 42,
      current_latitude: 11.9401,
      current_longitude: 79.8083,
      current_stop: 'Central Square Stop',
      next_stop: 'CKCET Campus Main Gate',
      estimated_arrival_minutes: 12,
      last_updated: new Date().toISOString()
    };

    return sendSuccess(res, 'Live route tracking data retrieved (Placeholder)', liveTrackingData);
  } catch (error) {
    next(error);
  }
};

/**
 * View Parent Notifications
 * GET /api/parents/me/notifications
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .in('target_role', ['all', 'parent']);

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Parent notifications fetched successfully', notifications || []);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
  getChildAttendance,
  getChildBusDetails,
  getLiveRouteInfo,
  getMyNotifications
};
