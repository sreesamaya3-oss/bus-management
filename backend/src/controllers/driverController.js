/**
 * Driver Controller
 * Handles driver management, assigned bus/route lookup, assigned student lists, attendance marking, and trip status updates.
 */

const SupabaseService = require('../services/supabaseService');
const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const driverService = new SupabaseService('drivers');

/**
 * Get all drivers
 * GET /api/drivers
 */
const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAll();
    return sendSuccess(res, 'Drivers fetched successfully', drivers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver by ID
 * GET /api/drivers/:id
 */
const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getById(req.params.id);
    if (!driver) {
      return sendError(res, 'Driver not found', {}, 404);
    }
    return sendSuccess(res, 'Driver profile fetched successfully', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new driver
 * POST /api/drivers
 */
const createDriver = async (req, res, next) => {
  try {
    const newDriver = await driverService.create(req.body);
    return sendSuccess(res, 'Driver profile created successfully', newDriver, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update driver by ID
 * PUT /api/drivers/:id
 */
const updateDriver = async (req, res, next) => {
  try {
    const updated = await driverService.update(req.params.id, req.body);
    return sendSuccess(res, 'Driver profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete driver by ID
 * DELETE /api/drivers/:id
 */
const deleteDriver = async (req, res, next) => {
  try {
    const deleted = await driverService.delete(req.params.id);
    return sendSuccess(res, 'Driver profile deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

/**
 * View Assigned Bus for Logged In Driver
 * GET /api/drivers/me/bus
 */
const getAssignedBus = async (req, res, next) => {
  try {
    // 1. Get driver record linked to user_id
    const { data: driver } = await supabase
      .from('drivers')
      .select('id, bus_id')
      .eq('user_id', req.user.id)
      .single();

    let busId = driver ? driver.bus_id : null;

    // Search directly in buses table if not found in driver profile
    if (!busId) {
      const { data: bus } = await supabase
        .from('buses')
        .select('*')
        .eq('driver_id', req.user.id)
        .single();

      if (bus) {
        return sendSuccess(res, 'Assigned bus details fetched successfully', bus);
      }
      return sendError(res, 'No bus assigned to this driver.', {}, 404);
    }

    const { data: busDetails, error } = await supabase
      .from('buses')
      .select('*')
      .eq('id', busId)
      .single();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Assigned bus details fetched successfully', busDetails);
  } catch (error) {
    next(error);
  }
};

/**
 * View Today's Assigned Route
 * GET /api/drivers/me/route
 */
const getTodayRoute = async (req, res, next) => {
  try {
    // Check driver's schedule or bus route
    const { data: schedule } = await supabase
      .from('driver_schedule')
      .select('*, routes(*)')
      .eq('driver_id', req.user.id);

    if (schedule && schedule.length > 0) {
      return sendSuccess(res, "Today's schedule and route details fetched", schedule);
    }

    // Fallback: search via assigned bus
    const { data: bus } = await supabase
      .from('buses')
      .select('route_id, routes(*)')
      .eq('driver_id', req.user.id)
      .single();

    if (!bus || !bus.route_id) {
      return sendError(res, 'No route assigned for today.', {}, 404);
    }

    return sendSuccess(res, "Today's route details fetched successfully", bus.routes || { route_id: bus.route_id });
  } catch (error) {
    next(error);
  }
};

/**
 * View Assigned Students for Driver's Bus
 * GET /api/drivers/me/students
 */
const getAssignedStudents = async (req, res, next) => {
  try {
    // Get driver's bus ID
    const { data: bus } = await supabase
      .from('buses')
      .select('id')
      .eq('driver_id', req.user.id)
      .single();

    const busId = bus ? bus.id : req.query.bus_id;

    if (!busId) {
      return sendError(res, 'Driver is not linked to an active bus.', {}, 400);
    }

    // Fetch students assigned to this bus
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('bus_id', busId);

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Assigned students list retrieved successfully', students || []);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Attendance for a Student
 * POST /api/drivers/me/attendance
 */
const markStudentAttendance = async (req, res, next) => {
  try {
    const { student_id, bus_id, status, date } = req.body;

    const attendanceDate = date || new Date().toISOString().split('T')[0];

    const { data: record, error } = await supabase
      .from('attendance')
      .insert([
        {
          student_id,
          bus_id: bus_id || null,
          date: attendanceDate,
          status: status || 'present',
          marked_by: req.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Student attendance marked successfully', record[0], 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update Bus Trip Status (e.g., 'Started', 'In Progress', 'Completed')
 * PUT /api/drivers/me/trip-status
 */
const updateTripStatus = async (req, res, next) => {
  try {
    const { status, current_location, bus_id } = req.body;

    // Find assigned bus
    let targetBusId = bus_id;
    if (!targetBusId) {
      const { data: bus } = await supabase
        .from('buses')
        .select('id')
        .eq('driver_id', req.user.id)
        .single();
      targetBusId = bus ? bus.id : null;
    }

    if (!targetBusId) {
      return sendError(res, 'No assigned bus found to update status.', {}, 404);
    }

    const { data: updatedBus, error } = await supabase
      .from('buses')
      .update({
        status: status || 'In Transit',
        current_location: current_location || 'En Route'
      })
      .eq('id', targetBusId)
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Trip status updated successfully', updatedBus[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAssignedBus,
  getTodayRoute,
  getAssignedStudents,
  markStudentAttendance,
  updateTripStatus
};
