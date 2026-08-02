/**
 * Student Controller
 * Manages student profiles, bus assignments, attendance history, complaints, and leave requests.
 */

const SupabaseService = require('../services/supabaseService');
const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/response');

const studentService = new SupabaseService('students');

/**
 * Get all students
 * GET /api/students
 */
const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAll();
    return sendSuccess(res, 'Students fetched successfully', students);
  } catch (error) {
    next(error);
  }
};

/**
 * Get student by ID
 * GET /api/students/:id
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getById(req.params.id);
    if (!student) {
      return sendError(res, 'Student not found', {}, 404);
    }
    return sendSuccess(res, 'Student fetched successfully', student);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new student
 * POST /api/students
 */
const createStudent = async (req, res, next) => {
  try {
    const newStudent = await studentService.create(req.body);
    return sendSuccess(res, 'Student created successfully', newStudent, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update student by ID
 * PUT /api/students/:id
 */
const updateStudent = async (req, res, next) => {
  try {
    const updated = await studentService.update(req.params.id, req.body);
    return sendSuccess(res, 'Student updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete student by ID
 * DELETE /api/students/:id
 */
const deleteStudent = async (req, res, next) => {
  try {
    const deleted = await studentService.delete(req.params.id);
    return sendSuccess(res, 'Student deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

/**
 * Assign Bus, Stop, and Route to a Student
 * POST /api/students/:id/assign
 */
const assignBusStopRoute = async (req, res, next) => {
  try {
    const { bus_id, stop_id, route_id } = req.body;
    const studentId = req.params.id;

    // Update student table
    const updatedStudent = await studentService.update(studentId, {
      bus_id,
      stop_id,
      route_id
    });

    // Record in student_bus_assignment table
    await supabase.from('student_bus_assignment').insert([
      {
        student_id: studentId,
        bus_id,
        stop_id,
        route_id,
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'active'
      }
    ]);

    return sendSuccess(res, 'Student bus/stop/route assigned successfully', updatedStudent);
  } catch (error) {
    next(error);
  }
};

/**
 * View Attendance for Logged In Student
 * GET /api/students/me/attendance
 */
const getMyAttendance = async (req, res, next) => {
  try {
    // Find student ID linked to logged-in user ID
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const studentId = student ? student.id : req.user.id;

    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Student attendance records fetched', attendance || []);
  } catch (error) {
    next(error);
  }
};

/**
 * View Notifications for Logged In Student
 * GET /api/students/me/notifications
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .in('target_role', ['all', 'student']);

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Student notifications fetched', notifications || []);
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Complaint as Student
 * POST /api/students/me/complaint
 */
const submitComplaint = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    const { data: newComplaint, error } = await supabase
      .from('complaints')
      .insert([
        {
          user_id: req.user.id,
          title,
          description,
          category: category || 'general',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Complaint submitted successfully', newComplaint[0], 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Leave Request as Student
 * POST /api/students/me/leave
 */
const submitLeaveRequest = async (req, res, next) => {
  try {
    const { start_date, end_date, reason } = req.body;

    // Find student id if exists
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    const studentId = student ? student.id : req.user.id;

    const { data: newLeave, error } = await supabase
      .from('leave_requests')
      .insert([
        {
          student_id: studentId,
          user_id: req.user.id,
          start_date,
          end_date,
          reason,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw new Error(error.message);

    return sendSuccess(res, 'Leave request submitted successfully', newLeave[0], 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  assignBusStopRoute,
  getMyAttendance,
  getMyNotifications,
  submitComplaint,
  submitLeaveRequest
};
