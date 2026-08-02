/**
 * Admin Controller
 * Provides administrative oversight, dashboard analytics, resource assignment, complaint resolution, and leave approvals.
 */

const SupabaseService = require('../services/supabaseService');
const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const adminService = new SupabaseService('admins');

/**
 * Get all admins
 * GET /api/admins
 */
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAll();
    return sendSuccess(res, 'Admin profiles fetched successfully', admins);
  } catch (error) {
    next(error);
  }
};

/**
 * Get admin by ID
 * GET /api/admins/:id
 */
const getAdminById = async (req, res, next) => {
  try {
    const admin = await adminService.getById(req.params.id);
    if (!admin) {
      return sendError(res, 'Admin record not found', {}, 404);
    }
    return sendSuccess(res, 'Admin profile fetched successfully', admin);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new admin
 * POST /api/admins
 */
const createAdmin = async (req, res, next) => {
  try {
    const newAdmin = await adminService.create(req.body);
    return sendSuccess(res, 'Admin created successfully', newAdmin, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update admin by ID
 * PUT /api/admins/:id
 */
const updateAdmin = async (req, res, next) => {
  try {
    const updated = await adminService.update(req.params.id, req.body);
    return sendSuccess(res, 'Admin updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete admin by ID
 * DELETE /api/admins/:id
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const deleted = await adminService.delete(req.params.id);
    return sendSuccess(res, 'Admin deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

/**
 * Dashboard Counts Analytics
 * GET /api/admins/dashboard/counts
 */
const getDashboardCounts = async (req, res, next) => {
  try {
    const [
      { count: totalStudents },
      { count: totalDrivers },
      { count: totalBuses },
      { count: totalRoutes },
      { count: totalStops },
      { count: pendingComplaints },
      { count: pendingLeaves }
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('drivers').select('*', { count: 'exact', head: true }),
      supabase.from('buses').select('*', { count: 'exact', head: true }),
      supabase.from('routes').select('*', { count: 'exact', head: true }),
      supabase.from('stops').select('*', { count: 'exact', head: true }),
      supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    const counts = {
      total_students: totalStudents || 0,
      total_drivers: totalDrivers || 0,
      total_buses: totalBuses || 0,
      total_routes: totalRoutes || 0,
      total_stops: totalStops || 0,
      pending_complaints: pendingComplaints || 0,
      pending_leaves: pendingLeaves || 0
    };

    return sendSuccess(res, 'Dashboard counts retrieved successfully', counts);
  } catch (error) {
    next(error);
  }
};

/**
 * Assign Student to Bus, Stop, and Route
 * POST /api/admins/assign-student
 */
const assignStudentToBus = async (req, res, next) => {
  try {
    const { student_id, bus_id, stop_id, route_id } = req.body;

    const { data: updatedStudent, error } = await supabase
      .from('students')
      .update({ bus_id, stop_id, route_id })
      .eq('id', student_id)
      .select();

    if (error) throw new Error(error.message);

    // Save assignment history
    await supabase.from('student_bus_assignment').insert([
      {
        student_id,
        bus_id,
        stop_id,
        route_id,
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'active'
      }
    ]);

    return sendSuccess(res, 'Student assigned to bus successfully', updatedStudent ? updatedStudent[0] : {});
  } catch (error) {
    next(error);
  }
};

/**
 * Assign Driver to Bus
 * POST /api/admins/assign-driver
 */
const assignDriverToBus = async (req, res, next) => {
  try {
    const { driver_id, bus_id } = req.body;

    // Update buses table
    const { data: updatedBus, error: busErr } = await supabase
      .from('buses')
      .update({ driver_id })
      .eq('id', bus_id)
      .select();

    if (busErr) throw new Error(busErr.message);

    // Update driver record
    await supabase
      .from('drivers')
      .update({ bus_id })
      .eq('id', driver_id);

    return sendSuccess(res, 'Driver assigned to bus successfully', updatedBus ? updatedBus[0] : {});
  } catch (error) {
    next(error);
  }
};

/**
 * Manage / Resolve Complaint
 * PUT /api/admins/complaints/:id
 */
const resolveComplaint = async (req, res, next) => {
  try {
    const { status, resolution_notes } = req.body;
    const complaintId = req.params.id;

    const { data: updated, error } = await supabase
      .from('complaints')
      .update({
        status: status || 'resolved',
        resolved_by: req.user.id,
        resolution_notes: resolution_notes || null
      })
      .eq('id', complaintId)
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Complaint status updated successfully', updated ? updated[0] : {});
  } catch (error) {
    next(error);
  }
};

/**
 * Approve or Reject Leave Request
 * PUT /api/admins/leaves/:id
 */
const approveLeaveRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const leaveId = req.params.id;

    const { data: updated, error } = await supabase
      .from('leave_requests')
      .update({
        status: status || 'approved',
        approved_by: req.user.id
      })
      .eq('id', leaveId)
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, `Leave request ${status || 'updated'} successfully`, updated ? updated[0] : {});
  } catch (error) {
    next(error);
  }
};

/**
 * Create Broadcast Notification
 * POST /api/admins/notifications
 */
const createNotification = async (req, res, next) => {
  try {
    const { title, message, target_role } = req.body;

    const { data: newNotification, error } = await supabase
      .from('notifications')
      .insert([
        {
          title,
          message,
          target_role: target_role || 'all',
          created_by: req.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Notification created successfully', newNotification[0], 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getDashboardCounts,
  assignStudentToBus,
  assignDriverToBus,
  resolveComplaint,
  approveLeaveRequest,
  createNotification
};
